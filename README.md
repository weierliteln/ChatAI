# ChatAI
### 添加依赖
首先，我们需要为项目添加必要的依赖。在你的项目根目录下，打开终端并执行以下命令：
```bash
pnpm install
```
### 获取API密钥
接下来，你需要从KIMI官网获取你的专属`apiKey`，来访问Moonshot AI的强大功能。
在代码中找到配置OpenAI客户端的部分，并替换为你自己的API密钥：

```javascript
const { OpenAI } = require('openai');
const client = new OpenAI({
  apiKey: "这里填你自己的API_KEY", // 替换为你的KIMI提供的API_KEY
  baseURL: "https://api.moonshot.cn/v1",
});
```
### 启动服务
然后，在终端中执行以下命令启动服务：
```bash
nodemon app.js
```
`nodemon`是一个开发工具，它会在你的代码发生变化时自动重启你的Node.js应用程序。

### 在浏览器中访问Html页面
最后，打开你的网络浏览器，输入以下地址：
```
http://localhost:3000/
```
这样你应该会看到你的聊天页面已经加载完毕啦!