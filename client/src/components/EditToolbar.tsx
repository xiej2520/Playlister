import { Grid, Button } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import { useContext } from "react";
import { StoreContext, StoreAPICreator } from "../store";
import IPlaylistExport from "../store/playlist-model";


function EditToolbar(props: { playlist: IPlaylistExport }) {
	const { playlist } = props;
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	function handleAddSong() {
		StoreAPI.addCreateSongTransaction();
	}
	function handleUndo(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		StoreAPI.undo();
	}
	function handleRedo(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		StoreAPI.redo();
	}
	function handlePublish(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		StoreAPI.publishPlaylist();
	}
	function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		StoreAPI.showDeletePlaylistModal(playlist);
	}
	function handleDuplicate(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		StoreAPI.duplicatePlaylist(playlist);
	}

	const isExpanded = store.openPlaylist !== null && store.openPlaylist._id === playlist._id;
	const published = playlist.publishDate !== null;
	return (
		isExpanded ?
			<Grid item xs={12}
				sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
				onClick={event => {
					event.preventDefault();
					event.nativeEvent.stopImmediatePropagation();
					event.stopPropagation();
				}}
			>
				<Button
					disabled={published}
					onClick={handleAddSong}
					variant='contained'
				>
				<AddIcon/>
				</Button>
				<Button
					disabled={!StoreAPI.canUndo() || published}
					id='undo-button'
					onClick={handleUndo}
					variant='contained'>
					<UndoIcon/>
				</Button>
				<Button
					disabled={!StoreAPI.canRedo() || published}
					id='redo-button'
					onClick={handleRedo}
					variant="contained">
					<RedoIcon/>
				</Button>
				<Button
					disabled={published}
					onClick={handlePublish}
					variant='contained'
				>
					Publish
				</Button>
				<Button
					onClick={handleDelete}
					variant='contained'
				>
					Delete
				</Button>
				<Button
					onClick={handleDuplicate}
					variant='contained'
				>
					Duplicate
				</Button>
			</Grid> :
			<></>
	)
}

export default EditToolbar;
