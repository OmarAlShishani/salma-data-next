'use client';
import { createEntities, getEntitiesFun } from '@/utils/entitiesUtils';
import { getUsersFun } from '@/utils/usersUtils';
import { Box, Button, Grid, Pagination, Stack, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import PageContainer from '../components/container/PageContainer';
import CustomModal from '../components/shared/CustomModal';
import DashboardCard from '../components/shared/DashboardCard';
import EnhancedTable from '../components/shared/enhancedTable';
import { SketchPicker } from 'react-color';
import HandlePermission from '../components/entities/handle-permission';
import HandleIntents from '../components/entities/handle-intents';

const EntitiesPage = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [entity, setEntity] = useState('');
    const [entityColor, setEntityColor] = useState('#37d67a');
    const [showModal, setShowModal] = useState(false);
    const [showIntentsModal, setShowIntentsModal] = useState(false);
    const [entityId, setEntityId] = useState(null);
    const [showPicker, setColorPicker] = useState(false);
    const {
        user: { loggedInUser, users },
        entities: { entities, entitiesCount },
    } = useSelector((state: RootState) => state);
    useEffect(() => {
        getEntitiesFun(0);
        if (loggedInUser.user_type === 'ADMIN') {
            getUsersFun();
        }
        setIsClient(true);
    }, []);

    const headCells = ['Id','Entity Name', 'Color', 'Actions'];
    if (!isClient) return <></>;
    return (
        <PageContainer title="Entities" description="this is Entities page">
            <DashboardCard title="Entities Page">
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
                                entityId={entityId}
                            />
                        </CustomModal>
                    )}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            border: 'solid 1px #C8C8C8',
                            borderRadius: '5px',
                            margin: '10px 0',
                        }}
                    >
                        {loggedInUser.user_type === 'ADMIN' && (
                            <>
                                <TextField
                                    id="outlined-basic"
                                    label="Add Entity"
                                    variant="outlined"
                                    value={entity}
                                    onKeyDown={(e) => {
                                        if (e.keyCode == 13) {
                                            createEntities(entity, entityColor);
                                            setEntity('');
                                        }
                                    }}
                                    onChange={(e) => {
                                        setEntity(e.target.value);
                                    }}
                                    style={{
                                        width: '50%',
                                        margin: '10px',
                                    }}
                                />
                                <div
                                    style={{
                                        position: 'relative',
                                        display: 'flex',
                                        justifyContent: 'start',
                                        alignItems: 'center',
                                        gap: '20px',
                                        width: '30%',
                                    }}
                                >
                                    <p>Choose Entity Color:</p>
                                    <p
                                        onClick={() => {
                                            setColorPicker(!showPicker);
                                        }}
                                        style={{
                                            backgroundColor: entityColor,
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            color: '#fff',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Set Color
                                    </p>
                                    {showPicker && (
                                        <div
                                            style={{
                                                backgroundColor: '#fff',
                                                position: 'absolute',
                                                border: 'solid 1px #C8C8C8',
                                                borderRadius: '5px',
                                                overflow: 'hidden',
                                                top: '48px',
                                                zIndex: '9999999',
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                style={{ margin: '10px' }}
                                                onClick={() => {
                                                    setColorPicker(!showPicker);
                                                }}
                                            >
                                                Done
                                            </Button>
                                            <SketchPicker
                                                color={entityColor}
                                                onChange={(color) => {
                                                    setEntityColor(color.hex);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
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
                                        onClick={() => {
                                            setColorPicker(false);
                                            createEntities(entity, entityColor);
                                            setEntity('');
                                        }}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setEntity('');
                                        }}
                                    >
                                        Rest
                                    </Button>
                                </Box>
                            </>
                        )}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            margin: '10px',
                        }}
                    >
                        Entities Records:{entitiesCount || 0}
                    </div>
                    <EnhancedTable
                        headCells={headCells}
                        rows={entities.map((entity: any, i: any) => ({
                            id: entity.id,
                            value: [
                                entity?.id,
                                entity?.name,
                                <div
                                    key={i}
                                    style={{
                                        backgroundColor: `${entity?.color}`,
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        color: '#fff',
                                        display: 'flex',
                                    }}
                                >
                                    {entity?.color}
                                </div>,
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
                                                `/entities-value/${entity.id}-${entity.name}`
                                            );
                                        }}
                                        variant="outlined"
                                    >
                                        Value
                                    </Button>
                                    {loggedInUser.user_type === 'ADMIN' && (
                                        <Button
                                            onClick={() => {
                                                setEntityId(entity.id);
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
                    {entitiesCount > 0 && (
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
                                count={Math.ceil(entitiesCount / 50)}
                                color="primary"
                                onChange={(e, page) => {
                                    getEntitiesFun(page - 1);
                                }}
                            />
                        </Stack>
                    )}
                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default EntitiesPage;
