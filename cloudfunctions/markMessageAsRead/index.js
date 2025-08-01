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

    // 查询消息是否属于当前用户
    const messageResult = await db.collection('messages')
      .doc(id)
      .get()

    if (messageResult.data.toOpenid !== openid) {
      return {
        success: false,
        error: '无权访问该消息'
      }
    }

    // 标记消息为已读
    await db.collection('messages')
      .doc(id)
      .update({
        data: {
          isRead: true,
          readTime: db.serverDate()
        }
      })

    return {
      success: true
    }
  } catch (err) {
    console.error('标记消息为已读失败:', err)
    return {
      success: false,
      error: err
    }
  }
}