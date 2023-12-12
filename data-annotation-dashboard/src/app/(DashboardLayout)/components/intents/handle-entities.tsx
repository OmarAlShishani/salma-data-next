import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material';
import { RootState } from '../../../../redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IconArchive } from '@tabler/icons-react';
import {
    getIntentsByEntityRolesId,
    createEntitiesIntentsRelation,
    deleteEntitiesIntentsRelation,
    getIntentsForEntitiesIntentsRelation,
} from '@/utils/entitiesWithIntentsUtils';
import { resetEntitiesIntentsRelation } from '@/redux/features/entitiesSlice';

export default function HandleEntities({
    setOpen,
    intentId,
}: {
    setOpen?: any;
    intentId?: any;
}) {
    const [selectedValue, setSelectedValue] = useState([] as any);
    const [deleteEntitiesIntents, setDeleteEntitiesIntents] = useState(
        [] as any
    );
    const {
        entities: {
            entitiesIntentsRelation,
            intentsForEntitiesIntents: intents,
        },
    } = useSelector((state: RootState) => state);
    useEffect(() => {
        getIntentsForEntitiesIntentsRelation();
        getIntentsByEntityRolesId(intentId);
    }, []);
    useEffect(() => {
        setSelectedValue(entitiesIntentsRelation || []);
    }, [entitiesIntentsRelation]);
    return (
        <div>
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
                    onClick={async () => {
                        await deleteEntitiesIntentsRelation(
                            deleteEntitiesIntents,
                            intentId
                        );
                        createEntitiesIntentsRelation(selectedValue, intentId);
                        resetEntitiesIntentsRelation();
                        setOpen(false);
                    }}
                >
                    Save
                </Button>
                <Button variant="outlined" onClick={() => setOpen(false)}>
                    Close
                </Button>
            </Box>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Entity</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={'Select Entity'}
                    label="Entity"
                    onChange={(e: any) => {
                        if (e) {
                            const parsedValue = JSON.parse(e.target.value);
                            if (parsedValue) {
                                setSelectedValue([
                                    parsedValue,
                                    ...selectedValue,
                                ]);
                            }
                        }
                    }}
                >
                    {intents
                        .filter(
                            (intent: any) =>
                                !selectedValue
                                    .map((ele: any) => ele.id)
                                    .includes(intent.id) &&
                                intent.active === true
                        )
                        .map((intent: any, i: any) => (
                            <MenuItem value={JSON.stringify(intent)} key={i}>
                                {intent.name}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                    margin: '10px 0',
                }}
            >
                {selectedValue?.map((selected: any, i: any) => (
                    <div
                        style={{
                            border: 'solid 1px',
                            borderRadius: '5px',
                            padding: '0px 10px',
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                        key={i}
                    >
                        <p style={{ margin: '0' }}>{selected?.name}</p>
                        <p
                            style={{
                                margin: '0',
                                padding: '0',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            onClick={() => {
                                setDeleteEntitiesIntents([
                                    ...deleteEntitiesIntents,
                                    selected,
                                ]);
                                const filters = selectedValue.filter(
                                    (ele: any) => ele.id !== selected?.id
                                );
                                setSelectedValue(filters);
                            }}
                        >
                            <IconArchive />
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
