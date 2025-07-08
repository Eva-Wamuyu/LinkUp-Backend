import express from "express";
import cors from 'cors';
import userRouter from './Routes/userRoutes.js';
import postRouter from "./Routes/postRoutes.js";
import commentRouter from "./Routes/commentRoutes.js";
import followRouter from "./Routes/followRoutes.js";
import likeRouter from "./Routes/likeRoutes.js";
import dotenv from 'dotenv'
dotenv.config()
const app = express();
const corsOptions = {
	origin: '*',
};
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Linkup:Hello World!');
});

app.use('/user', userRouter);
app.use('/post',postRouter)
app.use('/post',commentRouter)
app.use('/follow',followRouter)
app.use('/like',likeRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;