const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.js');

const authRoutes = require('./routes/authRoutes.js');
const usersRoutes = require('./routes/userRoutes.js');
const postRoutes = require('./routes/postRoutes.js');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/posts", postRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
