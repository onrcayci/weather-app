const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const public_dir = path.join(__dirname, '../public')
const views_dir = path.join(__dirname, '../templates/views')
const partials_dir = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', views_dir)
hbs.registerPartials(partials_dir)

// Setup static directory to serve
app.use(express.static(public_dir))

// app.com
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Onur Cayci',
    })
})

// app.com/about
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Onur Cayci',
    })
})

// app.com/help
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'This is some helpful text',
        name: 'Onur Cayci',
    })
})

// app.com/weather
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: "You must provide an address!"
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if(error) {
            return res.send({ error })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error) {
                return res.send({ error })
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address,
            })
        })
    })
})

// app.com/products
app.get('/products', (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)    
    res.send({
        products: [],
    })
})

// app.com/help/* -> any other help urls server does not support
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        error: 'Help article not found',
        name: 'Onur Cayci',
    })
})

// app.com/* -> any other urls that server does not support
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        error: 'Page not found',
        name: 'Onur Cayci',
    })
})

//start server
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})