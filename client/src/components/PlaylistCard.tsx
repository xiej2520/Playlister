import { useContext, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IPlaylistExport } from '../store/playlist-model';
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import SongCard from './SongCard';
import { StoreContext, StoreAPICreator, StoreActionType } from '../store';

function PlaylistCard(props: { playlist: IPlaylistExport }) {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	const { playlist } = props;
	const [editActive, setEditActive] = useState(false);
	const [text, setText] = useState(playlist.name);
	const isExpanded = store.openPlaylist !== null && store.openPlaylist._id === playlist._id;

	const handleChange =
		(panel: string) => (event: React.SyntheticEvent) => {
			if (isExpanded) {
				StoreAPI.setOpenPlaylist(null);
			}
			else {
				StoreAPI.setOpenPlaylist(playlist);
			}
		};

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
	function handleDelete(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		StoreAPI.showDeletePlaylistModal(playlist);
	}
	function handleEditName(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		setEditActive(true);
	}
	function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.code === 'Enter') {
			StoreAPI.editPlaylistName(playlist, text);
			setEditActive(false);
		}
	}
	function handleUpdateText(event: React.ChangeEvent<HTMLInputElement>) {
		setText(event.target.value);
	}

	const publishedFields = playlist.publishDate !== null ?
	<></> : (
		<>
		<Grid item xs={8}
			display='flex'
			sx={{flexDirection: 'column', justifyContent: 'center'}}
		>Published: {String(playlist.publishDate)}</Grid>
		<Grid item xs={4}>
			<IconButton
				size="medium"
				edge="end"
				aria-label='like'
				aria-haspopup="true"
				color="inherit"
			>
				<ThumbUp/>
			</IconButton>
		</Grid>
		<Grid item xs={8}
			display='flex'
			sx={{ flexDirection: 'column', justifyContent: 'center' }}
		>Listens: </Grid>
		<Grid item xs={4}>
			<IconButton
				size="medium"
				edge="end"
				aria-label='dislike'
				aria-haspopup="true"
				color="inherit"
			>
				<ThumbDown/>
			</IconButton>
		</Grid>
			{
			playlist.publishDate === null && isExpanded ?
			<Grid item xs={12}
				sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
				onClick={event => {
					event.preventDefault();
					event.nativeEvent.stopImmediatePropagation();
					event.stopPropagation();
				}}
			>
				<Button
					onClick={handleAddSong}
					variant='contained'
				>
				<AddIcon/>
				</Button>
				<Button
					disabled={!StoreAPI.canUndo()}
					id='undo-button'
					onClick={handleUndo}
					variant='contained'>
					<UndoIcon/>
				</Button>
				<Button
					disabled={!StoreAPI.canRedo()}
					id='redo-button'
					onClick={handleRedo}
					variant="contained">
					<RedoIcon/>
				</Button>
				<Button
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
					variant='contained'
				>
					Duplicate
				</Button>
			</Grid> :
			<></>
		}
		</>
	);

	return (
		<Accordion
			expanded={isExpanded}
			onChange={handleChange(playlist._id)}
		>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1bh-content"
				id="panel1bh-header"
				sx={{ bgcolor: 'grey.900', position: 'sticky', top: '0', zIndex: 100 }}
			>
				<Grid container>
					<Grid item xs={8}>
						{
						editActive ?
							<TextField
								fullWidth
								onKeyPress={handleKeyPress}
								onClick={(event: any) => {event.stopPropagation()}}
								onChange={handleUpdateText}
								defaultValue={playlist.name}
								autoFocus
							>
							</TextField> :
							<Typography variant='h5' sx={{ flexShrink: 0 }}>
								{playlist.name}
								<IconButton
									onClick={handleEditName}>
									<EditIcon/>
								</IconButton>
							</Typography>
						}
					</Grid>
					<Grid
						item xs={4}
						display='flex'
						sx={{flexDirection: 'column', justifyContent: 'center'}}
					>
						<Typography sx={{ color: 'text.secondary', width: '50%' }}>
							By: {playlist.ownerName}
						</Typography>
					</Grid>
				{publishedFields}
				</Grid>
			</AccordionSummary>
			<AccordionDetails
				sx={{ bgcolor: 'divider' }}
			>
				{
					playlist.songs.map((song, index) => (
						<SongCard
							key={index}
							index={index}
							song={song}
						/>
					))
				}
			</AccordionDetails>
		</Accordion>
	);
}

export default PlaylistCard;
