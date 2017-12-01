//import express to use on top of NodeJS
const express = require('express');
const app = express();

//configure environment to be used with knex
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
//import body parser middleware
const bodyParser = require('body-parser');

//set development port to 3000, access this port in the browser
app.set('port', process.env.PORT || 3000);
//serving up all static pages from inside the public folder
app.use(express.static(__dirname + '/public'));

//middleware to parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//create endpoint to get project data
app.get('/api/v1/projects', (request, response) => {
  //select what database/table in our database we are getting data from
  database('projects').select()
    //using .then for async promises
    .then((projects) => {
      //set response status to 200 if promise is resolved and return the projects
      response.status(200).json(projects);
    })
    //throw an error if promise is not resolved
    .catch((error) => {
      //set status to 500 if there is a server error
      response.status(500).json({ error });
    });
});

//creates endpoint to get the palettes
app.get('/api/v1/palettes', (request, response) => {
  //saying what database/table in our database to select from
  database('palettes').select()
    //.then for async promises
    .then((palettes) => {
      //set the response status to 200 if promise is resolved and return the palettes
      response.status(200).json(palettes);
    })
    .catch((error) => {
      //set status to 500 if there is a server error
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  //setting the request body to a variable
  const project = request.body;

  //user must submit all the required parameters in the body or else respond with 422 error
  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response.status(422).send({ error: `You're missing a ${requiredParameter}.` });
    }
  }

  //specify the database/table to insert into and returning what is entered into the database
  database('projects').insert(project, '*')
    .then(project => {
      //status 201 if promise is resolved and return the whole project
      response.status(201).json(project);
    })
    .catch(error => {
      //status 500 for server error
      response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes', (request, response) => {
  //setting body to a variable
  const palette = request.body;

  //user must submit the required parameters in the body or else respond with 422 error
  for (let requiredParameter of ['name', 'hex1', 'hex2', 'hex3', 'hex4', 'hex5']) {
    if (!palette[requiredParameter]) {
      return response.status(422).send({ error: `You're missing a ${requiredParameter}.` });
    }
  }

  //specify the database to insert into and returning what is entered into the database
  database('palettes').insert(palette, '*')
    .then(palette => {
      //status 201 if promise is resolved and return the whole palette
      response.status(201).json(palette);
    })
    .catch(error => {
      //status 500 for server error
      response.status(500).json({ error });
    });
});

//create endpoint to get palettes for a specific project
app.get('/api/v1/projects/:id/palettes', (request, response) => {
  //choosing project from the database that has the dynamic id above
  database('palettes')
    .where({ project_id: request.params.id}).select()
    .then(palette => {
      //setting status to 200 if promise is resolved and sending the palette
      response.status(200).json(palette);
    })
    .catch(error => {
      //sending 500 status if there is a server error
      response.status(500).json({ error });
    });
});

//create endpoint to delete a specific palette
app.delete('/api/v1/palettes/:id', (request, response) => {
  // setting the id to a variable
  const id = request.params;

  //selecting the palettes database then deleting the row that contains the id
  database('palettes').where(id).del()
    .then(result => {
      if (!result) {
        //if the palette doesn't exist then return an error
        response.status(422).json({ error: 'no palette'});
      } else {
        //if successful send status of 204
        response.sendStatus(204);
      }
    })
    // if there is a server error send back response status of 500
    .catch(error => response.status(500).json({ error }));
});

// show in the console what port the app will run on
app.listen(app.get('port'), () => {
  console.log(`running on ${app.get('port')}.`);
});

//exporting the app so we can use it in testing
module.exports = app;
