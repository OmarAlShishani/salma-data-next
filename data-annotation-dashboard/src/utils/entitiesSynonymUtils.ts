import {
    setEntitiesSynonym,
    setEntitiesSynonymCount,
    setEntitiesSynonymExports,
} from '@/redux/features/entitiesSynonymSlice';
import { store } from '@/redux/store';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

export const getEntitiesSynonym = async (
    entityId: any,
    entityValueId: any,
    page: any
) => {
    try {
        const response = await axiosInstance.get(
            `/entitiesSynonym/getEntitiesSynonym/${entityId}/${entityValueId}/${page}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setEntitiesSynonym(response.data.results.result));
            store.dispatch(
                setEntitiesSynonymCount(response.data.results.count)
            );
            exportDataToExcel(entityId, entityValueId);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const createEntitiesSynonym = async (
    text: string,
    entityId: any,
    entityValueId: any
) => {
    try {
        const response = await axiosInstance.post(
            '/entitiesSynonym/createEntitiesSynonym',
            {
                entityId,
                entityValueId,
                text,
            }
        );
        if (response.data.isSuccess) {
            getEntitiesSynonym(entityId, entityValueId, 0);
            return { error: false, message: 'Intent Added' };
        } else {
            toast.error(response.data.message);
            return { error: true, message: response.data.message };
        }
    } catch (error) {
        console.error(error);
        return { error: true, message: 'حدث خطأ' };
    }
};

export const importXlsxFile = async (
    file: any,
    entityId: any,
    entityValueId: any
) => {
    try {
        const response = await axiosInstance.post(
            '/entitiesSynonym/importXlsxFile',
            {
                file,
                entityId,
                entityValueId,
            }
        );
        let success = [] as any;
        let failed = [] as any;
        for (let index = 0; index < response.data.length; index++) {
            const { isSuccess, message } = response.data[index];
            if (isSuccess) {
                success.push(message);
            } else {
                failed.push(message);
            }
        }
        if (success.length) {
            toast.success(success.join('\n'));
        }
        if (failed.length) {
            toast.error(failed.join('\n'));
        }
        getEntitiesSynonym(entityId, entityValueId, 0);
    } catch (error) {
        console.error(error);
        return { error: true, message: 'حدث خطأ' };
    }
};

export const exportDataToExcel = async (entityId: any, entityValueId: any) => {
    try {
        const response = await axiosInstance.get(
            `/entitiesSynonym/exportXlsxFile/${entityId}/${entityValueId}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setEntitiesSynonymExports(response.data.results));
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const checkPermissionFun = async (entityId: any) => {
    try {
        const response = await axiosInstance.get(
            `/entitiesSynonym/checkPermission/${entityId}}`
        );
        return response.data.results;
    } catch (error) {
        console.error(error);
    }
};

export const deleteEntitiesSynonym = async (
    id: any,
    entityId: any,
    entityValueId: any,
    page: any
) => {
    try {
        const response = await axiosInstance.delete(
            `/entitiesSynonym/deleteEntitiesSynonym/${entityId}/${id}`
        );
        if (response.data.isSuccess) {
            getEntitiesSynonym(entityId, entityValueId, page);
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    }
};

export const updateEntitiesSynonym = async (
    id: any,
    entityId: any,
    entityValueId: any,
    page: any,
    modifyText: any
) => {
    try {
        const response = await axiosInstance.put(
            `/entitiesSynonym/updateEntitiesSynonym/${entityId}/${id}`,
            {
                data: {
                    synonym: {
                        set: modifyText,
                    },
                },
            }
        );
        if (response.data.isSuccess) {
            getEntitiesSynonym(entityId, entityValueId, page);
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    }
};
