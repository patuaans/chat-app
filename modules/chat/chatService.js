const { Message } = require('../../models/Message');

const handleConnection = async (socket) => {
  socket.on('new-user', async (username) => {
    socket.username = username;
      try {
          const messages = await Message.find().sort('timestamp').limit(50);
          socket.emit('load-messages', messages);
      } catch (error) {
          console.error('Error loading messages', error);
      }

      socket.broadcast.emit('update', {
          username: username,
          message: username + ' has joined the conversation',
      });
        updateUsersList();
    });
    
    socket.on('chat', async (message) => {
      try {
          const newMessage = new Message({
              username: message.username,
              message: message.message,
          });
          await newMessage.save();
          global._io.emit('chat', newMessage);
      } catch (error) {
        console.error('Error saving message', error);
      }
    });

    socket.on('disconnect', () => {
      socket.broadcast.emit('update', {
          username: socket.username,
          message: socket.username + ' left the conversation',
      });
        updateUsersList();
    });
};
    
function updateUsersList() {
    const userList = Array.from(global._io.sockets.sockets.values()).map((s) => ({
        id: s.id,
        username: s.username,
    }));
    global._io.emit('list-users', userList);
}
    
module.exports = { handleConnection };