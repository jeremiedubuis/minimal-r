#!/usr/bin/env node
require('../src/cli')({
    nodeExecutable: process.argv[0],
    command: process.argv[2],
    projectRoot: process.cwd(),
    args: process.argv.slice(3, process.argv.length),
});
