'use client';
import {
    createsSmallTalkTesting,
    getSmallTalkTestingsFun,
    importXlsxFile,
    checkPermissionFun,
    deleteSmallTalkTesting,
    updateSmallTalkTesting,
} from '@/utils/smallTalkTestingsUtils';
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

const SmallTalkTestingPage = ({
    params,
}: {
    params: { smallTalkId: string };
}) => {
    const [smallTalkId, smallTalkName] = decodeURI(params.smallTalkId).split(
        '-'
    );
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [smallTalkTesting, setSmallTalkTesting] = useState('');
    const [page, setPage] = useState(0);
    const [modifyText, setModifyText] = useState('');
    const [showModifyInput, setShowModifyInput] = useState('');
    const {
        user: { loggedInUser },
        smallTalkTestings: {
            smallTalkTestings,
            smallTalkTestingsExports,
            smallTalkTestingsCount,
        },
    } = useSelector((state: RootState) => state);
    const checkPermission = async () => {
        const result = await checkPermissionFun(smallTalkId);
        if (!result) {
            toast.warning(`You cannot access this page`);
            router.push('/small-talks');
        } else {
            getSmallTalkTestingsFun(smallTalkId, page);
        }
    };
    useEffect(() => {
        setIsClient(true);
        if (loggedInUser.user_type === 'USER') {
            checkPermission();
        } else {
            getSmallTalkTestingsFun(smallTalkId, page);
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
            importXlsxFile(d, smallTalkId);
        });
    };
    const writeExcel = () => {
        const Workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(smallTalkTestingsExports);
        XLSX.utils.book_append_sheet(Workbook, worksheet, 'Sheet1');
        XLSX.writeFile(Workbook, `${smallTalkName}_small_talks_testing.xlsx`);
    };
    return (
        <PageContainer
            title="Small Talks Testing"
            description="this is Small Talks Testing page"
        >
            <DashboardCard title="Small Talks Testing Page">
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
                            label="Add Testing Text"
                            variant="outlined"
                            value={smallTalkTesting}
                            onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                    createsSmallTalkTesting(
                                        smallTalkTesting,
                                        smallTalkId
                                    );
                                    setPage(0);
                                    setSmallTalkTesting('');
                                }
                            }}
                            onChange={(e) => {
                                setSmallTalkTesting(e.target.value);
                            }}
                            style={{
                                width: '50%',
                                margin: '10px',
                            }}
                        />
                        <div>
                            Small Talks Testings Records:
                            {smallTalkTestingsCount || 0}
                        </div>
                    </div>
                    <EnhancedTable
                        headCells={headCells}
                        rows={smallTalkTestings.map(
                            (smallTalkTesting: any, i) => ({
                                id: smallTalkTesting.id,
                                value: [
                                    smallTalkTesting.id,
                                    ,
                                    showModifyInput === smallTalkTesting.id ? (
                                        <TextField
                                            id="outlined-basic"
                                            label="Modify"
                                            multiline
                                            variant="outlined"
                                            value={modifyText}
                                            onKeyDown={(e) => {
                                                if (e.keyCode == 13) {
                                                    updateSmallTalkTesting(
                                                        smallTalkTesting.id,
                                                        smallTalkId,
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
                                                    smallTalkTesting.text
                                                );
                                                setShowModifyInput(
                                                    smallTalkTesting.id
                                                );
                                            }}
                                        >
                                            {smallTalkTesting.text}
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
                                                    smallTalkTesting.id
                                                ) {
                                                    updateSmallTalkTesting(
                                                        smallTalkTesting.id,
                                                        smallTalkId,
                                                        page,
                                                        modifyText
                                                    );
                                                    setModifyText('');
                                                    setShowModifyInput('');
                                                } else {
                                                    deleteSmallTalkTesting(
                                                        smallTalkTesting.id,
                                                        smallTalkId,
                                                        page
                                                    );
                                                }
                                            }}
                                            key={i}
                                        >
                                            {showModifyInput ===
                                            smallTalkTesting.id
                                                ? 'Save'
                                                : 'Remove'}
                                        </Button>
                                        {showModifyInput ===
                                            smallTalkTesting.id && (
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
                    {smallTalkTestingsCount > 0 && (
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
                                count={Math.ceil(smallTalkTestingsCount / 50)}
                                color="primary"
                                onChange={(e, page) => {
                                    getSmallTalkTestingsFun(smallTalkId, page);
                                }}
                            />
                        </Stack>
                    )}
                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default SmallTalkTestingPage;
