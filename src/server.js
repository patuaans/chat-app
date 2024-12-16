const http = require('http');
const { app, chatService, fileService } = require('./app');
const { connectDB } = require('./config/db');
const socketio = require('socket.io');

const server = http.createServer(app);
global._io = socketio(server, {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

connectDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log('http://localhost:' + PORT)
        });
        // Socket.io Logic
        global._io.on('connection', async (socket) => {
          chatService.handleConnection(socket);
          fileService.handleFileUpload(socket);
      });
    })
    .catch(err => {
        console.error('Failed to start server:', err);
        process.exit(1);
    });