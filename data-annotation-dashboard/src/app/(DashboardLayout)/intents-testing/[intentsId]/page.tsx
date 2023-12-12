'use client';
import {
    getIntentsTesting,
    createIntentsTesting,
    importXlsxFile,
    checkPermissionFun,
    deleteIntentsTesting,
    updateIntentsTesting,
    getAllEntities,
    getEntityValuesByEntityId,
} from '@/utils/intentsTestingsUtils';
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
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
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const IntentsTestingPage = ({ params }: { params: { intentsId: string } }) => {
    const [intentsId, intentsName] = decodeURI(params.intentsId).split('-');
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [intentsTesting, setIntentsTesting] = useState('');
    const [entities, setEntities] = useState([] as any);
    const [selectedEntity, setSelectedEntity] = useState({} as any);
    const [selectedEntityValue, setSelectedEntityValue] = useState({} as any);
    const [entityValues, setEntityValues] = useState([]);
    const [page, setPage] = useState(0);
    const [modifyData, setModifyData] = useState({} as any);
    const [editEntities, setEditEntities] = useState([] as any);
    const [selectedEditEntity, setSelectedEditEntity] = useState({} as any);
    const [selectedEditEntityValue, setSelectedEditEntityValue] = useState(
        {} as any
    );
    const [deleteEntities, setDeleteEntities] = useState([] as any);
    const [showModifyInput, setShowModifyInput] = useState('');
    const {
        user: { loggedInUser },
        intentsTestings: {
            intentsTestings,
            intentsTestingsCount,
            intentsTestingsExports,
            allEntities,
        },
    } = useSelector((state: RootState) => state);
    const checkPermission = async () => {
        const result = await checkPermissionFun(intentsId);
        if (!result) {
            toast.warning(`You cannot access this page`);
            router.push('/intents');
        } else {
            getIntentsTesting(intentsId, page);
            getAllEntities(intentsId);
        }
    };
    useEffect(() => {
        setIsClient(true);
        if (loggedInUser.user_type === 'USER') {
            checkPermission();
        } else {
            getIntentsTesting(intentsId, page);
            getAllEntities(intentsId);
        }
    }, []);
    const headCells = ['Id', 'Text', 'Expected'];
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
        const worksheet = XLSX.utils.aoa_to_sheet(intentsTestingsExports);
        XLSX.utils.book_append_sheet(Workbook, worksheet, 'Sheet1');
        XLSX.writeFile(Workbook, `${intentsName}_intents_testing.xlsx`);
    };
    return (
        <PageContainer
            title="Intents Testing"
            description="this is Intents Testing page"
        >
            <DashboardCard title="Intents Testing Page">
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
                        <>
                            <TextField
                                id="outlined-basic"
                                label="Add Testing Text"
                                variant="outlined"
                                value={intentsTesting}
                                multiline
                                onKeyDown={(e) => {
                                    if (e.keyCode == 13) {
                                        setEntities([
                                            ...entities,
                                            {
                                                entity: { id: selectedEntity },
                                                entityValue: {
                                                    id: selectedEntityValue,
                                                },
                                            },
                                        ]);
                                        createIntentsTesting(
                                            intentsTesting,
                                            intentsId,
                                            [
                                                ...entities,
                                                {
                                                    entity: {
                                                        id: selectedEntity,
                                                    },
                                                    entityValue: {
                                                        id: selectedEntityValue,
                                                    },
                                                },
                                            ]
                                        );
                                        setIntentsTesting('');
                                        setEntities([]);
                                        setSelectedEntity({});
                                        setSelectedEntityValue({});
                                        setEntityValues([]);
                                    }
                                }}
                                onChange={(e) => {
                                    setIntentsTesting(e.target.value);
                                }}
                                style={{
                                    width: '50%',
                                    margin: '10px',
                                }}
                            />
                            <div
                                style={{
                                    width: '30%',
                                }}
                            >
                                {entities.map((ele: any, i: number) => (
                                    <div
                                        key={i}
                                        style={{
                                            position: 'relative',
                                            display: 'flex',
                                            justifyContent: 'start',
                                            alignItems: 'center',
                                            gap: '20px',
                                            width: '100%',
                                            margin: '10px 5px',
                                        }}
                                    >
                                        <p
                                            style={{
                                                border: 'solid 1px',
                                                borderRadius: '5px',
                                                padding: '5px',
                                                cursor: 'pointer',
                                                width: '100%',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {ele?.entity?.name}
                                        </p>
                                        <p
                                            style={{
                                                border: 'solid 1px',
                                                borderRadius: '5px',
                                                padding: '5px',
                                                cursor: 'pointer',
                                                width: '100%',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {ele?.entityValue?.keyword}
                                        </p>
                                    </div>
                                ))}
                                <div
                                    style={{
                                        position: 'relative',
                                        display: 'flex',
                                        justifyContent: 'start',
                                        alignItems: 'center',
                                        gap: '20px',
                                        width: '100%',
                                        margin: '10px 5px',
                                    }}
                                >
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">
                                            Entity
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={selectedEntity}
                                            label="user"
                                            onChange={async (e: any) => {
                                                if (e) {
                                                    if (e.target.value) {
                                                        const result =
                                                            await getEntityValuesByEntityId(
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                )
                                                            );
                                                        setEntityValues(result);
                                                        setSelectedEntity(
                                                            e.target.value
                                                        );
                                                    }
                                                }
                                            }}
                                        >
                                            {allEntities.map(
                                                (entity: any, i: any) => (
                                                    <MenuItem
                                                        value={entity.id}
                                                        key={i}
                                                    >
                                                        {entity.name}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-entity-value">
                                            Entity Value
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-entity-value"
                                            id="demo-simple-select"
                                            value={selectedEntityValue}
                                            label="user"
                                            disabled={!selectedEntity}
                                            onChange={(e: any) => {
                                                if (e) {
                                                    setSelectedEntityValue(
                                                        e.target.value
                                                    );
                                                }
                                            }}
                                        >
                                            {entityValues
                                                .filter((ele: any) => {
                                                    const mappingEntities =
                                                        entities.map(
                                                            (ele: any) =>
                                                                ele.entityValue
                                                                    .id
                                                        );
                                                    return !mappingEntities.includes(
                                                        ele.id
                                                    );
                                                })
                                                .map((entity: any, i: any) => (
                                                    <MenuItem
                                                        value={entity?.id}
                                                        key={i}
                                                    >
                                                        {entity.keyword}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div
                                    style={{
                                        border: 'solid 1px',
                                        borderRadius: '5px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: '5px',
                                        margin: '5px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => {
                                        if (
                                            selectedEntity &&
                                            selectedEntityValue
                                        ) {
                                            const entity = allEntities.find(
                                                (ele) =>
                                                    ele.id === selectedEntity
                                            );
                                            const entityValue =
                                                entityValues.find(
                                                    (ele: any) =>
                                                        ele.id ===
                                                        selectedEntityValue
                                                );
                                            setEntities([
                                                ...entities,
                                                {
                                                    entity,
                                                    entityValue,
                                                },
                                            ]);
                                            setSelectedEntity({});
                                            setSelectedEntityValue({});
                                        } else {
                                            toast.error('check select');
                                        }
                                    }}
                                >
                                    Add Entity
                                </div>
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
                                        setEntities([
                                            ...entities,
                                            {
                                                entity: { id: selectedEntity },
                                                entityValue: {
                                                    id: selectedEntityValue,
                                                },
                                            },
                                        ]);
                                        createIntentsTesting(
                                            intentsTesting,
                                            intentsId,
                                            [
                                                ...entities,
                                                {
                                                    entity: {
                                                        id: selectedEntity,
                                                    },
                                                    entityValue: {
                                                        id: selectedEntityValue,
                                                    },
                                                },
                                            ]
                                        );
                                        setIntentsTesting('');
                                        setEntities([]);
                                        setSelectedEntity({});
                                        setSelectedEntityValue({});
                                        setEntityValues([]);
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setIntentsTesting('');
                                        setEntities([]);
                                        setSelectedEntity({});
                                        setSelectedEntityValue({});
                                        setEntityValues([]);
                                    }}
                                >
                                    Rest
                                </Button>
                            </Box>
                        </>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            margin: '10px',
                        }}
                    >
                        Intents Testing Records:{intentsTestingsCount || 0}
                    </div>
                    <EnhancedTable
                        headCells={headCells}
                        rows={intentsTestings.map((intentsTesting: any, i) => {
                            return {
                                id: intentsTesting.id,
                                value: [
                                    intentsTesting.id,
                                    showModifyInput === intentsTesting.id ? (
                                        <TextField
                                            id="outlined-basic"
                                            label="Modify"
                                            multiline
                                            variant="outlined"
                                            value={modifyData.text}
                                            onKeyDown={(e) => {
                                                if (e.keyCode == 13) {
                                                    updateIntentsTesting(
                                                        intentsTesting.id,
                                                        intentsId,
                                                        page,
                                                        modifyData,
                                                        editEntities,
                                                        deleteEntities
                                                    );
                                                    setModifyData({});
                                                    setShowModifyInput('');
                                                }
                                            }}
                                            onChange={(e) => {
                                                setModifyData({
                                                    ...modifyData,
                                                    text: e.target.value,
                                                });
                                            }}
                                            style={{
                                                minWidth: '400px',
                                            }}
                                        />
                                    ) : (
                                        <p
                                            onClick={() => {
                                                setModifyData({
                                                    ...modifyData,
                                                    text: intentsTesting.text,
                                                });
                                                setEditEntities(
                                                    intentsTesting.intent_testing_phrase_expected.map(
                                                        (ele: any) => ({
                                                            entityValue:
                                                                ele.entity_value,
                                                            entity: ele.entities,
                                                        })
                                                    )
                                                );
                                                setShowModifyInput(
                                                    intentsTesting.id
                                                );
                                            }}
                                        >
                                            {intentsTesting.text}
                                        </p>
                                    ),
                                    showModifyInput === intentsTesting.id ? (
                                        <>
                                            {editEntities.map(
                                                (ele: any, i: number) => (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            position:
                                                                'relative',
                                                            display: 'flex',
                                                            justifyContent:
                                                                'start',
                                                            alignItems:
                                                                'center',
                                                            gap: '20px',
                                                            width: '100%',
                                                            margin: '10px 5px',
                                                        }}
                                                    >
                                                        <p
                                                            style={{
                                                                border: 'solid 1px',
                                                                borderRadius:
                                                                    '5px',
                                                                padding: '5px',
                                                                cursor: 'pointer',
                                                                width: '100%',
                                                                textAlign:
                                                                    'center',
                                                            }}
                                                        >
                                                            {ele?.entity?.name}
                                                        </p>
                                                        <p
                                                            style={{
                                                                border: 'solid 1px',
                                                                borderRadius:
                                                                    '5px',
                                                                padding: '5px',
                                                                cursor: 'pointer',
                                                                width: '100%',
                                                                textAlign:
                                                                    'center',
                                                            }}
                                                        >
                                                            {
                                                                ele?.entityValue
                                                                    ?.keyword
                                                            }
                                                        </p>
                                                        <p
                                                            style={{
                                                                border: 'solid 1px',
                                                                borderRadius:
                                                                    '5px',
                                                                padding: '5px',
                                                                cursor: 'pointer',
                                                                textAlign:
                                                                    'center',
                                                            }}
                                                            onClick={() => {
                                                                const result =
                                                                    editEntities.filter(
                                                                        (
                                                                            element: any,
                                                                            index: number
                                                                        ) =>
                                                                            i !==
                                                                            index
                                                                    );
                                                                setEditEntities(
                                                                    result
                                                                );
                                                                setDeleteEntities(
                                                                    [
                                                                        ...deleteEntities,
                                                                        ele,
                                                                    ]
                                                                );
                                                            }}
                                                        >
                                                            x
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                            <div
                                                style={{
                                                    position: 'relative',
                                                    display: 'flex',
                                                    justifyContent: 'start',
                                                    alignItems: 'center',
                                                    gap: '20px',
                                                    width: '100%',
                                                    margin: '10px 5px',
                                                }}
                                            >
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-label">
                                                        Entity
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={
                                                            selectedEditEntity
                                                        }
                                                        label="user"
                                                        onChange={async (
                                                            e: any
                                                        ) => {
                                                            if (e) {
                                                                if (
                                                                    e.target
                                                                        .value
                                                                ) {
                                                                    const result =
                                                                        await getEntityValuesByEntityId(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    setEntityValues(
                                                                        result
                                                                    );
                                                                    setSelectedEditEntity(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        {allEntities.map(
                                                            (
                                                                entity: any,
                                                                i: any
                                                            ) => (
                                                                <MenuItem
                                                                    value={
                                                                        entity?.id
                                                                    }
                                                                    key={i}
                                                                >
                                                                    {
                                                                        entity.name
                                                                    }
                                                                </MenuItem>
                                                            )
                                                        )}
                                                    </Select>
                                                </FormControl>
                                                <FormControl fullWidth>
                                                    <InputLabel id="demo-simple-select-entity-value">
                                                        Entity Value
                                                    </InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-entity-value"
                                                        id="demo-simple-select"
                                                        value={
                                                            selectedEditEntityValue
                                                        }
                                                        label="user"
                                                        disabled={
                                                            !selectedEditEntity
                                                        }
                                                        onChange={(e: any) => {
                                                            if (e) {
                                                                setSelectedEditEntityValue(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {entityValues
                                                            .filter(
                                                                (ele: any) => {
                                                                    const mappingEntities =
                                                                        editEntities.map(
                                                                            (
                                                                                ele: any
                                                                            ) =>
                                                                                ele
                                                                                    ?.entityValue
                                                                                    ?.id
                                                                        );
                                                                    return !mappingEntities.includes(
                                                                        ele.id
                                                                    );
                                                                }
                                                            )
                                                            .map(
                                                                (
                                                                    entity: any,
                                                                    i: any
                                                                ) => (
                                                                    <MenuItem
                                                                        value={
                                                                            entity?.id
                                                                        }
                                                                        key={i}
                                                                    >
                                                                        {
                                                                            entity.keyword
                                                                        }
                                                                    </MenuItem>
                                                                )
                                                            )}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <div
                                                style={{
                                                    border: 'solid 1px',
                                                    borderRadius: '5px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: '5px',
                                                    margin: '5px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => {
                                                    if (
                                                        selectedEditEntity &&
                                                        selectedEditEntityValue
                                                    ) {
                                                        const entity =
                                                            allEntities.find(
                                                                (ele) =>
                                                                    ele.id ===
                                                                    selectedEditEntity
                                                            );
                                                        const entityValue =
                                                            entityValues.find(
                                                                (ele: any) =>
                                                                    ele.id ===
                                                                    selectedEditEntityValue
                                                            );
                                                        setEditEntities([
                                                            ...editEntities,
                                                            {
                                                                entity,
                                                                entityValue,
                                                            },
                                                        ]);
                                                        setSelectedEditEntity(
                                                            {}
                                                        );
                                                        setSelectedEditEntityValue(
                                                            {}
                                                        );
                                                        console.log('yes');

                                                        getAllEntities(
                                                            intentsId
                                                        );
                                                    } else {
                                                        toast.error(
                                                            'check select'
                                                        );
                                                    }
                                                }}
                                            >
                                                Add Entity
                                            </div>
                                        </>
                                    ) : (
                                        <div
                                            key={i}
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                gap: '10px',
                                            }}
                                        >
                                            {intentsTesting.intent_testing_phrase_expected.map(
                                                (ele: any, i: number) => (
                                                    <p
                                                        key={i}
                                                        onClick={() => {
                                                            setModifyData({
                                                                ...modifyData,
                                                                text: intentsTesting.text,
                                                            });
                                                            setShowModifyInput(
                                                                intentsTesting.id
                                                            );
                                                            setEditEntities(
                                                                intentsTesting.intent_testing_phrase_expected.map(
                                                                    (
                                                                        ele: any
                                                                    ) => ({
                                                                        id: ele.id,
                                                                        entityValue:
                                                                            ele.entity_value,
                                                                        entity: ele.entities,
                                                                    })
                                                                )
                                                            );
                                                        }}
                                                        style={{
                                                            fontSize: '14px',
                                                            fontWeight: '700px',
                                                            padding: '5px',
                                                            borderRadius: '5px',
                                                            color: '#fff',
                                                            backgroundColor:
                                                                ele.entities
                                                                    .color,
                                                        }}
                                                    >
                                                        {ele.entities.name}:
                                                        {
                                                            ele.entity_value
                                                                .keyword
                                                        }
                                                    </p>
                                                )
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
                                                    intentsTesting.id
                                                ) {
                                                    setEditEntities([
                                                        ...editEntities,
                                                        {
                                                            entity: {
                                                                id: selectedEditEntity,
                                                            },
                                                            entityValue: {
                                                                id: selectedEditEntityValue,
                                                            },
                                                        },
                                                    ]);
                                                    updateIntentsTesting(
                                                        intentsTesting.id,
                                                        intentsId,
                                                        page,
                                                        modifyData,
                                                        [
                                                            ...editEntities,
                                                            {
                                                                entity: {
                                                                    id: selectedEditEntity,
                                                                },
                                                                entityValue: {
                                                                    id: selectedEditEntityValue,
                                                                },
                                                            },
                                                        ],
                                                        deleteEntities
                                                    );
                                                    setModifyData({});
                                                    setShowModifyInput('');
                                                } else {
                                                    deleteIntentsTesting(
                                                        intentsTesting.id,
                                                        intentsId,
                                                        page
                                                    );
                                                }
                                            }}
                                        >
                                            {showModifyInput ===
                                            intentsTesting.id
                                                ? 'Save'
                                                : 'Remove'}
                                        </Button>
                                        {showModifyInput ===
                                            intentsTesting.id && (
                                            <Button
                                                variant="contained"
                                                onClick={() => {
                                                    setModifyData({});
                                                    setShowModifyInput('');
                                                }}
                                            >
                                                Close
                                            </Button>
                                        )}
                                    </div>,
                                ],
                            };
                        })}
                    />
                    {intentsTestingsCount > 0 && (
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
                                count={Math.ceil(intentsTestingsCount / 50)}
                                color="primary"
                                onChange={(e, page) => {
                                    setPage(page - 1);
                                    getIntentsTesting(intentsId, page - 1);
                                }}
                            />
                        </Stack>
                    )}
                </Grid>
            </DashboardCard>
        </PageContainer>
    );
};

export default IntentsTestingPage;
