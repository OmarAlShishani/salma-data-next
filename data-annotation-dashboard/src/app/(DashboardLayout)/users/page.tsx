'use client';
import { getUsersFun, updateUser } from '@/utils/usersUtils';
import {
    Button,
    FormControlLabel,
    FormGroup,
    Grid,
    Switch,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PageContainer from '../components/container/PageContainer';
import CustomModal from '../components/shared/CustomModal';
import DashboardCard from '../components/shared/DashboardCard';
import EnhancedTable from '../components/shared/enhancedTable';
import AddUser from '../components/users/AddUser';

const UsersPage = () => {
    const [isClient, setIsClient] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const {
        user: { loggedInUser, users },
    } = useSelector((state: RootState) => state);
    useEffect(() => {
        getUsersFun();
        setIsClient(true);
    }, []);

    const headCells = [
        'Id',
        'Name',
        'User Name',
        'Email',
        'User Role',
        'Is Active',
    ];
    // if (!isClient) return <></>;
    return (
        <PageContainer title="Users" description="Users page">
            <DashboardCard title="Users Page">
                <Grid>
                    {showModal && (
                        <CustomModal
                            open={showModal}
                            setOpen={setShowModal}
                            styleProp={{ width: '50%', height: '600px' }}
                        >
                            <AddUser setOpen={setShowModal} />
                        </CustomModal>
                    )}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            margin: '10px',
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={() => setShowModal(true)}
                        >
                            Add User
                        </Button>
                        <div>Users Records:{users?.length}</div>
                    </div>
                    <EnhancedTable
                        headCells={headCells}
                        rows={users.map((user: any, i: any) => ({
                            id: user.id,
                            value: [
                                user?.id,
                                user?.name,
                                user?.username,
                                user?.email,
                                user?.user_type,
                                <FormGroup key={i}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                disabled={
                                                    user?.user_type === 'ADMIN'
                                                }
                                                checked={user.active}
                                            />
                                        }
                                        label="Active"
                                        onChange={(event: any) => {
                                            updateUser({
                                                id: user?.id,
                                                data: {
                                                    active: event.target
                                                        .checked,
                                                },
                                            });
                                        }}
                                    />
                                </FormGroup>,
                            ],
                        }))}
                    />
                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default UsersPage;
