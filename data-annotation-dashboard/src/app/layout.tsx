'use client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { baselightTheme } from '../utils/theme/DefaultColors';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePathname, useRouter } from 'next/navigation';
import getCookies from '@/utils/getCookies';
import { useEffect, useState } from 'react';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathName = usePathname();
    const cookies = getCookies();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    if (!isClient) return <></>;

    if (!cookies['user_token']) {
        if (!pathName.startsWith('/login')) {
            router.push('/login');
        }
    } else {
        if (pathName.startsWith('/login')) {
            router.push('/intents');
        }
    }
    return (
        <html lang="en">
            <body>
                <ThemeProvider theme={baselightTheme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
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
                </ThemeProvider>
            </body>
        </html>
    );
}
