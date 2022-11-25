import { createContext, Dispatch, useContext, useReducer, useState } from 'react';
import api from './store-request-api';
import { IPlaylist } from './playlist-model';

export const enum StoreActionType {
	LOAD_SCREEN,
	LOAD_PLAYLISTS,
	CLOSE_CURRENT_LIST,
	CREATE_NEW_LIST,
	LOAD_ID_NAME_PAIRS,
	MARK_LIST_FOR_DELETION,
	SET_CURRENT_LIST,
	SET_LIST_NAME_EDIT_ACTIVE,
	EDIT_SONG,
	REMOVE_SONG,
	HIDE_MODALS
};

const enum CurrentScreen {
	NONE,
	HOME,
	ALL_LISTS,
	USER_LISTS
}

const enum CurrentModal {
	NONE,
	DELETE_LIST,
	EDIT_SONG,
	REMOVE_SONG
};

type StoreState = {
	currentScreen: CurrentScreen;
	currentModal: CurrentModal;
	playlists: IPlaylist[];
	currentList: null;
};

const defaultStore: StoreState = {
	currentScreen: CurrentScreen.NONE,
	currentModal: CurrentModal.NONE,
	playlists: [],
	currentList: null
};

type StoreAction =
	| { type: StoreActionType.LOAD_SCREEN, payload: { currentScreen: CurrentScreen }}
	| { type: StoreActionType.LOAD_PLAYLISTS, payload: { playlists: IPlaylist[] }}

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
			default: return store;
		}
	}

	const [store, storeDispatch] = useReducer(storeReducer, defaultStore);

	return <StoreContext.Provider value={{ state: store, dispatch: storeDispatch }}>
		{children}
	</StoreContext.Provider>;
}

export const StoreAPICreator = (storeDispatch: Dispatch<StoreAction>) => ({
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
	}
})

export default {
	StoreContext,
	StoreContextProvider
}