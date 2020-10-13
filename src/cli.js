const { build } = require('./build/build');

module.exports = async ({
    nodeExecutable,
    command,
    projectRoot,
    args
}) => {
    switch(command) {
        case 'build':
            await build(projectRoot, args[0]);
    }
};
