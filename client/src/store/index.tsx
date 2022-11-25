import { createContext, Dispatch, useContext, useReducer, useState } from 'react';
import api from './store-request-api';
import { IPlaylistExport, ISong } from './playlist-model';
import tsTPS, { tsTPS_Transaction } from '../common/tsTPS';
import CreateSongTransaction from './transactions/CreateSongTransaction';
import RemoveSongTransaction from './transactions/RemoveSongTransaction';

const tps = new tsTPS();

export const enum StoreActionType {
	LOAD_SCREEN,
	LOAD_PLAYLISTS,
	SET_OPEN_PLAYLIST,
	SET_MODAL,
	CREATE_NEW_LIST,
	LOAD_ID_NAME_PAIRS,
	MARK_LIST_FOR_DELETION,
	SET_LIST_NAME_EDIT_ACTIVE,
	EDIT_SONG,
	REMOVE_SONG,
	HIDE_MODALS
};

export const enum CurrentScreen {
	NONE,
	HOME,
	ALL_LISTS,
	USER_LISTS
}

export const enum ModalType {
	NONE,
	DELETE_LIST,
	EDIT_SONG,
	REMOVE_SONG
};

type CurrentModal =
	| { type: ModalType.NONE }
	| { type: ModalType.DELETE_LIST, fields: { playlistId: string, playlistName: string } }
	| { type: ModalType.EDIT_SONG, fields: { index: number, title: string, artist: string, youTubeId: string } }
	| { type: ModalType.REMOVE_SONG, fields: { index: number, title: string } }
;

type StoreState = {
	currentScreen: CurrentScreen;
	currentModal: CurrentModal;
	playlists: IPlaylistExport[];
	openPlaylist: IPlaylistExport | null;
};

const defaultStore: StoreState = {
	currentScreen: CurrentScreen.NONE,
	currentModal: { type: ModalType.NONE },
	playlists: [],
	openPlaylist: null
};

type StoreAction =
	| { type: StoreActionType.LOAD_SCREEN, payload: { currentScreen: CurrentScreen }}
	| { type: StoreActionType.LOAD_PLAYLISTS, payload: { playlists: IPlaylistExport[] }}
	| { type: StoreActionType.SET_OPEN_PLAYLIST, payload: { playlist: IPlaylistExport | null }}
	| { type: StoreActionType.SET_MODAL, payload: { modal: CurrentModal }}
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
			default: return store;
		}
	}

	const [store, storeDispatch] = useReducer(storeReducer, defaultStore);

	return <StoreContext.Provider value={{ state: store, dispatch: storeDispatch }}>
		{children}
	</StoreContext.Provider>;
}

export const StoreAPICreator = (store: StoreState, storeDispatch: Dispatch<StoreAction>) => ({
	getUserPlaylists: async function()  {
		try {
			const response = await api.getUserPlaylists();
			console.log('loading playlists')
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
	setOpenPlaylist: function(playlist: IPlaylistExport | null) {
		storeDispatch({ type: StoreActionType.SET_OPEN_PLAYLIST, payload: {
			playlist: playlist
		}});
	},
	updateCurrentPlaylist: async function() {
		try {
			if (store.openPlaylist !== null) {
				console.log('updating playlist')
				const response = await api.updatePlaylistById(store.openPlaylist);
				this.getUserPlaylists();
			}
		}
		catch (err) {
			console.log(err);
		}
	},
	closeModal: function() {
		storeDispatch({ type: StoreActionType.SET_MODAL, payload: {
			modal: { type: ModalType.NONE}} }
		);
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
	removeSong: function(index: number) {
		if (store.openPlaylist !== null) {
			console.log('removing song')
			store.openPlaylist.songs.splice(index, 1);
			this.updateCurrentPlaylist();
		}
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
	addRemoveSongTransaction: function() {
		if (store.openPlaylist !== null && store.currentModal.type == ModalType.REMOVE_SONG) {
			let index = store.currentModal.fields.index;
			let oldSong = store.openPlaylist.songs[index];
			tps.addTransaction(new RemoveSongTransaction(this, index, oldSong));
			this.closeModal();
		}
		else {
			console.log('Tried to remove song from null playlist.');
		}
	}

})

export default {
	StoreContext,
	StoreContextProvider
}