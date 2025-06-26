import { useEffect } from 'react';

const useDocTitle = (title) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} - LKN Privé`;
        } else {
            document.title = 'LKN Privé | The Perfect Audio Store';
        }
    }, [title]);

    return null;
};

export default useDocTitle;
