import React from 'react';

export const HTML = ({ children, initialProps }: any) => {
    return (
        <html>
            <head>
                <script
                    id="initialProps"
                    type="application/json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(initialProps || {}) }}
                />
                <script type="module" src="build/client.js" />
            </head>
            <body>
                <div id="minimal-r">{children}</div>
            </body>
        </html>
    );
};
