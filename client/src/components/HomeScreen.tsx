import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useContext, useEffect } from 'react';
import { CurrentScreen, StoreAPICreator, StoreContext } from '../store';
import DeletePlaylistModal from './modals/DeletePlaylistModal';
import EditSongModal from './modals/EditSongModal';
import PlaylistCard from './PlaylistCard';
import RemoveSongModal from './modals/RemoveSongModal';
import PublishPlaylistModal from './modals/PublishPlaylistModal';
import StoreErrorModal from './modals/StoreErrorModal';

function HomeScreen() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);
	useEffect(() => {
		StoreAPI.getPlaylists();
	}, [store.currentScreen])

	let playlistCards = (
		<Box sx={{ height: '85vh', overflow: 'scroll', transform: 'rotate(2deg)' }}>
			{store.displayedPlaylists.map((playlist) => (
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
		<StoreErrorModal/>
	</>);
}

export default HomeScreen;
