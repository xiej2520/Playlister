import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { StoreAPICreator, StoreContext } from '../store';

function StatusBar() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	const [openPlaylist, setOpenPlaylist] = useState<string | null>(null);
	
	function handleCreatePlaylist() {
		StoreAPI.createPlaylist();
	}
		
	return (
		<Box
			sx={{
				height: '80%', width: '80%', alignItems: 'center',
				bgcolor: 'primary.main',
				justifyContent: 'center', display: 'flex' 
			}}
		>
		<Button
			onClick={handleCreatePlaylist}
			variant='contained'
		>
			<AddIcon/>
		</Button>
		STATUS
		</Box>
	)
}

export default StatusBar;
