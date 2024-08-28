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
app.get('/reserve_seat', async (req, res) => {
  try {
    const currentSeats = await getCurrentAvailableSeats();
    if (currentSeats > 0) {
      await reserveSeat(currentSeats - 1);
      res.status(200).json({ status: 'Seat reserved' });
    } else {
      res.status(404).json({ status: 'No seats available' });
    }
  } catch (err) {
    console.error('Error processing reservation:', err);
    res.status(500).json({ status: 'Failed to reserve seat' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
