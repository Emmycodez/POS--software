export function generateSKU(name) {
  return name.toUpperCase().split(" ").join("-") + "-" + Math.floor(1000 + Math.random() * 9000);
}
