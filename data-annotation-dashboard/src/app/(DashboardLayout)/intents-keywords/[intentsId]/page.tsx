'use client';
import {
    createIntentsKeyword,
    getIntentsKeywordsFun,
    importXlsxFile,
    checkPermissionFun,
    deleteIntentsKeyword,
    updateIntentsKeyword,
} from '@/utils/intentsKeywordsUtils';
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Grid,
    Pagination,
    Stack,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import PageContainer from '../../components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import EnhancedTable from '../../components/shared/enhancedTable';
import * as XLSX from 'xlsx';
import { CSVLink } from 'react-csv';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Select from 'react-select';

const IntentsKeywordsPage = ({ params }: { params: { intentsId: string } }) => {
    const [intentsId, intentsName] = decodeURI(params?.intentsId)?.split('-');
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [page, setPage] = useState(0);
    const [newKeywordIntents, setNewKeywordIntents] = useState({
        keyword: '',
        original_word: false,
        intentsFlowsId: [],
    } as any);
    const [editKeywordIntents, setEditKeywordIntents] = useState({} as any);
    const [showModifyInput, setShowModifyInput] = useState('');
    const {
        user: { loggedInUser },
        intentsKeywords: {
            intentsKeywords,
            intentsKeywordsExports,
            intentsKeywordsCount,
            intentsFlowsForKeywords,
        },
    } = useSelector((state: RootState) => state);
    const checkPermission = async () => {
        const result = await checkPermissionFun(intentsId);
        if (!result) {
            toast.warning(`You cannot access this page`);
            router.push('/intents');
        } else {
            getIntentsKeywordsFun(intentsId, page);
        }
    };
    useEffect(() => {
        setIsClient(true);
        if (loggedInUser.user_type === 'USER') {
            checkPermission();
        } else {
            getIntentsKeywordsFun(intentsId, page);
        }
    }, []);
    const headCells = ['Id', 'Keyword', 'Original Word', 'Flows'];
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
        const worksheet = XLSX.utils.aoa_to_sheet(intentsKeywordsExports);
        XLSX.utils.book_append_sheet(Workbook, worksheet, 'Sheet1');
        XLSX.writeFile(Workbook, `${intentsName}_intents_Keywords.xlsx`);
    };
    const handleClickValues = (intentsKeyword: any) => {
        setEditKeywordIntents({
            ...editKeywordIntents,
            keyword: intentsKeyword.keyword,
            original_word: intentsKeyword.original_word,
            intentsFlowsId: intentsKeyword.intent_keyword_flow.map(
                (ele: any) => ({ value: ele.intent_flows.id, label: ele.intent_flows.text })
            ),
        });
        setShowModifyInput(intentsKeyword.id);
    };
    return (
        <PageContainer
            title="Intents Keywords"
            description="this is Intents Keywords page"
        >
            <DashboardCard title="Intents Keywords Page">
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
                            border: 'solid 1px #C8C8C8',
                            borderRadius: '5px',
                            margin: '10px 0',
                        }}
                    >
                        <TextField
                            id="outlined-basic"
                            label="Add Intents Keywords Text"
                            variant="outlined"
                            value={newKeywordIntents.keyword}
                            onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                    createIntentsKeyword(
                                        newKeywordIntents,
                                        intentsId
                                    );
                                    setPage(0);
                                    setNewKeywordIntents({
                                        keyword: '',
                                        original_word: false,
                                        intentsFlowsId: [],
                                    });
                                }
                            }}
                            onChange={(e) => {
                                setNewKeywordIntents({
                                    ...newKeywordIntents,
                                    keyword: e.target.value,
                                });
                            }}
                            style={{
                                width: '30%',
                                margin: '10px',
                            }}
                        />
                        <FormGroup style={{ width: '16%' }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            newKeywordIntents.original_word
                                        }
                                        onChange={(e) => {
                                            setNewKeywordIntents({
                                                ...newKeywordIntents,
                                                original_word: e.target.checked,
                                            });
                                        }}
                                    />
                                }
                                label="Original Word"
                            />
                        </FormGroup>
                        <Select
                            isMulti
                            name="flows"
                            value={newKeywordIntents.intentsFlowsId}
                            options={intentsFlowsForKeywords}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            styles={{
                                container: (base) => ({
                                    ...base,
                                    width: '30%',
                                }),
                            }}
                            onChange={(value) => {
                                setNewKeywordIntents({
                                    ...newKeywordIntents,
                                    intentsFlowsId: value,
                                });
                            }}
                        />
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
                                    setPage(0);
                                    createIntentsKeyword(
                                        newKeywordIntents,
                                        intentsId
                                    );
                                    setNewKeywordIntents({
                                        keyword: '',
                                        original_word: false,
                                        intentsFlowsId: [],
                                    });
                                }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setNewKeywordIntents({
                                        keyword: '',
                                        original_word: false,
                                        intentsFlowsId: [],
                                    });
                                }}
                            >
                                Rest
                            </Button>
                        </Box>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            margin: '10px',
                        }}
                    >
                        Intents Keywords Records:
                        {intentsKeywordsCount || 0}
                    </div>
                    <EnhancedTable
                        headCells={headCells}
                        rows={intentsKeywords.map(
                            (intentsKeyword: any, i: number) => {
                                return {
                                    id: intentsKeyword.id,
                                    value: [
                                        intentsKeyword.id,
                                        showModifyInput ===
                                        intentsKeyword.id ? (
                                            <TextField
                                                id="outlined-basic"
                                                label="Modify"
                                                multiline
                                                variant="outlined"
                                                value={
                                                    editKeywordIntents.keyword
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.keyCode == 13) {
                                                        updateIntentsKeyword(
                                                            intentsKeyword.id,
                                                            intentsId,
                                                            page,
                                                            editKeywordIntents
                                                        );
                                                        setEditKeywordIntents(
                                                            {}
                                                        );
                                                        setShowModifyInput('');
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setEditKeywordIntents({
                                                        ...editKeywordIntents,
                                                        keyword: e.target.value,
                                                    });
                                                }}
                                                style={{
                                                    minWidth: '300px',
                                                }}
                                            />
                                        ) : (
                                            <p
                                                onClick={() =>
                                                    handleClickValues(
                                                        intentsKeyword
                                                    )
                                                }
                                            >
                                                {intentsKeyword.keyword}
                                            </p>
                                        ),
                                        showModifyInput ===
                                        intentsKeyword.id ? (
                                            <FormGroup style={{ width: '16%' }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={
                                                                editKeywordIntents.original_word
                                                            }
                                                            onChange={(e) => {
                                                                setEditKeywordIntents(
                                                                    {
                                                                        ...editKeywordIntents,
                                                                        original_word:
                                                                            e
                                                                                .target
                                                                                .checked,
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    }
                                                    label="Original Word"
                                                />
                                            </FormGroup>
                                        ) : (
                                            <p
                                                onClick={() =>
                                                    handleClickValues(
                                                        intentsKeyword
                                                    )
                                                }
                                            >
                                                {intentsKeyword.original_word ===
                                                true
                                                    ? 'yes'
                                                    : 'no'}
                                            </p>
                                        ),
                                        showModifyInput ===
                                        intentsKeyword.id ? (
                                            <Select
                                                isMulti
                                                name="flows"
                                                defaultValue={
                                                    editKeywordIntents.intentsFlowsId
                                                }
                                                value={
                                                    editKeywordIntents.intentsFlowsId
                                                }
                                                options={
                                                    intentsFlowsForKeywords
                                                }
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                styles={{
                                                    container: (base) => ({
                                                        ...base,
                                                        width: '100%',
                                                    }),
                                                }}
                                                onChange={(value) => {
                                                    setEditKeywordIntents({
                                                        ...editKeywordIntents,
                                                        intentsFlowsId: value,
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <div
                                                key={i}
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'start',
                                                    flexWrap: 'wrap',
                                                    gap: '10px',
                                                }}
                                            >
                                                {intentsKeyword
                                                    .intent_keyword_flow
                                                    .length ? (
                                                    intentsKeyword.intent_keyword_flow.map(
                                                        (
                                                            ele: any,
                                                            i: number
                                                        ) => (
                                                            <p
                                                                key={i}
                                                                style={{
                                                                    border: 'solid 1px',
                                                                    borderRadius:
                                                                        '5px',
                                                                    padding:
                                                                        '5px',
                                                                }}
                                                                onClick={() =>
                                                                    handleClickValues(
                                                                        intentsKeyword
                                                                    )
                                                                }
                                                            >
                                                                {
                                                                    ele
                                                                        .intent_flows
                                                                        .text
                                                                }
                                                            </p>
                                                        )
                                                    )
                                                ) : (
                                                    <p
                                                        style={{
                                                            border: 'solid 1px',
                                                            borderRadius: '5px',
                                                            padding: '5px',
                                                        }}
                                                        onClick={() =>
                                                            handleClickValues(
                                                                intentsKeyword
                                                            )
                                                        }
                                                    >
                                                        All
                                                    </p>
                                                )}
                                            </div>
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
                                                        intentsKeyword.id
                                                    ) {
                                                        updateIntentsKeyword(
                                                            intentsKeyword.id,
                                                            intentsId,
                                                            page,
                                                            editKeywordIntents
                                                        );
                                                        setEditKeywordIntents(
                                                            {}
                                                        );
                                                        setShowModifyInput('');
                                                    } else {
                                                        deleteIntentsKeyword(
                                                            intentsKeyword.id,
                                                            intentsId,
                                                            page
                                                        );
                                                    }
                                                }}
                                                key={i}
                                            >
                                                {showModifyInput ===
                                                intentsKeyword.id
                                                    ? 'Save'
                                                    : 'Remove'}
                                            </Button>
                                            {showModifyInput ===
                                                intentsKeyword.id && (
                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        setEditKeywordIntents(
                                                            {}
                                                        );
                                                        setShowModifyInput('');
                                                    }}
                                                >
                                                    Close
                                                </Button>
                                            )}
                                        </div>,
                                    ],
                                };
                            }
                        )}
                    />
                    {intentsKeywordsCount > 0 && (
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
                                count={Math.ceil(intentsKeywordsCount / 50)}
                                color="primary"
                                onChange={(e, page) => {
                                    setPage(page - 1);
                                    getIntentsKeywordsFun(intentsId, page - 1);
                                }}
                            />
                        </Stack>
                    )}
                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default IntentsKeywordsPage;
