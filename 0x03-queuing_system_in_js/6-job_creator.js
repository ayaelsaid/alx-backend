import redis from 'redis';
import kue from 'kue';

const data = {
  phoneNumber: '1234567890',
  message: 'Hello, this is a test notification.'
};
const push_notification_code = kue.createQueue();

const job = push_notification_code.create('notification', {
  to: data.phoneNumber,
  message: data.message
}).save((err) => {
  if (err) {
    console.error('Error creating job:', err);
  } else {
    console.log('Notification job created with ID:', job.id);
  }
});

push_notification_code.on('job complete', (id) => {
  console.log('Job complete with ID:', id);
});

push_notification_code.on('error', (err) => {
  console.error('Notification job failed:', err);
});
