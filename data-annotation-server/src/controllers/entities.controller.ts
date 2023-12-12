import { Request, Response } from 'express';
import { context } from '../context';
import { checkTextAndReWrite } from '../utils/util';

export const createEntities = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { name, color } = req.body;
    if (!name) {
        return res.status(201).json({
            status_code: 400,
            message: 'Please Fill Name Text Box',
            isSuccess: false,
            results: null,
        });
    }
    if (name.length > 255) {
        return res.status(201).json({
            status_code: 400,
            message: 'Name Too Long',
            isSuccess: false,
            results: null,
        });
    }
    if (!color) {
        return res.status(201).json({
            status_code: 400,
            message: 'Please Set Color',
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
    const normalized_name = checkTextAndReWrite(name);
    const checkName = await context.prisma.entities.findFirst({
        where: {
            normalized_name: {
                equals: normalized_name,
            },
            active: {
                equals: true,
            },
        },
    });
    const checkColor = await context.prisma.entities.findFirst({
        where: {
            color: {
                equals: color,
            },
            active: {
                equals: true,
            },
        },
    });
    if (checkName) {
        return res.status(201).json({
            status_code: 400,
            message: 'This Entity already exists',
            isSuccess: false,
            results: null,
        });
    }
    if (checkColor) {
        return res.status(201).json({
            status_code: 400,
            message: 'This Color already exists',
            isSuccess: false,
            results: null,
        });
    }
    return await context.prisma.entities
        .create({
            data: {
                name,
                color,
                user: {
                    connect: {
                        id: userId,
                    },
                },
                normalized_name,
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
export const getEntities = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { page } = req.params;
    let count: any;
    let result: any;
    const take = 50;
    const skip = parseInt(page) * 50;
    if (user_type === 'ADMIN') {
        const where = {
            active: { equals: true },
        };
        result = await context.prisma.entities
            .findMany({
                where,
                orderBy: {
                    id: 'desc',
                },
                take,
                skip,
            })
            .then((x) => {
                return x;
            })
            .catch((e) => ({
                error: e.message,
            }));

        count = await context.prisma.entities
            .aggregate({
                where,
                _count: { id: true },
            })
            .then((x) => x._count.id)
            .catch((e) => ({
                error: e.message,
            }));
    } else {
        const where = {
            user_id: { equals: userId },
            entities: {
                active: {
                    equals: true,
                },
            },
        };
        result = await context.prisma.enities_permission
            .findMany({
                where,
                include: {
                    entities: true,
                },
                orderBy: {
                    id: 'desc',
                },
                take,
                skip,
            })
            .then((x) => x.map((ele) => ele.entities))
            .catch((e) => {
                console.log(
                    '🚀 ~ file: entities.controller.ts:156 ~ getEntities ~ e:',
                    e
                );
                return {
                    error: e.message,
                };
            });
        count = await context.prisma.enities_permission
            .aggregate({
                where,
                _count: { id: true },
            })
            .then((x) => x._count.id)
            .catch((e) => ({
                error: e.message,
            }));
    }
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
export const getEntitiesById = async (req: Request, res: Response) => {};
