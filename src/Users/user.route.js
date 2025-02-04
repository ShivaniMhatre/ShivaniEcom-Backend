import express from 'express';
import {
    DeleteUser,
    EditProfile,
    GetAllUser,
    Login,
    Logout,
    Register,
    UpdateUserRole
} from './user.controller.js';

const router = express.Router();

router.post("/register", Register)
router.post("/login", Login);
router.post('/logout', Logout);
router.delete('/deleteUser/:id', DeleteUser)
router.get('/getalluser', GetAllUser)
router.put('/updateRole/:id', UpdateUserRole)
router.patch('/edit-profile', EditProfile)


export default router