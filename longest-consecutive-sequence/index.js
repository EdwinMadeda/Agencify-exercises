const input = [100, 4, 200, 1, 3, 2];
const output = [];

for (let i = 0; i < input.length; i++) {
  for (let j = input.length; j > 0; j--) {
    const itemFromTheLeft = input[i];
    const itemFromTheRight = input[j];
    if (itemFromTheRight !== undefined) {
      if (itemFromTheLeft > itemFromTheRight) {
        output.push(itemFromTheRight);
      }
    }
  }
  if (output.length > 1) {
    break;
  }
}

console.log(output.sort((a, b) => (a > b ? 1 : -1)));
