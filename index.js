
const express = require("express")
const http = require("http")
const path = require("path")
const fs = require("fs")
const { Server } = require("socket.io");
const Trie = require("./trie")


const PORT = 9000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve("./public")));


const abuseWords = fs.readFileSync('./abuses.txt', 'utf8');
let wordsArray = abuseWords.split(/\r?\n/);
const trie = new Trie();

for (let i = 0; i < wordsArray.length; i++)
  trie.insert(wordsArray[i]);

io.on("connection", (socket) => {
    socket.on("user-message", (message) => {
      let words = message.split(' ');
      let finalMsg = "";
      
      // TODO: add a custom logic, where we dont split the words (a copy).
      // we just call with whole msg, the trie keep checking and adding/masking words as encountered.
      for (let i = 0; i < words.length; i++)
        if (trie.search(words[i]))
          finalMsg += " ****";
        else
          finalMsg += " " + words[i];

      io.emit("message", finalMsg);
    });
});

app.get("/", (req, res) => {
    console.log("Req came");
    return res.sendFile('./public/index.html');
})

server.listen(PORT, () => console.log(`Server started at port: ${PORT}`));


