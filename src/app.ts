import 'express-async-errors';

import cors from 'cors';
import * as dotenv from 'dotenv';
import express, { Application, json } from 'express';
import mongoose from 'mongoose';
import authRoute from './routes/auth';
import userRoute from './routes/user';
import helmet from "helmet"


dotenv.config();

const app: Application = express();

app.use(json());
app.use(helmet());
app.use(cors());

app.use('/auth', authRoute);
app.use('/user', userRoute);

app.get('/', (_, res) => {
  res.json({
    msg: 'This is a setup for vyrill',
  });
});


mongoose.connect(process.env.MONGO_URI as string);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection failed'));
db.once('open', async () => {
  console.log('Database conencted successfully!');
});
mongoose.set('strictQuery', true);

export { app };
