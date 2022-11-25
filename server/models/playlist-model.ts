export {};

import { Schema, Model, Document, model } from 'mongoose';

export interface ISong {
	title: string;
	artist: string;
	youTubeId: string;
}

export interface IPlaylist extends Document {
	name: string;
	ownerName: string;
	ownerEmail: string;
	songs: ISong[];
	publishDate: Date | null;
	listens: number;
	likeCount: number;
	likes: Map<String, boolean>;
	dislikeCount: number;
	dislikes: Map<String, boolean>;
};

export const PlaylistSchema = new Schema<IPlaylist>(
	{
		name: { type: String, required: true },
		ownerName: { type: String, required: true },
		ownerEmail: { type: String, required: true },
		songs: {
			type: [{
				title: String,
				artist: String,
				youTubeId: String
			}], required: true
		},
		publishDate: { type: Date, required: false },
		listens: { type: Number, required: false },
		likeCount: { type: Number, required: true },
		likes: { type: Map, of: String},
		dislikeCount: { type: Number, required: true},
		dislikes: { type: Map, of: String}
	},
	{ timestamps: true }
);

export const Playlist: Model<IPlaylist> = model('Playlist', PlaylistSchema);

export default Playlist;