const fs = require('fs');

const createDir = (_path) => {
    if (!fs.existsSync(_path)) fs.mkdirSync(_path);
}

module.exports = { createDir };
