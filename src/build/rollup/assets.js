import fs from 'fs';
import path from 'path';

export default () => {
    return {
        name: 'assets',

        writeBundle(options, bundle = options) {
            const assets = {};

            Object.keys(bundle).forEach((file) => {
                const extension = file.split('.').pop();
                if (!assets[extension]) assets[extension] = [];
                assets[extension].push(file);
            });

            fs.writeFileSync(path.join(options.dir, '../../assets.json'), JSON.stringify(assets));
        }
    };
};
