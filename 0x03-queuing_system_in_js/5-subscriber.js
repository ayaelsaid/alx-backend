import redis from 'redis';

const client = redis.createClient();

client.on('ready', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.error('Redis client not connected to the server: ', err);
});

const channel = 'holberton school channel';
client.subscribe(channel);

client.on('message', (channel, message) => {
  if (message === 'KILL_SERVER') {
    client.unsubscribe(channel);
    client.quit();
  } else {
    console.log(message);
  }
});



