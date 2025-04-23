const express = require('express');
const app = express();
const port = process.env.PORT || 9000;
const http = require('http');
const cors = require('cors');
const connection = require('./database/db');
const documentData = require('./controller/documentController');
connection()
  .then(() => {
    console.log('DB init complete');
  })
  .catch((err) => {
    console.error('Failed to init DB:', err);
  });
app.use(cors({
    origin: "*"
}));

const sockerio = require('socket.io');

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
    socket.on('get-document', async (documentId) => {
        const document = await documentData.getDocument(documentId)
        socket.join(documentId);
        socket.documentId = documentId; 
        socket.emit('load-document' , document.data);
    })

    socket.on('send-changes', (delta) => {
        const documentId = socket.documentId; 
        if(!documentId)return;
        console.log(delta , documentId);
        socket.broadcast.to(documentId).emit('receive-changes', delta);
    })

    socket.on('save-document' , async( data)=>{
        await documentData.updateDocument(socket.documentId , data)
    })
})

server.listen(port, () => {
    console.log("server is running at :", port);
})

