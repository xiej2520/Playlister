import api from './auth-request-api'
import React, { createContext, Dispatch, useReducer } from 'react';

interface User {
	firstName: String;
	lastName: String;
	email: String;
	passwordHash: String;
	playlists: String;
};

type AuthState = {
	user: User | null;
	loggedIn: boolean;
	errorMsg: String | null;
};

const defaultAuth: AuthState = {
	user: null,
	loggedIn: false,
	errorMsg: null,
};

export const enum AuthActionType {
	GET_LOGGED_IN,
	LOGIN_USER,
	LOGOUT_USER,
	REGISTER_USER,
	SET_ERROR_MESSAGE
};

type AuthAction =
	| { type: AuthActionType.GET_LOGGED_IN, payload: { user: User, loggedIn: boolean} }
	| { type: AuthActionType.LOGIN_USER, payload: { user: User } }
	| { type: AuthActionType.LOGOUT_USER, payload: {} }
	| { type: AuthActionType.REGISTER_USER, payload: { user: User }
	}
	| { type: AuthActionType.SET_ERROR_MESSAGE, payload: { errorMsg: string | null } }

const authDefaultDispatch: Dispatch<AuthAction> = () => defaultAuth;

export const AuthContext = createContext({state: defaultAuth, dispatch: authDefaultDispatch});

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
	const authReducer = (auth: AuthState, { type, payload }: AuthAction): AuthState => {
		switch (type) {
			case AuthActionType.GET_LOGGED_IN: {
				return {
					...auth,
					user: payload.user,
					loggedIn: payload.loggedIn,
					errorMsg: null
				};
			}
			case AuthActionType.LOGIN_USER: {
				return {
					...auth,
					user: payload.user,
					loggedIn: true
				};
			}
			case AuthActionType.LOGOUT_USER: {
				return {
					...auth,
					user: null,
					loggedIn: false,
					errorMsg: null
				};
			}
			case AuthActionType.REGISTER_USER: {
				return {
					...auth,
					user: payload.user,
					loggedIn: true
				};
			}
			case AuthActionType.SET_ERROR_MESSAGE: {
				console.log(payload.errorMsg)
				return {
					...auth,
					errorMsg: payload.errorMsg
				};
			}
			default: return auth;
		}
	}

	const [auth, authDispatch] = useReducer(authReducer, defaultAuth);

	return <AuthContext.Provider value={{ state: auth, dispatch: authDispatch}}>{children}</AuthContext.Provider>;
}

export const AuthAPICreator = (authDispatch: Dispatch<AuthAction>) => ({
	getLoggedIn: async function() {
		try {
			const response = await api.getLoggedIn();
			if (response.status === 200) {
				authDispatch({ type: AuthActionType.GET_LOGGED_IN, payload: {
					loggedIn: response.data.loggedIn,
					user: response.data.user
				}});
				return response.data.loggedIn;
			}
		}
		catch (err) {
			console.log('Error encountered in getLoggedIn.');
			return false;
		}
	},
	getUserInitials: function (auth: AuthState) {
		let initials = '';
		if (auth.user !== null) {
			initials += auth.user.firstName.charAt(0);
			initials += auth.user.lastName.charAt(0);
		}
		return initials;
	},
	loginUser: async (email: string, password: string) => {
		try {
			const response = await api.loginUser(email, password);
			if (response.status === 200) {
				authDispatch({ type: AuthActionType.LOGIN_USER, payload: { user: response.data.user}});
				return true;
			}
			return false;
		}
		catch (err: any) {
			console.log(err.response.data.errorMessage);
			authDispatch({
				type: AuthActionType.SET_ERROR_MESSAGE,
				payload: { errorMsg: err.response.data.errorMessage }
			});
			return false;
		}
	},
	logoutUser: async () => {
		try {
			const response = await api.logoutUser();
			if (response.status === 200) {
				authDispatch({ type: AuthActionType.LOGOUT_USER, payload: {}});
			}
		}
		catch (err) {
			console.log("Error encountered in logoutUser.");
		}
	},
	registerUser: async (firstName: string, lastName: string, username: string, 
		email: string, password: string, passwordVerify: string) => {
		try {
			const response = await api.registerUser(
				firstName, lastName, username, email, password, passwordVerify
			);
			if (response.status === 200) {
				authDispatch({
					type: AuthActionType.REGISTER_USER,
					payload: {
						user: response.data.user,
					}
				});
				return true;
			}
		}
		catch (err: any) {
			authDispatch({
				type: AuthActionType.SET_ERROR_MESSAGE,
				payload: {
					errorMsg: err.response.data.errorMessage
				}
			});
			return false;
		}
	},
	setErrorMessage: function(errorMsg: string | null) {
		authDispatch({
			type: AuthActionType.SET_ERROR_MESSAGE,
			payload: { errorMsg: errorMsg }
		});
	}
})

export default {
	AuthAPICreator,
	AuthContext,
	AuthContextProvider,
};
