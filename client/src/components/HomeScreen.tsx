import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from 'react';
import { StoreAPICreator, StoreContext } from '../store';
import PlaylistCard from './PlaylistCard';

function HomeScreen() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(storeDispatch);

	useEffect(() => {
		StoreAPI.getUserPlaylists();
	}, [])

	let playlistCards = (
		<Box sx={{ height: '82.5vh', overflow: 'scroll' }}>
			{store.playlists.map((playlist) => (
				<PlaylistCard
					playlist={playlist}/>
			))}
		</Box>
	);
		
	return (<>
		{playlistCards}
	</>);
}

export default HomeScreen;
