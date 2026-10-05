import express from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from './UserController';

const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
