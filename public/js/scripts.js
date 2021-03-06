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
  if (bar.attr('src') === './assets/unlock-white.svg'){
    bar.attr('src', './assets/padlock-white.svg');
    bar.closest('.color').toggleClass('locked');
  } else {
    bar.attr('src', './assets/unlock-white.svg');
    bar.closest('.color').toggleClass('locked');
  }
};

const editColor = (event) => {
  const bar = $(event.target);
  const barColor = bar.text();
  bar.closest('.color').css('background-color', barColor);
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
      <div class='full-palette' data-colorlist='${JSON.stringify([palette.hex1, palette.hex2, palette.hex3, palette.hex4, palette.hex5])}' id='${palette.id}'>
        <h3 class='palette-name'>${palette.name}</h3>
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
        <button class='delete-palette'>Delete</button>
      </div>
    `);
  });
};

const showSavedPaletteAbove = (event) => {
  const palette = $(event.target).closest('.full-palette');
  const colors = JSON.parse(palette.attr('data-colorlist'));
  console.log(colors);

  colors.forEach((color, index) => {
    $(`.color${index + 1}`).css('background-color', color);
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
        <h2 class='project-name'>${project.name}</h2>
      </div>
    `);
  });
};

const getProjects = () => {
  $('.project').remove();
  fetch('/api/v1/projects')
  .then(response => response.json())
  .then(projects => {
    makeProjectList(projects);
    getPalettes(projects);
    showProjects(projects);
  })
  .catch(error => console.log({ error }));
};

const savePalette = () => {
  const palette = {
    name: $('.name-input').val(),
    hex1: $('.color1').css('background-color'),
    hex2: $('.color2').css('background-color'),
    hex3: $('.color3').css('background-color'),
    hex4: $('.color4').css('background-color'),
    hex5: $('.color5').css('background-color'),
    project_id: $('.drop-down').val()
  };

  fetch('/api/v1/palettes', {
    method: 'POST',
    body: JSON.stringify(palette),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(palettes => showPalettes(palettes))
    .catch(error => console.log(error));

  $('.name-input').val('');
};

const saveProject = () => {
  const projectName = $('.project-input').val();

  fetch('/api/v1/projects')
    .then(response => response.json())
    .then(projects => {
      const duplicate = projects.find(project => projectName === project.name);
      if (!duplicate) {
        postProject();
      } else {
        alert('Project name already in use');
      }
    });
};

const postProject = () => {
  const projectName = JSON.stringify({
    name: $('.project-input').val()
  });

  fetch('/api/v1/projects', {
    method: 'POST',
    body: projectName,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(project => {
      addProject(project[0].name, project[0].id);
      showProjects([project[0]]);
    })
    .catch(error => console.log(error));

  $('.project-input').val('');
};

const deletePalette = (event) => {
  const id = $(event.target).closest('.full-palette').attr('id');

  fetch(`/api/v1/palettes/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .catch(error => console.log(error));

  $(event.target).closest('.full-palette').remove();
};

// event listeners
$(document).ready(setPalette);
$(document).ready(getProjects);
$('.color').on('click', '.lock-button', (event => lockUnlockColor(event)));
$('.color').on('focusout', '.hex-text', (event) => editColor(event));
$('.new-button').on('click', setPalette);
$('.save-button').on('click', savePalette);
$('.save-project').on('click', saveProject);
$('.projects-container').on('click', '.delete-palette', (event) => deletePalette(event));
$('.projects-container').on('click', '.small-color', (event) => showSavedPaletteAbove(event));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('Service Worker registration successful');
      })
      .catch(error => {
        console.log(`Service worker registration failed: ${error}`);
      });
  });
}
