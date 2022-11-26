import { Box, Button } from "@mui/material";
import { useContext, useState } from "react";
import { AuthAPICreator } from "../auth";
import { StoreContext, StoreAPICreator } from "../store";
import { ISong } from "../store/playlist-model";

function SongCard(props: { song: ISong, index: number}) {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);
	const { song, index } = props;
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
		let targetIndex = index;
		let sourceIndex = Number(event.dataTransfer.getData('song'));
		setDraggedTo(false);
	}
	function handleRemoveSong(event: React.MouseEvent<HTMLButtonElement>) {
		StoreAPI.showRemoveSongModal(index, song);
	}
	function handleClick(event: React.MouseEvent<HTMLElement>) {
		if (event.detail === 2) {
			StoreAPI.showEditSongModal(index, song);
		}
	}
	return (
		<Box
			key={index}
			id={'song-' + index + '-card'}
			sx={{
				alignItems: 'center',
				bgcolor: draggedTo ? 'primary' : 'background.paper',
				borderRadius: '4px',
				display: 'flex',
				margin: '4px',
				padding: '8px'
			}}
			draggable='true'
			/*
			className={cardClass}
			*/
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onClick={handleClick}
		>
			{index + 1}.&nbsp;
			<a
				id={'song-' + index + '-link'}
				className="song-link"
				href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
				{song.title} by {song.artist}
			</a>
			<Box sx={{ flexGrow: 1 }}/>
			<Button
				variant="contained"
				id={"remove-song-" + index}
				className="list-card-button"
				onClick={handleRemoveSong}
			>
			&#x2715;
			</Button>
		</Box>
	);
}

export default SongCard;
