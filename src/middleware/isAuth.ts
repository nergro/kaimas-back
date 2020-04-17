import { RequestHandler } from 'express';
import passport from 'passport';

export const isAuth: RequestHandler = passport.authenticate('jwt', {
    session: false
}) as RequestHandler;
