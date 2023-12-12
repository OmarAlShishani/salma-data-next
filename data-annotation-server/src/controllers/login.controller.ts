import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { appSecret } from '../variables';
import { context } from '../context';

export const login = async (req: Request, res: Response) => {
    let { username = '', password = '' } = req?.body;
    username = username?.toLowerCase();

    if (!password) {
        return res.status(201).json({
            status_code: 400,
            message: `Enter Password`,
            isSuccess: false,
            results: null,
        });
    }

    const theUser = await context.prisma.user
        .findFirst({
            where: {
                OR: [
                    { email: { equals: username } },
                    { username: { equals: username } },
                ],
                active: {
                    equals: true,
                },
            },
        })
        .then((x) => x)
        .catch((e) => e);

    if (!theUser || !theUser.password) {
        return res.status(201).json({
            status_code: 400,
            message: `${username} Not Found`,
            isSuccess: false,
            results: null,
        });
    }

    let isValidPassword = false;

    if (theUser.password) {
        isValidPassword = await bcrypt.compare(password, theUser.password);
    }

    if (!isValidPassword) {
        return res.status(201).json({
            status_code: 400,
            message: 'Wrong Password',
            isSuccess: false,
            results: null,
        });
    }
    const { password: rr, ...restUser } = theUser;
    return res.status(201).json({
        status_code: 201,
        message: 'Success',
        isSuccess: true,
        results: {
            token: jwt.sign({ userId: theUser.id }, appSecret),
            user: restUser,
        },
    });
};
