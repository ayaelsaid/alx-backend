import redis from 'redis'
import { promisify } from 'util';


const client = redis.createClient()

client.on('ready', () => {
	console.log('Redis client connected to the server');
});
client.on('error', (err) => {
	  console.error('Redis client not connected to the server: ', err);
});
const asyncSet = promisify(client.set).bind(client);
const asyncGet = promisify(client.get).bind(client);

async function setNewSchool(schoolName, value){
try {
    await asyncSet(schoolName, value);
  } catch (err) {
    console.error('Error setting key:', err);
  }
}


async function displaySchoolValue(schoolName) {
  try {
    const reply = await asyncGet(schoolName);
    console.log(`reply);
  } catch (err) {
    console.error('Error getting key:', err);
  } finally {
    client.quit();
  }
}
(async () => {
  await displaySchoolValue('Holberton');

  await setNewSchool('HolbertonSanFrancisco', '100');
  await displaySchoolValue('HolbertonSanFrancisco');
})();
