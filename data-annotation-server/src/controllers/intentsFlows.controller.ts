import { Request, Response } from 'express';
import { context } from '../context';
import { checkTextAndReWrite } from '../utils/util';

export const createIntentsFlows = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { intentsId, text } = req.body;
    if (!text) {
        return res.status(201).json({
            status_code: 400,
            message: 'Please Fill Flow Text text box',
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
            message: 'Intents Id invalid',
            isSuccess: false,
            results: null,
        });
    }
    if (user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'No Permission',
            isSuccess: false,
            results: null,
        });
    }
    const normalized_text = checkTextAndReWrite(text);
    const checkName = await context.prisma.intent_flows.findFirst({
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
            message: 'This intent flows text already exists',
            isSuccess: false,
            results: null,
        });
    }
    return await context.prisma.intent_flows
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
export const getIntentsFlows = async (req: any, res: Response) => {
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
    result = await context.prisma.intent_flows
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
    count = await context.prisma.intent_flows
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
export const getIntentsFlowsById = async (req: Request, res: Response) => {};
export const importXlsxFile = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { file, intentsId } = req.body;

    if (user_type !== 'ADMIN') {
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
                const find = await context.prisma.intent_flows.findFirst({
                    where: {
                        normalized_text: { equals: normalized_text },
                        active: { equals: true },
                    },
                });
                if (!find) {
                    return await context.prisma.intent_flows
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
                        message: `flow text ${i} already exists`,
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

    if (user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'No Permission',
            isSuccess: false,
            results: null,
        });
    }
    const result = await context.prisma.intent_flows
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
