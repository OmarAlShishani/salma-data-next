import React, { useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import CustomTextField from '../../(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import axiosInstance from '../../../utils/axiosInstance';
import { setCookie } from 'nookies';
import { AxiosRequestConfig } from 'axios';
import { toast } from 'react-toastify';
import { longestMaxAge } from '../../../../config/variables';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/features/userSlice';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface loginType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const checkLogin = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/login', {
                username,
                password,
            } as AxiosRequestConfig<any>);
            if (response.data.isSuccess) {
                setCookie(
                    null,
                    'user',
                    JSON.stringify(response.data.results.user),
                    {
                        maxAge: longestMaxAge,
                        path: '/',
                    }
                );
                setCookie(null, 'user_token', response.data.results.token, {
                    maxAge: longestMaxAge,
                    path: '/',
                });
                dispatch(
                    login({
                        token: response.data.results.token,
                        loggedInUser: response.data.results.user,
                    })
                );
                // router.push('/intents');
                location.reload();
                router.refresh();
            } else {
                setLoading(false);
                toast.error(response?.data?.message);
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
        }
    };
    return (
        <>
            {loading ? (
                <div
                    style={{
                        width: '100%',
                        height: '300px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image
                        src={'/images/loading.gif'}
                        width={100}
                        height={100}
                        alt="loading"
                        priority
                    />
                </div>
            ) : (
                <>
                    {title ? (
                        <Typography fontWeight="700" variant="h2" mb={1}>
                            {title}
                        </Typography>
                    ) : null}

                    <Stack>
                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                component="label"
                                htmlFor="username"
                                mb="5px"
                            >
                                Username
                            </Typography>
                            <CustomTextField
                                variant="outlined"
                                fullWidth
                                onChange={(e: any) =>
                                    setUsername(e.target.value)
                                }
                            />
                        </Box>
                        <Box mt="25px">
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                component="label"
                                htmlFor="password"
                                mb="5px"
                            >
                                Password
                            </Typography>
                            <CustomTextField
                                type="password"
                                variant="outlined"
                                fullWidth
                                onChange={(e: any) =>
                                    setPassword(e.target.value)
                                }
                            />
                        </Box>
                        <Stack
                            justifyContent="space-between"
                            direction="row"
                            alignItems="center"
                            my={2}
                        ></Stack>
                    </Stack>
                    <Box>
                        <Button
                            color="primary"
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={checkLogin}
                            type="submit"
                        >
                            Sign In
                        </Button>
                    </Box>
                </>
            )}
        </>
    );
};

export default AuthLogin;
