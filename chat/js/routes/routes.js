const path = require('path');
const multer = require("multer");
const fs = require('fs');
const handleError = (err, res) => res.status(500);
let commonPath = path.join(__dirname, `/../../img/avatars`);
const upload = multer({ dest: commonPath });
 
const findingMatches = function (users, enteredNickname) {
  return users.length === 0 || !users.some(user => user.nickname === enteredNickname)
}

module.exports = function(app, users) {
  app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../../index.html')));
  app.get('/client.js', (req, res) => res.sendFile(path.join(__dirname + '/../client.js')));
  app.get('/form.js', (req, res) => res.sendFile(path.join(__dirname + '/../form.js')));
  app.get('/normalize', (req, res) => res.sendFile(path.join(__dirname + '/../../css/normalize.css')));
  app.get('/media', (req, res) => res.sendFile(path.join(__dirname + '/../../css/media.css')));
  app.get('/inviteForm', (req, res) => res.sendFile(path.join(__dirname + '/../../css/inviteForm.css')));
  app.get('/chat', (req, res) => res.sendFile(path.join(__dirname + '/../../css/chat.css')));
  app.get('/common', (req, res) => res.sendFile(path.join(__dirname + '/../../css/common.css')));
  app.get('/default_avatar', (req, res) => res.sendFile(path.join(__dirname + '/../../img/avatars/dflt_avtr.png')));
  app.get('/bot', (req, res) => res.sendFile(path.join(__dirname + '/../../img/avatars/bot.png')));
  app.get('/invte_fm_img_bg', (req, res) => res.sendFile(path.join(__dirname + '/../../img/invte_fm_img_bg.jpg')));

  const DEFAULT_PATH_IMAGE = '/default_avatar'

  app.post('/chat',
    upload.single('avatar'),
    (req, res) => {
      const { nickname } = req.body
      if (req.hasOwnProperty('file')) {

        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, `/../../img/avatars/${req.file.originalname}`);
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);

          const { originalname } = req.file
          app.get(`/${originalname}`, (req, res) => res.sendFile(targetPath));

          if (findingMatches(users, nickname)) {
            users.push({
              nickname,
              path: `/${originalname}`,
            })
          }
          res
            .status(200)
            .sendFile(path.join(__dirname + '/../../html/chat.html'))
        });
      } else {
        fs.unlink(DEFAULT_PATH_IMAGE, err => {
          if (findingMatches(users, nickname)) {
            users.push({
              nickname,
              path: `${DEFAULT_PATH_IMAGE}`,
            })
          }
          res
            .status(403)
            .sendFile(path.join(__dirname + '/../../html/chat.html'))
        });
      }
    }
  );
}