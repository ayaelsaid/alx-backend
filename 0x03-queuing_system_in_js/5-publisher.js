import redis from 'redis';

const client = redis.createClient();

client.on('ready', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.error('Redis client not connected to the server: ', err);
});

function publishMessage(message, time) {
  setTimeout(() => {
    console.log('About to send MESSAGE');
    client.publish('holberton school channel', message, (err, reply) => {
      if (err) {
        console.error('Error publishing message:', err);
      } else {
        console.log(`Message published. ${reply} subscriber(s) received the message.`);
      }
    });
  }, time);
}
publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);
