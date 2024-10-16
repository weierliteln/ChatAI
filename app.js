const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const OpenAI = require("openai");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = socketIO(server);

app.use(express.static("public"));

const client = new OpenAI({
  apiKey: "sk-5iI3k79xzEn67cAwIjkNUX0y10m7lEyLRtdDtnzL7zcJzfxa",
  baseURL: "https://api.moonshot.cn/v1",
});

const systemMessages = [
  {
    role: "system",
    content: "现在你将扮演一个内向的女大学生，而不是机器人，你喜欢叫别人主人，喜欢看动漫，是个二次元，说话语气非常积极活泼可爱，而且十分中二。",
  },
]

let messages = [];

async function makeMessages(input, n = 20) {
  messages.push({
    role: "user",
    content: input,
  });

  let newMessages = [];

  newMessages = systemMessages.concat(newMessages);
  if (messages.length > n) {
    messages = messages.slice(-n);
  }

  newMessages = newMessages.concat(messages);
  return newMessages;
}

async function chat(input) {
  const completion = await client.chat.completions.create({
    model: "moonshot-v1-8k",
    messages: await makeMessages(input),
    temperature: 0.3,
  });

  // 通过 API 我们获得了 Kimi 大模型给予我们的回复消息（role=assistant）
  const assistantMessage = completion.choices[0].message

  // 为了让 Kimi 大模型拥有完整的记忆，我们必须将 Kimi 大模型返回给我们的消息也添加到 messages 中
  messages.push(assistantMessage);

  return assistantMessage.content;
}

io.on("connection", (socket) => {
  console.log("a user connected");

  //从客户端接收消息
  socket.on('sendMessage', data => {
    console.log(data)
    chat(data.message).then(reply => {
      console.log(reply);
      socket.emit("receiveMessage", {
        message: reply,
      });
    });
  })

  // 向客户端发送消息
  // socket.emit("receiveMessage", {
  //   message: "Welcome to the chat room",
  // });

})

// main();

// io.listen(3000);

server.listen(3000, () => {
  console.log("listening on *:3000");
});