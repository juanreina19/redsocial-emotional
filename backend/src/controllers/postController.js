const Post = require("../models/post");

const createPost = async (req, res) => {
    try {
        const { content, image, mood } = req.body;

        if (!content) {
            return res.status(400).json({ msg: "El contenido no puede estar vacío" });
        }

        const newPost = new Post({
            content,
            image,
            mood,
            author: req.user.id
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("author", "username mood avatar")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Publicación no encontrada" });
        }

        const alreadyLiked = post.likes.includes(req.user.id);

        if (alreadyLiked) {
            post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
        } else {
            post.likes.push(req.user.id);
        }

        await post.save();
        res.json({ likes: post.likes.length, liked: !alreadyLiked });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

const commentPost = async (req, res) => {
    try {
        const { text } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Publicación no encontrada" });
        }

        post.comments.push({
            text,
            author: req.user.id,
        });

        await post.save();
        res.status(201).json(post.comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

const editPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Publicación no encontrada" });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ msg: "No autorizado" });
        }

        const { content, mood, image } = req.body;

        if (content) post.content = content;
        if (mood) post.mood = mood;
        if (image) post.image = image;

        await post.save();
        res.json({ msg: "Publicación actualizada", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Publicación no encontrada" });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ msg: "No autorizado" });
        }

        await post.deleteOne();
        res.json({ msg: "Publicación eliminada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

const editComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Publicación no encontrada" });
        }

        const comment = post.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ msg: "Comentario no encontrado" });
        }

        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ msg: "No autorizado" });
        }

        comment.text = req.body.text || comment.text;
        await post.save();

        res.json({ msg: "Comentario actualizado", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Publicación no encontrada" });
        }

        const comment = post.comments.id(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ msg: "Comentario no encontrado" });
        }

        if (comment.author.toString() !== req.user.id) {
            return res.status(403).json({ msg: "No autorizado" });
        }

        comment.deleteOne();
        await post.save();

        res.json({ msg: "Comentario eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

const getMyPosts = async (req, res) => {
    try {
        const userId = req.user.id; // req.user viene del middleware JWT

        const posts = await Post.find({ author: userId })
            .sort({ createdAt: -1 }); // Orden descendente (últimos primero)

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener publicaciones" });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "username avatar")
            .populate("comments.author", "username avatar"); // trae info del autor y comentarios

        if (!post) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la publicación" });
    }
};


module.exports = {
    createPost,
    getAllPosts,
    likePost,
    commentPost,
    editPost,
    deletePost,
    editComment,
    deleteComment,
    getMyPosts,
    getPostById
};