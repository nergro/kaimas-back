import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/user';
import { UserType, UserJWTPayload } from '../types/user';
import jwt from 'jsonwebtoken';
import { getEnvironmentVariableString } from '../services/environmentVariable';

export const register = async (req: Request, res: Response) => {
    const {
        name,
        lastName,
        email,
        password,
        phone,
        isSubscribed
    } = req.body as UserType;
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
            userType: 'someuser',
            isSubscribed
        });

        await user.save();

        const payload: UserJWTPayload = {
            id: user.id,
            userType: user.userType
        };

        jwt.sign(
            payload,
            getEnvironmentVariableString('JWT_SECRET'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};

export const getByToken = async (req: Request, res: Response) => {
    try {
        if (req.user !== undefined) {
            const { email, id } = req.user as UserType;
            res.status(200).send({ id, email });
        }
        //     const { id } = req.user;
        // const user = await User.findById(id);
        // const { name, email, admin } = user;
    } catch (error) {
        res.status(400).send({ error: 'Bad request' });
    }
};
