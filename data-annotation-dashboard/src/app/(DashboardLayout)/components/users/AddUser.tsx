import { createUserFun, getUsersFun } from '@/utils/usersUtils';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import CustomTextField from '../forms/theme-elements/CustomTextField';

export default function AddUser({ setOpen }: any) {
    const [userData, setUserData] = useState({} as any);
    return (
        <div>
            <Box
                sx={{
                    margin: '10px',
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                    gap: '10px',
                }}
            >
                <Button
                    variant="contained"
                    onClick={async () => {
                        const result = await createUserFun(userData);
                        if (!result.error) {
                            getUsersFun();
                            setOpen(false);
                        }
                    }}
                >
                    Save
                </Button>
                <Button variant="outlined" onClick={() => setOpen(false)}>
                    Close
                </Button>
            </Box>
            <Stack>
                <Box>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="username"
                        mb="5px"
                    >
                        Name
                    </Typography>
                    <CustomTextField
                        variant="outlined"
                        fullWidth
                        onChange={(e: any) =>
                            setUserData({ ...userData, name: e.target.value })
                        }
                    />
                </Box>
                <Box>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="username"
                        mb="5px"
                    >
                        User Name
                    </Typography>
                    <CustomTextField
                        variant="outlined"
                        fullWidth
                        onChange={(e: any) =>
                            setUserData({
                                ...userData,
                                username: e.target.value,
                            })
                        }
                    />
                </Box>
                <Box>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="username"
                        mb="5px"
                    >
                        Email
                    </Typography>
                    <CustomTextField
                        variant="outlined"
                        fullWidth
                        onChange={(e: any) =>
                            setUserData({ ...userData, email: e.target.value })
                        }
                    />
                </Box>
                <Box>
                    <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        component="label"
                        htmlFor="username"
                        mb="5px"
                    >
                        Password
                    </Typography>
                    <CustomTextField
                        variant="outlined"
                        fullWidth
                        onChange={(e: any) =>
                            setUserData({
                                ...userData,
                                password: e.target.value,
                            })
                        }
                    />
                </Box>
                <Box>
                    <FormControl fullWidth style={{margin:"20px 0"}}>
                        <InputLabel id="demo-simple-select-label">
                            User Type
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={userData?.user_type}
                            label="User Type"
                            onChange={(e: any) =>
                                setUserData({
                                    ...userData,
                                    user_type: e.target.value,
                                })
                            }
                        >
                            <MenuItem value={'ADMIN'}>Admin</MenuItem>
                            <MenuItem value={'USER'}>User</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Stack>
        </div>
    );
}
