export {};

const express = require('express');
import PlaylistController from '../controllers/playlist-controller';
const router = express.Router();
import auth from '../auth';

router.get('/userplaylists', auth.verify, PlaylistController.getUserPlaylists);
router.post('/playlist', auth.verify, PlaylistController.createPlaylist);
router.post('/duplicateplaylist/:id', auth.verify, PlaylistController.duplicatePlaylist);
router.put('/playlist/publish/:id', auth.verify, PlaylistController.publishPlaylist);
router.put('/playlist/:id', auth.verify, PlaylistController.updatePlaylist);
router.delete('/playlist/:id', auth.verify, PlaylistController.deletePlaylist);
/*
router.get('/playlist/:id', auth.verify, PlaylistController.getPlaylistById);
router.get('/playlistpairs', auth.verify, PlaylistController.getPlaylistPairs);
router.get('/playlists', auth.verify, PlaylistController.getPlaylists);
*/

module.exports = router;
