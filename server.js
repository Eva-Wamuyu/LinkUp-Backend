import express from "express";
import cors from 'cors';
import userRouter from './Routes/userRoutes.js';

const app = express();
const corsOptions = {
	origin: '*',
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/user', userRouter);


const PORT = 3000;
app.listen(PORT)


export default app;