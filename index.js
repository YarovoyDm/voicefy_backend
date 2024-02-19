import express from 'express';
import mongoose from 'mongoose';
import { registerValidation, loginValidation } from './validations/auth.js';
import { postCreateValidation } from './validations/post.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import cors from 'cors';

import 'dotenv/config';

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log('DB connected');
    })
    .catch((err) => console.log(err));

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Auth endpoints

app.post('/auth/register', registerValidation, UserController.register);
app.post('/auth/login', loginValidation, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

// Following endpoints

app.patch('/:id/follow', checkAuth, UserController.follow);
app.patch('/:id/unfollow', checkAuth, UserController.unfollow);

// Post endpoints

app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.get('/posts', checkAuth, PostController.getAll);
app.get('/posts/userPosts', checkAuth, PostController.getUserPosts);
app.delete('/posts/:id', checkAuth, PostController.deletePost);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log('Server OK');
});
