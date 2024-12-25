const generateBackgroundColors = (length) => {
  const colors = [];
  for (let i = 0; i < length; i++) {
    const color = `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
    colors.push(color);
  }
  return colors;
};

const generateHoverBackgroundColors = (color, amount) => {
  let colorValue = color.startsWith("#") ? color.slice(1) : color;
  const num = parseInt(colorValue, 16);

  let r = Math.max((num >> 16) - amount, 0);
  let g = Math.max(((num >> 8) & 0x00ff) - amount, 0);
  let b = Math.max((num & 0x0000ff) - amount, 0);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
};

module.exports = {
  generateBackgroundColors,
  generateHoverBackgroundColors,
};
