import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from 'react';
import { StoreAPICreator, StoreContext } from '../store';
import DeletePlaylistModal from './DeletePlaylistModal';
import EditSongModal from './EditSongModal';
import PlaylistCard from './PlaylistCard';
import RemoveSongModal from './RemoveSongModal';

function HomeScreen() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	useEffect(() => {
		StoreAPI.getUserPlaylists();
	}, [])

	let playlistCards = (
		<Box sx={{ height: '85vh', overflow: 'scroll' }}>
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
		<RemoveSongModal/>
	</>);
}

export default HomeScreen;
