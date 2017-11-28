const generateRandomColor = () => {
  const chars = '0123456789ABCDEF';
  let hex = '#';
  for (let i = 0; i < 6; i++) {
    hex += chars[Math.floor(Math.random() * 16)];
  }
  console.log(hex);
  return hex;
};

// let colorHex1 = generateRandomColor();
// let colorHex2 = generateRandomColor();
// let colorHex3 = generateRandomColor();
// let colorHex4 = generateRandomColor();
// let colorHex5 = generateRandomColor();

// $('.color1').css('background-color', colorHex1);

const setPalette = () => {
  for (let i = 1; i < 6; i++){
    const randomHex = generateRandomColor();
    $(`.color${i}`).css('background-color', randomHex);
    $(`#color${i}Hex`).text(randomHex)
  }
};

$(document).ready(setPalette);

// event listeners
$('.new-button').on('click', setPalette);
