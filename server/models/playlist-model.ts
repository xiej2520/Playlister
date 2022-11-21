export {};

import { Schema, Model, Document, model } from 'mongoose';

export interface ISong {
	title: string;
	artist: string;
	youTubeId: string;
}

export interface IPlaylist extends Document {
	name: string;
	ownerEmail: string;
	songs: ISong[]
};

export const PlaylistSchema = new Schema<IPlaylist>(
	{
		name: { type: String, required: true },
		ownerEmail: { type: String, required: true },
		songs: {
			type: [{
				title: String,
				artist: String,
				youTubeId: String
			}], required: true
		}
	},
	{ timestamps: true }
);

export const Playlist: Model<IPlaylist> = model('Playlist', PlaylistSchema);

export default Playlist;
