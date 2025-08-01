Page({
  data: {
    userInfo: null
  },

  // 页面加载时检查登录状态
  onLoad: function() {
    this.checkLoginStatus();
  },

  // 检查用户登录状态
  checkLoginStatus: function() {
    const app = getApp();
    const userInfo = app.getGlobalData().userInfo;

    if (userInfo) {
      this.setData({ userInfo });
    } else {
      // 尝试从本地存储获取
      const storedUser = wx.getStorageSync('userInfo');
      if (storedUser) {
        this.setData({ userInfo: storedUser });
        app.getGlobalData().userInfo = storedUser;
      }
    }
  },

  // 处理登录
  handleLogin: function() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: res => {
        const userInfo = res.userInfo;
        this.setData({ userInfo });
        
        // 保存到全局和本地存储
        getApp().getGlobalData().userInfo = userInfo;
        wx.setStorageSync('userInfo', userInfo);

        // 调用云函数更新用户信息
        wx.cloud.callFunction({
          name: 'updateUserInfo',
          data: userInfo
        });
      },
      fail: err => {
        console.error('登录失败:', err);
        wx.showToast({ title: '登录失败', icon: 'none' });
      }
    });
  },

  // 跳转到我的收藏
  gotoCollection: function() {
    const app = getApp();
    const { hasLogin } = app.globalData;

    // 检查是否登录
    if (!hasLogin) {
      return wx.showModal({
        title: '提示',
        content: '查看收藏需要先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/login/login' });
          }
        }
      });
    }
    wx.navigateTo({ url: '/pages/collection/collection' });
  },

  // 跳转到我的发布
  gotoMyPosts: function() {
    const app = getApp();
    const { hasLogin } = app.globalData;

    // 检查是否登录
    if (!hasLogin) {
      return wx.showModal({
        title: '提示',
        content: '查看我的发布需要先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/login/login' });
          }
        }
      });
    }
    wx.navigateTo({ url: '/pages/my-posts/my-posts' });
  },

  // 跳转到设置页面
  gotoSettings: function() {
    wx.navigateTo({ url: '/pages/settings/settings' });
  }
})