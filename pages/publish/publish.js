Page({
  data: {
    content: '',
    tags: ['情感', '职场', '生活', '学习', '深夜emo', '考研压力', '暗恋心事', '家庭关系'],
    selectedTags: [],
    isAnonymous: true,
    images: [],
    voicePath: '',
    voiceDuration: 0,
    recording: false
  },

  // 监听内容输入
  onContentChange: function(e) {
    this.setData({ content: e.detail.value });
  },

  // 切换标签选择
  toggleTag: function(e) {
    const tag = e.currentTarget.dataset.tag;
    const selectedTags = [...this.data.selectedTags];
    const index = selectedTags.indexOf(tag);

    if (index > -1) {
      selectedTags.splice(index, 1);
    } else {
      // 限制最多选择3个标签
      if (selectedTags.length < 3) {
        selectedTags.push(tag);
      } else {
        wx.showToast({ title: '最多选择3个标签', icon: 'none' });
      }
    }

    this.setData({ selectedTags });
  },

  // 切换匿名状态
  toggleAnonymous: function(e) {
    this.setData({ isAnonymous: e.detail.value });
  },

  // 取消发布
  handleCancel: function() {
    wx.navigateBack();
  },

  // 选择图片
  chooseImage: function() {
    const maxCount = 9 - this.data.images.length;
    if (maxCount <= 0) {
      return wx.showToast({ title: '最多上传9张图片', icon: 'none' });
    }

    wx.chooseImage({
      count: maxCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        const images = [...this.data.images, ...tempFilePaths];
        this.setData({ images });
      }
    });
  },

  // 删除图片
  deleteImage: function(e) {
    const index = e.currentTarget.dataset.index;
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({ images });
  },

  // 录制语音
  recordVoice: function() {
    if (this.data.recording) {
      wx.stopRecord();
      this.setData({ recording: false });
      return;
    }

    this.setData({ recording: true });
    wx.showToast({ title: '开始录音...', icon: 'none' });

    wx.startRecord({
      success: (res) => {
        const tempFilePath = res.tempFilePath;
        // 获取录音时长
        wx.getVoiceInfo({
          src: tempFilePath,
          success: (voiceRes) => {
            const duration = Math.ceil(voiceRes.duration / 1000);
            this.setData({
              voicePath: tempFilePath,
              voiceDuration: duration,
              recording: false
            });
          }
        });
      },
      fail: (err) => {
        console.error('录音失败:', err);
        this.setData({ recording: false });
        wx.showToast({ title: '录音失败', icon: 'none' });
      },
      complete: () => {
        if (this.data.recording) {
          this.setData({ recording: false });
        }
      }
    });
  },

  // 删除语音
  deleteVoice: function() {
    this.setData({ voicePath: '', voiceDuration: 0 });
  },

  // 发布内容
  handlePublish: function() {
    const app = getApp();
    const { hasLogin } = app.globalData;

    // 检查是否登录
    if (!hasLogin) {
      return wx.showModal({
        title: '提示',
        content: '发布内容需要先登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/login/login' });
          }
        }
      });
    }

    const { content, selectedTags, isAnonymous } = this.data;

    // 验证内容
    if (!content.trim() && this.data.images.length === 0 && !this.data.voicePath) {
      return wx.showToast({ title: '内容、图片和语音至少填写一项', icon: 'none' });
    }

    if (selectedTags.length === 0) {
      return wx.showToast({ title: '请选择至少一个标签', icon: 'none' });
    }

    wx.showLoading({ title: '发布中...' });

    // 上传图片和语音文件
    const uploadTasks = [];
    const imageUrls = [];
    let voiceUrl = '';

    // 上传图片
    this.data.images.forEach((imagePath, index) => {
      const uploadTask = wx.cloud.uploadFile({
        cloudPath: `posts/images/${Date.now()}_${index}.${imagePath.match(/\.(\w+)$/)[1]}`,
        filePath: imagePath
      }).then(res => {
        imageUrls.push(res.fileID);
      });
      uploadTasks.push(uploadTask);
    });

    // 上传语音
    if (this.data.voicePath) {
      const uploadTask = wx.cloud.uploadFile({
        cloudPath: `posts/voices/${Date.now()}.${this.data.voicePath.match(/\.(\w+)$/)[1]}`,
        filePath: this.data.voicePath
      }).then(res => {
        voiceUrl = res.fileID;
      });
      uploadTasks.push(uploadTask);
    }

    // 等待所有文件上传完成
    Promise.all(uploadTasks)
      .then(() => {
        // 获取用户信息
        const userInfo = getApp().getGlobalData().userInfo || { nickName: '匿名用户', avatarUrl: '/images/avatar2.svg' };

        // 调用云函数发布内容
        return wx.cloud.callFunction({
          name: 'publishPost',
          data: {
            content: content.trim(),
            tags: selectedTags,
            isAnonymous,
            userInfo: isAnonymous ? {
              nickName: '匿名用户',
              avatarUrl: '/images/avatar2.svg'
            } : userInfo,
            likes: 0,
            comments: 0,
            images: imageUrls,
            voiceUrl: voiceUrl,
            voiceDuration: this.data.voiceDuration,
            createdAt: new Date()
          }
        });
      })
    .then(res => {
      wx.hideLoading();
      wx.showToast({ title: '发布成功' });
      // 返回树洞页面并刷新
      wx.navigateBack({
        delta: 1,
        success: () => {
          const page = getCurrentPages()[getCurrentPages().length - 1];
          page.loadTreeholePosts(true);
        }
      });
    })
    .catch(err => {
      console.error('发布失败:', err);
      wx.hideLoading();
      wx.showToast({ title: '发布失败', icon: 'none' });
    });
  }
})