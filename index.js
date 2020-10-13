module.exports = {
    routes: [
        {
            path: '/',
            type: 'react',
            handler: './handlers/index',
            useServerSideProps: true
        },
        {
            path: '/test',
            type: 'react',
            handler: './handlers/test',
            useServerSideProps: false
        },
        {
            path: '/json',
            handler: './handlers/json'
        }
    ]
};
