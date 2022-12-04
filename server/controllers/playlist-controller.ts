export { };

import { Response } from 'express';
import { CallbackError, ObjectId } from 'mongoose';
import { IPlaylist, IPlaylistExport } from '../models/playlist-model';
import Playlist from '../models/playlist-model';
import { IUser, UserSchema, User } from '../models/user-model';
import { ICreatePlaylistRequest, IDeletePlaylistRequest, IGetPlaylistsRequest,
	IUpdatePlaylistRequest, ILikePlaylistRequest, IDislikePlaylistRequest } from './requests/playlist-requests';
import auth from '../auth';
const jwt = require('jsonwebtoken'); // only needed for getPublishedPlaylists

function exportPlaylist(userId: String, playlist: IPlaylist): IPlaylistExport {
	return {
		_id: playlist._id,
		name: playlist.name,
		ownerUsername: playlist.ownerUsername,
		songs: playlist.songs,
		publishDate: playlist.publishDate,
		listens: playlist.listens,
		liked: playlist.likes.has(userId),
		likeCount: playlist.likeCount,
		disliked: playlist.dislikes.has(userId),
		dislikeCount: playlist.dislikeCount,
		comments: playlist.comments
	}
}

const createPlaylist = async (req: ICreatePlaylistRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(401).json({ errorMessage: 'Unauthorized request.' })
	}
	User
		.findOne({ _id: req.userId })
		.then(async (user: IUser | null) =>  {
			if (user === null) {
				return res.status(400).send('User could not be found.');
			}
			let i = 0;
			let found = false;
			while (!found) {
				await Playlist
					.findOne({ name: `Untitled Playlist ${i}`})
					.then((playlist: IPlaylist | null) => {
						if (playlist === null) {
							found = true;
						}
						else {
							i++;
						}
					})
					.catch((err: CallbackError) => console.log(err));
			}
			const playlist = new Playlist({
				name: `Untitled Playlist ${i}`,
				ownerUsername: user.username,
				ownerId: user._id,
				songs: [],
				publishDate: null,
				listens: 0,
				likeCount: 0,
				likes: new Map(),
				dislikeCount: 0,
				dislikes: new Map()
			});
			user.playlists.push(playlist._id);
			user.save().then(() => {
				playlist
					.save()
					.then(() => {
						return res.status(201).json({
							playlist: exportPlaylist(user.id, playlist)
						});
					})
					.catch((err) => {
						console.log(err);
						return res.status(400).json({
							errorMessage: 'Playlist not created!'
						});
					});
			});
	});
}

const duplicatePlaylist = (req: ICreatePlaylistRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(401).json({ errorMessage: 'Unauthorized request.' });
	}
	User
		.findOne({ _id: req.userId })
		.then(async (user: IUser | null) => {
			if (user === null) {
				return res.status(400).send('User could not be found.');
			}
			Playlist
				.findById(req.params.id)
				.then(async (playlist: IPlaylist | null) => {
					if (playlist === null) {
						return res.status(404).json({ errorMessage: 'Playlist not found!' });
					}
					let i = 1;
					let found = false;
					while (!found) {
						await Playlist
							.findOne({ name: playlist.name + ` ${i}`})
							.then((playlist: IPlaylist | null) => {
								if (playlist === null) {
									found = true;
								}
								else {
									i++;
								}
							})
							.catch((err: CallbackError) => console.log(err));
					}
					const dupePlaylist = new Playlist({
						name: playlist.name + ` ${i}`,
						ownerUsername: user.username,
						ownerId: user._id,
						songs: playlist.songs,
						publishDate: null,
						listens: 0,
						likeCount: 0,
						likes: new Map(),
						dislikeCount: 0,
						dislikes: new Map()
					});
					user.playlists.push(dupePlaylist._id);
					user.save().then(() => {
						dupePlaylist
							.save()
							.then(() => {
								return res.status(201).json({
									playlist: exportPlaylist(user.id, dupePlaylist)
								});
							})
					});
				})
			})
		.catch((err) => {
			console.log(err);
			return res.status(400).json({
				errorMessage: 'Playlist not created!'
			});
		});;
};

const deletePlaylist = async (req: IDeletePlaylistRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(401).json({ errorMessage: 'Unauthorized request.' })
	}
	Playlist
		.findById(req.params.id)
		.then((playlist: IPlaylist | null) => {
			if (playlist === null) {
				return res.status(404).json({ errorMessage: 'Playlist not found!' });
			}
			if (playlist.ownerId != req.userId) {
				return res.status(401).json({ errorMessage: 'User does not have permission to delete this playlist.'});
			}
			Playlist
				.findByIdAndDelete(req.params.id)
				.then(() => { return res.status(200).json({ body: 'Playlist successfully deleted.' }); })
				.catch((err: CallbackError) => console.log(err));
		})
		.catch((err: CallbackError) => console.log(err));
}

const getUserPlaylists = async (req: IGetPlaylistsRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(401).json({ errorMessage: 'Unauthorized access.' });
	}
	Playlist
		.find({ ownerId: req.userId })
		//.select('name ownerName songs publishDate listens likeCount dislikeCount')
		.exec()
		.then((playlists: IPlaylist[]) => {
			if (!playlists.length) {
				return res
					.status(404)
					.json({ error: 'Playlists not found.' });
			}
			return res.status(200).json({ playlists: playlists.map(
				(playlist) => exportPlaylist(req.userId, playlist))
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(400).json({ error: err });
		});
}

const getPublishedPlaylists = async (req: IGetPlaylistsRequest, res: Response) => {
	const token = req.cookies.token;
	if (token !== null && token !== undefined) {
		console.log(token)
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = verified.userId;
	}
	// allow guests to get published playlists
	// must be verified to get likes/dislikes
	Playlist
		.find({ publishDate: { $ne: null } })
		.exec()
		.then((playlists: IPlaylist[]) => {
			if (!playlists.length) {
				return res
					.status(404)
					.json({ error: 'Playlists not found.' });
			}
			return res.status(200).json({ playlists: playlists.map(
				(playlist) => exportPlaylist(req.userId, playlist))
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(400).json({ error: err });
		});
}

const publishPlaylist = async(req: IUpdatePlaylistRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(400).json({ errorMessage: 'Unauthorized request.' });
	}
	Playlist
		.findById(req.params.id)
		.then((playlist: IPlaylist | null) => {
			if (playlist === null) {
				return res.status(404).json({ errorMessage: 'Playlist not found!' });
			}
			if (playlist.ownerId != req.userId) {
				return res.status(401).json({ errorMessage: 'User does not have permission to publish this playlist!' });
			}
			if (playlist.publishDate !== null) {
				return res.status(400).json({ errorMessage: 'Playlist is already published!' });
			}
			playlist.publishDate = new Date();
			playlist
				.save()
				.then(() => {
					return res.status(200).json({ body: 'Playlist sucessfully published!' });
				})
				.catch((error: CallbackError) => {
					console.log(error);
					return res.status(400).json({ body: 'Playlist not published!' });
				});
		})
		.catch((error: CallbackError) => {
			console.log(error);
			return res.status(400).json({ body: 'Playlist not published!' });
		})
}

const updatePlaylist = async(req: IUpdatePlaylistRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(400).json({ errorMessage: 'Unauthorized request.' });
	}
	if (!req.body) {
		return res.status(400).json({
			error: 'You must provide a body to update!'
		});
	}
	Playlist
		.findById(req.params.id)
		.then((playlist: IPlaylist | null) => {
			if (playlist === null) {
				return res.status(404).json({ errorMessage: 'Playlist not found!' });
			}
			if (playlist.ownerId != req.userId) {
				return res.status(401).json({ errorMessage: 'User does not have permission to edit this playlist!' });
			}
			if (playlist.publishDate !== null) {
				return res.status(400).json({ errorMessage: 'Playlist cannot be edited!' });
			}
			let updatedPlaylist = req.body.playlist;
			playlist.name = updatedPlaylist.name;
			playlist.songs = updatedPlaylist.songs;
			playlist
				.save()
				.then(() => {
					return res.status(200).json({ body: 'Playlist sucessfully edited!' });
				})
				.catch((error: CallbackError) => {
					console.log(error);
					return res.status(400).json({ body: 'Playlist not edited!' });
				});
		})
		.catch((error: CallbackError) => {
			console.log(error);
			return res.status(400).json({ body: 'Playlist not edited!' });
		})
}

const likePlaylist = async(req: ILikePlaylistRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(400).json({ errorMessage: 'Unauthorized request.' });
	}
	if (!req.body) {
		return res.status(400).json({
			error: 'Invalid body for like playlist request.'
		});
	}
	Playlist
		.findById(req.params.id)
		.then((playlist: IPlaylist | null) => {
			if (playlist === null) {
				return res.status(404).json({ errorMessage: 'Playlist not found!' });
			}
			if (playlist.publishDate === null) {
				return res.status(400).json({ errorMessage: 'Playlist cannot be liked!' });
			}
			if (req.body.like === true) {
				if (!playlist.likes.has(req.userId)) {
					if (playlist.dislikes.has(req.userId)) {
						playlist.dislikes.delete(req.userId);
						playlist.dislikeCount--;
					}
					playlist.likes.set(req.userId, true);
					playlist.likeCount++;
				}
			}
			else {
				if (playlist.likes.has(req.userId)) {
					playlist.likes.delete(req.userId);
					playlist.likeCount--;
				}
			}
			playlist
				.save()
				.then(() => {
					return res.status(200).json({ body: 'Playlist sucessfully liked!' });
				});
		})
		.catch((error: CallbackError) => {
			console.log(error);
			return res.status(400).json({ body: 'Playlist not liked!' });
		})
}

const dislikePlaylist = async(req: IDislikePlaylistRequest, res: Response) => {
	if (auth.verifyUser(req) === null) {
		return res.status(400).json({ errorMessage: 'Unauthorized request.' });
	}
	if (!req.body) {
		return res.status(400).json({
			error: 'Invalid body for dislike playlist request.'
		});
	}
	Playlist
		.findById(req.params.id)
		.then((playlist: IPlaylist | null) => {
			if (playlist === null) {
				return res.status(404).json({ errorMessage: 'Playlist not found!' });
			}
			if (playlist.publishDate === null) {
				return res.status(400).json({ errorMessage: 'Playlist cannot be disliked!' });
			}
			if (req.body.dislike === true) {
				if (!playlist.dislikes.has(req.userId)) {
					if (playlist.likes.has(req.userId)) {
						playlist.likes.delete(req.userId);
						playlist.likeCount--;
					}
					playlist.dislikes.set(req.userId, true);
					playlist.dislikeCount++;
				}
			}
			else {
				if (playlist.dislikes.has(req.userId)) {
					playlist.dislikes.delete(req.userId);
					playlist.dislikeCount--;
				}
			}
			playlist
				.save()
				.then(() => {
					return res.status(200).json({ body: 'Playlist sucessfully disliked!' });
				});
		})
		.catch((error: CallbackError) => {
			console.log(error);
			return res.status(400).json({ body: 'Playlist not disliked!' });
		})
}
const PlaylistController = {
	createPlaylist,
	duplicatePlaylist,
	deletePlaylist,
	getUserPlaylists,
	getPublishedPlaylists,
	likePlaylist,
	dislikePlaylist,
	publishPlaylist,
	updatePlaylist
}
export default PlaylistController; 
