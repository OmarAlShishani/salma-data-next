import { setIntentsRoles } from '@/redux/features/intentsSlice';
import { store } from '@/redux/store';
import axiosInstance from './axiosInstance';

export const getIntentsPermission = async (intentsId?: any) => {
    try {
        const response = await axiosInstance.get(
            `/intentsRoles/getRolesByIntentsId/${intentsId}`
        );
        store.dispatch(setIntentsRoles(response.data.results));
    } catch (error) {
        console.error(error);
    }
};


export const addRoles = async (users?: any, intentsId?: any) => {
    for (let index = 0; index < users.length; index++) {
        const user = users[index];
        try {
            await axiosInstance.post('/intentsRoles/createRoles', {
                userId: user?.id,
                intentsId,
            });
            getIntentsPermission(intentsId);
        } catch (error: any) {
            console.error(error.message);
        }
    }
};

export const deleteRole = async (deleteRoles?: any, intentsId?: any) => {
    for (let index = 0; index < deleteRoles.length; index++) {
        const { roleId } = deleteRoles[index];
        if (roleId) {
            try {
                await axiosInstance.delete(
                    `/intentsRoles/deleteRoles/${roleId}`
                );
            } catch (error: any) {
                console.error(error.message);
            }
        }
    }
    getIntentsPermission(intentsId);
};
