import { PassportStatic } from 'passport';
import passportJWT, { ExtractJwt } from 'passport-jwt';

import { logger } from './logging';
import { UserInterface, UserJWTPayload } from './types/user';
import { User } from './models/user';

export const auth: (passportRef: PassportStatic) => void = (
    passportRef: PassportStatic
): void => {
    passportRef.use(
        new passportJWT.Strategy(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: process.env.JWT_SECRET
            },
            async (
                jwtPayload: UserJWTPayload,
                done: (err: Error | null, user?: UserInterface | null) => void
            ): Promise<void> => {
                try {
                    const user = await User.findById(jwtPayload.id);
                    done(null, user);
                } catch (err) {
                    logger.log('error', (err as Error).message);
                    done(null, null);
                }
            }
        )
    );
};
