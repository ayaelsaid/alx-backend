import kue from 'kue';

const queue = kue.createQueue();

const blacklisted = [4153518780, 4153518781];
function sendNotification(phoneNumber, message, job, done){
  job.progress(0, 100);
if (blacklisted.includes(phoneNumber)) {
    const errorMsg = `Phone number ${phoneNumber} is blacklisted`;
    console.error(`Error: ${errorMsg}`);
    
    return done(new Error(errorMsg));
  } else {
    job.progress(50);
    console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
    
  }
}

queue.process('push_notification_code_2', (job, done) => {
  sendNotification(job.data.phoneNumber, job.data.message, job, done);
});

queue.on('error', (err) => {
  console.error('Queue error:', err);
});  
