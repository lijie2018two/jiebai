// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const { postId, content, isAnonymous, userInfo } = event;
    const wxContext = cloud.getWXContext();
    const openid = wxContext.OPENID;

    // 1. 获取帖子信息
    const postResult = await db.collection('posts').doc(postId).get();
    const post = postResult.data;

    // 2. 添加评论到数据库
    const commentResult = await db.collection('comments').add({
      data: {
        postId,
        content,
        isAnonymous,
        userInfo: {
          nickName: isAnonymous ? '匿名用户' : userInfo.nickName,
          avatarUrl: isAnonymous ? '/images/avatar2.svg' : userInfo.avatarUrl
        },
        openid,
        createdAt: db.serverDate()
      }
    });

    // 3. 更新帖子的评论数
    await db.collection('posts').doc(postId).update({
      data: {
        comments: _.inc(1)
      }
    });

    // 4. 如果评论的不是自己的帖子，发送消息通知
    if (post.openid !== openid) {
      await sendMessage(
        post.openid,
        postId,
        isAnonymous ? '匿名用户' : userInfo.nickName,
        isAnonymous ? '/images/avatar2.svg' : userInfo.avatarUrl,
        `评论了你的帖子: ${content.slice(0, 20)}...`
      );
    }

    return {
      success: true,
      commentId: commentResult._id
    };
  } catch (err) {
    console.error('添加评论失败:', err);
    return {
      success: false,
      error: err
    };
  }
};

// 发送消息通知
async function sendMessage(toOpenid, postId, fromName, fromAvatar, content) {
  try {
    await db.collection('messages').add({
      data: {
        toOpenid,
        fromOpenid: cloud.getWXContext().OPENID,
        fromName,
        fromAvatar,
        content,
        postId,
        isRead: false,
        createTime: db.serverDate()
      }
    });
    console.log('发送消息成功');
  } catch (err) {
    console.error('发送消息失败:', err);
  }
}