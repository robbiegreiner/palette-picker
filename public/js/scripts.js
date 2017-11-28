const generateRandomColor = () => {
  const chars = '0123456789ABCDEF';
  let hex = '#';
  for (let i = 0; i < 6; i++) {
    hex += chars[Math.floor(Math.random() * 16)];
  }
  console.log(hex);
  return hex;
};

let color1 = generateRandomColor();
let color2 = generateRandomColor();
let color3 = generateRandomColor();
let color4 = generateRandomColor();
let color5 = generateRandomColor();

$('.new-button').on('click', generateRandomColor);
