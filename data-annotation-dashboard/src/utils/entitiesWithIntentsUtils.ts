import {
    setEntitiesIntentsRelation,
    setIntentsForEntitiesIntents,
} from '@/redux/features/entitiesSlice';
import { store } from '@/redux/store';
import axiosInstance from './axiosInstance';

export const getIntentsByEntityRolesId = async (intentsId?: any) => {
    try {
        const response = await axiosInstance.get(
            `/entitiesIntentsRelation/getIntentsByEntityRolesId/${intentsId}`
        );
        store.dispatch(setEntitiesIntentsRelation(response.data.results));
    } catch (error) {
        console.error(error);
    }
};

export const createEntitiesIntentsRelation = async (
    entities?: any,
    intentsId?: any,
) => {
    for (let index = 0; index < entities.length; index++) {
        const entity = entities[index];
        try {
            await axiosInstance.post(
                '/entitiesIntentsRelation/createEntitiesIntentsRelation',
                {
                    intentsId,
                    entityId:entity.id,
                }
            );
            getIntentsByEntityRolesId(intentsId);
        } catch (error: any) {
            console.error(error.message);
        }
    }
};

export const deleteEntitiesIntentsRelation = async (
    deleteEntitiesIntents?: any,
    intentsId?: any
) => {
    for (let index = 0; index < deleteEntitiesIntents.length; index++) {
        const { roleId } = deleteEntitiesIntents[index];
        if (roleId) {
            try {
                await axiosInstance.delete(
                    `/entitiesIntentsRelation/deleteEntitiesIntentsRelation/${roleId}/${intentsId}`
                );
            } catch (error: any) {
                console.error(error.message);
            }
        }
    }
    getIntentsByEntityRolesId(intentsId);
};

export const getIntentsForEntitiesIntentsRelation = async () => {
    try {
        const response = await axiosInstance.get(
            `/entitiesIntentsRelation/getIntentsForEntitiesIntentsRelation`
        );
        store.dispatch(setIntentsForEntitiesIntents(response.data.results));
    } catch (error: any) {
        console.error(error.message);
    }
};
