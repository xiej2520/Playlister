import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useContext, useEffect } from 'react';
import { CurrentScreen, StoreAPICreator, StoreContext } from '../store';
import DeletePlaylistModal from './modals/DeletePlaylistModal';
import EditSongModal from './modals/EditSongModal';
import PlaylistCard from './PlaylistCard';
import RemoveSongModal from './modals/RemoveSongModal';
import PublishPlaylistModal from './modals/PublishPlaylistModal';

function HomeScreen() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);
	useEffect(() => {
		if (store.currentScreen === CurrentScreen.HOME) {
			StoreAPI.getUserPlaylists();
		}
		else if (store.currentScreen === CurrentScreen.ALL_LISTS) {
			
			StoreAPI.unloadPlaylists();
		}
		else if (store.currentScreen === CurrentScreen.USER_LISTS) {
			
			StoreAPI.unloadPlaylists();
		}
		else {
			StoreAPI.unloadPlaylists();
		}
	}, [store.currentScreen])

	let playlistCards = (
		<Box sx={{ height: '85vh', overflow: 'scroll', transform: 'rotate(2deg)' }}>
			{store.playlists.map((playlist) => (
				<PlaylistCard
					key={playlist._id}
					playlist={playlist}/>
			))}
		</Box>
	);
		
	return (<>
		{playlistCards}
		<DeletePlaylistModal/>
		<EditSongModal/>
		<PublishPlaylistModal/>
		<RemoveSongModal/>
	</>);
}

export default HomeScreen;
