import React from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    styled,
    Stack,
    IconButton,
    Badge,
    Button,
} from '@mui/material';
import PropTypes from 'prop-types';

// components
import Profile from './Profile';
import { IconMenu } from '@tabler/icons-react';
import { destroyCookie } from 'nookies';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/redux/features/userSlice';
import { useRouter } from 'next/navigation';
import { resetRedux } from '@/utils/reset';
import { RootState } from '@/redux/store';

interface ItemType {
    toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}
function deleteCookie(cookieName: string) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
const Header = ({ toggleMobileSidebar }: ItemType) => {
    // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

    const dispatch = useDispatch();
    const {
        user: { loggedInUser },
    } = useSelector((state: RootState) => state);
    const router = useRouter();
    const AppBarStyled = styled(AppBar)(({ theme }) => ({
        boxShadow: 'none',
        background: theme.palette.background.paper,
        justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        borderRadius: 13,
        [theme.breakpoints.up('lg')]: {
            minHeight: '70px',
        },
    }));
    const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
        width: '100%',
        color: theme.palette.text.secondary,
    }));
    const handleLogOut = () => {
        deleteCookie('user');
        deleteCookie('user_token');
        destroyCookie(null, 'user');
        destroyCookie(null, 'user_token');
        dispatch(logout());
        resetRedux();
        router.push('/login');
        setTimeout(() => {
            location.reload();
        }, 500);
    };
    return (
        <AppBarStyled position="sticky" color="default">
            <ToolbarStyled>
                <IconButton
                    color="inherit"
                    aria-label="menu"
                    onClick={toggleMobileSidebar}
                    sx={{
                        display: {
                            lg: 'none',
                            xs: 'inline',
                        },
                    }}
                >
                    <IconMenu width="20" height="20" />
                </IconButton>
                <p>Hello {loggedInUser?.name}</p>
                <Box flexGrow={1} />
                <Stack spacing={1} direction="row" alignItems="center">
                    <Box
                        sx={{
                            display: {
                                xs: 'none',
                                sm: 'block',
                            },
                        }}
                    >
                        <Button
                            variant="contained"
                            disableElevation
                            color="primary"
                            onClick={handleLogOut}
                        >
                            logout
                        </Button>
                    </Box>
                </Stack>
            </ToolbarStyled>
        </AppBarStyled>
    );
};

Header.propTypes = {
    sx: PropTypes.object,
};

export default Header;
