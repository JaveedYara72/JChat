const moment = require('moment')

function formatMessage(username,text){
    return{
        username,
        text,
        time: moment().format('h:mm a')
    }
}

// this will return an object which returns username,textmessage and the time at which it was sent
// Now Export this

module.exports = formatMessage