import { Request, Response } from 'express';
import { context } from '../context';
import { checkTextAndReWrite } from '../utils/util';

export const createIntentsTesting = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { intentsId, text, entities } = req.body;
    if (!text) {
        return res.status(201).json({
            status_code: 400,
            message: 'Please Fill Intent Testing text box',
            isSuccess: false,
            results: null,
        });
    }
    if (text.length > 5000) {
        return res.status(201).json({
            status_code: 400,
            message: 'Text too long',
            isSuccess: false,
            results: null,
        });
    }
    if (!intentsId) {
        return res.status(201).json({
            status_code: 400,
            message: 'intents Id invalid',
            isSuccess: false,
            results: null,
        });
    }
    if (
        !Object.keys(entities?.[0].entity).length ||
        !Object.keys(entities?.[0].entityValue).length
    ) {
        return res.status(201).json({
            status_code: 400,
            message: 'please add entities',
            isSuccess: false,
            results: null,
        });
    }
    const checkUserPermission =
        await context.prisma.intent_permission.findFirst({
            where: {
                intent_id: { equals: parseInt(intentsId) },
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
    const normalized_text = checkTextAndReWrite(text);
    const checkName = await context.prisma.intent_testing_phrases.findFirst({
        where: {
            normalized_text: {
                equals: normalized_text,
            },
            active: {
                equals: true,
            },
        },
    });
    if (checkName) {
        return res.status(201).json({
            status_code: 400,
            message: 'This intent testing already exists',
            isSuccess: false,
            results: null,
        });
    }
    return await context.prisma.intent_testing_phrases
        .create({
            data: {
                text,
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
                normalized_text,
            },
        })
        .then(async (x) => {
            for (let index = 0; index < entities.length; index++) {
                const {
                    entityValue: { id: entity_value_id },
                    entity: { id: entity_id },
                } = entities[index];
                await context.prisma.intent_testing_phrase_expected
                    .create({
                        data: {
                            entity_value: {
                                connect: {
                                    id: parseInt(entity_value_id),
                                },
                            },
                            intents: {
                                connect: {
                                    id: parseInt(intentsId),
                                },
                            },
                            entities: {
                                connect: {
                                    id: parseInt(entity_id),
                                },
                            },
                            intent_testing_phrases: {
                                connect: {
                                    id: x.id,
                                },
                            },
                            user: {
                                connect: {
                                    id: userId,
                                },
                            },
                        },
                    })
                    .then((x) => x)
                    .catch((e) => {
                        console.log(
                            '🚀 ~ file: intentsTesting.controller.ts:126 ~ .then ~ e:',
                            e
                        );
                    });
            }
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
export const getIntentsTesting = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { intentsId, page } = req.params;

    const checkUserPermission =
        await context.prisma.intent_permission.findFirst({
            where: {
                intent_id: { equals: parseInt(intentsId) },
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
        intent_id: { equals: parseInt(intentsId) },
    };
    const take = 50;
    const skip = parseInt(page) * 50;
    result = await context.prisma.intent_testing_phrases
        .findMany({
            where,
            orderBy: {
                id: 'desc',
            },
            include: {
                intent_testing_phrase_expected: {
                    include: {
                        entities: true,
                        entity_value: true,
                    },
                },
            },
            take,
            skip,
        })
        .then((x) => x)
        .catch((e) => ({ error: e.message }));
    count = await context.prisma.intent_testing_phrases
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
export const getIntentsTestingById = async (req: Request, res: Response) => {};
export const importXlsxFile = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { file, intentsId } = req.body;
    const checkUserPermission =
        await context.prisma.intent_permission.findFirst({
            where: {
                intent_id: { equals: parseInt(intentsId) },
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
            async (
                { text, expected }: { text: string; expected: string },
                i: number
            ) => {
                if (!text) {
                    return {
                        status_code: 400,
                        message: `text ${i} is Empty`,
                        isSuccess: false,
                        results: null,
                    };
                }
                if (!expected) {
                    return {
                        status_code: 400,
                        message: `expected ${i} is Empty`,
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
                const normalized_text = checkTextAndReWrite(text);
                const find =
                    await context.prisma.intent_testing_phrases.findFirst({
                        where: {
                            normalized_text: { equals: normalized_text },
                            active: { equals: true },
                        },
                    });
                if (!find) {
                    return await context.prisma.intent_testing_phrases
                        .create({
                            data: {
                                text,
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
                                normalized_text,
                            },
                        })
                        .then(async (x) => {
                            if (expected) {
                                const array =
                                    typeof expected === 'string'
                                        ? expected?.split(',')
                                        : expected;
                                const entities = Array.isArray(array)
                                    ? array.filter(
                                          (
                                              value: any,
                                              index: any,
                                              self: any
                                          ) => {
                                              return (
                                                  self.indexOf(value) === index
                                              );
                                          }
                                      )
                                    : array;
                                if (entities.length) {
                                    const entities = expected.split(',');
                                    for (
                                        let index = 0;
                                        index < entities.length;
                                        index++
                                    ) {
                                        const [entityId, entityValueId] =
                                            entities[index].split('-');
                                        const entity =
                                            await context.prisma.entities.findUnique(
                                                {
                                                    where: {
                                                        id: parseInt(entityId),
                                                    },
                                                    select: {
                                                        id: true,
                                                    },
                                                }
                                            );
                                        const entityValue =
                                            await context.prisma.entity_value.findUnique(
                                                {
                                                    where: {
                                                        id: parseInt(
                                                            entityValueId
                                                        ),
                                                    },
                                                    select: {
                                                        id: true,
                                                    },
                                                }
                                            );
                                        const entity_id = entity?.id;
                                        const entity_value_id = entityValue?.id;
                                        if (entity_id && entity_value_id) {
                                            await context.prisma.intent_testing_phrase_expected.create(
                                                {
                                                    data: {
                                                        entity_value: {
                                                            connect: {
                                                                id: entity_value_id,
                                                            },
                                                        },
                                                        intents: {
                                                            connect: {
                                                                id: parseInt(
                                                                    intentsId
                                                                ),
                                                            },
                                                        },
                                                        entities: {
                                                            connect: {
                                                                id: entity_id,
                                                            },
                                                        },
                                                        intent_testing_phrases:
                                                            {
                                                                connect: {
                                                                    id: x.id,
                                                                },
                                                            },
                                                        user: {
                                                            connect: {
                                                                id: userId,
                                                            },
                                                        },
                                                    },
                                                }
                                            );
                                        }
                                    }
                                }
                            }
                            return x;
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
                        message: `testing text ${i} already exists`,
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
    const { intentsId } = req.params;
    const checkUserPermission =
        await context.prisma.intent_permission.findFirst({
            where: {
                intent_id: { equals: parseInt(intentsId) },
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
    const result = await context.prisma.intent_testing_phrases
        .findMany({
            where: {
                active: { equals: true },
                intent_id: { equals: parseInt(intentsId) },
            },
            orderBy: {
                id: 'desc',
            },
            select: {
                id: true,
                text: true,
                intent_testing_phrase_expected: {
                    include: {
                        entity_value: true,
                    },
                },
            },
        })
        .then((x) => {
            return res.status(201).json({
                status_code: 201,
                message: 'Success',
                isSuccess: true,
                results: [
                    ['id', 'text', 'expected'],
                    ...x.map((ele) => [
                        ele.id,
                        ele.text,
                        ele.intent_testing_phrase_expected
                            .map(
                                (ele) =>
                                    `${ele.entity_id}-${ele.entity_value_id}`
                            )
                            .join(','),
                    ]),
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
    const { intentsId } = req.params;
    const checkUserPermission = await context.prisma.intent_permission
        .findFirst({
            where: {
                intent_id: { equals: parseInt(intentsId) },
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

export const deleteIntentsTesting = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { id, intentsId } = req.params;
    if (!id) {
        return res.status(201).json({
            status_code: 400,
            message: 'intent Testing Id not Fount',
            isSuccess: false,
            results: null,
        });
    }
    if (!intentsId) {
        return res.status(201).json({
            status_code: 400,
            message: 'intent Id not Fount',
            isSuccess: false,
            results: null,
        });
    }

    const checkUserPermission =
        await context.prisma.intent_permission.findFirst({
            where: {
                intent_id: { equals: parseInt(intentsId) },
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
    const result = await context.prisma.intent_testing_phrases
        .update({
            where: {
                id: parseInt(id),
            },
            data: {
                active: {
                    set: false,
                },
                user_intent_testing_phrases_deleted_byTouser: {
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

export const updateIntentsTesting = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { id, intentsId } = req.params;
    const { data, entities, deleteEntities } = req.body;
    if (!id) {
        return res.status(201).json({
            status_code: 400,
            message: 'intent Testing Id not Fount',
            isSuccess: false,
            results: null,
        });
    }
    if (!intentsId) {
        return res.status(201).json({
            status_code: 400,
            message: 'intent Id not Fount',
            isSuccess: false,
            results: null,
        });
    }

    const checkUserPermission =
        await context.prisma.intent_permission.findFirst({
            where: {
                intent_id: { equals: parseInt(intentsId) },
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
    if (!data.text.set) {
        return res.status(201).json({
            status_code: 400,
            message: 'Text not found',
            isSuccess: false,
            results: null,
        });
    }
    if (data.text.set.length > 5000) {
        return res.status(201).json({
            status_code: 400,
            message: 'Text too long',
            isSuccess: false,
            results: null,
        });
    }
    const normalized_text = checkTextAndReWrite(data.text.set);
    const checkName = (await context.prisma.intent_testing_phrases.findFirst({
        where: {
            normalized_text: {
                equals: normalized_text,
            },
            active: {
                equals: true,
            },
        },
    })) as any;
    if (
        checkName?.id === parseInt(id) &&
        !deleteEntities.length &&
        !Object.keys(entities?.[0].entity).length &&
        !Object.keys(deleteEntities?.[0].entity).length
    ) {
        return res.status(201).json({
            status_code: 400,
            message: '',
            isSuccess: true,
            results: null,
        });
    }
    if (checkName && checkName?.id !== parseInt(id)) {
        return res.status(201).json({
            status_code: 400,
            message: 'This intent testing already exists',
            isSuccess: false,
            results: null,
        });
    }
    const result = await context.prisma.intent_testing_phrases
        .update({
            where: {
                id: parseInt(id),
            },
            data: {
                ...data,
                normalized_text: {
                    set: normalized_text,
                },
                user_intent_testing_phrases_modified_byTouser: {
                    connect: {
                        id: userId,
                    },
                },
            },
            include: {
                intent_testing_phrase_expected: true,
            },
        })
        .then(async (x) => {
            if (entities.length) {
                for (let index = 0; index < entities.length; index++) {
                    const {
                        id,
                        entityValue: { id: entity_value_id },
                        entity: { id: entity_id },
                    } = entities[index];
                    if ((!entity_value_id && !entity_id) || id) continue;
                    await context.prisma.intent_testing_phrase_expected
                        .create({
                            data: {
                                entity_value: {
                                    connect: {
                                        id: parseInt(entity_value_id),
                                    },
                                },
                                intents: {
                                    connect: {
                                        id: parseInt(intentsId),
                                    },
                                },
                                entities: {
                                    connect: {
                                        id: parseInt(entity_id),
                                    },
                                },
                                intent_testing_phrases: {
                                    connect: {
                                        id: x.id,
                                    },
                                },
                                user: {
                                    connect: {
                                        id: userId,
                                    },
                                },
                            },
                        })
                        .then((x) => x)
                        .catch((e) => {
                            console.log(
                                '🚀 ~ file: intentsTesting.controller.ts:126 ~ .then ~ e:',
                                e
                            );
                        });
                }
            }
            if (deleteEntities.length) {
                if (
                    x.intent_testing_phrase_expected.length <= 1 &&
                    Object.keys(entities?.[0]?.entityValue)?.length === 0
                ) {
                    return res.status(201).json({
                        status_code: 400,
                        message: 'You Cant Remove All Expected',
                        isSuccess: false,
                        results: null,
                    });
                } else {
                    for (
                        let index = 0;
                        index < deleteEntities.length;
                        index++
                    ) {
                        const { id } = deleteEntities[index];
                        if (!id) continue;
                        await context.prisma.intent_testing_phrase_expected
                            .delete({
                                where: { id },
                            })
                            .then((x) => x)
                            .catch((e) => {
                                console.log(
                                    '🚀 ~ file: intentsTesting.controller.ts:691 ~ updateIntentsTesting ~ e:',
                                    e
                                );
                            });
                    }
                }
            }
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

export const getAllEntities = async (req: any, res: Response) => {
    const { intentsId } = req.params;
    return await context.prisma.intent_entities
        .findMany({
            where: {
                intent_id: {
                    equals: parseInt(intentsId),
                },
                active: {
                    equals: true,
                },
            },
            select: {
                entities: true,
            },
        })
        .then((x) => {
            return res.status(201).json({
                status_code: 201,
                message: 'Success',
                isSuccess: true,
                results: x.map((ele) => ele.entities),
            });
        })
        .catch((e) => {
            console.log(
                '🚀 ~ file: intentsTesting.controller.ts:677 ~ getAllEntities ~ e:',
                e
            );
            return res.status(201).json({
                status_code: 400,
                message: 'Server Error',
                isSuccess: false,
                results: null,
            });
        });
};

export const getEntityValuesByEntityId = async (req: any, res: Response) => {
    const { entityId } = req.params;
    return await context.prisma.entity_value
        .findMany({
            where: {
                entity_id: {
                    equals: parseInt(entityId),
                },
                active: {
                    equals: true,
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
};
