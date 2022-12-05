import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useContext } from 'react';
import { CurrentScreen, StoreAPICreator, StoreContext } from '../store';

function StatusBar() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	function handleCreatePlaylist() {
		StoreAPI.createPlaylist();
	}

	let status = '';
	switch (store.currentScreen) {
		case CurrentScreen.HOME:
			status = 'Your Lists';
			break;
		case CurrentScreen.ALL_LISTS:
			status = `${store.searchText} Playlists`
			break;
		case CurrentScreen.USER_LISTS:
			status = `${store.searchText} Playlists`
			break;
		default:
			return <></>;
	}
	return (
		<Box
			sx={{
				height: '80%', width: '80%', alignItems: 'center',
				bgcolor: 'primary.main',
				justifyContent: 'center', display: 'flex' 
			}}
		>
		{
			store.currentScreen === CurrentScreen.HOME ? 
			<Button
				onClick={handleCreatePlaylist}
				sx={{ bgcolor: 'background.paper'}}
				variant='contained'
			>
		
			<AddIcon/>
		</Button> : <></>}&nbsp;
			{status}
		</Box>
	)
}

export default StatusBar;
