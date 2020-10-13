import { createFilter } from '@rollup/pluginutils';

export default function ignoreImports(extensions) {
    const filter = createFilter(
        extensions.map((ext) => `**/*${ext}`),
        'node_modules/**'
    );

    return {
        transform(code, id) {
            if (!filter(id)) return;
            return {
                code: 'export default undefined;',
                map: null
            };
        }
    };
}
