// require('dotenv').config();
// const express = require('express');
// const helmet = require('helmet');
// const cors = require('cors');
// const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean');

// const authRoutes = require('./routes/auth.routes');
// const postRoutes = require('./routes/post.routes');
// const userRoutes = require('./routes/user.routes');
// const friendRoutes = require('./routes/friend.routes');

// const app = express();
// app.use(helmet());
// app.use(cors({ origin: true }));
// app.use(express.json());
// app.use(mongoSanitize());
// app.use(xss());

// // rutas
// app.use('/api/auth', authRoutes);
// app.use('/api/posts', postRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/friends', friendRoutes);

// module.exports = app;
