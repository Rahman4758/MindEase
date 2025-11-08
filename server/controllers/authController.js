import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user ){
        // User not found in DB
      return res.status(404).json({
        success: false,
        errorCode: "USER_NOT_FOUND",
        message: "User not found"
      });
    }

    //check password
        
    const isMatch = await user.comparePassword(password);
      if(!isMatch) {
        //sahi user, but galat password
        return res.status(401).json({
            success:false,
            errorCode:"Invalid Password",
            message: 'Invalid credentials' });
    };
     //success: login the user
    res.status(200).json({
      _id: user._id,
      name: user.name,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
