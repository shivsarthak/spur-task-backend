import express from 'express';
import { getArtworkComments, getArtworks, postArtworkComment, uploadArtwork } from '../controllers/artworkController';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const artworkRouter = express.Router()

artworkRouter.get('/all', getArtworks);
artworkRouter.post('/upload', upload.single('image'), uploadArtwork);
artworkRouter.get('/:artworkId/comments', getArtworkComments);
artworkRouter.post('/:artworkId/comment', postArtworkComment);

export default artworkRouter;