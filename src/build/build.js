const path = require('path');
const { buildConfig } = require('./buildConfig');
const rimraf = require('rimraf');

const build = async (projectRoot, entry) => {
    try {
        rimraf(path.join(__dirname, '../../_minimal-r'), async () => {
            const entryPoint = path.join(projectRoot, entry);
            const config = require(entryPoint);
            await buildConfig(config, projectRoot, entryPoint);
        });
    } catch (e) {
        console.log(e);
    }
};

module.exports = { build };
