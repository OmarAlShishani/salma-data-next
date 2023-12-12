'use client';
import {
    getEntitiesSynonym,
    createEntitiesSynonym,
    importXlsxFile,
    checkPermissionFun,
    deleteEntitiesSynonym,
    updateEntitiesSynonym,
} from '@/utils/entitiesSynonymUtils';
import { Button, Grid, Pagination, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import PageContainer from '../../../components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import EnhancedTable from '../../../components/shared/enhancedTable';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const EntitiesSynonymPage = ({
    params,
}: {
    params: { entityId: string; entityValueId: string };
}) => {
    const [entityId, entityName] = decodeURI(params.entityId).split('-');
    const [entityValueId, entityValueName] = decodeURI(
        params.entityValueId
    ).split('-');
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [entitySynonym, setEntitySynonym] = useState('');
    const [page, setPage] = useState(0);
    const [modifyText, setModifyText] = useState('');
    const [showModifyInput, setShowModifyInput] = useState('');
    const {
        user: { loggedInUser },
        entitiesSynonym: {
            entitiesSynonym,
            entitiesSynonymExports,
            entitiesSynonymCount,
        },
    } = useSelector((state: RootState) => state);
    const checkPermission = async () => {
        const result = await checkPermissionFun(entityId);
        if (!result) {
            toast.warning(`You cannot access this page`);
            router.push('/entities');
        } else {
            getEntitiesSynonym(entityId, entityValueId, page);
        }
    };
    useEffect(() => {
        setIsClient(true);
        if (loggedInUser.user_type === 'USER') {
            checkPermission();
        } else {
            getEntitiesSynonym(entityId, entityValueId, page);
        }
    }, []);
    const headCells = ['Id', 'Synonym'];
    if (!isClient) return <></>;
    const readExcel = (file: any) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.onload = (e: any) => {
                const bufferArray = e.target.result;
                const wb = XLSX.read(bufferArray, {
                    type: 'buffer',
                });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);
                resolve(data);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
        promise.then((d: any) => {
            importXlsxFile(d, entityId, entityValueId);
        });
    };
    const writeExcel = () => {
        const Workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(entitiesSynonymExports);
        XLSX.utils.book_append_sheet(Workbook, worksheet, 'Sheet1');
        XLSX.writeFile(
            Workbook,
            `${entityName}_${entityValueName}_entities_synonym.xlsx`
        );
    };
    return (
        <PageContainer
            title="Entities Synonym"
            description="this is Entities Synonyms page"
        >
            <DashboardCard title="Entities Synonyms Page">
                <Grid>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        <label
                            htmlFor="file-input"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '5px',
                                cursor: 'pointer',
                                backgroundColor: '#0085db',
                                borderRadius: '20px',
                                width: '80px',
                                height: '35px',
                                color: '#fff',
                            }}
                        >
                            Import
                        </label>
                        <Button onClick={writeExcel} variant="contained">
                            Export
                        </Button>
                        <input
                            type="file"
                            id="file-input"
                            onChange={(e: any) => {
                                const file = e.target.files[0];
                                readExcel(file);
                            }}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            id="outlined-basic"
                            label="Add Entity Synonym"
                            variant="outlined"
                            value={entitySynonym}
                            onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                    createEntitiesSynonym(
                                        entitySynonym,
                                        entityId,
                                        entityValueId
                                    );
                                    setPage(0);
                                    setEntitySynonym('');
                                }
                            }}
                            onChange={(e) => {
                                setEntitySynonym(e.target.value);
                            }}
                            style={{
                                width: '50%',
                                margin: '10px',
                            }}
                        />
                        <div>
                            Entities Synonym Records:
                            {entitiesSynonymCount || 0}
                        </div>
                    </div>
                    <EnhancedTable
                        headCells={headCells}
                        rows={entitiesSynonym.map((entitySynonym: any, i) => ({
                            id: entitySynonym.id,
                            value: [
                                entitySynonym.id,
                                // entitySynonym.synonym,
                                showModifyInput === entitySynonym.id ? (
                                    <TextField
                                        id="outlined-basic"
                                        label="Modify"
                                        multiline
                                        variant="outlined"
                                        value={modifyText}
                                        onKeyDown={(e) => {
                                            if (e.keyCode == 13) {
                                                updateEntitiesSynonym(
                                                    entitySynonym.id,
                                                    entityId,
                                                    entityValueId,
                                                    page,
                                                    modifyText
                                                );
                                                setModifyText('');
                                                setShowModifyInput('');
                                            }
                                        }}
                                        onChange={(e) => {
                                            setModifyText(e.target.value);
                                        }}
                                        style={{
                                            minWidth: '500px',
                                        }}
                                    />
                                ) : (
                                    <p
                                        onClick={() => {
                                            setModifyText(
                                                entitySynonym.synonym
                                            );
                                            setShowModifyInput(
                                                entitySynonym.id
                                            );
                                        }}
                                    >
                                        {entitySynonym.synonym}
                                    </p>
                                ),
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '10px',
                                    }}
                                >
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            if (
                                                showModifyInput ===
                                                entitySynonym.id
                                            ) {
                                                updateEntitiesSynonym(
                                                    entitySynonym.id,
                                                    entityId,
                                                    entityValueId,
                                                    page,
                                                    modifyText
                                                );
                                                setModifyText('');
                                                setShowModifyInput('');
                                            } else {
                                                deleteEntitiesSynonym(
                                                    entitySynonym.id,
                                                    entityId,
                                                    entityValueId,
                                                    page
                                                );
                                            }
                                        }}
                                        key={i}
                                    >
                                        {showModifyInput === entitySynonym.id
                                            ? 'Save'
                                            : 'Remove'}
                                    </Button>
                                    {showModifyInput === entitySynonym.id && (
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                setModifyText('');
                                                setShowModifyInput('');
                                            }}
                                        >
                                            Close
                                        </Button>
                                    )}
                                </div>,
                            ],
                        }))}
                    />
                    {entitiesSynonymCount > 0 && (
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
                                count={Math.ceil(entitiesSynonymCount / 50)}
                                color="primary"
                                onChange={(e, page) => {
                                    getEntitiesSynonym(
                                        entityId,
                                        entityValueId,
                                        page
                                    );
                                }}
                            />
                        </Stack>
                    )}
                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default EntitiesSynonymPage;
