// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取已存在的集合列表
    let database_list = []
    try {
      const result = await cloud.database().listCollections()
      database_list = result.database_list || []
    } catch (listError) {
      console.error('获取集合列表失败:', listError)
      // 如果获取集合列表失败，假设所有集合都不存在
      database_list = []
    }

    const existingCollections = database_list.map(collection => collection.name)
    console.log('已存在的集合:', existingCollections)

    // 需要创建的集合
    const collectionsToCreate = ['posts', 'users', 'tags', 'comments', 'messages']
    const createdCollections = []
    const collectionErrors = []

    // 创建不存在的集合
    for (const collection of collectionsToCreate) {
      try {
        if (!existingCollections.includes(collection)) {
          console.log(`尝试创建集合: ${collection}`)
          await db.createCollection(collection)
          createdCollections.push(collection)
          console.log(`成功创建集合: ${collection}`)
        } else {
          console.log(`集合 ${collection} 已存在，跳过创建`)
        }
      } catch (createError) {
        console.error(`创建集合 ${collection} 失败:`, createError)
        // 检查是否是集合已存在的错误
        if (createError.message && createError.message.includes('DATABASE_COLLECTION_ALREADY_EXIST')) {
          console.log(`集合 ${collection} 已存在，继续处理其他集合`)
        } else {
          collectionErrors.push({
            collection: collection,
            error: createError.message
          })
        }
      }
    }

    // 检查标签集合是否已有数据
    let tagsCount = { total: 0 }
    try {
      tagsCount = await db.collection('tags').count()
      console.log('标签集合数据量:', tagsCount)
    } catch (countError) {
      console.error('获取标签集合数据量失败:', countError)
    }

    if (tagsCount.total === 0) {
      // 初始化热门标签数据
      const tagsData = [
        { name: '深夜emo', hot: false, count: 128 },
        { name: '职场吐槽', hot: false, count: 95 },
        { name: '考研压力', hot: false, count: 87 },
        { name: '暗恋心事', hot: true, count: 156 }
      ]

      try {
        // 批量添加标签数据
        for (const tag of tagsData) {
          await db.collection('tags').add({
            data: {
              name: tag.name,
              hot: tag.hot,
              count: tag.count,
              createdAt: new Date()
            }
          })
        }
        console.log('成功添加标签数据')
      } catch (tagError) {
        console.error('添加标签数据失败:', tagError)
        collectionErrors.push({
          collection: 'tags',
          operation: 'add data',
          error: tagError.message
        })
      }
    } else {
      console.log('标签数据已存在，跳过添加')
    }

    // 注意：集合权限需要在云开发控制台手动配置
    // 推荐配置：仅管理员可写，所有人可读

    let message = '数据库初始化成功'
    if (createdCollections.length > 0) {
      message += `，已创建以下集合：${createdCollections.join(', ')}`
    } else {
      message += '，所有集合已存在'
    }

    if (tagsCount.total === 0) {
      message += '，并添加了初始标签数据'
    } else {
      message += '，标签数据已存在'
    }

    if (collectionErrors.length > 0) {
      message += `，但存在以下错误：${collectionErrors.map(err => `${err.collection}: ${err.error}`).join('; ')}`
    }

    return {
      success: collectionErrors.length === 0,
      message: message,
      createdCollections: createdCollections,
      existingCollections: existingCollections,
      errors: collectionErrors
    }
  } catch (e) {
    console.error('数据库初始化过程中发生未捕获错误:', e)
    return {
      success: false,
      message: '数据库初始化失败',
      error: e.message,
      stack: e.stack
    }
  }
}