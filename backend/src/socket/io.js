import pool from '../db/pool.js';

function setupSocket(io) {
  io.on('connection', (socket) => {
    socket.on('join:ride', (rideId) => {
      socket.join(`ride:${rideId}`);
    });

    socket.on('driver:location', async (payload) => {
      try {
        const { rideId, driverId, lat, lng, heading = null, speed = null } = payload;
        if (!rideId || !driverId || lat == null || lng == null) return;

        await pool.query(
          `INSERT INTO ride_locations (ride_id, driver_id, lat, lng, heading, speed)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [rideId, driverId, lat, lng, heading, speed]
        );

        io.to(`ride:${rideId}`).emit('driver:location:update', {
          rideId,
          driverId,
          lat,
          lng,
          heading,
          speed,
          at: new Date().toISOString()
        });
      } catch (error) {
        socket.emit('error:location', { message: error.message });
      }
    });

    socket.on('ride:status:update', ({ rideId, status }) => {
      io.to(`ride:${rideId}`).emit('ride:status:changed', { rideId, status, at: new Date().toISOString() });
    });
  });
}

export default setupSocket;
