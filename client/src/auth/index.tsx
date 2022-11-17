import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
	firstName: String;
	lastName: String;
	email: String;
	passwordHash: String;
	playlists: String;
};

interface IAuthContext {
	user: User | null;
	loggedIn: boolean;
	errorMsg: String;
};

const defaultAuth = {
	user: null,
	loggedIn: false,
	errorMsg: ""
};

export const AuthActionType = {
	GET_LOGGED_IN: "GET_LOGGED_IN",
	LOGIN_USER: "LOGIN_USER",
	LOGOUT_USER: "LOGOUT_USER",
	REGISTER_USER: "REGISTER_USER",
	DISMISS_ERROR: "DISMISS_ERROR"
};

const AuthContext = createContext<IAuthContext>(defaultAuth);

type AuthProps = {
	children: React.ReactNode;
};

const AuthContextProvider = (props: AuthProps) => {
	const [auth, setAuth ] = useState(
		defaultAuth
	);
	return <AuthContext.Provider value={defaultAuth}>{props.children}</AuthContext.Provider>;

}

export default AuthContext;
export { AuthContextProvider };
