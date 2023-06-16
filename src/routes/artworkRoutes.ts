import express from 'express';
import { getArtworkComments, getArtworks, postArtworkComment, uploadArtwork } from '../controllers/artworkController';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'src/uploads');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = file.originalname.split('.').pop();
      cb(null, uniqueSuffix + '.' + extension);
    }
  });

const upload = multer({ storage });
const artworkRouter = express.Router()

artworkRouter.get('/all', getArtworks);
artworkRouter.post('/upload', upload.single('image'), uploadArtwork);
artworkRouter.get('/:artworkId/comments', getArtworkComments);
artworkRouter.post('/:artworkId/comment', postArtworkComment);

export default artworkRouter;