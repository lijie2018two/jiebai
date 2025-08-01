const cloud = require('wx-server-sdk')

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 获取当前环境信息
    const env = cloud.getWXContext().ENV
    const appid = cloud.getWXContext().APPID
    
    // 获取云开发环境列表
    const envList = await cloud.getEnvList()
    
    return {
      success: true,
      currentEnv: env,
      appid: appid,
      availableEnvs: envList
    }
  } catch (e) {
    return {
      success: false,
      error: e.message
    }
  }
}