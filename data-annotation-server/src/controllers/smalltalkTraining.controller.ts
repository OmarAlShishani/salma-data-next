import { Request, Response } from 'express';
import { context } from '../context';
import { checkTextAndReWrite } from '../utils/util';

export const createSmalltalkTraining = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { smalltalkId, text } = req.body;
    if (!text) {
        return res.status(201).json({
            status_code: 400,
            message: 'Please Fill Small Talk Trining Name text box',
            isSuccess: false,
            results: null,
        });
    }
    if (text.length > 5000) {
        return res.status(201).json({
            status_code: 400,
            message: 'Text Too long',
            isSuccess: false,
            results: null,
        });
    }
    if (!smalltalkId) {
        return res.status(201).json({
            status_code: 400,
            message: 'Small Talk Id invalid',
            isSuccess: false,
            results: null,
        });
    }
    const checkUserPermission =
        await context.prisma.smalltalk_permission.findFirst({
            where: {
                smalltalk_id: { equals: parseInt(smalltalkId) },
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
    const checkName = await context.prisma.smalltalk_training_phrases.findFirst(
        {
            where: {
                normalized_text: {
                    equals: normalized_text,
                },
                active: {
                    equals: true,
                },
            },
        }
    );
    if (checkName) {
        return res.status(201).json({
            status_code: 400,
            message: 'This small talks training already exists',
            isSuccess: false,
            results: null,
        });
    }
    return await context.prisma.smalltalk_training_phrases
        .create({
            data: {
                text,
                smalltalks: {
                    connect: {
                        id: parseInt(smalltalkId),
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
export const getSmalltalkTraining = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { smalltalkId, page } = req.params;

    const checkUserPermission =
        await context.prisma.smalltalk_permission.findFirst({
            where: {
                smalltalk_id: { equals: parseInt(smalltalkId) },
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
        smalltalk_id: { equals: parseInt(smalltalkId) },
    };
    const take = 50;
    const skip = parseInt(page) * 50;
    result = await context.prisma.smalltalk_training_phrases
        .findMany({
            where,
            orderBy: {
                id: 'desc',
            },
            take,
            skip,
        })
        .then((x) => x)
        .catch((e) => ({
            error: e.message,
        }));
    count = await context.prisma.smalltalk_training_phrases
        .aggregate({
            where,
            _count: {
                id: true,
            },
        })
        .then((x) => x._count.id)
        .catch((e) => ({
            error: e.message,
        }));

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
export const getSmalltalkTrainingById = async (
    req: Request,
    res: Response
) => {};

export const importXlsxFile = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { file, smalltalkId } = req.body;
    const checkUserPermission =
        await context.prisma.smalltalk_permission.findFirst({
            where: {
                smalltalk_id: { equals: parseInt(smalltalkId) },
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
                        message: `text ${i} is Empty`,
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
                    await context.prisma.smalltalk_training_phrases.findFirst({
                        where: {
                            normalized_text: { equals: normalized_text },
                            active: { equals: true },
                        },
                    });
                if (!find) {
                    return await context.prisma.smalltalk_training_phrases
                        .create({
                            data: {
                                text,
                                smalltalks: {
                                    connect: {
                                        id: parseInt(smalltalkId),
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
                        .then((x) => {
                            return {
                                status_code: 201,
                                message: `Success ${i}`,
                                isSuccess: true,
                                results: x,
                            };
                        })
                        .catch((e) => {
                            return {
                                status_code: 400,
                                message: `Server Error ${i}`,
                                isSuccess: false,
                                results: null,
                            };
                        });
                } else {
                    return {
                        status_code: 400,
                        message: `training text ${i} already exists`,
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
    const { smalltalkId } = req.params;
    const checkUserPermission =
        await context.prisma.smalltalk_permission.findFirst({
            where: {
                smalltalk_id: { equals: parseInt(smalltalkId) },
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
    const result = await context.prisma.smalltalk_training_phrases
        .findMany({
            where: {
                active: { equals: true },
                smalltalk_id: { equals: parseInt(smalltalkId) },
            },
            orderBy: {
                id: 'desc',
            },
            select: {
                id: true,
                text: true,
            },
        })
        .then((x) => {
            return res.status(201).json({
                status_code: 201,
                message: 'Success',
                isSuccess: true,
                results: [
                    ['id', 'text'],
                    ...x.map((ele) => [ele.id, ele.text]),
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
    const { smalltalkId } = req.params;
    const checkUserPermission = await context.prisma.smalltalk_permission
        .findFirst({
            where: {
                smalltalk_id: { equals: parseInt(smalltalkId) },
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

export const deleteSmalltalkTraining = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { id, smalltalkId } = req.params;
    if (!id) {
        return res.status(201).json({
            status_code: 400,
            message: 'Small talk Training Id not Fount',
            isSuccess: false,
            results: null,
        });
    }
    if (!smalltalkId) {
        return res.status(201).json({
            status_code: 400,
            message: 'Small talk Id not Fount',
            isSuccess: false,
            results: null,
        });
    }

    const checkUserPermission =
        await context.prisma.smalltalk_permission.findFirst({
            where: {
                smalltalk_id: { equals: parseInt(smalltalkId) },
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
    const result = await context.prisma.smalltalk_training_phrases
        .update({
            where: {
                id: parseInt(id),
            },
            data: {
                active: {
                    set: false,
                },
                user_smalltalk_training_phrases_deleted_byTouser: {
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

export const updateSmalltalkTraining = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { id, smalltalkId } = req.params;
    const { data } = req.body;
    if (!id) {
        return res.status(201).json({
            status_code: 400,
            message: 'Small talk Training Id not Fount',
            isSuccess: false,
            results: null,
        });
    }
    if (!smalltalkId) {
        return res.status(201).json({
            status_code: 400,
            message: 'Small talk Id not Fount',
            isSuccess: false,
            results: null,
        });
    }
    if (!data) {
        return res.status(201).json({
            status_code: 400,
            message: 'Data not Fount',
            isSuccess: false,
            results: null,
        });
    }

    const checkUserPermission =
        await context.prisma.smalltalk_permission.findFirst({
            where: {
                smalltalk_id: { equals: parseInt(smalltalkId) },
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
            message: 'Text Not Found',
            isSuccess: false,
            results: null,
        });
    }
    if (data.text.set.length > 5000) {
        return res.status(201).json({
            status_code: 400,
            message: 'Text Too long',
            isSuccess: false,
            results: null,
        });
    }
    const normalized_text = checkTextAndReWrite(data.text.set);
    const checkName =
        (await context.prisma.smalltalk_training_phrases.findFirst({
            where: {
                normalized_text: {
                    equals: normalized_text,
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
            message: 'This small talks training already exists',
            isSuccess: false,
            results: null,
        });
    }
    const result = await context.prisma.smalltalk_training_phrases
        .update({
            where: {
                id: parseInt(id),
            },
            data: {
                ...data,
                normalized_text: {
                    set: normalized_text,
                },
                user_smalltalk_training_phrases_modified_byTouser: {
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
