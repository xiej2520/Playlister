import axios from 'axios';
import IPlaylist from '../playlist-model';
axios.defaults.withCredentials = true;
const api = axios.create({
	baseURL: 'http://localhost:4000/api',
})

export const createPlaylist = (newListName: string, newSongs: [], userEmail: string) => {
	return api.post(`/playlist/`, {
		name: newListName,
		ownerEmail: userEmail,
		songs: newSongs,
	})
}
export const getPublishedPlaylists = () => api.get(`/publishedplaylists/`);
export const getUserPlaylists = () => api.get(`/userplaylists/`);
export const deletePlaylistById = (id: string) => api.delete(`/playlist/${id}`);
export const updatePlaylistById = (playlist: IPlaylist) => {
	return api.put(`/playlist/${playlist._id}`, {
		playlist: playlist
	});
};

const apis = {
	createPlaylist,
	deletePlaylistById,
	getPublishedPlaylists,
	getUserPlaylists,
	updatePlaylistById
}

export default apis
