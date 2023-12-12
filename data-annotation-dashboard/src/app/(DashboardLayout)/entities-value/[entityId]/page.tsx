'use client';
import {
    createsEntityValue,
    getEntityValuesFun,
    importXlsxFile,
    checkPermissionFun,
} from '@/utils/entityValueUtils';
import { Button, Grid, Pagination, Stack, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import EnhancedTable from '../../components/shared/enhancedTable';
import * as XLSX from 'xlsx';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const EntityValuePage = ({ params }: { params: { entityId: string } }) => {
    const [entityId, entityName] = decodeURI(params.entityId).split('-');
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [entityValue, setEntityValue] = useState('');
    const [page, setPage] = useState(0);
    const {
        user: { loggedInUser },
        entityValues: { entityValues, entityValuesExports, entityValuesCount },
    } = useSelector((state: RootState) => state);
    const checkPermission = async () => {
        const result = await checkPermissionFun(entityId);
        if (!result) {
            toast.warning(`You cannot access this page`);
            router.push('/entities');
        } else {
            getEntityValuesFun(entityId, page);
        }
    };
    useEffect(() => {
        setIsClient(true);
        if (loggedInUser.user_type === 'USER') {
            checkPermission();
        } else {
            getEntityValuesFun(entityId, page);
        }
    }, []);
    const headCells = ['id', 'Name', 'Actions'];
    if (!isClient) return <></>;
    // const readExcel = (file: any) => {
    //     const promise = new Promise((resolve, reject) => {
    //         const fileReader = new FileReader();
    //         fileReader.readAsArrayBuffer(file);
    //         fileReader.onload = (e: any) => {
    //             const bufferArray = e.target.result;
    //             const wb = XLSX.read(bufferArray, {
    //                 type: 'buffer',
    //             });
    //             const wsname = wb.SheetNames[0];
    //             const ws = wb.Sheets[wsname];
    //             const data = XLSX.utils.sheet_to_json(ws);
    //             resolve(data);
    //         };
    //         fileReader.onerror = (error) => {
    //             reject(error);
    //         };
    //     });
    //     promise.then((d: any) => {
    //         importXlsxFile(d, entityId);
    //     });
    // };
    // const writeExcel = () => {
    //     const Workbook = XLSX.utils.book_new();
    //     const worksheet = XLSX.utils.aoa_to_sheet(entityValuesExports);
    //     XLSX.utils.book_append_sheet(Workbook, worksheet, 'Sheet1');
    //     XLSX.writeFile(Workbook, `${entityName}_entities_values.xlsx`);
    // };
    return (
        <PageContainer
            title="Entity Values"
            description="this is Entity Values page"
        >
            <DashboardCard title="Entity Values Page">
                <Grid>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                    >
                        {/* <label
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
                        />*/}
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
                            label="Add Entity Value"
                            variant="outlined"
                            value={entityValue}
                            onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                    createsEntityValue(entityValue, entityId);
                                    setPage(0);
                                    setEntityValue('');
                                }
                            }}
                            onChange={(e) => {
                                setEntityValue(e.target.value);
                            }}
                            style={{
                                width: '50%',
                                margin: '10px',
                            }}
                        />
                        <div>
                            Entity Value Records:
                            {entityValuesCount || 0}
                        </div>
                    </div>
                    <EnhancedTable
                        headCells={headCells}
                        rows={entityValues.map(
                            (entityValue: any, i: number) => ({
                                id: entityValue.id,
                                value: [
                                    entityValue.id,
                                    entityValue.keyword,
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
                                                    `/entities-synonym/${entityId}-${entityName}/${entityValue.id}-${entityValue.keyword}`
                                                );
                                            }}
                                            variant="outlined"
                                        >
                                            Synonym
                                        </Button>
                                    </div>,
                                ],
                            })
                        )}
                    />
                    {entityValuesCount > 0 && (
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
                                count={Math.ceil(entityValuesCount / 50)}
                                color="primary"
                                onChange={(e, page) => {
                                    getEntityValuesFun(entityId, page);
                                }}
                            />
                        </Stack>
                    )}
                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default EntityValuePage;
