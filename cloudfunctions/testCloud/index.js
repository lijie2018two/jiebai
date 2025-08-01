// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return {
      success: true,
      message: '云函数调用成功',
      env: cloud.getWXContext().ENV
    }
  } catch (e) {
    return {
      success: false,
      message: '云函数调用失败',
      error: e.message
    }
  }
}