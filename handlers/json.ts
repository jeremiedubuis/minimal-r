import { ServerResponse } from 'http';

export const get = (req: any, res: ServerResponse) => {
    res.setHeader('content-type', 'application/json');
    res.end(
        JSON.stringify({
            foo: 'bar'
        })
    );
};
