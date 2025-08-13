const jwt = require("jsonwebtoken");
const User = require("../models/user"); // importa tu modelo

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "No autorizado" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar usuario en la base de datos
        const user = await User.findById(decoded.id).select("-password");
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        req.user = user; // Ahora sí es el usuario real
        next();
    } catch (error) {
        res.status(401).json({ message: "Token inválido" });
    }
};

module.exports = authMiddleware;
