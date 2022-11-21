export {};

import * as express from 'express';
import { CallbackError } from 'mongoose';
import { IPlaylist } from '../models/playlist-model';
import Playlist from '../models/playlist-model';
import { IUser, UserSchema, User } from '../models/user-model';
import { ICreatePlaylistRequest, IDeletePlaylistRequest } from './requests/playlist-requests';

const createPlaylist = async (req: ICreatePlaylistRequest, res: express.Response) => {
	const body = req.body;

	if (!body) {
		return res.status(400).json({
			success: false,
			error: 'You must provide a Playlist',
		})
	}

	const playlist = new Playlist(body);
	if (!playlist) {
		return res.status(400).json({ success: false, error: 'Invalid playlist sent to server.' })
	}
	
	User.findOne({ _id: req.userId }, (err: CallbackError, user: IUser) => {
		if (user === null) {
			return res.status(400).send("User could not be found.");
		}
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
					.catch(() => {
						return res.status(400).json({
							errorMessage: 'Playlist not created!'
						})
					})
			});
	});
}

const deletePlaylist = async (req: IDeletePlaylistRequest, res: express.Response) => {
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

module.exports = {
	createPlaylist,
	deletePlaylist,
}