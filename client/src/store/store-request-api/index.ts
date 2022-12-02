import axios from 'axios';
import IPlaylistExport, { ISong } from '../playlist-model';
axios.defaults.withCredentials = true;
const api = axios.create({
	baseURL: 'http://localhost:4000/api',
})

export const createPlaylist = () => { return api.post(`/playlist/`) };
export const duplicatePlaylist = (id: string) => { return api.post(`/duplicateplaylist/${id}`) };
export const getPublishedPlaylists = () => api.get(`/publishedplaylists/`);
export const getUserPlaylists = () => api.get(`/userplaylists/`);
export const deletePlaylistById = (id: string) => api.delete(`/playlist/${id}`);
export const publishPlaylistById = (id: string) => api.put(`/playlist/publish/${id}`);
export const updatePlaylistById = (playlist: IPlaylistExport) => {
	return api.put(`/playlist/${playlist._id}`, {
		playlist: playlist
	});
};

const apis = {
	createPlaylist,
	deletePlaylistById,
	duplicatePlaylist,
	getPublishedPlaylists,
	getUserPlaylists,
	publishPlaylistById,
	updatePlaylistById
}

export default apis
