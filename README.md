# 婕白树洞小程序

这是一个基于微信小程序开发的匿名社交应用，用户可以发布自己的心事、情感和故事，也可以浏览和互动他人的分享。本项目还包含消息中心模块，使用户能够及时接收评论通知等消息。

## 项目结构
```
├── app.js                 // 小程序入口文件
├── app.json               // 全局配置
├── cloudfunctions/        // 云函数
│   ├── initDatabase/      // 数据库初始化
│   ├── publishPost/       // 发布树洞内容
│   ├── addComment/        // 添加评论
│   ├── getMessages/       // 获取消息列表
│   ├── getMessageDetail/  // 获取消息详情
│   └── markMessageAsRead/ // 标记消息为已读
├── images/                // 图片资源
├── pages/                 // 页面文件
│   ├── index/             // 首页
│   ├── publish/           // 发布页面
│   ├── profile/           // 个人中心
│   ├── login/             // 登录页面
│   └── messages/          // 消息中心
│       ├── detail/        // 消息详情
└── README.md              // 项目说明
```

## 功能特点
1. **首页**：展示热门标签、最新发布内容，支持搜索和分类浏览
2. **发布**：支持文本内容发布，可添加标签和匿名发布
3. **个人中心**：用户信息展示，我的收藏和发布管理
4. **消息中心**：接收评论通知，查看消息详情
5. **评论**：对帖子进行评论，支持匿名评论

## 数据库设计

### 1. users 集合
存储用户信息
```javascript
{
  _id: "用户ID",
  openid: "微信用户唯一标识",
  nickName: "用户昵称",
  avatarUrl: "头像URL",
  createdAt: Date, // 创建时间
  updatedAt: Date  // 更新时间
}
```

### 2. posts 集合
存储帖子信息
```javascript
{
  _id: "帖子ID",
  content: "帖子内容",
  tags: ["标签1", "标签2"], // 帖子标签
  isAnonymous: Boolean, // 是否匿名
  userInfo: {
    nickName: "用户名/匿名用户",
    avatarUrl: "头像URL"
  },
  likes: Number, // 点赞数
  comments: Number, // 评论数
  openid: "发布者openid",
  createdAt: Date, // 创建时间
  updatedAt: Date  // 更新时间
}
```

### 3. comments 集合
存储评论信息
```javascript
{
  _id: "评论ID",
  postId: "帖子ID",
  content: "评论内容",
  isAnonymous: Boolean, // 是否匿名
  userInfo: {
    nickName: "用户名/匿名用户",
    avatarUrl: "头像URL"
  },
  openid: "评论者openid",
  createdAt: Date // 创建时间
}
```

### 4. tags 集合
存储标签信息
```javascript
{
  _id: "标签ID",
  name: "标签名称",
  count: Number // 关联帖子数量
}
```

### 5. messages 集合
存储消息通知
```javascript
{
  _id: "消息ID",
  toOpenid: "接收者openid",
  fromOpenid: "发送者openid",
  fromName: "发送者名称",
  fromAvatar: "发送者头像URL",
  content: "消息内容",
  postId: "相关帖子ID", // 可选
  isRead: Boolean, // 是否已读
  createTime: Date, // 创建时间
  readTime: Date // 阅读时间，可选
}
```

## 后端模块实现

### 1. 用户模块
- **updateUserInfo**：更新用户信息

### 2. 帖子模块
- **publishPost**：发布帖子
- **getPosts**：获取帖子列表
- **getPostDetail**：获取帖子详情

### 3. 评论模块
- **addComment**：添加评论，并发送消息通知帖子作者
- **getComments**：获取帖子评论列表

### 4. 消息模块
- **getMessages**：获取用户消息列表
- **getMessageDetail**：获取消息详情
- **markMessageAsRead**：标记消息为已读

### 5. 数据库初始化模块
- **initDatabase**：创建必要的集合和索引

## 环境配置
1. 安装微信开发者工具
2. 导入项目到微信开发者工具
3. 配置云开发环境
   - 创建云开发环境
   - 在app.js中替换env为你的云环境ID

## 运行步骤
1. 初始化数据库
   - 右键点击cloudfunctions/initDatabase选择"上传并部署"
   - 在云开发控制台执行该云函数
2. 编译运行小程序

## 技术栈
- 微信小程序原生开发
- 云开发（云函数、云数据库）
- SVG图标

## 注意事项
1. 项目使用云开发功能，需要开通微信云开发
2. 首次使用需先初始化数据库
3. 发布功能需要用户授权登录

## 更新记录
- v1.0.0: 初始版本，实现基本功能
- v1.1.0: 添加消息中心模块，完善数据库设计