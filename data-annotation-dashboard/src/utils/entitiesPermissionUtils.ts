import { setEntitiesRoles } from '@/redux/features/entitiesSlice';
import { store } from '@/redux/store';
import axiosInstance from './axiosInstance';

export const getEntitiesPermission = async (entityId?: any) => {
    try {
        const response = await axiosInstance.get(
            `/entitiesRoles/getRolesByEntityRolesId/${entityId}`
        );
        store.dispatch(setEntitiesRoles(response.data.results));
    } catch (error) {
        console.error(error);
    }
};


export const addRoles = async (users?: any, entityId?: any) => {
    for (let index = 0; index < users.length; index++) {
        const user = users[index];
        try {
            await axiosInstance.post('/entitiesRoles/createRoles', {
                userId: user?.id,
                entityId,
            });
            getEntitiesPermission(entityId);
        } catch (error: any) {
            console.error(error.message);
        }
    }
};

export const deleteRole = async (deleteRoles?: any, entityId?: any) => {
    for (let index = 0; index < deleteRoles.length; index++) {
        const { roleId } = deleteRoles[index];
        if (roleId) {
            try {
                await axiosInstance.delete(
                    `/entitiesRoles/deleteRoles/${roleId}`
                );
            } catch (error: any) {
                console.error(error.message);
            }
        }
    }
    getEntitiesPermission(entityId);
};
