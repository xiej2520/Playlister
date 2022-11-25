import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import { useContext, useEffect, useState } from 'react';
import { AuthAPICreator, AuthContext } from '../auth';
import { StoreAPICreator, StoreContext } from '../store';
import PlaylistCard from './PlaylistCard';

function HomeScreen() {
	const { state: auth, dispatch: authDispatch } = useContext(AuthContext);
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const AuthAPI = AuthAPICreator(authDispatch);
	const StoreAPI = StoreAPICreator(storeDispatch);

	useEffect(() => {
		console.log("calling once");
		StoreAPI.getUserPlaylists();
	}, [])

	const [openPlaylist, setOpenPlaylist] = useState<string | null>(null);
	let playlistCards = (
		<Box>
			{store.playlists.map((playlist) => (
				<PlaylistCard
					openPlaylist={openPlaylist}
					setOpenPlaylist={setOpenPlaylist}
					playlist={playlist}/>
			))}
		</Box>
	);
		
	return (<>
		{playlistCards}
	</>);
}

export default HomeScreen;
