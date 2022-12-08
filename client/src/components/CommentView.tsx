import { Box, Card, CardContent, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { StoreAPICreator, StoreContext } from '../store';

function CommentView() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	const [text, setText] = useState('');

	let playlist = store.openPlaylist;
	let comments = playlist === null ? <></> :
			playlist.comments.map((comment) => (
				<Card variant='outlined' sx={{ minHeight: '150px' }}>
					<CardContent>
						<Typography sx={{ color:'text.secondary'}} gutterBottom>
							{comment.ownerUsername}
						</Typography>
						<Typography display='block' style={{ wordWrap: 'break-word' }}>
							{comment.text}
						</Typography>
					</CardContent>
				</Card>
		));

	function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.code === 'Enter') {
			StoreAPI.postComment(text);
			setText('');
		}
	}
	function handleUpdateText(event: React.ChangeEvent<HTMLInputElement>) {
		setText(event.target.value);
	}
	return (
		store.openPlaylist === null || store.openPlaylist.publishDate === null ?
		<Box>
			Open a published playlist to see comments!
		</Box> :
		<Box sx={{ display: 'flex', flexDirection: 'column',
			height: '74vh'}}>
			<Box sx={{ flexDirection: 'column', overflow: 'scroll'}}>
				{comments}
			</Box>
			<Box sx={{ flexGrow: 1}}/>
			<TextField
				fullWidth
				onKeyPress={handleKeyPress}
				onClick={(event: any) => {event.stopPropagation()}}
				onChange={handleUpdateText}
				label='Add Comment'
				value={text}
				variant='standard'
			>
			</TextField> 
		</Box>
	);
}

export default CommentView;
