const generateRandomColor = () => {
  const chars = '0123456789ABCDEF';
  let hex = '#';
  for (let i = 0; i < 6; i++) {
    hex += chars[Math.floor(Math.random() * 16)];
  }
  return hex;
};

const setPalette = () => {
  for (let i = 1; i < 6; i++){
    const randomHex = generateRandomColor();
    if (!$(`.color${i}`).hasClass('locked')) {
      $(`.color${i}`).css('background-color', randomHex);
      $(`#color${i}Hex`).text(randomHex);
    }
  }
};

const lockUnlockColor = (event) => {
  const bar = $(event.target);
  bar.closest('.color').toggleClass('locked');
};

const addProject = (name, value) => {
  $('.drop-down').append(`<option value='${value}'>${name}</option>`);
};

const makeProjectList = (projects) => {
  projects.forEach(project => {
    addProject(project.name, project.id);
  });
};

const showPalettes = (palettes) => {
  palettes.forEach(palette => {
    $(`.project${palette.project_id}`).append(`
      <div class='full-palette'>
        <div class='small-color'
          style='background-color: ${palette.hex1}'>
        </div>
        <div class='small-color'
          style='background-color: ${palette.hex2}'>
        </div>
        <div class='small-color'
          style='background-color: ${palette.hex3}'>
        </div>
        <div class='small-color'
          style='background-color: ${palette.hex4}'>
        </div>
        <div class='small-color'
          style='background-color: ${palette.hex5}'>
        </div>
      </div>
    `);
  });
};

const getPalettes = (projects) => {
  projects.forEach(project => {
    fetch(`/api/v1/projects/${project.id}/palettes`)
      .then( response => response.json())
      .then( palettes => showPalettes(palettes));
  });
};

const showProjects = (projects) => {
  projects.forEach(project => {
    $('.projects-container').append(`
      <div class='project${project.id} project'>
        <h2>${project.name}</h2>
      </div>
    `);
  });
};

const getProjects = () => {
  fetch('/api/v1/projects')
  .then(response => response.json())
  .then(projects => {
    makeProjectList(projects);
    getPalettes(projects);
    showProjects(projects);
  })
  .catch(error => console.log({ error }));
};









// event listeners
$(document).ready(setPalette);
$(document).ready(getProjects);
$('.color').on('click', ".lock-button", (event => lockUnlockColor(event)));
$('.new-button').on('click', setPalette);
