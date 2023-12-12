'use client';

import { store } from './store';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ToastContainer
                position="top-center"
                autoClose={3500}
                style={{
                    zIndex: '999999999999999999',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                }}
            />
            {children}
        </Provider>
    );
}
