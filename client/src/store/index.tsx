import { createContext, Dispatch, useContext, useReducer, useState } from 'react';
import api from './store-request-api';
import { IPlaylistExport, ISong } from './playlist-model';
import { tsTPS, tsTPS_Transaction } from '../common/tsTPS';
import CreateSongTransaction from './transactions/CreateSongTransaction';
import RemoveSongTransaction from './transactions/RemoveSongTransaction';
import EditSongTransaction from './transactions/EditSongTransaction';
import MoveSongTransaction from './transactions/MoveSongTransaction';

const tps = new tsTPS();

export const enum StoreActionType {
	LOAD_SCREEN,
	GET_PLAYLISTS,
	DISPLAY_PLAYLISTS,
	SET_OPEN_PLAYLIST,
	SET_PLAYING_PLAYLIST,
	SET_MODAL,
	SET_SEARCH_TEXT,
	SET_SORT_TYPE
};

export const enum CurrentScreen {
	NONE,
	HOME,
	ALL_LISTS,
	USER_LISTS
}

export const enum ModalType {
	NONE,
	DELETE_PLAYLIST,
	PUBLISH_PLAYLIST,
	EDIT_SONG,
	REMOVE_SONG,
	ERROR
};

export const enum SortType {
	NONE,
	NAME,
	EDIT_DATE,
	CREATION_DATE,
	PUBLISH_DATE,
	LISTENS,
	LIKES,
	DISLIKES
};

type CurrentModal =
	| { type: ModalType.NONE }
	| { type: ModalType.DELETE_PLAYLIST, fields: { playlistId: string, playlistName: string } }
	| { type: ModalType.PUBLISH_PLAYLIST, fields: { playlistId: string, playlistName: string } }
	| { type: ModalType.EDIT_SONG, fields: { index: number, title: string, artist: string, youTubeId: string } }
	| { type: ModalType.REMOVE_SONG, fields: { index: number, title: string } }
	| { type: ModalType.ERROR, fields: { errorMsg: string }}
;

type StoreState = {
	currentScreen: CurrentScreen;
	currentModal: CurrentModal;
	playlists: IPlaylistExport[];
	displayedPlaylists: IPlaylistExport[];
	openPlaylist: IPlaylistExport | null;
	playing: { playlist: IPlaylistExport, index: number } | null;
	searchText: string;
	sortType: SortType;
};

const defaultStore: StoreState = {
	currentScreen: CurrentScreen.NONE,
	currentModal: { type: ModalType.NONE },
	playlists: [],
	displayedPlaylists: [],
	openPlaylist: null,
	playing: null,
	searchText: '',
	sortType: SortType.NONE
};

type StoreAction =
	| { type: StoreActionType.LOAD_SCREEN, payload: { currentScreen: CurrentScreen }}
	| { type: StoreActionType.GET_PLAYLISTS, payload: { playlists: IPlaylistExport[] }}
	| { type: StoreActionType.DISPLAY_PLAYLISTS, payload: { displayedPlaylists: IPlaylistExport[] }}
	| { type: StoreActionType.SET_OPEN_PLAYLIST, payload: { playlist: IPlaylistExport | null }}
	| { type: StoreActionType.SET_MODAL, payload: { modal: CurrentModal }}
	| { type: StoreActionType.SET_SEARCH_TEXT, payload: { searchText: string }}
	| { type: StoreActionType.SET_SORT_TYPE, payload: { sortType: SortType }}
	| { type: StoreActionType.SET_PLAYING_PLAYLIST, payload: { playlist: IPlaylistExport, index: number } | null }
;

const storeDefaultDispatch: Dispatch<StoreAction> = () => defaultStore;

export const StoreContext = createContext(
	{ state: defaultStore, dispatch: storeDefaultDispatch}
);
function sortPlaylists(playlists: IPlaylistExport[], sortType: SortType) {
	switch (sortType) {
		case SortType.NAME:
			playlists.sort((a, b) => a.name.localeCompare(b.name));
		break;
		case SortType.EDIT_DATE:
			playlists.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
		break;
		case SortType.CREATION_DATE:
			playlists.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
		break;
		case SortType.PUBLISH_DATE:
			playlists.sort((a, b) => {
				if (b.publishDate === null) {
					return 1;
				}
				else if (a.publishDate === null) {
					return -1;
				}
				return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime();
			});
		break;
		case SortType.LISTENS:
			playlists.sort((a, b) => b.listens - a.listens);
		break;
		case SortType.LIKES:
			playlists.sort((a, b) => b.likeCount - a.likeCount);
		break;
		case SortType.DISLIKES:
			playlists.sort((a, b) => b.dislikeCount - a.dislikeCount);
		break;
	}
};

export const StoreContextProvider = ({ children }: { children: React.ReactNode }) => {
	const storeReducer = (store: StoreState, { type, payload }: StoreAction): StoreState => {
		switch (type) {
			case StoreActionType.LOAD_SCREEN: {
				return {
					...store,
					currentScreen: payload.currentScreen
				};
			}
			case StoreActionType.GET_PLAYLISTS: {
				let openPlaylist = null;
				if (store.openPlaylist !== null) {
					for (const p of payload.playlists) {
						if (p._id === store.openPlaylist._id) {
							openPlaylist = p;
						}
					}
				}
				return {
					...store,
					openPlaylist: openPlaylist,
					playlists: payload.playlists
				};
			}
			case StoreActionType.DISPLAY_PLAYLISTS: {
				return {
					...store,
					displayedPlaylists: payload.displayedPlaylists,
				};
			}
			case StoreActionType.SET_OPEN_PLAYLIST: {
				return {
					...store,
					openPlaylist: payload.playlist
				};
			}
			case StoreActionType.SET_PLAYING_PLAYLIST: {
				return {
					...store,
					playing: payload
				}
			}
			case StoreActionType.SET_MODAL: {
				return {
					...store,
					currentModal: payload.modal
				};
			}
			case StoreActionType.SET_SEARCH_TEXT: {
				return {
					...store,
					searchText: payload.searchText
				};
			}
			case StoreActionType.SET_SORT_TYPE: {
				sortPlaylists(store.playlists, payload.sortType);
				return {
					...store,
					sortType: payload.sortType
				};
			}
			default: return store;
		}
	}

	const [store, storeDispatch] = useReducer(storeReducer, defaultStore);

	return <StoreContext.Provider value={{ state: store, dispatch: storeDispatch }}>
		{children}
	</StoreContext.Provider>;
}

export const StoreAPICreator = (store: StoreState, storeDispatch: Dispatch<StoreAction>) => ({
	unloadPlaylists: function() {
		storeDispatch({ type: StoreActionType.GET_PLAYLISTS, payload: { playlists: [] }});
		storeDispatch({ type: StoreActionType.DISPLAY_PLAYLISTS, payload: { displayedPlaylists: [] }})
	},
	getPlaylists: async function() {
		try {
			let response;
			if (store.currentScreen === CurrentScreen.HOME) {
				response = await api.getUserPlaylists();
			}
			else {
				response = await api.getPublishedPlaylists();
			}
			let playlists: IPlaylistExport[] = response.data.playlists;
			storeDispatch({ type: StoreActionType.GET_PLAYLISTS, payload: {
				playlists: playlists
			}});
			if (store.searchText !== '') {
				const lowerText = store.searchText.toLowerCase();
				if (store.currentScreen === CurrentScreen.ALL_LISTS) {
					playlists = playlists.filter(p => p.name.toLowerCase().includes(lowerText));
				}
				else if (store.currentScreen === CurrentScreen.USER_LISTS) {
					playlists = playlists.filter(p => p.ownerUsername.toLowerCase().includes(lowerText));
				}
				sortPlaylists(playlists, store.sortType);
				storeDispatch({ type: StoreActionType.DISPLAY_PLAYLISTS, payload: {
					displayedPlaylists: playlists
				}});
			}
		}
		catch (err) {
			console.log('Error encountered in getPlaylists.');
		}
	},
	displayPlaylists: function() {
		let playlists = store.playlists;
		if (store.searchText !== '') {
			const lowerText = store.searchText.toLowerCase();
			if (store.currentScreen === CurrentScreen.ALL_LISTS) {
				playlists = playlists.filter(p => p.name.toLowerCase().includes(lowerText));
			}
			else if (store.currentScreen === CurrentScreen.USER_LISTS) {
				playlists = playlists.filter(p => p.ownerUsername.toLowerCase().includes(lowerText));
			}
			sortPlaylists(playlists, store.sortType);
			storeDispatch({ type: StoreActionType.DISPLAY_PLAYLISTS, payload: {
				displayedPlaylists: playlists
			}});
		}
	},
	setOpenPlaylist: function(playlist: IPlaylistExport | null) {
		storeDispatch({ type: StoreActionType.SET_OPEN_PLAYLIST, payload: {
			playlist: playlist
		}});
		tps.clearAllTransactions();
	},
	createPlaylist: async function() {
		try {
			const response = await api.createPlaylist();
			this.getPlaylists();
		}
		catch (err) {
			console.log(err);
		}
	},
	duplicatePlaylist: async function(playlist: IPlaylistExport) {
		try {
			const response = await api.duplicatePlaylist(playlist._id);
			this.getPlaylists();
		}
		catch (err) {
			console.log(err);
		}
	},
	editPlaylistName: async function(playlist: IPlaylistExport, newName: string) {
		try {
			playlist.name = newName;
			const response = await api.updatePlaylistById(playlist);
			this.getPlaylists();
			return true;
		}
		catch (err: any) {
			storeDispatch({
				type: StoreActionType.SET_MODAL,
				payload: {
					modal: { type: ModalType.ERROR, fields: {
						errorMsg: err.response.data.errorMessage
					}}
				}
			});
			this.getPlaylists();
			console.log(err);
			return false;
		}
	},
	updateCurrentPlaylist: async function() {
		try {
			if (store.openPlaylist !== null) {
				const response = await api.updatePlaylistById(store.openPlaylist);
				this.getPlaylists();
			}
		}
		catch (err) {
			console.log('Error encountered in updateCurrentPlaylist.');
		}
	},
	showPublishPlaylistModal: function(playlist: IPlaylistExport) {
		storeDispatch({ type: StoreActionType.SET_MODAL, payload: {
			modal: { type: ModalType.PUBLISH_PLAYLIST, fields: {
				playlistId: playlist._id,
				playlistName: playlist.name
			}}
		}});
	},
	publishPlaylist: async function() {
		try {
			if (store.currentModal.type === ModalType.PUBLISH_PLAYLIST) {
				const response = await api.publishPlaylistById(store.currentModal.fields.playlistId);
				this.getPlaylists();
			}
		}
		catch (err) {
			console.log('Error encountered in publishPlaylist.');
		}
	},
	showDeletePlaylistModal: function(playlist: IPlaylistExport) {
		storeDispatch({ type: StoreActionType.SET_MODAL, payload: {
			modal: { type: ModalType.DELETE_PLAYLIST, fields: {
				playlistId: playlist._id,
				playlistName: playlist.name
			}}
		}});
	},
	deletePlaylist: async function() {
		if (store.currentModal.type === ModalType.DELETE_PLAYLIST) {
			await api.deletePlaylistById(store.currentModal.fields.playlistId);
			this.closeModal();
			this.getPlaylists();
		}
		else {
			console.log('Error: tried to delete playlist without open modal.');
		}
	},
	likePlaylist: async function(playlist: IPlaylistExport) {
		await api.setPlaylistLike(playlist._id, !playlist.liked);
		this.getPlaylists();
	},
	dislikePlaylist: async function(playlist: IPlaylistExport) {
		await api.setPlaylistDislike(playlist._id, !playlist.disliked);
		this.getPlaylists();
	},
	closeModal: function() {
		storeDispatch({ type: StoreActionType.SET_MODAL, payload: {
			modal: { type: ModalType.NONE }} }
		);
	},
	showEditSongModal: function(index: number, song: ISong) {
		storeDispatch({ type: StoreActionType.SET_MODAL, payload: {
			modal: { type: ModalType.EDIT_SONG, fields: {
				index: index,
				title: song.title,
				artist: song.artist,
				youTubeId: song.youTubeId
			}}
		}});
	},
	showRemoveSongModal: function(index: number, song: ISong) {
		storeDispatch({ type: StoreActionType.SET_MODAL, payload: {
			modal: { type: ModalType.REMOVE_SONG, fields: { index: index, title: song.title }}
		}});
	},
	addSong: function(index: number, song: ISong) {
		if (store.openPlaylist !== null) {
			store.openPlaylist.songs.splice(index, 0, song);
			this.updateCurrentPlaylist();
		}
	},
	moveSong: function(start: number, end: number) {
		if (store.openPlaylist !== null) {
			let list = store.openPlaylist;

			if (start < end) {
				let temp = list.songs[start];
				for (let i = start; i < end; i++) {
					list.songs[i] = list.songs[i + 1];
				}
				list.songs[end] = temp;
			}
			else if (start > end) {
				let temp = list.songs[start];
				for (let i = start; i > end; i--) {
					list.songs[i] = list.songs[i - 1];
				}
				list.songs[end] = temp;
			}
			this.updateCurrentPlaylist();
		}
	},
	removeSong: function(index: number) {
		if (store.openPlaylist !== null) {
			store.openPlaylist.songs.splice(index, 1);
			this.updateCurrentPlaylist();
		}
	},
	editSong: function(index: number, song: ISong) {
		if (store.openPlaylist !== null) {
			store.openPlaylist.songs[index] = song;
			console.log(store.openPlaylist.songs[index]);
			this.updateCurrentPlaylist();
		}
	},
	undo: function() {
		tps.undoTransaction();
	},
	redo: function() {
		tps.doTransaction();
	},
	addCreateSongTransaction: function() {
		if (store.openPlaylist !== null) {
			let song: ISong = {
				title: 'Untitled',
				artist: 'Unknown',
				youTubeId: 'dQw4w9WgXcQ'
			};
			let index = store.openPlaylist.songs.length;
			tps.addTransaction(new CreateSongTransaction(this, index, song));
		}
		else {
			console.log('Tried to add song to null playlist.');
		}
	},
	addMoveSongTransaction: function(start: number, end: number) {
		if (store.openPlaylist !== null) {
			tps.addTransaction(new MoveSongTransaction(this, start, end));
		}
		else {
			console.log('Tried to move song in null playlist.');
		}
	},
	addEditSongTransaction: function(newSong: ISong) {
		if (store.openPlaylist !== null && store.currentModal.type === ModalType.EDIT_SONG) {
			let index = store.currentModal.fields.index;
			let oldSong = store.openPlaylist.songs[index];
			tps.addTransaction(new EditSongTransaction(this, index, oldSong, newSong));
			this.closeModal()
		}
		else {
			console.log('Tried to edit song of null playlist.')
		}
	},
	addRemoveSongTransaction: function() {
		if (store.openPlaylist !== null && store.currentModal.type === ModalType.REMOVE_SONG) {
			let index = store.currentModal.fields.index;
			let oldSong = store.openPlaylist.songs[index];
			tps.addTransaction(new RemoveSongTransaction(this, index, oldSong));
			this.closeModal();
		}
		else {
			console.log('Tried to remove song from null playlist.');
		}
	},
	canUndo: function() {
		return tps.hasTransactionToUndo();
	},
	canRedo: function() {
		return tps.hasTransactionToRedo();
	},
	postComment: async function(text: string) {
		if (store.openPlaylist !== null && store.openPlaylist.publishDate !== null) {
			try {
				const response = await api.commentPlaylist(store.openPlaylist._id, text);
				if (response.status === 200) {
					this.getPlaylists();
				}
				// openPlaylist needs to be updated...
				// this is the only place where its used like this
				storeDispatch({ type: StoreActionType.SET_OPEN_PLAYLIST, payload: {
					playlist: response.data.playlist
				}});
			}
			catch (err) {
				console.log('Error encountered in postComment');
			}
		}
	},
	loadPlaylist: async function(playlist: IPlaylistExport) {
		playlist.listens++;
		const response = await api.updatePlaylistListens(playlist);
		this.getPlaylists();
		storeDispatch({ type: StoreActionType.SET_PLAYING_PLAYLIST, payload: {
			playlist: playlist,
			index: -1
		}});
	}
})

export default {
	StoreContext,
	StoreContextProvider
}
