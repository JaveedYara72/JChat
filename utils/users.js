const users = []


//Join user to chat
// add a user to the array and return that
function userJoin(id,username, room){
    const user = {id,username,room}

    users.push(user)
    return user
}

//get current user
function getCurrentUser(id){
    return users.find(user=>user.id === id)
}

//User Leaves the chat
function userleave(id){
    const index = users.findIndex(user => user.id === id)

    if(indes !== -1){
        return users.splice(index,1)[0]
    }
}

//Get room users
function getRoomUsers(room){
    return users.filter(user => user.room === room)
}



module.exports = {
    userJoin,
    getCurrentUser,
    userleave,
    getRoomUsers
}