// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { content, tags, isAnonymous, userInfo } = event;
    const openid = cloud.getWXContext().OPENID;

    // 保存帖子到数据库
    const result = await db.collection('posts').add({
      data: {
        content,
        tags,
        isAnonymous,
        userInfo: {
          nickName: isAnonymous ? '匿名用户' : userInfo.nickName,
          avatarUrl: isAnonymous ? '/images/avatar2.svg' : userInfo.avatarUrl
        },
        likes: 0,
        comments: 0,
        openid,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // 更新标签计数
    for (const tag of tags) {
      await db.collection('tags')
        .where({ name: tag })
        .update({
          data: { count: db.command.inc(1) }
        });
    }

    return {
      success: true,
      postId: result._id
    };
  } catch (err) {
    console.error('发布帖子失败:', err);
    return {
      success: false,
      error: err.message
    };
  }
}