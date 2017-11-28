const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.get('api/v1/projects', (request, response) => {
  // JSON projects
});

app.get('api/v1/palettes', (request, response) => {
  // JSON palettes
});

app.post('api/v1/projects', (request, response) => {

});

app.delete('api/v1/palettes:id', (request, response) => {
  // JSON palettes
  // request.params.id
});

app.post('api/v1/palettes', (request, response) => {
  // JSON palettes
});




app.listen(app.get('port'), () => {
  console.log(`running on ${app.get('port')}.`);
});
