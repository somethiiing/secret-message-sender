const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const algorithm = 'aes-256-ctr';
const crypto = require('crypto');

app.use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(express.static(path.join(__dirname, 'build')))
  .use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


let encrypt = (message, passphrase) => {
  let cipher = crypto.createCipher(algorithm, passphrase)
  let crypted = cipher.update(JSON.stringify(message),'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

app.post('/api/encrypt/', (req, res) => {
  let passphrase = req.body.hash;
  let message = req.body.message;
  let encrypted = encrypt(message, passphrase);
  res.send(encrypted);
})

let decrypt = (message, passphrase) => {
  let decipher = crypto.createDecipher(algorithm, passphrase);
  try {
    let dec = decipher.update(message,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
  } catch (err) {
    return 'FAILED';
  }
}

app.post('/api/decrypt/', (req, res) => {
  let passphrase = req.body.hash;
  let message = req.body.message;
  let decrypted = decrypt(message, passphrase);
  let error = false;
  let response = {};

  if (decrypted === 'FAILED' ) {
    response = { status: 'FAILED' };
  } else {
    try {
      decrypted = JSON.parse(decrypted);
    } catch (err) {
      error = true;
      response = { status: 'FAILED' }
    }
    if (!error) {
      let date = Date();
      if (date < decrypted.expDate) {
        response = { status: 'FAILED' };
      } else {
        response = { status: 'SUCCESS', message: decrypted };
      }
    }
  }
  res.send(response);
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});

const port = process.env.PORT || '3000';
app.set('port', port);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});