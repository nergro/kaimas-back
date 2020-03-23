import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { UserType, UserJWTPayload } from '../types/user';
import jwt from 'jsonwebtoken';
import { getEnvironmentVariableString } from '../services/environmentVariable';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

export const register = async (req: Request, res: Response) => {
    const { name, lastName, email, password, phone } = req.body as UserType;
    try {
        let user = await User.findOne({ email });

        if (user) {
            return res
                .status(409)
                .json({ errors: [{ msg: 'User already exists' }] });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            lastName,
            email,
            password: hashedPassword,
            phone,
            userType: 'someuser'
        });

        await user.save();

        const payload: UserJWTPayload = {
            id: user.id,
            userType: user.userType
        };

        jwt.sign(
            payload,
            getEnvironmentVariableString('JWT_SECRET'),
            { expiresIn: getEnvironmentVariableString('JWT_EXPIRETIME') },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const login = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
        const payload: UserJWTPayload = {
            id: user.id,
            userType: user.userType
        };

        jwt.sign(
            payload,
            getEnvironmentVariableString('JWT_SECRET'),
            { expiresIn: getEnvironmentVariableString('JWT_EXPIRETIME') },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getByToken = async (req: Request, res: Response) => {
    try {
        if (req.user === undefined) {
            return res.status(401).send('Unauthorized');
        }
        const { email, id } = req.user as UserType;
        res.status(200).send({ id, email });
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const edit = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (req.user === undefined) {
        return res.status(401).send('Unauthorized');
    }
    const { id } = req.user as UserType;

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
        const update = { password: hashedPassword };
        await User.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(id) },
            update
        );
        res.status(200).send({ msg: 'User updated' });
    } catch (err) {
        console.error(err.message);
        res.status(400).send({ error: 'Bad request' });
    }
};
