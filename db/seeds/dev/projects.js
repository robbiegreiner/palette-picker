exports.seed = function(knex, Promise) {

  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          id: 1,
          name: 'idea box'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            {
              id: 1,
              name: 'Beastie Boys',
              hex1: '#A7DF45',
              hex2: '#81A03C',
              hex3: '#339445',
              hex4: '#93B26A',
              hex5: '#E750C6',
              project_id: project[0]
            },
            {
              id: 2,
              name: 'Dirty Heads',
              hex1: '#769DA3',
              hex2: '#5CF36D',
              hex3: '#2236DA',
              hex4: '#DBA028',
              hex5: '#BC601A',
              project_id: project[0]
            }
          ]);
        })
        .then(() => console.log('The data was successfully seeded!'))
        .catch(error => console.log(`There was a data seeding error ${ error }`))
      ]);
    })
    .catch(error => console.log(`There was a data seeding error ${ error }`));
};
