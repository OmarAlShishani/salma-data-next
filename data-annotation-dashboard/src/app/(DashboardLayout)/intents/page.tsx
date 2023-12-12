'use client';
import { createIntent, getIntentsFun } from '@/utils/intentsUtils';
import { getUsersFun } from '@/utils/usersUtils';
import { Button, Grid, Pagination, Stack, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PageContainer from '../components/container/PageContainer';
import HandleEntities from '../components/intents/handle-entities';
import HandlePermission from '../components/intents/handle-permission';
import CustomModal from '../components/shared/CustomModal';
import DashboardCard from '../components/shared/DashboardCard';
import EnhancedTable from '../components/shared/enhancedTable';

const IntentsPage = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [intent, setIntent] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [intentsId, setIntentsId] = useState(null);
    const [showIntentsModal, setShowIntentsModal] = useState(false);
    const {
        user: { loggedInUser, users },
        intents: { intents, intentsCount },
    } = useSelector((state: RootState) => state);
    useEffect(() => {
        getIntentsFun(0);
        if (loggedInUser.user_type === 'ADMIN') {
            getUsersFun();
        }
        setIsClient(true);
    }, []);
    const headCells = ['Intent Name', 'Actions'];
    if (!isClient) return <></>;
    return (
        <PageContainer title="Intents" description="this is Intents page">
            <DashboardCard title="Intents Page">
                <Grid>
                    {showModal && (
                        <CustomModal
                            open={showModal}
                            setOpen={setShowModal}
                            styleProp={{ width: '50%', height: '300px' }}
                        >
                            <HandlePermission
                                users={users}
                                setOpen={setShowModal}
                                intentsId={intentsId}
                            />
                        </CustomModal>
                    )}
                    {showIntentsModal && (
                        <CustomModal
                            open={showIntentsModal}
                            setOpen={setShowIntentsModal}
                            styleProp={{ width: '50%', height: '300px' }}
                        >
                            <HandleEntities
                                setOpen={setShowIntentsModal}
                                intentId={intentsId}
                            />
                        </CustomModal>
                    )}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        {loggedInUser.user_type === 'ADMIN' && (
                            <TextField
                                id="outlined-basic"
                                label="Add Intent"
                                variant="outlined"
                                value={intent}
                                onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                        createIntent(intent);
                                        setIntent('');
                                    }
                                }}
                                onChange={(e) => {
                                    setIntent(e.target.value);
                                }}
                                style={{
                                    width: '50%',
                                    margin: '10px',
                                }}
                            />
                        )}
                        <div>Intents Records:{intentsCount || 0}</div>
                    </div>
                    <EnhancedTable
                        headCells={headCells}
                        rows={intents.map((intent, i: any) => ({
                            id: intent.id,
                            value: [
                                intent?.name,
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'start',
                                        gap: '10px',
                                    }}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            router.push(
                                                `/intents-flows/${intent.id}-${intent.name}`
                                            );
                                        }}
                                    >
                                        Flows
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            router.push(
                                                `/intents-keywords/${intent.id}-${intent.name}`
                                            );
                                        }}
                                    >
                                        Keywords
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            router.push(
                                                `/intents-training/${intent.id}-${intent.name}`
                                            );
                                        }}
                                    >
                                        Training
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            router.push(
                                                `/intents-testing/${intent.id}-${intent.name}`
                                            );
                                        }}
                                    >
                                        Testing
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setIntentsId(intent.id);
                                            setShowIntentsModal(true);
                                        }}
                                        variant="outlined"
                                    >
                                        Entities
                                    </Button>
                                    {loggedInUser.user_type === 'ADMIN' && (
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                setIntentsId(intent.id);
                                                setShowModal(true);
                                            }}
                                        >
                                            Permission
                                        </Button>
                                    )}
                                </div>,
                                ,
                            ],
                        }))}
                    />
                    {intentsCount > 0 && (
                        <Stack
                            spacing={2}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                margin: '20px 0',
                            }}
                        >
                            <Pagination
                                count={Math.ceil(intentsCount / 50)}
                                color="primary"
                                onChange={(e, page) => {
                                    getIntentsFun(page - 1);
                                }}
                            />
                        </Stack>
                    )}
                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default IntentsPage;
