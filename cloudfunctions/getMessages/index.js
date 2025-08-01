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
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID

    // 查询当前用户的消息列表
    const result = await db.collection('messages')
      .where({
        toOpenid: openid
      })
      .orderBy('createTime', 'desc')
      .get()

    // 格式化时间
    const messages = result.data.map(message => {
      // 格式化时间为友好显示格式
      const createTime = new Date(message.createTime)
      const now = new Date()
      const diffTime = now - createTime
      const diffMinutes = Math.floor(diffTime / (1000 * 60))
      const diffHours = Math.floor(diffMinutes / 60)
      const diffDays = Math.floor(diffHours / 24)

      let timeStr
      if (diffMinutes < 1) {
        timeStr = '刚刚'
      } else if (diffMinutes < 60) {
        timeStr = `${diffMinutes}分钟前`
      } else if (diffHours < 24) {
        timeStr = `${diffHours}小时前`
      } else if (diffDays < 30) {
        timeStr = `${diffDays}天前`
      } else {
        const month = createTime.getMonth() + 1
        const day = createTime.getDate()
        timeStr = `${month}月${day}日`
      }

      return {
        ...message,
        createTime: timeStr
      }
    })

    return {
      success: true,
      data: messages
    }
  } catch (err) {
    console.error('获取消息列表失败:', err)
    return {
      success: false,
      error: err
    }
  }
}