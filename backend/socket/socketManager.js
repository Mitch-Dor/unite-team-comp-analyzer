/**
 * Socket.IO manager for WebRTC signaling
 */

module.exports = function(io) {
  // Store active rooms and their participants
  const rooms = new Map();
  
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Handle room creation
    socket.on('create-room', (roomId) => {
      console.log(`Room ${roomId} created by ${socket.id}`);
      
      // Initialize the room if it doesn't exist
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      console.log("1");
      
      // Join the room
      socket.join(roomId);
      rooms.get(roomId).add(socket.id);

      console.log("2");
      
      // Notify the client that room was created successfully
      socket.emit('room-created', { roomId, creatorId: socket.id });
    });
    
    // Handle joining a room
    socket.on('join-room', (roomId) => {
      console.log(`User ${socket.id} attempting to join room ${roomId}`);
      
      // Check if the room exists
      if (!rooms.has(roomId)) {
        socket.emit('error', { message: 'Room does not exist' });
        return;
      }
      
      const room = rooms.get(roomId);
      
      // Limit to 2 users per room for a draft system
      if (room.size >= 2) {
        socket.emit('error', { message: 'Room is full' });
        return;
      }
      
      // Join the room
      socket.join(roomId);
      room.add(socket.id);
      
      // Notify everyone in the room about the new user
      io.to(roomId).emit('user-joined', { 
        userId: socket.id, 
        participants: Array.from(room)
      });
      
      // If this is the second user, the room is ready to start drafting
      if (room.size === 2) {
        io.to(roomId).emit('room-ready', { 
          roomId,
          participants: Array.from(room)
        });
      }
    });
    
    // WebRTC Signaling
    socket.on('signal', ({ roomId, to, signal }) => {
      console.log(`Signal from ${socket.id} in room ${roomId}`);
      
      // If 'to' is specified, send the signal to that specific client
      if (to) {
        console.log(`Sending signal to specific client: ${to}`);
        io.to(to).emit('signal', {
          from: socket.id,
          signal
        });
      } else {
        // Broadcast to all other clients in the room
        console.log(`Broadcasting signal to all clients in room ${roomId} except sender`);
        socket.to(roomId).emit('signal', {
          from: socket.id,
          signal
        });
      }
    });
    
    // Handle draft actions
    socket.on('draft-action', ({ roomId, action, data }) => {
      // Broadcast the draft action to all users in the room except sender
      socket.to(roomId).emit('draft-action', {
        userId: socket.id,
        action,
        data
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Find and remove user from all rooms they were in
      for (const [roomId, participants] of rooms.entries()) {
        if (participants.has(socket.id)) {
          participants.delete(socket.id);
          
          // Notify remaining users
          io.to(roomId).emit('user-left', { userId: socket.id });
          
          // If room is empty, remove it
          if (participants.size === 0) {
            rooms.delete(roomId);
            console.log(`Room ${roomId} removed as it's empty`);
          }
        }
      }
    });
  });
}; 