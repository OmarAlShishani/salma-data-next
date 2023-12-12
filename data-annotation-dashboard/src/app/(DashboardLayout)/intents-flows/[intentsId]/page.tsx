'use client';
import {
    createIntentsFlow,
    getIntentsFlowsFun,
    importXlsxFile,
    checkPermissionFun,
} from '@/utils/intentsFlowsUtils';
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

const IntentsFlowsPage = ({ params }: { params: { intentsId: string } }) => {
    const [intentsId, intentsName] = decodeURI(params?.intentsId)?.split('-');
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [intentsFlow, setIntentsFlow] = useState('');
    const {
        user: { loggedInUser },
        intentsFlows: { intentsFlows, intentsFlowsExports, intentsFlowsCount },
    } = useSelector((state: RootState) => state);
    const checkPermission = async () => {
        const result = await checkPermissionFun(intentsId);
        if (!result) {
            toast.warning(`You cannot access this page`);
            router.push('/intents');
        } else {
            getIntentsFlowsFun(intentsId, 0);
        }
    };
    useEffect(() => {
        setIsClient(true);
        if (loggedInUser.user_type === 'USER') {
            checkPermission();
        } else {
            getIntentsFlowsFun(intentsId, 0);
        }
    }, []);
    const headCells = ['Id', 'Text'];
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
            importXlsxFile(d, intentsId);
        });
    };
    const writeExcel = () => {
        const Workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(intentsFlowsExports);
        XLSX.utils.book_append_sheet(Workbook, worksheet, 'Sheet1');
        XLSX.writeFile(Workbook, `${intentsName}_intents_flows.xlsx`);
    };
    return (
        <PageContainer
            title="Intents Flows"
            description="this is Intents Flows page"
        >
            <DashboardCard title="Intents Flows Page">
                <Grid>
                    {loggedInUser.user_type === 'ADMIN' && (
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
                                label="Add Intents Flows Text"
                                variant="outlined"
                                value={intentsFlow}
                                onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                        createIntentsFlow(
                                            intentsFlow,
                                            intentsId
                                        );
                                        setIntentsFlow('');
                                    }
                                }}
                                onChange={(e) => {
                                    setIntentsFlow(e.target.value);
                                }}
                                style={{
                                    width: '50%',
                                    margin: '10px',
                                }}
                            />
                        )}
                        <div>
                        Intents Flows Records:
                            {intentsFlowsCount || 0}
                        </div>
                    </div>
                    <EnhancedTable
                        headCells={headCells}
                        rows={intentsFlows.map((intentsFlow: any) => ({
                            id: intentsFlow.id,
                            value: [intentsFlow.id, intentsFlow.text],
                        }))}
                    />
                    {intentsFlowsCount > 0 && (
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
                                count={Math.ceil(intentsFlowsCount / 50)}
                                color="primary"
                                onChange={(e, page) => {
                                    getIntentsFlowsFun(intentsId, page - 1);
                                }}
                            />
                        </Stack>
                    )}
                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default IntentsFlowsPage;
