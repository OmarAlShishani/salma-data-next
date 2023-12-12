import { setSmallTalksPermission } from '@/redux/features/smallTalksPermissionSlice';
import { store } from '@/redux/store';
import axiosInstance from './axiosInstance';

export const getSmallTalksPermission = async (smalltalkId?: any) => {
    try {
        const response = await axiosInstance.get(
            `/smallTalkRoles/getRolesBySmallTalksId/${smalltalkId}`
        );
        store.dispatch(setSmallTalksPermission(response.data.results));
    } catch (error) {
        console.error(error);
    }
};

export const addRoles = async (users?: any, smalltalkId?: any) => {
    for (let index = 0; index < users.length; index++) {
        const user = users[index];
        try {
            await axiosInstance.post('/smallTalkRoles/createRoles', {
                userId: user?.id,
                smalltalkId,
            });
            getSmallTalksPermission(smalltalkId);
        } catch (error: any) {
            console.error(error.message);
        }
    }
};

export const deleteRole = async (deleteRoles?: any, smalltalkId?: any) => {
    for (let index = 0; index < deleteRoles.length; index++) {
        const { roleId } = deleteRoles[index];
        if (roleId) {
            try {
                await axiosInstance.delete(
                    `/smallTalkRoles/deleteRoles/${roleId}`
                );
            } catch (error: any) {
                console.error(error.message);
            }
        }
    }
    getSmallTalksPermission(smalltalkId);
};
