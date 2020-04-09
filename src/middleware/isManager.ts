import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Request, Response, NextFunction } from 'express';
import { getEnvironmentVariableString } from '../services/environmentVariable';
import { UserJWTPayload } from '../types/user';

export const isManager = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ msg: 'No token' });
    }

    try {
        if (token.length > 20) token = token.split(' ')[1];
        const decoded = jwt.verify(
            token,
            getEnvironmentVariableString('JWT_SECRET')
        ) as UserJWTPayload;
        req.user = decoded;
        let user = await User.findById(decoded.id);
        if (
            user &&
            (user.userType === 'Manager' || user.userType === 'Admin')
        ) {
            next();
        } else {
            res.status(401).send({ msg: 'Unauthorized action' });
        }
    } catch (error) {
        // console.log(error);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};
