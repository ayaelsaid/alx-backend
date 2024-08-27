import redis from 'redis'

const client = redis.createClient()

client.on('ready', () => {
	console.log('Redis client connected to the server');
});
client.on('error', (err) => {
	  console.error('Redis client not connected to the server: ', err);
});
client.hset('HolbertonSchools', 
  'Portland', '50',
  'Seattle', '80',
  'New York', '20',
  'Bogota', '20',
  'Cali', '40',
  'Paris', '2',
  redis.print
);
client.hgetall('HolbertonSchools', (err,reply) => {
        if(err) throw err;
        else {
        console.log(reply);
	}
        client.quit();

      });
