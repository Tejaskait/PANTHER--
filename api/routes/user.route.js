import express from 'express';
import { deleteAUser, deleteUser,getAllUsers,test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test',test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/all', verifyToken, getAllUsers);
router.delete('/:id', verifyToken, deleteAUser);

export default router;