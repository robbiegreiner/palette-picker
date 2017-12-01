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

  database('projects').insert(project, '*')
    .then(project => {
      response.status(201).json(project);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  for (let requiredParameter of ['name', 'hex1', 'hex2', 'hex3', 'hex4', 'hex5']) {
    if (!palette[requiredParameter]) {
      return response.status(422).send({ error: `You're missing a ${requiredParameter}.` });
    }
  }

  database('palettes').insert(palette, '*')
    .then(palette => {
      response.status(201).json(palette);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id/palettes', (request, response) => {
  database('palettes')
    .where({ project_id: request.params.id}).select()
    .then(palette => {
      response.status(200).json(palette);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {
  const id = request.params;

  database('palettes').where(id).del()
    .then(result => {
      if (!result) {
        response.status(422).json({ error: 'no palette'});
      } else {
        response.sendStatus(204);
      }
    })
    .catch(error => response.status(500).json({ error }));
});

app.listen(app.get('port'), () => {
  console.log(`running on ${app.get('port')}.`);
});

module.exports = app;
