import kue from 'kue';

const queue = kue.createQueue();

const blacklisted = ['4153518780', '4153518781']; // Use strings for consistency

function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, 100);

  if (blacklisted.includes(phoneNumber)) {
    job.fail(new Error(`Phone number ${phoneNumber} is blacklisted`));
    console.log(`Notification job ${job.id} failed: Phone number ${phoneNumber} is blacklisted`);
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  } else {
    job.progress(50, 100);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    
    setTimeout(() => {
      console.log(`Notification job ${job.id} completed`);
      done();
    }, 2000);
  }
}

queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

queue.on('error', (err) => {
  console.error('Queue error:', err);
});
