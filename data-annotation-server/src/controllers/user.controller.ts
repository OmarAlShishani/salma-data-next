import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { appSecret } from '../variables';
import { context } from '../context';
import { Prisma } from '@prisma/client';

export const createUser = async (req: any, res: Response) => {
    let { name, username, email, password, user_type } = req?.body;
    username = username?.toLowerCase();
    const { user_type: user_typeRple, id: userId } = req.user;
    if (user_typeRple !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'No Permission',
            isSuccess: false,
            results: null,
        });
    }
    // Password must be at least 8 characters long
    const message = [];
    if (!password?.length) {
        message.push('Password Required');
    }
    if (password?.length < 6) {
        message.push('Password is Short');
    }
    if (!username) {
        message.push('User Name Required');
    }
    if (!name) {
        message.push('Name Required');
    }
    if (!email) {
        message.push('Email Required');
    }
    if (message.length) {
        return res.status(201).json({
            status_code: 400,
            message: message.join(', '),
            isSuccess: false,
            results: null,
        });
    }

    const userExists = await context.prisma.user
        .findUnique({
            where: {
                username,
            },
            select: {
                id: true,
            },
        })
        .then((x) => x)
        .catch((e) => e);

    if (userExists?.id) {
        return res.status(201).json({
            status_code: 400,
            message: 'Sorry, the name is already registered',
            isSuccess: false,
            results: null,
        });
    } else {
        const userExists = await context.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
            },
        });
        if (userExists?.id) {
            return res.status(201).json({
                status_code: 400,
                message: 'Sorry, the email is already registered',
                isSuccess: false,
                results: null,
            });
        }
    }
    const hashWithBcrypt = await bcrypt.hash(password, 14);
    return await context.prisma.user
        .create({
            data: {
                username,
                email,
                password: hashWithBcrypt,
                name,
                ...(user_type && { user_type }),
            } as Prisma.userCreateInput,
        })
        .then((result) => {
            res.status(201).json({
                status_code: 201,
                message: 'Success',
                isSuccess: true,
                results: {
                    token: jwt.sign(
                        {
                            userId: result.id,
                            userName: result?.username,
                            userType: result?.user_type,
                        },
                        appSecret
                    ),
                    result,
                },
            });
        })
        .catch((e) =>
            res.status(201).json({
                status_code: 400,
                message: e?.message,
                isSuccess: false,
                results: null,
            })
        );
};

export const getUsers = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    if (user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'No Permission',
            isSuccess: false,
            results: null,
        });
    }
    return await context.prisma.user
        .findMany({
            orderBy: {
                id: 'desc',
            },
        })
        .then((result) => {
            return res.status(201).json({
                status_code: 201,
                message: 'Success',
                isSuccess: true,
                results: result,
            });
        })
        .catch((e) =>
            res.status(201).json({
                status_code: 400,
                message: e?.message,
                isSuccess: false,
                results: null,
            })
        );
};

export const updateUser = async (req: any, res: Response) => {
    const { user_type, id: userId } = req.user;
    const { id } = req.params;
    const { data } = req.body;
    if (user_type !== 'ADMIN') {
        return res.status(201).json({
            status_code: 400,
            message: 'No Permission',
            isSuccess: false,
            results: null,
        });
    }
    return await context.prisma.user
        .update({
            where: { id: parseInt(id) },
            data: {
                ...data,
                user_user_blocked_byTouser: {
                    connect: {
                        id: parseInt(id),
                    },
                },
            },
        })
        .then((result) => {
            return res.status(201).json({
                status_code: 201,
                message: 'Success',
                isSuccess: true,
                results: result,
            });
        })
        .catch((e) => {
            return res.status(201).json({
                status_code: 400,
                message: e?.message,
                isSuccess: false,
                results: null,
            });
        });
};
