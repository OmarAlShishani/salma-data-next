import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { context } from '../context';
import { appSecret } from '../variables';

const secretKey = appSecret; // Replace with your own secret key

export const authentication = (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(201).json({
                status_code: 400,
                message: 'No token provided',
                isSuccess: false,
                results: null,
            });
        }

        const decoded = jwt.verify(token, secretKey) as { userId: string };
        context.prisma.user
            .findUnique({
                where: {
                    id: parseInt(decoded.userId),
                    active: { equals: true },
                },
            })
            .then((user) => {
                if (!user) {
                    return res.status(201).json({
                        status_code: 400,
                        message: 'Invalid token',
                        isSuccess: false,
                        results: null,
                    });
                }
                req.user = user; // Attach authenticated user to the request object
                next();
            })
            .catch((error) =>
                res.status(201).json({
                    status_code: 400,
                    message: 'Invalid token',
                    isSuccess: false,
                    results: null,
                })
            );
    } catch (error) {
        res.status(201).json({
            status_code: 400,
            message: 'Invalid token',
            isSuccess: false,
            results: null,
        });
    }
};
