import { Box, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import { StoreAPICreator, StoreContext } from '../store';

function CommentView() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	const [text, setText] = useState('');

	let playlist = store.openPlaylist;
	let comments = playlist === null ? <></> :
			playlist.comments.map((comment) => (
			<></>
		));

	function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.code === 'Enter') {
			//StoreAPI.editPlaylistName(playlist, text);
			//setEditActive(false);
		}
	}
	function handleUpdateText(event: React.ChangeEvent<HTMLInputElement>) {
		setText(event.target.value);
	}
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column',
			height: '74vh', overflow: 'scroll' }}>
			{comments}
			<Box sx={{ flexGrow: 1}}/>
			<TextField
				fullWidth
				onKeyPress={handleKeyPress}
				onClick={(event: any) => {event.stopPropagation()}}
				onChange={handleUpdateText}
				label='Add Comment'
				variant='standard'
			>
			</TextField> 
		</Box>
	);
}

export default CommentView;
