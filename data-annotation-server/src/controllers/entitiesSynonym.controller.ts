import { Request, Response } from 'express';
import { context } from '../context';
import { checkTextAndReWrite } from '../utils/util';

export const createEntitiesSynonym = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { entityId, entityValueId, text } = req.body;
    if (!text) {
        return res.status(201).json({
            status_code: 400,
            message: 'Please Fill synonym Text Box',
            isSuccess: false,
            results: null,
        });
    }
    if (text.length > 5000) {
        return res.status(201).json({
            status_code: 400,
            message: 'synonym test too long',
            isSuccess: false,
            results: null,
        });
    }
    if (!entityId) {
        return res.status(201).json({
            status_code: 400,
            message: 'Entity Id invalid',
            isSuccess: false,
            results: null,
        });
    }
    if (!entityValueId) {
        return res.status(201).json({
            status_code: 400,
            message: 'Entity Value Id invalid',
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
    const normalized_synonym = checkTextAndReWrite(text);
    const checkName = await context.prisma.entity_value_synonym.findFirst({
        where: {
            normalized_synonym: {
                equals: normalized_synonym,
            },
            active: {
                equals: true,
            },
        },
    });
    if (checkName) {
        return res.status(201).json({
            status_code: 400,
            message: 'This Synonym already exists',
            isSuccess: false,
            results: null,
        });
    }
    return await context.prisma.entity_value_synonym
        .create({
            data: {
                synonym: text,
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
                entity_value: {
                    connect: {
                        id: parseInt(entityValueId),
                    },
                },
                normalized_synonym,
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

export const getEntitiesSynonym = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { entityId, entityValueId, page } = req.params;

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
        entity_value_id: { equals: parseInt(entityValueId) },
    };
    const take = 50;
    const skip = parseInt(page) * 50;
    result = await context.prisma.entity_value_synonym
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
    count = await context.prisma.entity_value_synonym
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
    const { file, entityId, entityValueId } = req.body;
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
                        message: `synonym ${i} not found`,
                        isSuccess: false,
                        results: null,
                    };
                }
                if (text.length > 5000) {
                    return {
                        status_code: 400,
                        message: `synonym ${i} too long`,
                        isSuccess: false,
                        results: null,
                    };
                }
                const normalized_synonym = checkTextAndReWrite(text);
                const find =
                    await context.prisma.entity_value_synonym.findFirst({
                        where: {
                            normalized_synonym: { equals: normalized_synonym },
                            active: { equals: true },
                        },
                    });
                if (!find) {
                    return await context.prisma.entity_value_synonym
                        .create({
                            data: {
                                synonym: text,
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
                                entity_value: {
                                    connect: {
                                        id: parseInt(entityValueId),
                                    },
                                },
                                normalized_synonym,
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
    const { entityId, entityValueId } = req.params;
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
    const result = await context.prisma.entity_value_synonym
        .findMany({
            where: {
                active: { equals: true },
                entity_id: { equals: parseInt(entityId) },
                entity_value_id: { equals: parseInt(entityValueId) },
            },
            orderBy: {
                id: 'desc',
            },
            select: {
                id: true,
                synonym: true,
            },
        })
        .then((x) => {
            return res.status(201).json({
                status_code: 201,
                message: 'Success',
                isSuccess: true,
                results: [
                    ['id', 'text'],
                    ...x.map((ele) => [ele.id, ele.synonym]),
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

export const deleteEntitiesSynonym = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { id, entityId } = req.params;
    if (!id) {
        return res.status(201).json({
            status_code: 400,
            message: 'Entities Synonym Id not Fount',
            isSuccess: false,
            results: null,
        });
    }
    if (!entityId) {
        return res.status(201).json({
            status_code: 400,
            message: 'Entity Id not Fount',
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
    const result = await context.prisma.entity_value_synonym
        .update({
            where: {
                id: parseInt(id),
            },
            data: {
                active: {
                    set: false,
                },
                user_entity_value_synonym_deleted_byTouser: {
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

export const updateEntitiesSynonym = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { id, entityId } = req.params;
    const { data } = req.body;

    if (!id) {
        return res.status(201).json({
            status_code: 400,
            message: 'Entities Synonym Id not Fount',
            isSuccess: false,
            results: null,
        });
    }
    if (!entityId) {
        return res.status(201).json({
            status_code: 400,
            message: 'Entity Id not Fount',
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
    if (!data.synonym.set) {
        return res.status(201).json({
            status_code: 400,
            message: 'synonym not found',
            isSuccess: false,
            results: null,
        });
    }
    if (data.synonym.set.length > 5000) {
        return res.status(201).json({
            status_code: 400,
            message: 'synonym too long',
            isSuccess: false,
            results: null,
        });
    }
    const normalized_synonym = checkTextAndReWrite(data.synonym.set);
    const checkName = (await context.prisma.entity_value_synonym.findFirst({
        where: {
            normalized_synonym: {
                equals: normalized_synonym,
            },
            active: {
                equals: true,
            },
        },
    })) as any;
    if (checkName?.id === parseInt(id)) {
        return res.status(201).json({
            status_code: 400,
            message: '',
            isSuccess: true,
            results: null,
        });
    }
    if (checkName) {
        return res.status(201).json({
            status_code: 400,
            message: 'This Synonym already exists',
            isSuccess: false,
            results: null,
        });
    }
    const result = await context.prisma.entity_value_synonym
        .update({
            where: {
                id: parseInt(id),
            },
            data: {
                ...data,
                normalized_synonym: {
                    set: normalized_synonym,
                },
                user_entity_value_synonym_modified_byTouser: {
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
