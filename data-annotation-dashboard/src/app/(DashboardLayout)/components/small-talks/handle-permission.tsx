import {
    addRoles,
    deleteRole,
    getSmallTalksPermission,
} from '@/utils/smallTalksPermissionUtils';
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
import { resetSmallTalksPermission } from '@/redux/features/smallTalksPermissionSlice';
import {
    IconArchive,
} from '@tabler/icons-react';

export default function HandlePermission({
    users,
    setOpen,
    smalltalkId,
}: {
    users?: any;
    setOpen?: any;
    smalltalkId?: any;
}) {
    const [selectedValue, setSelectedValue] = useState([] as any);
    const [deleteRoles, setDeleteRoles] = useState([] as any);
    const {
        smallTalksPermission: { roles },
    } = useSelector((state: RootState) => state);
    useEffect(() => {
        getSmallTalksPermission(smalltalkId);
    }, []);
    useEffect(() => {
        setSelectedValue(roles);
    }, [roles]);
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
                        await deleteRole(deleteRoles, smalltalkId);
                        addRoles(selectedValue, smalltalkId);
                        resetSmallTalksPermission();
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
                <InputLabel id="demo-simple-select-label">User</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={'select user'}
                    label="user"
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
                    {users
                        .filter(
                            (user: any) =>
                                !selectedValue
                                    .map((ele: any) => ele.id)
                                    .includes(user.id) &&
                                user.user_type === 'USER' &&
                                user.active === true
                        )
                        .map((user: any, i: any) => (
                            <MenuItem value={JSON.stringify(user)} key={i}>
                                {user.name}
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
                                setDeleteRoles([...deleteRoles, selected]);
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
