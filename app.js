const express = require('express');
const app = express();
const port = 9000;
const http = require('http');
const cors = require('cors');
app.use(cors({
    origin: "*"
}))
// const Server = require('socket.io');
const sockerio = require('socket.io');
const req = require('express/lib/request');

const server = http.createServer(app)
const io = sockerio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});
io.on('connection', (socket) => {
    console.log("socket connected successfully", socket.id);
    socket.on('get-document', (documentId) => {
        const data = "";
        socket.join(documentId);
        socket.documentId = documentId; 
        socket.emit('load-document' , data);
    })

    socket.on('send-changes', (delta) => {
        const documentId = socket.documentId; 
        if(!documentId)return;
        console.log(delta , documentId);
        socket.broadcast.to(documentId).emit('receive-changes', delta);
    })
})
app.get('/', (req, res) => {
    res.send("helo")
})
server.listen(port, () => {
    console.log("server is running at :", port);
})

