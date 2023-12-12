/** @format */

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height: '90%',
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 24,
    p: 4,
    overflow: 'auto',
};
interface PropsType {
    open: boolean;
    setOpen: any;
    children?: JSX.Element | JSX.Element[];
    styleProp?: any;
}

export default function CustomModal({
    open,
    setOpen,
    children,
    styleProp,
}: PropsType) {
    const handleClose = () => setOpen(false);
    return (
        <div>
            <Modal
                keepMounted
                open={open}
                onClose={handleClose}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={{ ...style, ...(styleProp && { ...styleProp }) }}>
                    {children}
                </Box>
            </Modal>
        </div>
    );
}
