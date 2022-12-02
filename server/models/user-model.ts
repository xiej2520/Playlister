export {};

import { Schema, Types, Model, Document, model } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;

export interface IUser extends Document {
	firstName: string;
	lastName: string;
	username: string;
	email: string;
	passwordHash: string;
	playlists: Types.ObjectId[];
};

export const UserSchema = new Schema<IUser>(
	{
		firstName: { type: String, required: true },
		lastName: { type: String, required: true },
		username: { type: String, required: true},
		email: { type: String, required: true },
		passwordHash: { type: String, required: true },
		playlists: [{ type: ObjectId, ref: 'Playlist' }],
	},
	{ timestamps: true}
);

export const User: Model<IUser> = model('User', UserSchema);

export default User;
