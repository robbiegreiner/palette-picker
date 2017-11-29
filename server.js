const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json(projects);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then((palettes) => {
      response.status(200).json(palettes);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response.status(422).send({ error: `You're missing a ${requiredParameter}.` });
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({id: project[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
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
