import { Request, Response } from 'express';
import { context } from '../context';
import { checkTextAndReWrite } from '../utils/util';

export const createEntityValues = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { entityId, name } = req.body;
    if (!name) {
        return res.status(201).json({
            status_code: 400,
            message: 'Please Fill Entity Value text box',
            isSuccess: false,
            results: null,
        });
    }
    if (name.length > 5000) {
        return res.status(201).json({
            status_code: 400,
            message: 'keyword Too long',
            isSuccess: false,
            results: null,
        });
    }
    if (!entityId) {
        return res.status(201).json({
            status_code: 400,
            message: 'entity Idinvalid',
            isSuccess: false,
            results: null,
        });
    }
    const checkUserPermission =
        await context.prisma.enities_permission.findFirst({
            where: {
                entity_id: { equals: parseInt(entityId) },
                user_id: { equals: userId },
            },
        });
    if (!checkUserPermission && user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'No Permission',
            isSuccess: false,
            results: null,
        });
    }
    const normalized_keyword = checkTextAndReWrite(name);
    const checkName = await context.prisma.entity_value.findFirst({
        where: {
            normalized_keyword: {
                equals: normalized_keyword,
            },
            active: {
                equals: true,
            },
        },
    });
    if (checkName) {
        return res.status(201).json({
            status_code: 400,
            message: 'This entity value already exists',
            isSuccess: false,
            results: null,
        });
    }
    return await context.prisma.entity_value
        .create({
            data: {
                keyword: name,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                entities: {
                    connect: {
                        id: parseInt(entityId),
                    },
                },
                normalized_keyword,
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
};
export const getEntityValues = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { entityId, page } = req.params;

    const checkUserPermission =
        await context.prisma.enities_permission.findFirst({
            where: {
                entity_id: { equals: parseInt(entityId) },
                user_id: { equals: userId },
            },
        });

    if (!checkUserPermission && user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'No Permission',
            isSuccess: false,
            results: null,
        });
    }
    let count: any;
    let result: any;
    const where = {
        active: { equals: true },
        entity_id: { equals: parseInt(entityId) },
    };
    const take = 50;
    const skip = parseInt(page) * 50;
    result = await context.prisma.entity_value
        .findMany({
            where,
            orderBy: {
                id: 'desc',
            },
            take,
            skip,
        })
        .then((x) => x)
        .catch((e) => ({ error: e.message }));
    count = await context.prisma.entity_value
        .aggregate({
            where,
            _count: {
                id: true,
            },
        })
        .then((x) => x._count.id)
        .catch((e) => ({ error: e.message }));

    if (result?.error || count?.error) {
        return res.status(201).json({
            status_code: 400,
            message: result?.error || count?.error,
            isSuccess: false,
            results: null,
        });
    }
    return res.status(201).json({
        status_code: 201,
        message: 'Success',
        isSuccess: true,
        results: { result, count },
    });
};
export const importXlsxFile = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { file, entityId } = req.body;
    const checkUserPermission =
        await context.prisma.enities_permission.findFirst({
            where: {
                entity_id: { equals: parseInt(entityId) },
                user_id: { equals: userId },
            },
        });

    if (!checkUserPermission && user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'No Permission',
            isSuccess: false,
            results: null,
        });
    }

    const result = await Promise.all(
        file.map(
            async ({ id, text }: { id: number; text: string }, i: number) => {
                if (!text) {
                    return {
                        status_code: 400,
                        message: `text ${i} not found`,
                        isSuccess: false,
                        results: null,
                    };
                }
                if (text.length > 5000) {
                    return {
                        status_code: 400,
                        message: `text ${i} too long`,
                        isSuccess: false,
                        results: null,
                    };
                }
                const normalized_keyword = checkTextAndReWrite(text);
                const find = await context.prisma.entity_value.findFirst({
                    where: {
                        normalized_keyword: { equals: normalized_keyword },
                        active: { equals: true },
                    },
                });
                if (!find) {
                    return await context.prisma.entity_value
                        .create({
                            data: {
                                keyword: text,
                                user: {
                                    connect: {
                                        id: userId,
                                    },
                                },
                                entities: {
                                    connect: {
                                        id: parseInt(entityId),
                                    },
                                },
                                normalized_keyword,
                            },
                        })
                        .then((x) => {
                            return {
                                status_code: 201,
                                message: 'Success',
                                isSuccess: true,
                                results: x,
                            };
                        })
                        .catch((e) => {
                            return {
                                status_code: 400,
                                message: 'Server Error',
                                isSuccess: false,
                                results: null,
                            };
                        });
                } else {
                    return {
                        status_code: 400,
                        message: `synonym ${i} already exists`,
                        isSuccess: false,
                        results: null,
                    };
                }
            }
        )
    );

    return res.json(result);
};

export const exportXlsxFile = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { entityId } = req.params;
    const checkUserPermission =
        await context.prisma.smalltalk_permission.findFirst({
            where: {
                smalltalk_id: { equals: parseInt(entityId) },
                user_id: { equals: userId },
            },
        });

    if (!checkUserPermission && user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'No Permission',
            isSuccess: false,
            results: null,
        });
    }
    const result = await context.prisma.entity_value
        .findMany({
            where: {
                active: { equals: true },
                entity_id: { equals: parseInt(entityId) },
            },
            orderBy: {
                id: 'desc',
            },
            select: {
                id: true,
                keyword: true,
            },
        })
        .then((x) => {
            return res.status(201).json({
                status_code: 201,
                message: 'Success',
                isSuccess: true,
                results: [
                    ['id', 'text'],
                    ...x.map((ele) => [ele.id, ele.keyword]),
                ],
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

export const checkPermission = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { entityId } = req.params;
    const checkUserPermission = await context.prisma.enities_permission
        .findFirst({
            where: {
                entity_id: { equals: parseInt(entityId) },
                user_id: { equals: userId },
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

    return checkUserPermission;
};
