import * as bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import UserModels from '../models/User';

const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!password) {
    res.status(400).json({ error: 'All fields are required' });
  }
  if (password.length < 8) {
    res
      .status(400)
      .json({ message: "Password can't be shorter than 8 characters" });
  }
  // check User Exists or not
  const userExists = await UserModels.find({
    $or: [
      { email: { $regex: `${email}`, $options: 'i' } },
    ],
  });
  if (userExists.length > 0) {
    return res.status(400).json({ error: 'User already exists' });
  }
  try {
    if (email) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await new UserModels({
        _id: new mongoose.Types.ObjectId(),
        email: email || '',
        password: hashedPassword,
      });
      const userResult = await user.save();
      res
        .status(200)
        .json({ message: 'user created', userResult });
    } else {
      res.status(400).json({ error: 'email is required' });
    }
  } catch (error) {
    console.log(error);
  }
  return false;
};



export default { registerUser };
