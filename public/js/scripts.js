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
    $(`.color${i}`).css('background-color', randomHex);
    $(`#color${i}Hex`).text(randomHex);
  }
};



// event listeners
$(document).ready(setPalette);
$('.new-button').on('click', setPalette);
