import {
    setIntentsFlowsForKeywords,
    setIntentsKeywords,
    setIntentsKeywordsCount,
    setIntentsKeywordsExports,
} from '@/redux/features/intentsKeywordsSlice';
import { store } from '@/redux/store';
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstance';

export const getIntentsKeywordsFun = async (intentsId: any, page: any) => {
    const isAdmin = store.getState().user.loggedInUser.user_type === 'ADMIN';
    try {
        const response = await axiosInstance.get(
            `/intentsKeywords/getIntentsKeywords/${intentsId}/${page}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setIntentsKeywords(response.data.results.result));
            store.dispatch(
                setIntentsKeywordsCount(response.data.results.count)
            );
            getIntentsFlowsForKeywordsFun(intentsId);
            if (isAdmin) {
                exportDataToExcel(intentsId);
            }
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const createIntentsKeyword = async (
    newKeywordIntents: any,
    intentsId: any
) => {
    try {
        const response = await axiosInstance.post(
            '/intentsKeywords/createIntentsKeywords',
            {
                intentsId: intentsId,
                ...newKeywordIntents,
            }
        );
        if (response.data.isSuccess) {
            getIntentsKeywordsFun(intentsId, 0);
            return { error: false, message: 'Intent Keyword Added' };
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
            '/intentsKeywords/importXlsxFile',
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
        getIntentsKeywordsFun(intentsId, 0);
    } catch (error) {
        console.error(error);
        return { error: true, message: 'حدث خطأ' };
    }
};

export const exportDataToExcel = async (intentsId: any) => {
    try {
        const response = await axiosInstance.get(
            `/intentsKeywords/exportXlsxFile/${intentsId}}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setIntentsKeywordsExports(response.data.results));
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
            `/intentsKeywords/checkPermission/${intentsId}}`
        );
        return response.data.results;
    } catch (error) {
        console.error(error);
    }
};

export const getIntentsFlowsForKeywordsFun = async (intentsId: any) => {
    try {
        const response = await axiosInstance.get(
            `/intentsKeywords/getIntentsFlowsForKeywords/${intentsId}`
        );
        if (response.data.isSuccess) {
            store.dispatch(setIntentsFlowsForKeywords(response.data.results));
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.error(error);
    }
};

export const deleteIntentsKeyword = async (
    KeywordId: any,
    intentsId: any,
    page: any
) => {
    try {
        const response = await axiosInstance.delete(
            `/intentsKeywords/deleteIntentsKeywords/${intentsId}/${KeywordId}`
        );
        if (response.data.isSuccess) {
            getIntentsKeywordsFun(intentsId, page);
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    }
};

export const updateIntentsKeyword = async (
    KeywordId: any,
    intentsId: any,
    page: any,
    editKeywordIntents: any
) => {
    try {
        const response = await axiosInstance.put(
            `/intentsKeywords/updateIntentsKeywords/${intentsId}/${KeywordId}`,
            {
                ...editKeywordIntents,
            }
        );
        if (response.data.isSuccess) {
            getIntentsKeywordsFun(intentsId, page);
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.message);
    }
};
