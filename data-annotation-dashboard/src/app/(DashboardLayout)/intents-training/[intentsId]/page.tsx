'use client';
import {
    createsIntentsTraining,
    getIntentsTrainingFun,
    importXlsxFile,
    checkPermissionFun,
    deleteIntentsTraining,
    updateIntentsTraining,
} from '@/utils/IntentsTrainingUtils';
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

const IntentsTrainingPage = ({ params }: { params: { intentsId: string } }) => {
    const [intentsId, intentsName] = decodeURI(params.intentsId).split('-');
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [intentsTraining, setIntentsTraining] = useState('');
    const [page, setPage] = useState(0);
    const [modifyText, setModifyText] = useState('');
    const [showModifyInput, setShowModifyInput] = useState('');
    const {
        user: { loggedInUser },
        intentsTrainings: {
            intentsTrainings,
            intentsTrainingsExports,
            intentsTrainingsCount,
        },
    } = useSelector((state: RootState) => state);
    const checkPermission = async () => {
        const result = await checkPermissionFun(intentsId);
        if (!result) {
            toast.warning(`You cannot access this page`);
            router.push('/intents');
        } else {
            getIntentsTrainingFun(intentsId, page);
        }
    };
    useEffect(() => {
        setIsClient(true);
        if (loggedInUser.user_type === 'USER') {
            checkPermission();
        } else {
            getIntentsTrainingFun(intentsId, page);
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
        const worksheet = XLSX.utils.aoa_to_sheet(intentsTrainingsExports);
        XLSX.utils.book_append_sheet(Workbook, worksheet, 'Sheet1');
        XLSX.writeFile(Workbook, `${intentsName}_intents_training.xlsx`);
    };
    return (
        <PageContainer
            title="Intents Training"
            description="this is Intents Training page"
        >
            <DashboardCard title="Intents Training Page">
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
                            label="Add Intents Training"
                            variant="outlined"
                            value={intentsTraining}
                            onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                    createsIntentsTraining(
                                        intentsTraining,
                                        intentsId
                                    );
                                    setPage(0);
                                    setIntentsTraining('');
                                }
                            }}
                            onChange={(e) => {
                                setIntentsTraining(e.target.value);
                            }}
                            style={{
                                width: '50%',
                                margin: '10px',
                            }}
                        />
                        <div>
                            Intents Training Records:
                            {intentsTrainingsCount || 0}
                        </div>
                    </div>
                    <EnhancedTable
                        headCells={headCells}
                        rows={intentsTrainings.map(
                            (intentsTraining: any, i: number) => ({
                                id: intentsTraining.id,
                                value: [
                                    intentsTraining.id,
                                    showModifyInput === intentsTraining.id ? (
                                        <TextField
                                            id="outlined-basic"
                                            label="Modify"
                                            multiline
                                            variant="outlined"
                                            value={modifyText}
                                            onKeyDown={(e) => {
                                                if (e.keyCode == 13) {
                                                    updateIntentsTraining(
                                                        intentsTraining.id,
                                                        intentsId,
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
                                                    intentsTraining.text
                                                );
                                                setShowModifyInput(
                                                    intentsTraining.id
                                                );
                                            }}
                                        >
                                            {intentsTraining.text}
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
                                                    intentsTraining.id
                                                ) {
                                                    updateIntentsTraining(
                                                        intentsTraining.id,
                                                        intentsId,
                                                        page,
                                                        modifyText
                                                    );
                                                    setModifyText('');
                                                    setShowModifyInput('');
                                                } else {
                                                    deleteIntentsTraining(
                                                        intentsTraining.id,
                                                        intentsId,
                                                        page
                                                    );
                                                }
                                            }}
                                            key={i}
                                        >
                                            {showModifyInput ===
                                            intentsTraining.id
                                                ? 'Save'
                                                : 'Remove'}
                                        </Button>
                                        {showModifyInput ===
                                            intentsTraining.id && (
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
                            })
                        )}
                    />
                    {intentsTrainingsCount > 0 && (
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
                                count={Math.ceil(intentsTrainingsCount / 50)}
                                color="primary"
                                onChange={(e, page) => {
                                    getIntentsTrainingFun(intentsId, page);
                                }}
                            />
                        </Stack>
                    )}
                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default IntentsTrainingPage;
