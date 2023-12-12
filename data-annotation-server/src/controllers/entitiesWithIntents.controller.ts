import { Response } from 'express';
import { context } from '../context';

export const createEntitiesIntentsRelation = async (
    req: any,
    res: Response
) => {
    const { user_type, id: userId } = req.user;
    const { entityId, intentsId } = req.body;

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
    const checkUserPermission = await context.prisma.enities_permission
        .findFirst({
            where: {
                entity_id: { equals: parseInt(entityId) },
                user_id: { equals: parseInt(userId) },
            },
        })
        .then((x) => x)
        .catch((e) => {
            console.log(
                '🚀 ~ file: entitiesWithIntents.controller.ts:92 ~ getIntentsByEntityRolesId ~ e:',
                e
            );
        });
    if (!checkUserPermission && user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'no permission',
            isSuccess: false,
            results: null,
        });
    }

    const result = await context.prisma.intent_entities
        .create({
            data: {
                entities: {
                    connect: {
                        id: parseInt(entityId),
                    },
                },
                intents: {
                    connect: {
                        id: parseInt(intentsId),
                    },
                },
                user: {
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
export const getIntentsByEntityRolesId = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { intentsId } = req.params;

    const checkUserPermission = await context.prisma.intent_permission
        .findFirst({
            where: {
                intent_id: { equals: parseInt(intentsId) },
                user_id: { equals: parseInt(userId) },
            },
        })
        .then((x) => x)
        .catch((e) => {
            console.log(
                '🚀 ~ file: entitiesWithIntents.controller.ts:92 ~ getIntentsByEntityRolesId ~ e:',
                e
            );
        });
    if (!checkUserPermission && user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'no permission',
            isSuccess: false,
            results: null,
        });
    }
    const result = await context.prisma.intent_entities
        .findMany({
            ...(intentsId && {
                where: {
                    intent_id: { equals: parseInt(intentsId) },
                },
                include: {
                    entities: {
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
                    ...ele?.entities,
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
export const deleteEntitiesIntentsRelation = async (
    req: any,
    res: Response
) => {
    const { id, intentsId } = req.params;
    const { user_type, id: userId } = req.user;
    const checkUserPermission = await context.prisma.intent_permission
        .findFirst({
            where: {
                intent_id: { equals: parseInt(intentsId) },
                user_id: { equals: parseInt(userId) },
            },
        })
        .then((x) => x)
        .catch((e) => {
            console.log(
                '🚀 ~ file: entitiesWithIntents.controller.ts:92 ~ getIntentsByEntityRolesId ~ e:',
                e
            );
        });
    if (!checkUserPermission && user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'no permission',
            isSuccess: false,
            results: null,
        });
    }

    const result = await context.prisma.intent_entities
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
export const getIntentsForEntitiesIntentsRelation = async (
    req: any,
    res: Response
) => {
    const result = await context.prisma.entities
        .findMany({ where: { active: { equals: true } } })
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
