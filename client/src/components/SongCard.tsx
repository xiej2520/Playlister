import { Box, Button } from "@mui/material";
import { useContext, useState } from "react";
import { StoreContext, StoreAPICreator } from "../store";
import { ISong } from "../store/playlist-model";

function SongCard(props: { song: ISong, index: number, playing: boolean, published: boolean }) {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);
	const { song, index, playing, published } = props;
	const [draggedTo, setDraggedTo] = useState(false);

	function handleDragStart(event: React.DragEvent<HTMLElement>) {
		event.dataTransfer.setData('song', index.toString());
	}
	function handleDragOver(event: React.DragEvent<HTMLElement>) {
		event.preventDefault();
	}
	function handleDragEnter(event: React.DragEvent<HTMLElement>) {
		event.preventDefault();
		setDraggedTo(true);
	}
	function handleDragLeave(event: React.DragEvent<HTMLElement>) {
		event.preventDefault();
		setDraggedTo(false);
	}
	function handleDrop(event: React.DragEvent<HTMLElement>) {
		event.preventDefault();
		let startIndex = Number(event.dataTransfer.getData('song'));
		let endIndex = index;
		setDraggedTo(false);
		StoreAPI.addMoveSongTransaction(startIndex, endIndex);
	}
	function handleRemoveSong(event: React.MouseEvent<HTMLButtonElement>) {
		StoreAPI.showRemoveSongModal(index, song);
	}
	function handleClick(event: React.MouseEvent<HTMLElement>) {
		if (event.detail === 2) {
			StoreAPI.showEditSongModal(index, song);
		}
	}
	const backgroundColor = draggedTo ? 'grey.900' : playing ? 'primary.dark' : 'background.paper';
	return (
		<Box
			key={index}
			id={'song-' + index + '-card'}
			sx={{
				alignItems: 'center',
				bgcolor: backgroundColor,
				borderRadius: '4px',
				display: 'flex',
				margin: '4px',
				padding: '8px',
				"&:hover": {
					bgcolor: 'grey.900',
				}
			}}
			draggable={published ? 'false' : 'true'}
			/*
			className={cardClass}
			*/
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onClick={published ? () => {} : handleClick}
		>
			{index + 1}.&nbsp;
			<a
				id={'song-' + index + '-link'}
				className="song-link"
				href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
				{song.title} by {song.artist}
			</a>
			<Box sx={{ flexGrow: 1 }}/>
			{published ? <></> :
			<Button
				variant="contained"
				id={"remove-song-" + index}
				className="list-card-button"
				onClick={handleRemoveSong}
			>
			&#x2715;
			</Button>
			}
		</Box>
	);
}

export default SongCard;
