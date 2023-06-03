//importing 


const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express()
const PORT = process.env.PORT || '8000';
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoute")
const socket = require("socket.io");


//app config

dotenv.config();


//middleware
app.use(cors())
app.use(express.json())


app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

// WdcBCDrQeM8Ucq6Z
//Db configure


mongoose.connect(process.env.MONGOURL, {

    useNewUrlParser: true,
    useUnifiedTopology: true
})

//??

const db = mongoose.connection
db.once('open', () => {
    console.log('Db is connected');
});






//deploy code starts
const path = require("path");
const dir_ = path.basename(path.dirname("server.js"));
const {resolve} = require("path");

// if(process.env.NODE_ENV==='production'){
    // app.use(express.static(path.join(__dirname, 'unite_chat_app','build')));

    app.get('/', function (req, res) {
        res.json("server start");
    });
// } 


//deploy code ends





const server = app.listen(process.env.PORT, () => console.log(`Listening on port :${PORT}`))

//listener
//socket code

const io = socket(server, {
    cors: {
        // origin: "http://localhost:3000",
        origin: "*",
        
        methods: ["GET", "POST"] ,
        credentials: true,
    },
}
);

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    })
    socket.on("send_msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.msg);
        }
    })
})

