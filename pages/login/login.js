Page({
  data: {
    canIUseGetUserProfile: false
  },

  onLoad() {
    // 检查是否支持getUserProfile接口
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },

  // 获取用户信息
  getUserProfile() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const app = getApp();
        app.globalData.userInfo = res.userInfo;
        app.globalData.hasLogin = true;

        wx.showToast({ title: '登录成功' });
        // 返回上一页
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      }
    })
  },

  // 快捷登录（仅用于演示）
  quickLogin() {
    const app = getApp();
    app.globalData.userInfo = {
      nickName: '测试用户',
      avatarUrl: '/images/avatar1.svg'
    };
    app.globalData.hasLogin = true;

    wx.showToast({ title: '快速登录成功' });
    // 返回上一页
    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  }
})