const chatform = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')

//Get Username and room from URL
const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})

const socket = io()

//Join Chat Room
socket.emit('joinroom',{username, room}) //we are sending out object which has username, text

//get Room and users
socket.on('roomUsers',({room, users})=>{
    outputRoomname(room);
    outputUsers(users)
})

// Message from server
socket.on('message', message =>{ //the second message is the data that we have sent
    console.log(message)
    outputMessage(message)

    //scroll down automatically
    chatMessages.scrollTop = chatMessages.scrollHeight
})



//message submit
chatform.addEventListener('submit',(e)=>{
    e.preventDefault();

    //Get Message Text
    const msg = e.target.elements.msg.value; //this is grabbing the value from the from.

    // emitting a message to the server
    socket.emit('chatMessage',msg)

    //clear the message
    e.target.elements.msg.value = ''
    e.target.elements.focus()
})

//Output Message to DOM
function outputMessage(message){
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `
    <div class="message">
    <p class="meta">${message.username}<span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    </div>
    `
    document.querySelector('.chat-messages').appendChild(div)
}

// Add room name to DOM
function outputRoomname(room){
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users){
    userList.innerHTML = `
        ${users.map( user =>`<li>${user.username}</li>`).join('')}
    `
}
