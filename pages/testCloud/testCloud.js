// testCloud.js
Page({
  data: {
    result: ''
  },

  onLoad: function() {
    // 页面加载时自动调用测试云函数
    this.testCloudFunction();
  },

  // 测试云函数调用
  testCloudFunction: function() {
    wx.cloud.callFunction({
      name: 'testCloud',
      data: {},
      success: res => {
        console.log('云函数调用成功', res.result);
        this.setData({
          result: JSON.stringify(res.result, null, 2)
        });
      },
      fail: err => {
        console.error('云函数调用失败', err);
        this.setData({
          result: '云函数调用失败: ' + JSON.stringify(err, null, 2)
        });
      },
      complete: () => {
        console.log('云函数调用完成');
      }
    });
  }
})