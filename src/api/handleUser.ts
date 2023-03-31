import type { Request, Response } from 'express';

import UserModels from '../models/User'

const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const user = await UserModels.find().select('-password');
    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
  return false;
};


export default { getAllUsers };
