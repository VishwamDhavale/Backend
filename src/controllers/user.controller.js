import asyncHandler from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
    // Do something
    res.status(200).json({ message: 'User registered successfully' });
});

export { registerUser };