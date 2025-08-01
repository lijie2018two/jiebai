Page({
  data: {
    result: ''
  },

  onLoad: function() {
    console.log('环境检查页面加载完成');
  },

  // 检查环境配置
  checkEnvironment: function() {
    wx.showLoading({
      title: '检查中...',
    })

    wx.cloud.callFunction({
      name: 'checkEnvironment',
      success: res => {
        wx.hideLoading()
        console.log('环境检查结果:', res.result)
        this.setData({
          result: JSON.stringify(res.result, null, 2)
        })

        wx.showToast({
          title: '检查成功',
          icon: 'success'
        })
      },
      fail: err => {
        wx.hideLoading()
        console.error('调用云函数失败:', err)
        this.setData({
          result: '调用云函数失败: ' + JSON.stringify(err, null, 2)
        })
        wx.showToast({
          title: '调用失败',
          icon: 'none'
        })
      }
    })
  },

  // 复制结果
  copyResult: function() {
    wx.setClipboardData({
      data: this.data.result,
      success: function() {
        wx.showToast({
          title: '已复制',
          icon: 'success'
        })
      }
    })
  }
})