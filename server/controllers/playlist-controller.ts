export { };

import * as express from 'express';
import { CallbackError } from 'mongoose';
import { IPlaylist } from '../models/playlist-model';
import Playlist from '../models/playlist-model';
import { IUser, UserSchema, User } from '../models/user-model';
import { ICreatePlaylistRequest, IDeletePlaylistRequest, IGetPlaylistsRequest } from './requests/playlist-requests';
import auth from '../auth';

const createPlaylist = async (req: ICreatePlaylistRequest, res: express.Response) => {
	console.log("received create playlist request")
	if (auth.verifyUser(req) === null) {
		return res.status(401).json({ errorMessage: 'Unauthorized request.' })
	}
	const body = req.body;

	if (!body) {
		return res.status(400).json({
			success: false,
			error: 'You must provide a Playlist',
		})
	}

	const playlist = new Playlist({
		...body,
		likeCount: 0,
		dislikeCount: 0
	});
	if (!playlist) {
		return res.status(400).json({ success: false, error: 'Invalid playlist sent to server.' })
	}

	User.findOne({ _id: req.userId }, (err: CallbackError, user: IUser) => {
		if (user === null) {
			return res.status(400).send("User could not be found.");
		}
		playlist.ownerEmail = user.email;
		playlist.ownerName = user.firstName + " " + user.lastName;
		user.playlists.push(playlist._id);
		user
			.save()
			.then(() => {
				playlist
					.save()
					.then(() => {
						return res.status(201).json({
							playlist: playlist
						})
					})
					.catch((err) => {
						console.log(err);
						return res.status(400).json({
							errorMessage: 'Playlist not created!'
						})
					})
			});
	});
}

const deletePlaylist = async (req: IDeletePlaylistRequest, res: express.Response) => {
	console.log("received delete playlist req")
	if (auth.verifyUser(req) === null) {
		return res.status(401).json({ errorMessage: 'Unauthorized request.' })
	}
	Playlist.findById(req.params.id, (err: CallbackError, playlist: IPlaylist) => {
		if (err) {
			return res.status(404).json({
				errorMessage: 'Playlist not found!'
			});
		}
		User.findOne({ email: playlist.ownerEmail }, (_err: CallbackError, user: IUser) => {
			if (user._id === req.userId) {
				Playlist.findByIdAndDelete(req.params.id, () => {
					return res.status(200).json({
						success: true
					});
				}).catch((err: CallbackError) => console.log(err));
			}
			else {
				return res.status(400).json({
					errorMessage: 'Error: user does not have permission to delete playlist.'
				});
			}
		})
	});
}

const getUserPlaylists = async (req: express.Request, res: express.Response) => {
	console.log('received get user playlists request')
	if (auth.verifyUser(req) === null) {
		return res.status(401).json({ errorMessage: 'Unauthorized access.' });
	}
	Playlist
		.find({})
		.exec()
		.then((playlists: IPlaylist[]) => {
			if (!playlists.length) {
				return res
					.status(404)
					.json({ error: 'Playlists not found.' });
			}
			return res.status(200).json({ playlists: playlists });
		})
		.catch((err) => {
			console.log(err);
			return res.status(400).json({ error: err });
		});
}

module.exports = {
	createPlaylist,
	deletePlaylist,
	getUserPlaylists,
};
