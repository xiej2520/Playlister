const jwt = require('jsonwebtoken');

function authManager() {
	return ({
		verify: (req: any, res: any, next: any) => {
			try {
				const token = req.cookies.token;
				if (!token) {
					return res.status(401).json({
						loggedIn: false,
						user: null,
						errorMessage: 'Unauthorized: could not verify user.'
					});
				}
				const verified = jwt.verify(token, process.env.JWT_SECRET);
				req.userId = verified.userId;
				next();
			} catch (err) {
				console.log(err);
				return res.status(401).json({
					loggedIn: false,
					user: null,
					errorMessage: 'Unauthorized: could not verify user.'
				});
			}
		},
		verifyUser: (req: any) => {
			try {
				const token = req.cookies.token;
				if (!token) {
					return null;
				}

				const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
				return decodedToken.userID;
			} catch (err) {
				return null;
			}
		},
		signToken: (userId: any) => {
			return jwt.sign({
				userId: userId
			}, process.env.JWT_SECRET);
		}
	});
}

const auth = authManager();

export default auth;
