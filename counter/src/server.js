const express = require('express')
const redis = require('redis')

const app = express()

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost'
const client = redis.createClient({url: REDIS_URL});

(async () => {
    await client.connect()
})();

app.get('/counter/:bookID', async (req, res) => {
    const {bookID} = req.params

    try {
        const cnt = await client.get(bookID)
        res.json({cnt})
    } catch (e) {
        console.log(`=== redis error  === \n ${e}`)
        res.json({errcode: 500, errmsg: 'redis error!'})
    }
})

app.post('/counter/:bookID/incr', async (req, res) => {
    const {bookID} = req.params

    try {
        const cnt = await client.incr(bookID)
        res.json({cnt})
    } catch (e) {
        console.log(`=== redis error  === \n ${e}`)
        res.json({errcode: 500, errmsg: 'redis error!'})
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, (err) => {
    err ? console.error(err) : console.log(`Server listen on port ${PORT}...`)
})
