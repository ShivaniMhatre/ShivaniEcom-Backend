import bcrypt from 'bcrypt';
import User from "./user.model.js";
import generateToken from '../middleware/generateToken.js';


//Register
export const Register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10)
        const user = new User({
            email,
            username,
            password: hashPassword
        })
        await user.save();
        res.status(200).json({
            success: true,
            message: "User created successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error.message,
            success: false
        })
    }
}

//Login
export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid password" })
        }
        const token = await generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        })

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession,
            }
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Error logging in user",
            error: error.message,
            success: false
        })
    }
}


//Logout
export const Logout = (req, res) => {
    res.clearCookie('token')
    res.status(200).json({
        success: true,
        message: 'User logged out successfully',
    })
}


//Delete User
export const DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        })
    } catch (error) {
        res.status(500).json({
            message: "Error deleting user",
            error: error.message,
            success: false
        })
    }
}


//Get All Users
export const GetAllUser = async (req, res) => {
    try {
        const users = await User.find({}, 'id email role').sort({ createdAt: - 1 });
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            message: "Error fetching all user",
            error: error.message,
            success: false
        })
    }
}

//Update User Role
export const UpdateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }
        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            user: user
        })
    } catch (error) {
        res.status(500).json({
            message: "Error updating user role",
            error: error.message,
            success: false
        })
    }
}

//Edit Profile

export const EditProfile = async (req, res) => {
    try {
        const { userId, username, profileImage, bio, profession } = req.body;
        if (!userId) {
          return res.status(400).send({ message: "User ID is required" });
        }
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(400).send({ message: "User not found" });
        }
        // update profile
        if (username !== undefined) user.username = username;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (bio !== undefined) user.bio = bio;
        if (profession !== undefined) user.profession = profession;
    
        await user.save();
        res.status(200).send({
          message: "Profile updated successfully",
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            bio: user.bio,
            profession: user.profession,
            role: user.role,
          },
        });
      } catch (error) {
        console.error("Error updating user profile", error);
        res.status(500).send({ message: "Error updating user profile" });
      }
}
