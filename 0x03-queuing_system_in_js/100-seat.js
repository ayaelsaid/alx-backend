import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import kue from 'kue';

const client = redis.createClient();
const queue = kue.createQueue();
const app = express();
const PORT = 1245;

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

async function reserveSeat(number) {
  try {
    await setAsync('available_seats', number);
    console.log(`Available seats set to ${number}`);
  } catch (err) {
    console.error('Error setting seats in Redis:', err);
  }
}

async function getCurrentAvailableSeats() {
  try {
    const seats = await getAsync('available_seats');
    return seats ? parseInt(seats, 10) : null;
  } catch (err) {
    console.error('Error getting available seats from Redis:', err);
    throw err;
  }
}

(async () => {
  try {
    client.on('error', (err) => {
      console.error('Redis client error:', err);
    });

    await reserveSeat(50);
    console.log('Application started. Number of available seats set to 50.');
  } catch (err) {
    console.error('Error initializing application:', err);
    process.exit(1);
  }
})();

let reservationEnabled = true;

app.get('/available_seats', async (req, res) => {
  try {
    const availableSeats = await getCurrentAvailableSeats();
    if (availableSeats === 0) {
      reservationEnabled = false;
    }
    res.json({ numberOfAvailableSeats: availableSeats });
  } catch (err) {
    console.error('Error retrieving available seats:', err);
    res.status(500).json({ error: 'Failed to retrieve available seats' });
  }
});

});
app.get('/reserve_seat', async (req, res) => {
  try {
    // const numberOfSeatsToReserve = parseInt(req.query.seats, 10); 
    // curl "localhost:1245/reserve_seat?seats=3"

    const allAvailableSeats = await getCurrentAvailableSeats();
    
    if (allAvailableSeats === 0) {
      reservationEnabled = false;
      return res.status(403).json({ "status": "Reservations are blocked" });
    }
    const newAvailableSeats = allAvailableSeats - 1;

    // const newAvailableSeats = allAvailableSeats - numberOfSeatsToReserve;

    await reserveSeat(newAvailableSeats);

    const job = queue.create('reserve_seat', {
      seatNumber: newAvailableSeats
    }).save((err) => {
      if (err) {
        return res.status(500).json({ "status": "Reservation failed" });
      } else {
        return res.json({ "status": "Reservation in process" });
      }
    });

    job.on('complete', () => {
      console.log(`Seat reservation job ${job.id} completed`);
    });

    job.on('failed', (err) => {
      console.log(`Seat reservation job ${job.id} failed: `, err);
    });

  } catch (err) {
    console.error('Error retrieving or reserving seats:', err);
    return res.status(500).json({ error: 'Failed to reserve seat' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
