import Redis from 'ioredis'

const dotenv = require('dotenv')

dotenv.config()

const host = process.env.REDIS_HOST || 'localhost'
const port = process.env.REDIS_PORT || 6379
const password = process.env.REDIS_PASSWORD || ''

const redis = new Redis({
    host: host,
    port: port,
    password: password
})

redis.on('error', err => {
    console.log('Error ' + err);
});

export default redis