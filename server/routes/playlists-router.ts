export {};

const express = require('express');
import PlaylistController from '../controllers/playlist-controller';
const router = express.Router();
import auth from '../auth';

router.get('/userplaylists', auth.verify, PlaylistController.getUserPlaylists);
router.get('/publishedplaylists', PlaylistController.getPublishedPlaylists);
router.post('/playlist', auth.verify, PlaylistController.createPlaylist);
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist);
router.post('/duplicateplaylist/:id', auth.verify, PlaylistController.duplicatePlaylist);
router.put('/playlist/publish/:id', auth.verify, PlaylistController.publishPlaylist);
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist);
router.put('/playlist/name/:id', auth.verify, PlaylistController.updatePlaylistName);
router.put('/playlist/like/:id', auth.verify, PlaylistController.likePlaylist);
router.put('/playlist/dislike/:id', auth.verify, PlaylistController.dislikePlaylist);
router.post('/playlist/comment/:id', auth.verify, PlaylistController.commentPlaylist);

module.exports = router;
