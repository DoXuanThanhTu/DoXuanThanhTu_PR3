import { Request, Response } from "express";
import { User } from "@repo/database";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// ✅ GET /users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json({ success: true, data: users });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ GET /users/:id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: user });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ POST /users
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, passwordHash } = req.body;
    if (!username || !email || !passwordHash)
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });

    const existing = await User.findOne({ email });
    if (existing)
      return res
        .status(409)
        .json({ success: false, message: "Email already registered" });

    const newUser = new User({ username, email, passwordHash });
    await newUser.save();

    res.status(201).json({ success: true, data: newUser });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ PUT /users/:id
export const updateUser = async (req: Request, res: Response) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ DELETE /users/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already used" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, username, passwordHash });

  return res.status(201).json({ user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  if (!user?.passwordHash) {
    throw new Error("User password not set");
  }

  const valid = bcrypt.compareSync(password, user.passwordHash);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: "7d",
    }
  );

  res.json({ token, user });
};

export const getProfile = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id);
  res.json({ user });
};
