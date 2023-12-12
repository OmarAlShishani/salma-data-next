import { Response } from 'express';
import { context } from '../context';

export const createRoles = async (req: any, res: Response) => {
    const { user_type, id: creatorUserId } = req.user;
    const { userId, entityId } = req.body;
    if (!userId) {
        return res.status(201).json({
            status_code: 400,
            message: 'user Id missing',
            isSuccess: false,
            results: null,
        });
    }
    if (!entityId) {
        return res.status(201).json({
            status_code: 400,
            message: 'Entity Id missing',
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

    const result = await context.prisma.enities_permission
        .create({
            data: {
                entities: {
                    connect: {
                        id: entityId,
                    },
                },
                user_enities_permission_granted_byTouser: {
                    connect: {
                        id: creatorUserId,
                    },
                },
                user_enities_permission_user_idTouser: {
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
export const getRolesByEntityRolesId = async (req: any, res: Response) => {
    const { user_type, id: creatorUserId } = req.user;
    const { entityId } = req.params;
    if (user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'no permission',
            isSuccess: false,
            results: null,
        });
    }
    const result = await context.prisma.enities_permission
        .findMany({
            ...(entityId && {
                where: {
                    entity_id: { equals: parseInt(entityId) },
                },
                include: {
                    user_enities_permission_user_idTouser: {
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
                    ...ele?.user_enities_permission_user_idTouser,
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
    const result = await context.prisma.enities_permission
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
