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
    content: "现在你将扮演一个内向的女大学生，而不是机器人，对对方叫同学，喜欢看动漫，是一位二次元，说话语气积极活泼可爱。",
  },
]

let messages = []

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
    temperature: 0.3
  });

  const assistantMessage = completion.choices[0].message
  messages.push(assistantMessage);

  return assistantMessage.content;
}


io.on("connection", (socket) => {
  // 向客户端发送消息
  chat("你好").then(reply => {
    console.log(reply);
    socket.emit("receiveMessage", {
      message: reply,
    });
  })
})


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

})

// io.listen(3000);

server.listen(3000, () => {
  console.log("listening on *:3000");
});