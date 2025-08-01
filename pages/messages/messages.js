Page({
  data: {
    messages: [],
    unreadCount: 0
  },

  onLoad: function() {
    this.getMessages();
  },

  onShow: function() {
    // 每次显示页面时刷新消息列表
    this.getMessages();
  },

  // 获取消息列表
  getMessages: function() {
    wx.cloud.callFunction({
      name: 'getMessages',
      success: res => {
        const messages = res.result.data;
        const unreadCount = messages.filter(msg => !msg.isRead).length;

        this.setData({
          messages,
          unreadCount
        });
      },
      fail: err => {
        console.error('获取消息列表失败:', err);
        wx.showToast({ title: '获取消息失败', icon: 'none' });
      }
    });
  },

  // 打开消息详情
  openMessageDetail: function(e) {
    const messageId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/messages/detail?id=' + messageId
    });
  }
})