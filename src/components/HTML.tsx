import React from 'react';

export const HTML = ({ children, initialProps, assets, Head }: any) => {
    return (
        <html>
            <head>
                <meta charSet="utf-8" />
                <script
                    id="initialProps"
                    type="application/json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(initialProps || {}) }}
                />
                <script type="module" src={`build/${assets.js[0]}`} />
                <link rel="stylesheet" href={`build/${assets.css[0]}`} />
                <Head children={children} initialProps={initialProps} assets={assets} />
            </head>
            <body>
                <div id="minimal-r">{children}</div>
            </body>
        </html>
    );
};
