import {
    setAllEntities,
    setIntentsTestings,
    setIntentsTestingsCount,
    setIntentsTestingsExports,
} from '@/redux/features/intentsTestingSlice';
import { store } from '@/redux/store';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

export const getIntentsTesting = async (intentsId: any, page: any) => {
    try {
        const response = await axiosInstance.get(
            `/intentsTesting/getIntentsTesting/${intentsId}/${page}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setIntentsTestings(response.data.results.result));
            store.dispatch(
                setIntentsTestingsCount(response.data.results.count)
            );
            exportDataToExcel(intentsId);
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const createIntentsTesting = async (
    text: string,
    intentsId: any,
    entities: any
) => {
    try {
        const response = await axiosInstance.post(
            '/intentsTesting/createIntentsTesting',
            {
                intentsId: intentsId,
                text,
                entities,
            }
        );
        if (response.data.isSuccess) {
            getIntentsTesting(intentsId, 0);
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

export const importXlsxFile = async (file: any, intentsId: any) => {
    try {
        const response = await axiosInstance.post(
            '/intentsTesting/importXlsxFile',
            {
                file,
                intentsId: intentsId,
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
        getIntentsTesting(intentsId, 0);
    } catch (error) {
        console.error(error);
        return { error: true, message: 'حدث خطأ' };
    }
};

export const exportDataToExcel = async (intentsId: any) => {
    try {
        const response = await axiosInstance.get(
            `/intentsTesting/exportXlsxFile/${intentsId}}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setIntentsTestingsExports(response.data.results));
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const checkPermissionFun = async (intentsId: any) => {
    try {
        const response = await axiosInstance.get(
            `/intentsTesting/checkPermission/${intentsId}}`
        );
        return response.data.results;
    } catch (error) {
        console.error(error);
    }
};

export const deleteIntentsTesting = async (
    trainingId: any,
    intentsId: any,
    page: any
) => {
    try {
        const response = await axiosInstance.delete(
            `/intentsTesting/deleteIntentsTesting/${intentsId}/${trainingId}`
        );
        if (response.data.isSuccess) {
            getIntentsTesting(intentsId, page);
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    }
};

export const updateIntentsTesting = async (
    trainingId: any,
    intentsId: any,
    page: any,
    modifyText: any,
    entities: any,
    deleteEntities: any
) => {
    const result = {} as any;
    for (const key in modifyText) {
        const element = modifyText[key];
        result[key] = { set: element };
    }
    try {
        const response = await axiosInstance.put(
            `/intentsTesting/updateIntentsTesting/${intentsId}/${trainingId}`,
            {
                data: result,
                entities,
                deleteEntities,
            }
        );
        if (response.data.isSuccess) {
            getIntentsTesting(intentsId, page);
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    }
};

export const getAllEntities = async (intentsId: any) => {
    try {
        const response = await axiosInstance.get(
            `/intentsTesting/getAllEntities/${intentsId}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setAllEntities(response.data.results));
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const getEntityValuesByEntityId = async (entityId: any) => {
    try {
        const response = await axiosInstance.get(
            `/intentsTesting/getEntityValuesByEntityId/${entityId}`
        );
        if (response.data.isSuccess) {
            return response.data.results;
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};
