module.exports = function (app, database, io) {
    // Get all active rooms
    app.get('/GETrooms', (req, res) => {
        try {
            // Get active rooms from socket.io server
            const rooms = Array.from(io.sockets.adapter.rooms.keys())
                .filter(room => !room.startsWith(io.sockets.adapter.sid));
            
            res.json({ rooms });
        } catch (error) {
            console.error('Error getting rooms:', error);
            res.status(500).json({ error: 'Failed to get rooms' });
        }
    });
    
    // Get room info
    app.get('/GETrooms/:roomId', (req, res) => {
        try {
            const { roomId } = req.params;
            const room = io.sockets.adapter.rooms.get(roomId);
            
            if (!room) {
                return res.status(404).json({ error: 'Room not found' });
            }
            
            // Get participants
            const participants = Array.from(room);
            
            res.json({
                roomId,
                participants,
                size: room.size
            });
        } catch (error) {
            console.error('Error getting room info:', error);
            res.status(500).json({ error: 'Failed to get room info' });
        }
    });
    
    // Create a new room with custom ID
    app.post('/POSTrooms', (req, res) => {
        try {
            let roomId = secureGenerateCode();

            // Check if room already exists
            while (io.sockets.adapter.rooms.has(roomId)) {
                roomId = secureGenerateCode();
            }
            
            res.json({
                roomId,
                message: 'Room created successfully'
            });
        } catch (error) {
            console.error('Error creating room:', error);
            res.status(500).json({ error: 'Failed to create room' });
        }
    });

    // Helper function to generate a secure code
    function secureGenerateCode(length = 6) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const array = new Uint8Array(length);
        crypto.getRandomValues(array); // CSPRNG
      
        let code = '';
        for (let i = 0; i < length; i++) {
          code += chars[array[i] % chars.length];
        }
      
        return code;
    }
      
}