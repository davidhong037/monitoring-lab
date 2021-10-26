const express = require('express')
const path = require('path')
const Rollbar = require('rollbar')

let rollbar = new Rollbar ({
    accessToken: '8ac023742d2b424d91f206c06db3e12e',
    captureUncaught: true,
    captureUnhandledRejections: true
})

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
    rollbar.info('html file served successfully')
})

app.get('/style', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/styles.css'))
})

app.get('/rollbar', (req, res) => {
    try {
        nonExistentFunction();
      } catch (error) {
        rollbar.bar.error("Not working properly");
      } 
})

app.use(rollbar.errorHandler())

const port = process.env.PORT || 4545

app.listen(port, () => console.log(`Take us to warp ${port}!`))