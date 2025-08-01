Page({
  data: {
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