import redis from 'redis'

const client = redis.createClient()

client.on('ready', () => {
	console.log('Redis client connected to the server');
});
client.on('error', (err) => {
	  console.error('Redis client not connected to the server: ', err);
});
function setNewSchool(schoolName, value){
  client.set(schoolName, value, redis.print)
function displaySchoolValue(schoolName){
      client.get(schoolName, (err,reply) => {
        if(err) throw err;
        else {
        console.log('reply: ${reply}');
        console.log(${schoolName});
        }
        client.quit();

      });
}
