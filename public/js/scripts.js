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



// event listeners
$(document).ready(setPalette);
$('.color').on('click', ".lock-button", (event => lockUnlockColor(event)));
$('.new-button').on('click', setPalette);
