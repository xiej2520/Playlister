import { Box } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { StoreAPICreator, StoreContext } from '../store';
import PlaylistCard from './PlaylistCard';

function StatusBar() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	const [openPlaylist, setOpenPlaylist] = useState<string | null>(null);
		
	return (
		<Box
			sx={{
				height: '80%', width: '80%', alignItems: 'center',
				bgcolor: 'primary.main',
				justifyContent: 'center', display: 'flex' 
			}}
		>
		STATUS
		</Box>
	)
}

export default StatusBar;
