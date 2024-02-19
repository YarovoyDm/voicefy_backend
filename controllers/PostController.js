import PostModel from '../models/Post.js';

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            author: req.userId,
        });

        const post = await doc.save();
        res.json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Post error',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('author').exec();

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Posts error',
        });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const userPosts = await PostModel.find({ author: req.userId })
            .populate('author')
            .exec();

        res.json(userPosts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Posts error',
        });
    }
};

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete(
            {
                _id: postId,
            },
            (error, doc) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({
                        message: 'Error while trying to delete a post',
                    });
                }
                if (!doc) {
                    console.log(error);
                    return res.status(404).json({
                        message: 'Post not found',
                    });
                }

                res.json({
                    success: true,
                });
            },
        );
    } catch (error) {}
};
