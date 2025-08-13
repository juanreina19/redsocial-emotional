const User = require("../models/user");


// Obtener perfil
const getProfile = (req, res) => {
    res.json(req.user);
};

// Actualizar perfil
const updateProfile = async (req, res) => {
    try {
        req.user.name = req.body.name || req.user.name;
        req.user.email = req.body.email || req.user.email;

        const updatedUser = await req.user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el perfil" });
    }
};

// Obtener perfil de otro usuario por su ID
const getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: "Error en el servidor " })
    }
};

// Obtener estado de ánimo
const getMood = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("mood username");
        if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

        res.json({ mood: user.mood, username: user.username });
    } catch (err) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// Actualizar estado de ánimo
const updateMood = async (req, res) => {
    try {
        const { mood } = req.body;
        const validMoods = ["feliz", "triste", "neutral", "enojado"];

        if (!validMoods.includes(mood)) {
            return res.status(400).json({ msg: "Estado de ánimo no válido" });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { mood },
            { new: true }
        ).select("mood username");

        res.json({ msg: "Estado de ánimo actualizado", mood: user.mood });
    } catch (err) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// Ver estado de ánimo de otro usuario por su ID
const getMoodById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("username mood");

        if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

        res.json({ username: user.username, mood: user.mood });
    } catch (err) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// Seguir a un usuario
const followUser = async (req, res) => {
    try {
        const { id } = req.params; // usuario a seguir
        const currentUserId = req.user.id; // usuario que sigue

        if (id === currentUserId) {
            return res.status(400).json({ msg: "No puedes seguirte a ti mismo" });
        }

        const userToFollow = await User.findById(id);
        const currentUser = await User.findById(currentUserId);

        if (!userToFollow) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        // Evitar seguir dos veces
        if (currentUser.following.includes(id)) {
            return res.status(400).json({ msg: "Ya sigues a este usuario" });
        }

        currentUser.following.push(id);
        userToFollow.followers.push(currentUserId);

        await currentUser.save();
        await userToFollow.save();

        res.json({ msg: `Ahora sigues a ${userToFollow.username}` });

    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

// Dejar de seguir a un usuario
const unfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;

        const userToUnfollow = await User.findById(id);
        const currentUser = await User.findById(currentUserId);

        if (!userToUnfollow) {
            return res.status(404).json({ msg: "Usuario no encontrado" });
        }

        currentUser.following = currentUser.following.filter(
            userId => userId.toString() !== id
        );

        userToUnfollow.followers = userToUnfollow.followers.filter(
            userId => userId.toString() !== currentUserId
        );

        await currentUser.save();
        await userToUnfollow.save();

        res.json({ msg: `Has dejado de seguir a ${userToUnfollow.username}` });

    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

const getUserSuggestions = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        // Obtener el usuario actual con sus seguidos
        const currentUser = await User.findById(currentUserId).populate('following', '_id');

        // IDs de los usuarios que ya sigue + él mismo
        const excludedIds = [...currentUser.following.map(u => u._id), currentUserId];

        // Buscar usuarios que no sigue todavía
        const suggestions = await User.find({ _id: { $nin: excludedIds } })
            .select('username mood followers') // Solo devolvemos algunos datos
            .limit(4); // Máximo 4 sugerencias

        res.json(suggestions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error obteniendo sugerencias' });
    }
};


module.exports = { getProfile, updateProfile, getMood, updateMood, getMoodById, getProfileById, followUser, unfollowUser, getUserSuggestions };

