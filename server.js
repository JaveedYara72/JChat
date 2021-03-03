const { error } = require('console')
const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const { Socket } = require('dgram')
const formatMessage = require('./utils/messages')
const { SSL_OP_NO_TICKET } = require('constants')
const botName = 'JChat Bot'
const {userJoin, getCurrentUser, userleave, getRoomUsers} = require('./utils/users')

//set static folder
app.use(express.static(path.join(__dirname,"public")))


const PORT = process.env.PORT || 3300
const server = http.createServer(app)
const io = socketio(server)

//RUn When it connects
io.on('connection',socket =>{
    socket.on('joinroom',({username,room})=>{
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)

        // console.log('New WS Connection')
        // Welcome Current User
        socket.emit('message', formatMessage(botName, 'Welcome to Jchat'))

        //Broadcast when a user connects, it sends this message to everyone except the guy who is connecting
        socket.broadcast.to(user.room).emit('message',formatMessage(botName, `A ${username} has joined the Chat`))
        
        //send users and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    //Listen for chat message
    socket.on('chatMessage',(msg)=>{ //this msg is the same msg that we got from the form in main.js
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,msg))
    })

    //THis runs when client disconnects
    socket.on('disconnect',()=>{ //this disconnect is apparently a keyword

        const user = userleave(socket.id)
        if(user){
            io.to(user.room).emit('message',formatMessage(botName, `A ${user.username} has left the chat`))

            //send users and room info
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
        
    })
    // All the Clients
    // io.emit()
})

server.listen(PORT,()=>{
    console.log(`Server is Running on ${PORT}`)
})

