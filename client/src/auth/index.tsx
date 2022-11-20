import api from './auth-request-api'
import React, { createContext, Dispatch, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';

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
	DISMISS_ERROR
};

type AuthAction =
	| { type: AuthActionType.GET_LOGGED_IN, payload: { user: User, loggedIn: boolean} }
	| {
		type: AuthActionType.LOGIN_USER, payload: {
			firstName: string, lastName: string, email: string,
			password: string, passwordVerify: string
		}
	}
	| { type: AuthActionType.LOGOUT_USER, payload: {} }
	| { type: AuthActionType.REGISTER_USER, payload: {} }
	| { type: AuthActionType.DISMISS_ERROR, payload: {} }

const authDefaultDispatch: Dispatch<AuthAction> = () => defaultAuth;

export const AuthContext = createContext({state: defaultAuth, dispatch: authDefaultDispatch});

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
	const authReducer = (state: AuthState, { type, payload }: AuthAction): AuthState => {
		switch(type) {
			case AuthActionType.GET_LOGGED_IN: {
				return {
					...auth,
					user: payload.user,
					loggedIn: payload.loggedIn,
					errorMsg: null
				}
			}
			case AuthActionType.LOGOUT_USER: {
				return {
					...auth,
					user: null,
					loggedIn: false,
					errorMsg: null
				}
			}
			default: return state;
		}
	}

	const [auth, authDispatch] = useReducer(authReducer, defaultAuth);

	const navigate = useNavigate();

	return <AuthContext.Provider value={{ state:auth, dispatch:authDispatch}}>{children}</AuthContext.Provider>;
}

export const AuthAPICreator = (authDispatch: Dispatch<AuthAction>) => ({
	getLoggedIn: async function () {
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
			console.log("Error encountered in getLoggedIn.");
			return false;
		}
	},
	getUserInitials: function (auth: AuthState) {
		let initials = "";
		if (auth.user !== null) {
			initials += auth.user.firstName.charAt(0);
			initials += auth.user.lastName.charAt(0);
		}
		return initials;
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
	}
})

export default {
	AuthAPICreator,
	AuthContext,
	AuthContextProvider,
};
