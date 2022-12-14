export {};

import { Schema, Model, Document, model, ObjectId } from 'mongoose';

export interface ISong {
	title: string;
	artist: string;
	youTubeId: string;
}

export interface IComment {
	text: string;
	ownerUsername: string;
}

export interface IPlaylist extends Document {
	name: string;
	ownerUsername: string;
	ownerId: string;
	songs: ISong[];
	publishDate: Date | null;
	createdAt: Date;
	updatedAt: Date;
	listens: number;
	likeCount: number;
	likes: Map<String, boolean>;
	dislikeCount: number;
	dislikes: Map<String, boolean>;
	comments: IComment[];
};

export interface IPlaylistExport {
	_id: ObjectId;
	name: string;
	ownerUsername: string;
	songs: ISong[];
	publishDate: Date | null;
	createdAt: Date;
	updatedAt: Date;
	listens: number;
	liked: boolean;
	likeCount: number;
	disliked: boolean;
	dislikeCount: number;
	comments: IComment[];
};

export const PlaylistSchema = new Schema<IPlaylist>(
	{
		name: { type: String, required: true },
		ownerUsername: { type: String, required: true },
		ownerId: { type: String, required: true },
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
		dislikes: { type: Map, of: String},
		comments: { type: [{ text: String, ownerUsername: String }], required: true}
	},
	{ timestamps: true }
);

export const Playlist: Model<IPlaylist> = model('Playlist', PlaylistSchema);

export default Playlist;
