module.exports = function(data, options) {
  const numberOfRows = data.length;
  const headers = Object.keys(data[0]);
  const maxLengths = findMaxLengths(data);
  const width = Object.values(maxLengths).reduce((acc, cur) => acc + cur + 3, 0) + 1;
  
  console.log('-'.repeat(width)); // Start

  let headerRow = '';
  headers.forEach((item, i) => {
    headerRow += `| ${padString(item, Object.values(maxLengths)[i])} `;
  });
  headerRow += '|';
  console.log(headerRow);
  console.log('-'.repeat(width));

  data.sort((a, b) => {
    const aVal = a.Modified.split('.');
    const bVal = b.Modified.split('.');
    if (aVal[2] < bVal[2]) {
      return -1;
    }
    else if (aVal[2] > bVal[2]) {
      return 1;
    }
    if (aVal[1] < bVal[1]) {
      return -1;
    }
    else if (aVal[1] > bVal[1]) {
      return 1;
    }
    if (aVal[0] < bVal[0]) {
      return -1;
    }
    else if (aVal[0] > bVal[0]) {
      return 1;
    }
    return 0;
  });

  data.forEach(item => {
    let row = '';
    Object.values(item).forEach((col, i) => {
      row += `| ${padString(col, Object.values(maxLengths)[i])} `;
    });
    row += '|';
    console.log(row);
  });

  console.log('-'.repeat(width)); // End
  console.log(`  Items: ${numberOfRows}`);
};

const findMaxLengths = (data) => {
  const lengths = {};

  Object.keys(data[0]).forEach(item => {
    lengths[item] = 0;
    lengths[item] = largest(item, 0);
  });

  data.forEach(item => {
    Object.entries(item).forEach((col) => {
      lengths[col[0]] = lengths[col[0]] || 0;
      lengths[col[0]] = largest(col[1], lengths[col[0]]);
    });
  });

  return lengths;
};

const largest = (str, current) => {
  if (str.toString().length > current) {
    return str.toString().length;
  }
  return current;
};

const padString = (input, length) => {
  let str = input.toString();

  if (str.length < length) {
    const pad = length - str.length;
    str += ' '.repeat(pad);
  }
  return str;
};
