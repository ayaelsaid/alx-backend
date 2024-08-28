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

// Handle Redis errors
client.on('error', (err) => {
  console.error('Redis client error:', err);
});

// Initialize application
(async () => {
  try {
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
    const allAvailableSeats = await getCurrentAvailableSeats();
    
    if (!reservationEnabled || allAvailableSeats === 0) {
      reservationEnabled = false;
      return res.status(403).json({ "status": "Reservations are blocked" });
    }

    res.json({ numberOfAvailableSeats: allAvailableSeats });
  } catch (err) {
    console.error('Error retrieving available seats:', err);
    res.status(500).json({ error: 'Failed to retrieve available seats' });
  }
});

app.get('/reserve_seat', async (req, res) => {
  try {
    const allAvailableSeats = await getCurrentAvailableSeats();

    if (!reservationEnabled || allAvailableSeats === 0) {
      reservationEnabled = false;
      return res.status(403).json({ "status": "Reservations are blocked" });
    }

    const newAvailableSeats = allAvailableSeats - 1;
    await reserveSeat(newAvailableSeats);

    const job = queue.create('reserve_seat', {
      reservedSeatsNumber: 1
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
      console.log(`Seat reservation job ${job.id} failed:`, err);
    });

  } catch (err) {
    console.error('Error processing reservation:', err);
    res.status(500).json({ error: 'Failed to process reservation' });
  }
});

// Job processing logic
queue.process('reserve_seat', async (job, done) => {
  try {
    const reservedSeatsNumber = job.data.reservedSeatsNumber;
    const allAvailableSeats = await getCurrentAvailableSeats();
    
    if (allAvailableSeats === 0) {
      done(new Error("Reservations are blocked"));
      return;
    }

    const newAvailableSeats = allAvailableSeats - reservedSeatsNumber;

    if (newAvailableSeats < 0) {
      done(new Error("Not enough seats available"));
      return;
    }

    await reserveSeat(newAvailableSeats);
    done();
  } catch (err) {
    console.error('Error retrieving or reserving seats:', err);
    done(err);
  }
});

app.get('/process', async (req, res) => {
  try {
    res.json({ "status": "Queue processing" });
  } catch (err) {
    console.error('Error in /process route:', err);
    res.status(500).json({ error: 'Failed to handle /process route' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
