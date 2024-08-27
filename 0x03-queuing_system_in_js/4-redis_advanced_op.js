import redis from 'redis';

const client = redis.createClient();

client.on('ready', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (err) => {
  console.error('Redis client not connected to the server: ', err);
});
const fields = [
  { key: 'Portland', value: '50' },
  { key: 'Seattle', value: '80' },
  { key: 'New York', value: '20' },
  { key: 'Bogota', value: '20' },
  { key: 'Cali', value: '40' },
  { key: 'Paris', value: '2' }
];
fields.forEach(field => {
  client.hset('HolbertonSchools', field.key, field.value, redis.print);
});
client.hgetall('HolbertonSchools', (err, reply) => {
  if (err) {
    console.error('Error getting hash:', err);
  } else {
    console.log('Hash contents:', reply);
  }
  client.quit();
});
