Page({
  data: {
    // 未读消息数量
    unreadMessageCount: 0,
    // 分类标签数据
    categories: ['全部', '情感', '职场', '生活'],
    activeCategory: 0,
    
    // 热门标签数据
    hotTags: [
      { name: '深夜emo', hot: false },
      { name: '职场吐槽', hot: false },
      { name: '考研压力', hot: false },
      { name: '暗恋心事', hot: true }
    ],
    
    // 最新发布数据
    latestPosts: [
      {
        id: 1,
        avatar: '/images/avatar1.png',
        username: '推荐树洞',
        time: '28.16',
        content: '这是一条推荐的树洞内容，包含一些用户分享的心情和故事，希望能给大家带来共鸣。',
        likes: '18m'
      },
      {
        id: 2,
        avatar: '/images/avatar2.png',
        username: '匿名用户',
        time: '38.16',
        content: '分享今天遇到的一件事，感觉很有感触，想听听大家的看法...',
        likes: '12m'
      },
      {
        id: 3,
        avatar: '/images/avatar3.png',
        username: '时间',
        time: '33.66',
        content: '时间过得真快，转眼又是一年，大家有什么新年愿望吗？',
        likes: '17m'
      }
    ],
    
    // 搜索关键词
    searchKeyword: ''
  },

  // 生命周期函数：页面加载时执行
  onLoad: function() {
    // 可以在这里发起网络请求获取数据
    console.log('首页加载完成');
    this.getUnreadMessageCount();
  },

  // 生命周期函数：页面显示时执行
  onShow: function() {
    // 每次页面显示时都获取未读消息数量
    this.getUnreadMessageCount();
  },

  // 获取未读消息数量
  getUnreadMessageCount: function() {
    // 调用云函数获取未读消息数量
    wx.cloud.callFunction({
      name: 'getUnreadMessages',
      data: {},
      success: res => {
        const unreadCount = res.result.count || 0;
        this.setData({
          unreadMessageCount: unreadCount
        });

        // 更新tabBar消息图标的badge值
        if (unreadCount > 0) {
          wx.setTabBarBadge({
            index: 2, // 消息在tabBar中的索引
            text: String(unreadCount),
            success: () => {
              console.log('设置tabBar消息提示成功');
            },
            fail: (err) => {
              console.error('设置tabBar消息提示失败:', err);
            }
          });
        } else {
          wx.removeTabBarBadge({
            index: 2, // 消息在tabBar中的索引
            success: () => {
              console.log('移除tabBar消息提示成功');
            },
            fail: (err) => {
              console.error('移除tabBar消息提示失败:', err);
            }
          });
        }
      },
      fail: err => {
        console.error('调用云函数获取未读消息数量失败:', err);
        // 出错时使用模拟数据
        const unreadCount = 0;
        this.setData({
          unreadMessageCount: unreadCount
        });
        wx.removeTabBarBadge({
          index: 2,
          success: () => {
            console.log('移除tabBar消息提示成功');
          },
          fail: (err) => {
            console.error('移除tabBar消息提示失败:', err);
          }
        });
      }
    });

    // 由于微信小程序原生不支持直接设置导航栏右侧按钮图标和文本，
    // 我们将通过自定义导航栏组件或使用tabBar的消息页面来实现消息提示
    // 这里我们先将消息页面添加回tabBar，同时保留之前的首页、发布、我的导航
    // 并在消息图标上添加数字提示
    // 注意：实际项目中，应该使用自定义导航栏组件来实现更灵活的导航栏效果

    // 更新tabBar消息图标的badge值
    if (unreadCount > 0) {
      wx.setTabBarBadge({
        index: 2, // 消息在tabBar中的索引
        text: String(unreadCount),
        success: () => {
          console.log('设置tabBar消息提示成功');
        },
        fail: (err) => {
          console.error('设置tabBar消息提示失败:', err);
        }
      });
    } else {
      wx.removeTabBarBadge({
        index: 2, // 消息在tabBar中的索引
        success: () => {
          console.log('移除tabBar消息提示成功');
        },
        fail: (err) => {
          console.error('移除tabBar消息提示失败:', err);
        }
      });
    }
  },

  // 跳转到消息中心
  navigateToMessages: function() {
    wx.navigateTo({
      url: '/pages/messages/messages'
    });
  }
  },

  // 跳转到消息中心
  navigateToMessages: function() {
    wx.navigateTo({
      url: '/pages/messages/messages'
    });
  },
  },

  // 搜索事件处理
  handleSearch: function() {
    if (this.data.searchKeyword.trim()) {
      console.log('搜索关键词:', this.data.searchKeyword);
      // 这里可以添加搜索逻辑
    } else {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
    }
  },

  // 输入框内容变化时更新数据
  onKeywordChange: function(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 切换分类标签
  switchCategory: function(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeCategory: index
    });
    // 这里可以添加分类筛选逻辑
  },

  // 点击热门标签
  clickTag: function(e) {
    const tagName = e.currentTarget.dataset.tag;
    console.log('点击标签:', tagName);
    // 这里可以添加标签筛选逻辑
  },

  // 点击帖子
  openPostDetail: function(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + postId
    });
  }
})