Page({
  data: {
    message: null
  },

  onLoad: function(options) {
    const { id } = options;
    this.getMessageDetail(id);
  },

  // 获取消息详情
  getMessageDetail: function(id) {
    wx.cloud.callFunction({
      name: 'getMessageDetail',
      data: { id },
      success: res => {
        this.setData({
          message: res.result.data
        });
        // 标记消息为已读
        this.markAsRead(id);
      },
      fail: err => {
        console.error('获取消息详情失败:', err);
        wx.showToast({ title: '获取消息失败', icon: 'none' });
      }
    });
  },

  // 标记消息为已读
  markAsRead: function(id) {
    wx.cloud.callFunction({
      name: 'markMessageAsRead',
      data: { id },
      success: () => {
        console.log('消息已标记为已读');
      },
      fail: err => {
        console.error('标记消息为已读失败:', err);
      }
    });
  }
})