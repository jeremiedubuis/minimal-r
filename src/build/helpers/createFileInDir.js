const fs = require('fs');
const path = require('path');

const createFileInDir = (_path, file, content) => {
    if (!fs.existsSync(_path)) fs.mkdirSync(_path);
    fs.writeFileSync(path.join(_path, file), content);
}

module.exports = { createFileInDir };
