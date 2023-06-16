import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const getArtworks = async (req: Request, res: Response) => {
    try {
        const artworks = await prisma.artwork.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        username: true,
                    }
                },
                comments: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        user: {
                            select: {
                                username: true,
                            }
                        }

                    },
                    take: 1,
                }
            }

        });
        res.json(artworks);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

export const uploadArtwork = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        if (!req.file || !title || !description) {
            console.log(req.file);
            return res.status(400).json({ error: 'No file uploaded or missing fields' });
        }
        const { filename, path } = req.file;
        const newArtwork = await prisma.artwork.create({
            data: {
                title,
                description,
                imagePath: `https://api.spur.shivsarthak.com/uploads/${filename}`,
                userId: res.locals.user.id,
            },
        });

        res.json(newArtwork);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
};

export const getArtworkComments = async (req: Request, res: Response) => {
    try {
        const { artworkId } = req.params;
        const comments = await prisma.comment.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            where: {
                artworkId: Number(artworkId),
            },
            include: {
                user: {
                    select: {
                        username: true,
                    }
                }
            }
        });
        res.json(comments);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

export const postArtworkComment = async (req: Request, res: Response) => {
    try {
        const { artworkId } = req.params;
        const { comment } = req.body;
        if (!comment) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        const newComment = await prisma.comment.create({
            data: {
                comment: comment,
                userId: res.locals.user.id,
                artworkId: Number(artworkId),
            },
        });
        res.json(newComment);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}
