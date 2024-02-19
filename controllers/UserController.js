import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            nickname: req.body.nickname,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'voicefy_key',
            {
                expiresIn: '1d',
            },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Register error',
        });
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'Use not found',
            });
        }

        const isPassValid = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash,
        );

        if (!isPassValid) {
            return res.status(404).json({
                message: 'Invalid email or password',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'voicefy_key',
            {
                expiresIn: '1d',
            },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Login error',
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            res.status(404).json({
                messasge: 'User not found',
            });
        }

        const { passwordHash, ...userData } = user._doc;

        res.json({ userData });
    } catch (error) {
        console.log(error);
        res.status(403).json({
            message: 'Permision denied',
        });
    }
};

export const follow = async (req, res) => {
    if (req.userId !== req.params.id) {
        try {
            const user = await UserModel.findById(req.params.id);
            const currentUser = await UserModel.findById(req.userId);

            if (!user.followers.includes(req.userId)) {
                await user.updateOne({ $push: { followers: req.userId } });
                await currentUser.updateOne({
                    $push: { followings: req.params.id },
                });

                res.json({
                    message: 'user has been followed',
                });
            } else {
                res.status(403).json({
                    message: 'You already follow this user',
                });
            }
        } catch (error) {
            res.json(error);
        }
    } else {
        res.status(403).json({
            message: 'You can not follow yourself',
        });
    }
};

export const unfollow = async (req, res) => {
    if (req.userId !== req.params.id) {
        try {
            const user = await UserModel.findById(req.params.id);
            const currentUser = await UserModel.findById(req.userId);

            if (user.followers.includes(req.userId)) {
                await user.updateOne({ $pull: { followers: req.userId } });
                await currentUser.updateOne({
                    $pull: { followings: req.params.id },
                });

                res.json({
                    message: 'user has been unfollowed',
                });
            } else {
                res.status(403).json({
                    message: 'You already unfollow this user',
                });
            }
        } catch (error) {
            res.json(error);
        }
    } else {
        res.status(403).json({
            message: 'You can not unfollow yourself',
        });
    }
};
