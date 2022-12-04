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
	LOAD_PLAYLISTS,
	SET_OPEN_PLAYLIST,
	SET_MODAL,
	SET_SEARCH_TEXT
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
	REMOVE_SONG
};

type CurrentModal =
	| { type: ModalType.NONE }
	| { type: ModalType.DELETE_PLAYLIST, fields: { playlistId: string, playlistName: string } }
	| { type: ModalType.PUBLISH_PLAYLIST, fields: { playlistId: string, playlistName: string } }
	| { type: ModalType.EDIT_SONG, fields: { index: number, title: string, artist: string, youTubeId: string } }
	| { type: ModalType.REMOVE_SONG, fields: { index: number, title: string } }
;

type StoreState = {
	currentScreen: CurrentScreen;
	currentModal: CurrentModal;
	playlists: IPlaylistExport[];
	openPlaylist: IPlaylistExport | null;
	searchText: string;
};

const defaultStore: StoreState = {
	currentScreen: CurrentScreen.NONE,
	currentModal: { type: ModalType.NONE },
	playlists: [],
	openPlaylist: null,
	searchText: ''
};

type StoreAction =
	| { type: StoreActionType.LOAD_SCREEN, payload: { currentScreen: CurrentScreen }}
	| { type: StoreActionType.LOAD_PLAYLISTS, payload: { playlists: IPlaylistExport[] }}
	| { type: StoreActionType.SET_OPEN_PLAYLIST, payload: { playlist: IPlaylistExport | null }}
	| { type: StoreActionType.SET_MODAL, payload: { modal: CurrentModal }}
	| { type: StoreActionType.SET_SEARCH_TEXT, payload: { searchText: string }}
;

const storeDefaultDispatch: Dispatch<StoreAction> = () => defaultStore;

export const StoreContext = createContext(
	{ state: defaultStore, dispatch: storeDefaultDispatch}
);

export const StoreContextProvider = ({ children }: { children: React.ReactNode }) => {
	const storeReducer = (store: StoreState, { type, payload }: StoreAction): StoreState => {
		switch (type) {
			case StoreActionType.LOAD_SCREEN: {
				return {
					...store,
					currentScreen: payload.currentScreen
				};
			}
			case StoreActionType.LOAD_PLAYLISTS: {
				return {
					...store,
					playlists: payload.playlists
				};
			}
			case StoreActionType.SET_OPEN_PLAYLIST: {
				return {
					...store,
					openPlaylist: payload.playlist
				};
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
		storeDispatch({ type: StoreActionType.LOAD_PLAYLISTS, payload: { playlists: []}});
	},
	getUserPlaylists: async function()  {
		try {
			const response = await api.getUserPlaylists();
			if (response.status === 200) {
				storeDispatch({ type: StoreActionType.LOAD_PLAYLISTS, payload: {
					playlists: response.data.playlists
				}});
			}
		}
		catch (err) {
			console.log('Error encountered in getUserPlaylists.');
		}
	},
	getPublishedPlaylists: async function(text: string) {
		try {
			const response = await api.getPublishedPlaylists();
			if (response.status === 200) {
				let playlists: IPlaylistExport[] = response.data.playlists;
				if (store.currentScreen === CurrentScreen.ALL_LISTS) {
					playlists = playlists.filter(p => p.name.includes(text));
				}
				else if (store.currentScreen === CurrentScreen.USER_LISTS) {
					playlists = playlists.filter(p => p.ownerUsername.includes(text));
				}
				storeDispatch({ type: StoreActionType.LOAD_PLAYLISTS, payload: {
					playlists: playlists
				}});
			}
		}
		catch (err) {
			console.log('Error encountered in getPublishedPlaylists');
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
			this.getUserPlaylists();
		}
		catch (err) {
			console.log(err);
		}
	},
	duplicatePlaylist: async function(playlist: IPlaylistExport) {
		try {
			const response = await api.duplicatePlaylist(playlist._id);
			if (store.currentScreen === CurrentScreen.HOME) {
				this.getUserPlaylists();
			}
			else {
				this.getPublishedPlaylists(store.searchText);
			}
		}
		catch (err) {
			console.log(err);
		}
	},
	editPlaylistName: async function(playlist: IPlaylistExport, newName: string) {
		try {
			playlist.name = newName;
			const response = await api.updatePlaylistById(playlist);
			this.getUserPlaylists();
		}
		catch (err) {
			console.log(err);
		}
	},
	updateCurrentPlaylist: async function() {
		try {
			if (store.openPlaylist !== null) {
				const response = await api.updatePlaylistById(store.openPlaylist);
				this.getUserPlaylists();
			}
		}
		catch (err) {
			console.log(err);
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
				this.getUserPlaylists();
			}
		}
		catch (err) {
			console.log(err);
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
			this.getUserPlaylists();
		}
		else {
			console.log('Error: tried to delete playlist without open modal.');
		}
	},
	likePlaylist: async function(playlist: IPlaylistExport) {
		await api.setPlaylistLike(playlist._id, !playlist.liked);
		if (store.currentScreen === CurrentScreen.HOME) {
			this.getUserPlaylists();
		}
		else {
			this.getPublishedPlaylists(store.searchText);
		}
	},
	dislikePlaylist: async function(playlist: IPlaylistExport) {
		await api.setPlaylistDislike(playlist._id, !playlist.disliked);
		if (store.currentScreen === CurrentScreen.HOME) {
			this.getUserPlaylists();
		}
		else {
			this.getPublishedPlaylists(store.searchText);
		}	},
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
					if (store.currentScreen === CurrentScreen.HOME) {
						this.getUserPlaylists();
					}
					else if (store.currentScreen === CurrentScreen.ALL_LISTS ||
						store.currentScreen === CurrentScreen.USER_LISTS) {
							this.getPublishedPlaylists(store.searchText);
					}
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
	}
})

export default {
	StoreContext,
	StoreContextProvider
}
