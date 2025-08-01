App({
  onLaunch: function() {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用微信开发者工具2.2.3或以上版本以支持云能力');
    } else {
      wx.cloud.init({
        // 请用户替换为自己的云环境ID
        env: 'your-cloud-environment-id',
        traceUser: true,
      });
    }

    // 全局数据存储
    this.globalData = {
      userInfo: null,
      hasLogin: false
    };

    console.log('小程序初始化完成');
  },

  // 获取全局数据
  getGlobalData: function() {
    return this.globalData;
  }
})