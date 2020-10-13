import { useEffect } from 'react';

type HeadUpdate = {
    title?: string;
};

const _updateHead = ({ title }: HeadUpdate) => {
    if (title) document.head.querySelector('title').innerText = title;
};

export const updateHead = (update: HeadUpdate) => {
    useEffect(() => {
        _updateHead(update);
    }, []);
};
