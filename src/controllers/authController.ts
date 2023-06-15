import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const saltRounds = 10;
const jwtSecret = 'hireMePls';

export const signUp = async (req: Request, res: Response) => {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const exist_email = await prisma.user.findUnique({
            where: { email },
        });
        if (exist_email) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ userId: newUser.id }, jwtSecret);

        res.json({ token });
    } catch (error) {
        console.error('Error in signUp:', error);
        res.status(500).json({ error: 'Failed to sign up' });
    }
};

export const signIn = async (req: Request, res: Response) => {
    console.log(req.body);
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const user_data = { userId: user.id, username: user.username, email: user.email }
        const token = jwt.sign(user_data, jwtSecret);

        res.json({ user_data,token });
    } catch (error) {
        console.error('Error in signIn:', error);
        res.status(500).json({ error: 'Failed to sign in' });
    }
};


export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, jwtSecret);

        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const user = await prisma.user.findUnique({
            where: { id: (decoded as any).userId },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        res.locals.user = user;

        next();
    } catch (error) {
        console.error('Error in verifyToken:', error);
        res.status(500).json({ error: 'Failed to verify token' });
    }
}