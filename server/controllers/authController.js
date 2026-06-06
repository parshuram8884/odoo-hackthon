const authService = require('../services/authService');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const data = await authService.loginUser(email, password);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = {
  login
};
