const express = require('express')
const app = express()

const indexRouter = require('./routes/index')
const errorMiddleware = require('./middleware/error');

app.use(express.urlencoded());
app.set("view engine", "ejs");

app.use(express.json())

app.use('/', indexRouter)

app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, (err) => {
    err ? console.error(err) : console.log(`Server is listening on port ${PORT}...`)
})