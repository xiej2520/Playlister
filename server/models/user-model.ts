export {};

import { Schema, Model, Document, model } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export interface IUser extends Document {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	dislikes: Map<String, boolean>;
	likes: Map<String, boolean>;
	passwordHash: string;
	playlists: Map<String, boolean>;
};

export const UserSchema = new Schema<IUser>(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		username: { type: String, required: true},
		email: { type: String, required: true },
		passwordHash: { type: String, required: true },
		dislikes: { type: Map, of: String },
		likes: { type: Map, of: String },
		playlists: { type: Map, of: String }
	},
	{ timestamps: true}
);

export const User: Model<IUser> = model('User', UserSchema);

export default User;
