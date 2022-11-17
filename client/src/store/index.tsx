import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';


export const enum GlobalStoreActionType {
	CHANGE_LIST_NAME,
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

const enum CurrentModal {
	NONE,
	DELETE_LIST,
	EDIT_SONG,
	REMOVE_SONG
};

interface IGlobalStoreContext {
	currentModal: CurrentModal;
	idNamePairs: [];
	currentList: null;
};

const defaultStore: IGlobalStoreContext = {
	currentModal: CurrentModal.NONE,
	idNamePairs: [],
	currentList: null
};

const GlobalStoreContext = createContext<IGlobalStoreContext>(defaultStore);

const GlobalStoreContextProvider = (props: any) => {
	const [store, setStore] = useState({
		defaultStore
	});
	
	return <GlobalStoreContext.Provider value={defaultStore}>
	{props.children}
	</GlobalStoreContext.Provider>
}
export default GlobalStoreContext;
export { GlobalStoreContextProvider };
