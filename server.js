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
        rollbar.error("Not working properly");
      } 
})

let soda = []

app.post('/api/soda', (req, res) => {
    let {name} = req.body
    name = name.trim()

    const index = soda.findIndex(sodaName => sodaName === name)

    if(index === -1 && name !== ''){
        soda.push(name)
        rollbar.log('Soda added successfully', {author: 'David', type: 'manual entry'})
        res.status(200).send(soda)
    } else if(name === ''){
        rollbar.error('No name given')
        res.status(400).send('Must provide a soda name')
    } else {
        rollbar.critical('Soda already exists')
        res.status(400).send("That soda already exists!")  
    }
})

app.use(rollbar.errorHandler())

const port = process.env.PORT || 4545

app.listen(port, () => console.log(`Take us to warp ${port}!`))