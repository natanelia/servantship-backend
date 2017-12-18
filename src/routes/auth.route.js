import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import Joi from 'joi';
import authCtrl from '../controllers/auth.controller';
import config from '../../config';

const router = express.Router(); // eslint-disable-line new-cap

/**
 * POST /api/auth/login - Returns token if correct username and password is provided
 */
router.route('/login')
    .post(validate({
        body: {
            phone: Joi.string().required(),
            password: Joi.string().required(),
        }
    }), authCtrl.login);

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header.
 * Authorization: Bearer {token}
 */
router.route('/random-number')
    .get(expressJwt({
        secret: config.jwtSecret,
    }), authCtrl.getRandomNumber);

export default router;
