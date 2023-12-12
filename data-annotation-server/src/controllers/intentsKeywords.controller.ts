import { Request, Response } from 'express';
import { context } from '../context';
import { checkTextAndReWrite } from '../utils/util';

export const createIntentsKeywords = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { intentsId, keyword, original_word, intentsFlowsId } = req.body;
    if (!keyword) {
        return res.status(201).json({
            status_code: 400,
            message: 'Please Fill Intent Keyword text box',
            isSuccess: false,
            results: null,
        });
    }
    if (keyword.length > 5000) {
        return res.status(201).json({
            status_code: 400,
            message: 'keyword too long',
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
    const normalized_keyword = checkTextAndReWrite(keyword);
    const checkName = await context.prisma.intent_keyword.findFirst({
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
            message: 'This intent keyword text already exists',
            isSuccess: false,
            results: null,
        });
    }
    return await context.prisma.intent_keyword
        .create({
            data: {
                keyword,
                original_word,
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
                normalized_keyword,
            },
        })
        .then(async (x) => {
            if (intentsFlowsId.length) {
                for (let index = 0; index < intentsFlowsId.length; index++) {
                    const element = intentsFlowsId[index];

                    await context.prisma.intent_keyword_flow
                        .create({
                            data: {
                                user: {
                                    connect: {
                                        id: userId,
                                    },
                                },
                                intents: {
                                    connect: {
                                        id: parseInt(intentsId),
                                    },
                                },
                                intent_keyword: {
                                    connect: {
                                        id: x.id,
                                    },
                                },
                                intent_flows: {
                                    connect: {
                                        id: element.value,
                                    },
                                },
                            },
                        })
                        .then((x) => x)
                        .catch((e) => {
                            console.log(
                                '🚀 ~ file: intentsKeywords.controller.ts:108 ~ ).then ~ e:',
                                e.message
                            );
                        });
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
};
export const getIntentsKeywords = async (req: any, res: Response) => {
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
    result = await context.prisma.intent_keyword
        .findMany({
            where,
            orderBy: {
                id: 'desc',
            },
            include: {
                intent_keyword_flow: {
                    include: {
                        intent_flows: {
                            select: {
                                text: true,
                                id: true,
                            },
                        },
                    },
                },
            },
            take,
            skip,
        })
        .then((x) => x)
        .catch((e) => ({ error: e.message }));
    count = await context.prisma.intent_keyword
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
export const getIntentsKeywordsById = async (req: Request, res: Response) => {};
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
        file.map(async ({ Keyword, Flows: flows, ...data }: any, i: number) => {
            const original_word = data['Original Word'];
            if (!Keyword) {
                return {
                    status_code: 400,
                    message: `keyword ${i} is Empty`,
                    isSuccess: false,
                    results: null,
                };
            }
            if (Keyword.length > 5000) {
                return {
                    status_code: 400,
                    message: `keyword ${i} too long`,
                    isSuccess: false,
                    results: null,
                };
            }
            const normalized_keyword = checkTextAndReWrite(Keyword);
            const find = await context.prisma.intent_keyword.findFirst({
                where: {
                    normalized_keyword: { equals: normalized_keyword },
                    active: { equals: true },
                },
            });
            if (!find) {
                const originalWord =
                    original_word === '1' || original_word === 1;
                return await context.prisma.intent_keyword
                    .create({
                        data: {
                            keyword: Keyword,
                            original_word: originalWord,
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
                            normalized_keyword,
                        },
                    })
                    .then(async (x) => {
                        if (flows) {
                            const array =
                                typeof flows === 'string'
                                    ? flows?.split(',')
                                    : flows;
                            const flowsIds = Array.isArray(array)
                                ? array.filter(
                                      (value: any, index: any, self: any) => {
                                          return self.indexOf(value) === index;
                                      }
                                  )
                                : array;
                            if (flowsIds.length) {
                                for (
                                    let index = 0;
                                    index < flowsIds.length;
                                    index++
                                ) {
                                    const element = flowsIds[index];
                                    const checkFlow =
                                        await context.prisma.intent_flows.findUnique(
                                            { where: { id: parseInt(element) } }
                                        );
                                    if (checkFlow) {
                                        await context.prisma.intent_keyword_flow
                                            .create({
                                                data: {
                                                    user: {
                                                        connect: {
                                                            id: userId,
                                                        },
                                                    },
                                                    intents: {
                                                        connect: {
                                                            id: parseInt(
                                                                intentsId
                                                            ),
                                                        },
                                                    },
                                                    intent_keyword: {
                                                        connect: {
                                                            id: x.id,
                                                        },
                                                    },
                                                    intent_flows: {
                                                        connect: {
                                                            id: parseInt(
                                                                element
                                                            ),
                                                        },
                                                    },
                                                },
                                            })
                                            .then((x) => x)
                                            .catch((e) => {
                                                console.log(
                                                    '🚀 ~ file: intentsKeywords.controller.ts:108 ~ ).then ~ e:',
                                                    e.message
                                                );
                                            });
                                    }
                                }
                            }
                        }
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
                        console.log(
                            '🚀 ~ file: intentsKeywords.controller.ts:340 ~ file.map ~ e:',
                            e
                        );
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
                    message: `keyword ${i} already exists`,
                    isSuccess: false,
                    results: null,
                };
            }
        })
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
    const result = await context.prisma.intent_keyword
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
                keyword: true,
                original_word: true,
                intent_keyword_flow: {
                    select: {
                        intent_flows: {
                            select: {
                                id: true,
                            },
                        },
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
                    ['id', 'Keyword', 'Original Word', 'Flows'],
                    ...x.map((ele) => [
                        ele.id,
                        ele.keyword,
                        ele.original_word ? 1 : 0,
                        ele.intent_keyword_flow
                            .map((ele) => ele.intent_flows.id)
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
export const getIntentsFlowsForKeywords = async (req: any, res: Response) => {
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
    const where = {
        active: { equals: true },
        intent_id: { equals: parseInt(intentsId) },
    };

    const result = await context.prisma.intent_flows
        .findMany({
            where,
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
                results: x?.map((ele) => ({ value: ele.id, label: ele.text })),
            });
        })
        .catch((e) =>
            res.status(201).json({
                status_code: 400,
                message: 'Server Error',
                isSuccess: false,
                results: null,
            })
        );
    return result;
    // { value: 'ocean', label: 'Ocean'
};

export const deleteIntentsKeywords = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { id, intentsId } = req.params;
    if (!id) {
        return res.status(201).json({
            status_code: 400,
            message: 'Intent Keyword Id not Fount',
            isSuccess: false,
            results: null,
        });
    }
    if (!intentsId) {
        return res.status(201).json({
            status_code: 400,
            message: 'Intent Id not Fount',
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
    const result = await context.prisma.intent_keyword
        .update({
            where: {
                id: parseInt(id),
            },
            data: {
                active: {
                    set: false,
                },
                user_intent_keyword_deleted_byTouser: {
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

export const updateIntentsKeywords = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { id, intentsId } = req.params;
    const { keyword, original_word, intentsFlowsId } = req.body;
    if (!id) {
        return res.status(201).json({
            status_code: 400,
            message: 'Intents Keyword Id not Fount',
            isSuccess: false,
            results: null,
        });
    }
    if (!intentsId) {
        return res.status(201).json({
            status_code: 400,
            message: 'Intents Id not Fount',
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
    if (!keyword) {
        return res.status(201).json({
            status_code: 400,
            message: 'Intents Keyword not Fount',
            isSuccess: false,
            results: null,
        });
    }
    if (keyword?.length > 5000) {
        return res.status(201).json({
            status_code: 400,
            message: 'keyword too long',
            isSuccess: false,
            results: null,
        });
    }
    const normalized_keyword = checkTextAndReWrite(keyword);
    const checkName = (await context.prisma.intent_keyword.findFirst({
        where: {
            normalized_keyword: {
                equals: normalized_keyword,
            },
            active: {
                equals: true,
            },
        },
    })) as any;

    if (checkName && checkName?.id !== parseInt(id)) {
        return res.status(201).json({
            status_code: 400,
            message: 'This intent keyword text already exists',
            isSuccess: false,
            results: null,
        });
    }
    const result = await context.prisma.intent_keyword
        .update({
            where: {
                id: parseInt(id),
            },
            data: {
                keyword: {
                    set: keyword,
                },
                normalized_keyword: { set: normalized_keyword },
                original_word: {
                    set: original_word,
                },
                user_intent_keyword_modified_byTouser: {
                    connect: {
                        id: userId,
                    },
                },
            },
            include: {
                intent_keyword_flow: {
                    include: {
                        intent_flows: {
                            select: {
                                text: true,
                                id: true,
                            },
                        },
                    },
                },
            },
        })
        .then(async (x) => {
            const standardData = x?.intent_keyword_flow?.map(
                (ele) => ele?.intent_flows?.id
            );
            const newData = intentsFlowsId?.map((ele: any) => ele?.value);
            const addIntentFlows = newData.filter(
                (ele: any) => !standardData.includes(ele)
            );
            const deleteIntentFlows = x?.intent_keyword_flow?.filter(
                (ele: any) => !newData.includes(ele?.intent_flows?.id)
            );
            if (addIntentFlows?.length) {
                for (let index = 0; index < addIntentFlows.length; index++) {
                    const flow_id = addIntentFlows[index];
                    await context.prisma.intent_keyword_flow
                        .create({
                            data: {
                                user: {
                                    connect: {
                                        id: userId,
                                    },
                                },
                                intents: {
                                    connect: {
                                        id: parseInt(intentsId),
                                    },
                                },
                                intent_keyword: {
                                    connect: {
                                        id: x.id,
                                    },
                                },
                                intent_flows: {
                                    connect: {
                                        id: flow_id,
                                    },
                                },
                            },
                        })
                        .then((x) => x)
                        .catch((e) => {
                            console.log(
                                '🚀 ~ file: intentsKeywords.controller.ts:760 ~ .then ~ e:',
                                e
                            );
                        });
                }
            }
            if (deleteIntentFlows?.length) {
                for (let index = 0; index < deleteIntentFlows.length; index++) {
                    const { id } = deleteIntentFlows[index];
                    await context.prisma.intent_keyword_flow
                        .delete({
                            where: {
                                id,
                            },
                        })
                        .then((x) => x)
                        .catch((e) => {
                            console.log(
                                '🚀 ~ file: intentsKeywords.controller.ts:760 ~ .then ~ e:',
                                e
                            );
                        });
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
            console.log(
                '🚀 ~ file: intentsKeywords.controller.ts:738 ~ updateIntentsKeywords ~ e:',
                e
            );
            return res.status(201).json({
                status_code: 400,
                message: 'Server Error',
                isSuccess: false,
                results: null,
            });
        });
    return result;
};
