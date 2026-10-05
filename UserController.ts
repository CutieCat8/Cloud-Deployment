import { Request, Response } from 'express';
import User from './User';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating user', error });
  }
};

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving users', error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving user', error });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating user', error });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting user', error });
  }
};
