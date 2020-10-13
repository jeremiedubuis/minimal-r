const path = require('path');
const { buildConfig } = require('./buildConfig');

const build = async (projectRoot, entry) => {
    try {
        const entryPoint = path.join(projectRoot, entry);
        const config = require(entryPoint);
        await buildConfig(config, projectRoot, entryPoint);
    } catch (e) {
        console.log(e);
    }
};

module.exports = { build };
