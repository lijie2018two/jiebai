Page({
  data: {
    posts: [],
    isLoading: true
  },

  // 页面加载时获取树洞数据
  onLoad: function() {
    this.loadTreeholePosts();
  },

  // 下拉刷新时重新加载数据
  onPullDownRefresh: function() {
    this.loadTreeholePosts(true);
  },

  // 加载树洞内容
  loadTreeholePosts: function(refresh = false) {
    const db = wx.cloud.database();
    this.setData({ isLoading: true });

    db.collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(10)
      .get()
      .then(res => {
        this.setData({
          posts: refresh ? res.data : this.data.posts.concat(res.data),
          isLoading: false
        });
        if (refresh) wx.stopPullDownRefresh();
      })
      .catch(err => {
        console.error('获取树洞数据失败:', err);
        this.setData({ isLoading: false });
        wx.showToast({ title: '加载失败', icon: 'none' });
      });
  },

  // 跳转到发布页面
  gotoPublish: function() {
    wx.navigateTo({ url: '/pages/publish/publish' });
  },

  // 点赞功能
  handleLike: function(e) {
    const index = e.currentTarget.dataset.index;
    const posts = [...this.data.posts];
    posts[index].likes++;
    this.setData({ posts });

    // 这里可以添加云开发点赞逻辑
    wx.cloud.callFunction({
      name: 'updateLike',
      data: { postId: posts[index]._id }
    });
  },

  // 评论功能
  handleComment: function(e) {
    const app = getApp();
    const { hasLogin } = app.globalData;

    // 检查是否登录
    if (!hasLogin) {
      return wx.showModal({
        title: '提示',
        content: '评论需要先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/login/login' });
          }
        }
      });
    }

    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/comment/comment?id=${postId}` });
  }
})