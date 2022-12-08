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
export const updatePlaylistNameById = (playlist: IPlaylistExport) => {
	return api.put(`/playlist/name/${playlist._id}`, {
		playlist: playlist
	});
};
export const setPlaylistLike = (id: string, like: boolean) =>
	api.put(`/playlist/like/${id}`, { like: like });
export const setPlaylistDislike = (id: string, dislike: boolean) =>
	api.put(`/playlist/dislike/${id}`, { dislike: dislike });
export const commentPlaylist = (id: string, comment: string) =>
	api.post(`/playlist/comment/${id}`, { comment: comment });

const apis = {
	createPlaylist,
	deletePlaylistById,
	duplicatePlaylist,
	getPublishedPlaylists,
	getUserPlaylists,
	publishPlaylistById,
	setPlaylistLike,
	setPlaylistDislike,
	commentPlaylist,
	updatePlaylistById,
	updatePlaylistNameById
}

export default apis
