// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { id } = event
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    // 查询消息详情
    const messageResult = await db.collection('messages')
      .doc(id)
      .get()

    const message = messageResult.data

    // 检查消息是否属于当前用户
    if (message.toOpenid !== openid) {
      return {
        success: false,
        error: '无权访问该消息'
      }
    }

    // 如果消息关联了帖子，获取帖子内容
    if (message.postId) {
      const postResult = await db.collection('posts')
        .doc(message.postId)
        .get()
      message.postContent = postResult.data.content
    }

    // 格式化时间
    const createTime = new Date(message.createTime)
    const year = createTime.getFullYear()
    const month = createTime.getMonth() + 1
    const day = createTime.getDate()
    const hour = createTime.getHours()
    const minute = createTime.getMinutes()

    message.createTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

    return {
      success: true,
      data: message
    }
  } catch (err) {
    console.error('获取消息详情失败:', err)
    return {
      success: false,
      error: err
    }
  }
}