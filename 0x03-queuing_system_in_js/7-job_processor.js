import kue from 'kue';

const queue = kue.createQueue();

const blacklisted = ['4153518780', '4153518781']; // Use strings for consistency

function sendNotification(phoneNumber, message, job, done) {
  // Track progress of the job
  job.progress(0, 100);

  // Check if the phone number is blacklisted
  if (blacklisted.includes(phoneNumber)) {
    const errorMsg = `Phone number ${phoneNumber} is blacklisted`;
    console.log(`Notification job ${job.id} failed: ${errorMsg}`);
    return done(new Error(errorMsg)); // Fail the job with an error
  }

  // Simulate sending notification
  job.progress(50, 100);
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);

  // Simulate success
  setTimeout(() => {
    job.progress(100, 100); // Track progress to 100%
    console.log(`Notification job ${job.id} completed`);
    done(); // Call done to mark the job as complete
  }, 1000); // Simulate delay
}

// Process jobs from the 'push_notification_code_2' queue
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

queue.on('error', (err) => {
  console.error('Queue error:', err);
});
