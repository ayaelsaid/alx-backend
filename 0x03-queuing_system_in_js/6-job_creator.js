import redis from 'redis';
import kue from 'kue';

const data = {
  phoneNumber: '1234567890',
  message: 'Hello, this is a test notification.'
};
const queue = kue.createQueue();

const job = queue.create('push_notification_code', {
  to: data.phoneNumber,
  message: data.message
}).save((err) => {
  if (err) {
    console.error('Error creating job:', err);
  } else {
    console.log('Notification job created with ID:', job.id);
  }
});

queue.on('job complete', (id) => {
  console.log('Job complete with ID:', id);
});

queue.on('error', (err) => {
  console.error('Notification job failed:', err);
});
