'use client';
import { createSmallTalks, getSmallTalksFun } from '@/utils/smallTalksUtils';
import { getUsersFun } from '@/utils/usersUtils';
import { Button, Grid, Pagination, Stack, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PageContainer from '../components/container/PageContainer';
import CustomModal from '../components/shared/CustomModal';
import DashboardCard from '../components/shared/DashboardCard';
import EnhancedTable from '../components/shared/enhancedTable';
import HandlePermission from '../components/small-talks/handle-permission';

const SmallTalksPage = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [smallTalk, setSmallTalk] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [smalltalkId, setSmalltalkId] = useState(null);
    const {
        user: { loggedInUser, users },
        smallTalks: { smallTalks, smallTalksCount },
    } = useSelector((state: RootState) => state);
    useEffect(() => {
        getSmallTalksFun(0);
        if (loggedInUser.user_type === 'ADMIN') {
            getUsersFun();
        }
        setIsClient(true);
    }, []);

    const headCells = ['Small Talks Name', 'Actions'];
    if (!isClient) return <></>;
    return (
        <PageContainer
            title="Small Talks"
            description="this is Small Talks page"
        >
            <DashboardCard title="Small Talks Page">
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
                                smalltalkId={smalltalkId}
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
                                label="Add Small Talks"
                                variant="outlined"
                                value={smallTalk}
                                onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                        createSmallTalks(smallTalk);
                                        setSmallTalk('');
                                    }
                                }}
                                onChange={(e) => {
                                    setSmallTalk(e.target.value);
                                }}
                                style={{
                                    width: '50%',
                                    margin: '10px',
                                }}
                            />
                        )}
                        <div>Small Talks Records:{smallTalksCount || 0}</div>
                    </div>
                    <EnhancedTable
                        headCells={headCells}
                        rows={smallTalks.map((smallTalk: any, i: any) => ({
                            id: smallTalk.id,
                            value: [
                                smallTalk?.name,
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'start',
                                        gap: '10px',
                                    }}
                                >
                                    <Button
                                        onClick={() => {
                                            router.push(
                                                `/training/${smallTalk.id}-${smallTalk.name}`
                                            );
                                        }}
                                        variant="outlined"
                                    >
                                        training
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            router.push(
                                                `/small-talk-testing/${smallTalk.id}-${smallTalk.name}`
                                            );
                                        }}
                                        variant="outlined"
                                    >
                                        testing
                                    </Button>
                                    {loggedInUser.user_type === 'ADMIN' && (
                                        <Button
                                            onClick={() => {
                                                setSmalltalkId(smallTalk.id);
                                                setShowModal(true);
                                            }}
                                            variant="outlined"
                                        >
                                            permission
                                        </Button>
                                    )}
                                </div>,
                            ],
                        }))}
                    />
                    {smallTalksCount > 0 && (
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
                                count={Math.ceil(smallTalksCount / 50)}
                                color="primary"
                                onChange={(e, page) => {
                                    getSmallTalksFun(page - 1);
                                }}
                            />
                        </Stack>
                    )}
                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default SmallTalksPage;
