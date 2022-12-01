import axios from 'axios'
axios.defaults.withCredentials = true
const api = axios.create({
	baseURL: 'http://localhost:4000/auth',
});

export const getLoggedIn = () => api.get('/loggedIn');
export const loginUser = (email: string, password: string) => {
	return api.post(`/login/`, {
		email: email,
		password: password
	})
}
export const logoutUser = () => api.get(`/logout/`)
export const registerUser = (
	firstName: string, lastName: string, username: string, email: string,
	password: string, passwordVerify: string) => {
	return api.post(`/register/`, {
		firstName: firstName,
		lastName: lastName,
		username: username,
		email: email,
		password: password,
		passwordVerify: passwordVerify
	})
}
const apis = {
	getLoggedIn,
	registerUser,
	loginUser,
	logoutUser
}

export default apis;
