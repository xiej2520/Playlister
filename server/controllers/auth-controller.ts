export {};

import { Request, Response } from 'express';
import auth from '../auth';
import User from '../models/user-model';
import bcrypt from 'bcryptjs';
import { IRegisterUserBody } from './requests/auth-requests';

const getLoggedIn = async (req: Request, res: Response) => {
	console.log("received getLoggedIn request")
	try {
		let userId = auth.verifyUser(req);
		if (userId === null) {
			return res.status(200).json({
				loggedIn: false,
				user: null,
				errorMessage: 'Error logging in user.'
			});
		}
		const loggedInUser = await User.findOne({ _id: userId });
		if (loggedInUser === null) {
			return res.status(200).json({
				loggedIn: false,
				user: null,
				errorMessage: 'Error logging in user.'
			});
		}
		return res.status(200).json({
			loggedIn: true,
			user: {
				firstName: loggedInUser.firstName,
				lastName: loggedInUser.lastName,
				email: loggedInUser.email
			}
		})
	} catch (err) {
		console.log(`Error: ${err}`);
		res.json(false);
	}
}

const loginUser = async (req: Request, res: Response) => {
	console.log("received loginUser request")
	try {
		const { email, password } = req.body;
		if (email === null || password === null) {
			return res
				.status(400)
				.json({ errorMessage: "Please enter all required fields. "});
		}
		
		const existingUser = await User.findOne({ email: email });
		if (existingUser === null) {
			return res
				.status(401)
				.json({ errorMessage: 'Wrong email or password provided.'});
		}
		const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
		if (!passwordCorrect) {
			return res
				.status(401)
				.json({ errorMessage: 'Wrong email or password provided. '});
		}
		
		const token = auth.signToken(existingUser._id);
		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			sameSite: true
		}).status(200).json({
			success: true,
			user: {
				firstName: existingUser.firstName,
				lastName: existingUser.lastName,
				email: existingUser.email
			}
		});
	}
	catch (err) {
		console.log(`Error: ${err}`);
		res.status(500).send();
	}
}

const logoutUser = async (_req: Request, res: Response) => {
	console.log("received logoutUser request")
	res.cookie("token", "", {
		httpOnly: true,
		expires: new Date(0),
		secure: true,
		sameSite: 'none'
	}).send();
}

const registerUser = async (req: Request<{}, {}, IRegisterUserBody>, res: Response) => {
	console.log("received registerUser request")
	try {
		const { firstName, lastName, email, password, passwordVerify } = req.body;
		if (!firstName || !lastName || ! email || !password || !passwordVerify) {
			return res
				.status(400)
				.json({ errorMessage: 'Please enter all required fields.' });
		}
		if (password.length < 8) {
			return res
				.status(400)
				.json({ errorMessage: 'Please enter a password of at least 8 characters.'});
		}
		if (password !== passwordVerify) {
			return res
				.status(400)
				.json({ errorMessage: 'Please enter the same password twice.'});
		}
		const existingUser = await User.findOne({ email: email });
		if (existingUser !== null) {
			return res
				.status(400)
				.json({
					errorMessage: 'An account with this email address already exists.'
				});
		}
		const saltRounds = 10;
		const salt = await bcrypt.genSalt(saltRounds);
		const passwordHash = await bcrypt.hash(password, salt);

		const newUser = new User({ firstName, lastName, email, passwordHash});
		const savedUser = await newUser.save();

		const token = auth.signToken(savedUser._id); 

		res.cookie('token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'none'
		}).status(200).json({
			success: true,
			user: {
				firstName: savedUser.firstName,
				lastName: savedUser.lastName,
				email: savedUser.email
			}
		});
	}
	catch (err) {
		console.log(err);
		res.status(500).send();
	}
}

module.exports = {
	getLoggedIn,
	registerUser,
	loginUser,
	logoutUser
};
