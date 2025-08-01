// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 创建帖子集合
    await db.createCollection('posts')
    // 创建用户集合
    await db.createCollection('users')
    // 创建标签集合
    await db.createCollection('tags')

    // 初始化热门标签数据
    const tagsData = [
      { name: '深夜emo', hot: false, count: 128 },
      { name: '职场吐槽', hot: false, count: 95 },
      { name: '考研压力', hot: false, count: 87 },
      { name: '暗恋心事', hot: true, count: 156 }
    ]

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

    // 设置集合权限（仅管理员可写，所有人可读）
    await db.collection('posts').setPermission({
      read: true,
      write: false
    })

    return {
      success: true,
      message: '数据库初始化成功，已创建posts、users、tags集合并添加初始标签数据'
    }
  } catch (e) {
    return {
      success: false,
      message: '数据库初始化失败',
      error: e.message
    }
  }
}