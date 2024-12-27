import express from 'express';
import { deleteAUser, deleteUser,getAllUsers,test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test',test);
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/all', verifyToken, getAllUsers);
router.delete('/:id', verifyToken, deleteAUser);
router.get('/check-admin', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (user && user.isAdmin) {
        return res.json({ isAdmin: true }); 
      }
      res.json({ isAdmin: false });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to check admin status.' });
    }
  });
  router.get('/user-info', verifyToken, (req, res) => {
    res.json({ success: true, isAdmin: req.user.isAdmin });
  });
  

export default router;