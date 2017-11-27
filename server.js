const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);

app.get('/', (request, response) => {
  response.send('express running ok');
})

app.listen(app.get('port'), () => {
  console.log(`running on ${app.get('port')}.`);
})
