const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const COUNT_PARTICIPANTS = 2
const BOT_NAME = '@bot'
const BOT_AVATAR = '/bot'

// TIP: rooms contain messages between people, P.S. bad name for property message, text better
let rooms = [
  {
    name: 'petya_vlad',
    messages: [
      {
        sender: 'petya',
        path: '/default_avatar',
        message: 'Hi, what is up ?'
      },
      {
        sender: 'vlad',
        path: '/default_avatar',
        message: 'everth good thanks!',
      }
    ]
  }
];
let users = [{
  nickname: BOT_NAME,
  path: BOT_AVATAR,
}];

let returnSpecialSymbols = function (message) {
  const result = message.filter(item => item == '#@)₴?$0');
  if(result.length) {
    return result
  } else {
    return message
  }
}

let getRequestToBot = function (message, checkSpecialSymbols) {   
  const splitMessageToArray = message.split(' ');
  const checkingBySymbols = checkSpecialSymbols.call(null, splitMessageToArray);
  const stringBodyMessage = checkingBySymbols.join(' ');
  return stringBodyMessage;
}

const TIP = require("./factory.js")();

let creatingBotAnswer = function (message) {
  let bodyMessageFromBot = getRequestToBot(message, returnSpecialSymbols)
  let createTipDependsToRequest = TIP.create(bodyMessageFromBot);
  let messageOfBotAnswer = createTipDependsToRequest ? createTipDependsToRequest.getMessage() : false;
  if(messageOfBotAnswer == false) {
    messageOfBotAnswer = 'Гей друже, я гадаю ти помилився запитом';
    return messageOfBotAnswer;
  }

  return messageOfBotAnswer;
}

const routes = require("./routes/routes")(app, users);

io.on('connection', (socket) => {
  console.log(`client connected`);
  io.emit('users list',  users);
  socket.on('get messages from room', (otherPerson, currentPerson) => {
    let isCreateNewRoom = true;
    rooms.map(room => {
      let count_of_coincidence = 0;
      let participantsOfRoom = room.name.split('_');
      for (let participant of participantsOfRoom) {
        if (otherPerson === participant || currentPerson === participant) {
          count_of_coincidence += 1;
        }
      }
      if (count_of_coincidence === COUNT_PARTICIPANTS) {
        isCreateNewRoom = false;
        socket.join(room.name);
        io.in(room.name).emit('set room with messages', room);
      } else {
        socket.leave(room.name);
      }
    })

    if (isCreateNewRoom) {
      let newRoom = {
        name: `${otherPerson}_${currentPerson}`,
        messages: []
      }
      socket.join(newRoom.name);
      rooms.push(newRoom);
      
      io.in(newRoom.name).emit('set room with messages', newRoom);
    }
  })

  socket.on('send message', (message, receiver) => {
    let currentPerson = message.sender;
    let otherPerson = receiver;
    rooms.map(room => {
      let count_of_coincidence = 0;
      let participantsOfRoom = room.name.split('_');
      for (let participant of participantsOfRoom) {
        if (otherPerson === participant || currentPerson === participant) {
          count_of_coincidence += 1;
        }
      }
      if (count_of_coincidence === COUNT_PARTICIPANTS) {
        for (let user of users) {
          if (user.nickname === currentPerson) {
            // TIP: setting image for this person because from server it came without image
            message.path = user.path
          }
        }
        room.messages.push(message)
        if (otherPerson === BOT_NAME) {
          // TIP: reason why property message is bad :-(
          let text = message.message
          let botAnswer = creatingBotAnswer(text);
          room.messages.push({
            sender: BOT_NAME,
            path: BOT_AVATAR,
            message: botAnswer,
          })
        }
        io.in(room.name).emit('send message', room);
      }
    })
  })

  socket.on('disconnect', () => {
    console.log(`client is disconnected`);
  });
})

http.listen(3000, () => {
  console.log('litening on *:3000');
});