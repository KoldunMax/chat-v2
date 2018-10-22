let chat = document.getElementsByClassName('chat')[0]
let list = document.getElementsByClassName('list')[0]
let chat_list = document.getElementsByClassName('chat-list')[0]
let menu_media = document.getElementsByClassName('menu-media')[0]
let people_list = document.getElementsByClassName('people-list')[0]
let close_icon_menu = document.getElementsByClassName('close-icon-menu')[0]
let body = document.getElementsByTagName('BODY')[0]
let chat_message__text = document.getElementsByClassName('chat-message__text')[0]
let chat_message__button = document.getElementsByClassName('chat-message__button')[0]
let my_account = document.getElementsByClassName('my-account')[0]
let search__item = document.getElementsByClassName('search__item')[0]

const socket = io.connect();

const CURRENT_USER_NAME = sessionStorage.getItem('nickname');

my_account.innerText = `${CURRENT_USER_NAME} (me)`;

let setAttributes = function (el, attrs) {
  for(let key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
}

let displayingMediaMenu = function () {
  let { width } = people_list.style;
  if (width === '260px') {
    people_list.style.width = '0px';
  } else {
    people_list.style.width = '260px';
  }
}

let showingMenu = function () {
  let { width } = people_list.style;
  if (body.offsetWidth > 768 && width === '0px') {
    people_list.style.width = '260px';
  }
  if (body.offsetWidth < 768 && width === '260px') {
    people_list.style.width = '0px';
  }
}

let gettingMessagesFromServer = function () {
  let clickedPerson = this
  let nickname = clickedPerson.innerText
  socket.emit('get messages from room', nickname, CURRENT_USER_NAME);
}

let makingListItemActive = function () {
  let clickedPerson = this
  // TIP: if we choosen person, we can type him message, that reason making input active
  chat_message__text.removeAttribute("disabled")
  for (let user of list.children) {
    if (clickedPerson === user) {
      clickedPerson.classList.add('list__item_active')
    } else {
      user.classList.remove('list__item_active')
    }
  }
}

let definitionKeyValidateSendingClearing = function (e) {
  if(e.keyCode == 13) {
    validatingAndSendingMessage();
    clearingTextInput();
  }
}

let displayingListUsers = function (users) {
  // EXPLANATION: if was added new user, we clean old list and download new
  list.innerHTML = ''
  for (let user of users) {
    let { path, nickname } = user
    if (user.nickname !== CURRENT_USER_NAME) {
      let list__item = document.createElement('li');
      setAttributes(list__item, {
        'class': 'list__item',
      });
      list__item.addEventListener('click', makingListItemActive)
      list__item.addEventListener('click', gettingMessagesFromServer)
      let list__img = document.createElement('img');
      setAttributes(list__img, {
        'class': 'list__img',
        'src': path,
        'alt': 'avatar',
      });
      let list__about = document.createElement('div');
      setAttributes(list__about, {
        'class': 'list__about',
      });
      let list__name = document.createElement('div');
      list__name.innerText = nickname;
      setAttributes(list__name, {
        'class': 'list__name',
      });
      list__about.appendChild(list__name);
      list__item.appendChild(list__img);
      list__item.appendChild(list__about);
      list.appendChild(list__item);
    }
  }
}

let displayingListMessages = function (messages = []) {
  // EXPLANATION: if was added new message, we clean old list and download new
  chat_list.innerHTML = '';
  if (messages.length > 0) {
    for (let message_item of messages) {
      let { sender, path, message } = message_item
      
      let chat_list__item = document.createElement('li');
      setAttributes(chat_list__item, {
        'class': 'chat-list__item',
      });

      if (sender === CURRENT_USER_NAME) chat_list__item.classList.add('align-right')

      let chat_list__data = document.createElement('div');
      setAttributes(chat_list__data, {
        'class': 'chat-list__data',
      });

      let chat_list__image = document.createElement('img');
      setAttributes(chat_list__image, {
        'class': 'chat-list__image',
        'src': path,
      })

      let chat_list__message = document.createElement('div');
      chat_list__message.innerText = message;
      setAttributes(chat_list__message, {
        'class': 'chat-list__message'
      })
      sender === CURRENT_USER_NAME
        ? chat_list__message.classList.add('my-message')
        : chat_list__message.classList.add('other-message');
      
      chat_list__data.appendChild(chat_list__image);
      chat_list__item.appendChild(chat_list__data);
      chat_list__item.appendChild(chat_list__message);
      chat_list.appendChild(chat_list__item);
    }
  }
}

let getChoosenUser = function () {
  for (let user of list.children) {
    if (user.classList.contains('list__item_active')) {
      let nickname = user.innerText;
      return nickname;
    }
  }
}

let validatingAndSendingMessage = function () {
  let message = chat_message__text.value;
  let choosenUser = getChoosenUser();
  if (message.length > 0) {
    socket.emit('send message', {
      sender: CURRENT_USER_NAME,
      message,
    },
    choosenUser)
  }
}

let clearingTextInput = function () {
  let message = chat_message__text.value;
  if (message.length > 0) {
    chat_message__text.value = ''
  }
}

let filteringByName = function (e) {
  let filter = e.target.value.toUpperCase();
  console.log(list.children);
  [].forEach.call(list.children, user => {
    let name = user.innerText.toUpperCase();
    console.log(name.indexOf(filter))
    if (name.indexOf(filter) > -1) {
      user.style.display = 'flex';
    } else {
      user.style.display = 'none';
    }
  })
}

socket.on('set room with messages', (room) => displayingListMessages(room.messages))

socket.on('users list', (users) => displayingListUsers(users));

socket.on('send message', (room) => displayingListMessages(room.messages))

menu_media.addEventListener('click', displayingMediaMenu)
close_icon_menu.addEventListener('click', displayingMediaMenu)
window.addEventListener('resize', showingMenu)
chat_message__button.addEventListener('click', validatingAndSendingMessage)
chat_message__button.addEventListener('click', clearingTextInput)
chat_message__text.addEventListener('keypress', definitionKeyValidateSendingClearing)
search__item.addEventListener('keyup', filteringByName)