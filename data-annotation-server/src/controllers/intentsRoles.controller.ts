import { Response } from 'express';
import { context } from '../context';

export const createRoles = async (req: any, res: Response) => {
    const { user_type, id: creatorUserId } = req.user;
    const { userId, intentsId } = req.body;
    if (!userId) {
        return res.status(201).json({
            status_code: 400,
            message: 'user Id missing',
            isSuccess: false,
            results: null,
        });
    }
    if (!intentsId) {
        return res.status(201).json({
            status_code: 400,
            message: 'intent Id missing',
            isSuccess: false,
            results: null,
        });
    }
    if (user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'no permission',
            isSuccess: false,
            results: null,
        });
    }

    const result = await context.prisma.intent_permission
        .create({
            data: {
                intents: {
                    connect: {
                        id: intentsId,
                    },
                },
                user_intent_permission_granted_byTouser: {
                    connect: {
                        id: creatorUserId,
                    },
                },
                user_intent_permission_user_idTouser: {
                    connect: {
                        id: userId,
                    },
                },
            },
        })
        .then((x) => {
            return res.status(201).json({
                status_code: 201,
                message: 'Success',
                isSuccess: true,
                results: x,
            });
        })
        .catch((e) => {
            return res.status(201).json({
                status_code: 400,
                message: 'Server Error',
                isSuccess: false,
                results: null,
            });
        });

    return result;
};
export const getRoles = async (req: any, res: Response) => {};
export const getRolesByIntentsId = async (req: any, res: Response) => {
    const { user_type, id: creatorUserId } = req.user;
    const { intentsId } = req.params;
    if (user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'no permission',
            isSuccess: false,
            results: null,
        });
    }
    const result = await context.prisma.intent_permission
        .findMany({
            ...(intentsId && {
                where: {
                    intent_id: { equals: parseInt(intentsId) },
                },
                include: {
                    user_intent_permission_user_idTouser: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }),
            orderBy: {
                id: 'desc',
            },
        })
        .then((x) => {
            return res.status(201).json({
                status_code: 201,
                message: 'Success',
                isSuccess: true,
                results: x.map((ele: any) => ({
                    roleId: ele.id,
                    ...ele?.user_intent_permission_user_idTouser,
                })),
            });
        })
        .catch((e) => {
            return res.status(201).json({
                status_code: 400,
                message: 'Server Error',
                isSuccess: false,
                results: null,
            });
        });

    return result;
};
export const getRolesById = async (req: any, res: Response) => {};
export const deleteRoles = async (req: any, res: Response) => {
    const { id } = req.params;
    const { user_type } = req.user;
    if (user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'no permission',
            isSuccess: false,
            results: null,
        });
    }
    const result = await context.prisma.intent_permission
        .delete({ where: { id: parseInt(id) } })
        .then((x) => {
            return res.status(201).json({
                status_code: 201,
                message: 'Success',
                isSuccess: true,
                results: x,
            });
        })
        .catch((e) => {
            return res.status(201).json({
                status_code: 400,
                message: 'Server Error',
                isSuccess: false,
                results: null,
            });
        });

    return result;
};
