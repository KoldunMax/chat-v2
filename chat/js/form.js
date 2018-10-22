const invite_form = document.getElementsByClassName('invite-form')[0]
const invite_form__input = document.getElementsByClassName('invite-form__input')[0]

let savingNickToSessionStorage = function () {
  sessionStorage.setItem('nickname', invite_form__input.value)
}

invite_form.addEventListener('submit', savingNickToSessionStorage)