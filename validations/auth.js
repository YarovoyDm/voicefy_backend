import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Incorrect email format').isEmail(),
    body('password').isLength({ min: 8 }),
    body('nickname', 'This nickname already used').isLength({ min: 3 }),
];

export const loginValidation = [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
];
