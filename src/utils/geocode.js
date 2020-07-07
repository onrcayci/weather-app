const request = require('postman-request')

// instead of using string address itself, we use encodeURIComponent() to convert the string to the correct form
const geocode = (address, callback) => {
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1Ijoib2NheWNpIiwiYSI6ImNrYXNoYm9rdTB3d2QycW14cDJzbXhmaDEifQ.9Zo_RJADCV4K9N7BQHNGYQ'
    request({ url, json: true }, (error, { body }) => {
        if(error) {
            callback('Unable to connect to location services!', undefined)
        } else if(body.features.length === 0) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            callback(undefined, {
                latitude: body.features[0].center[1],
                longitude: body.features[0].center[0],
                location: body.features[0].place_name
            })
        }
    })
}

module.exports = geocode