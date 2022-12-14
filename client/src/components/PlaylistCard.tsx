import { useContext, useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IPlaylistExport } from '../store/playlist-model';
import { Grid, IconButton, TextField } from '@mui/material';
import { ThumbUp, ThumbDown, ThumbUpOffAlt, ThumbDownOffAlt } from '@mui/icons-material';
import InputIcon from '@mui/icons-material/Input';
import SongCard from './SongCard';
import { AuthContext } from '../auth';
import { StoreContext, StoreAPICreator } from '../store';
import { EditToolbar } from '.';

function PlaylistCard(props: { playlist: IPlaylistExport }) {
	const { playlist } = props;
	const { state: auth, dispatch: authDispatch } = useContext(AuthContext);
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

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
	function handleEditName(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		setEditActive(true);
	}
	async function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.code === 'Enter') {
			if (playlist.name === text || await StoreAPI.editPlaylistName(playlist, text)) {
				setEditActive(false);
			}
		}
	}
	function handleUpdateText(event: React.ChangeEvent<HTMLInputElement>) {
		setText(event.target.value);
	}
	function handleLoadPlaylist(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		StoreAPI.loadPlaylist(playlist);
	}
	function handleToggleLikePlaylist(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		StoreAPI.likePlaylist(playlist);
	}
	function handleToggleDislikePlaylist(event: React.MouseEvent<HTMLButtonElement>) {
		event.stopPropagation();
		StoreAPI.dislikePlaylist(playlist);
	}

	const published = playlist.publishDate !== null;
	const publishDate = published ? 
	new Date(playlist.publishDate!).toLocaleString('en-US', {
		month: 'short', day: '2-digit', year: 'numeric'
	}) : '';
	const loggedIn = auth.user !== null;
	const publishedFields = published ?
		<>
		<Grid item xs={8}
			display='flex'
			sx={{flexDirection: 'column', justifyContent: 'center'}}
		>Published: {publishDate}</Grid>
		<Grid item xs={4} container alignItems='center' >
			<IconButton
				disabled={!loggedIn}
				size="medium"
				edge="end"
				aria-label='like'
				aria-haspopup="true"
				color="inherit"
				onClick={handleToggleLikePlaylist}
			>
				{ playlist.liked ? <ThumbUp/> : <ThumbUpOffAlt/> }
			</IconButton>&nbsp;&nbsp;&nbsp;
			{playlist.likeCount}
		</Grid>
		<Grid item xs={8}
			display='flex'
			sx={{ flexDirection: 'column', justifyContent: 'center' }}
		>Listens: {playlist.listens}</Grid>
		<Grid item xs={4} container alignItems='center' >
			<IconButton
				disabled={!loggedIn}
				size="medium"
				edge="end"
				aria-label='dislike'
				aria-haspopup="true"
				color="inherit"
				onClick={handleToggleDislikePlaylist}
			>
				{ playlist.disliked ? <ThumbDown/> : <ThumbDownOffAlt/> }
			</IconButton>&nbsp;&nbsp;&nbsp;
			{playlist.dislikeCount}
		</Grid>
	</> :
	<></>;

	const playing = store.playing !== null && store.playing.playlist._id == playlist._id;
	return (
		<Accordion
			expanded={isExpanded}
			onChange={handleChange(playlist._id)}
		>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1bh-content"
				id="panel1bh-header"
				sx={{ bgcolor: playing ? 'primary.dark' :
					published ? 'grey.800' : 'grey.900', position: 'sticky', top: '0', zIndex: 100 }}
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
								{published ? <></> :
								<IconButton
									onClick={handleEditName}>
									<EditIcon/>
								</IconButton>}
								{playlist.songs.length > 0 ? <IconButton
									color='primary'
									onClick={handleLoadPlaylist}>
									<InputIcon/>
								</IconButton>
								: <></>}
							</Typography>
						}
					</Grid>
					<Grid
						item xs={4}
						display='flex'
						sx={{flexDirection: 'column', justifyContent: 'center'}}
					>
						<Typography sx={{ color: 'text.secondary', width: '50%' }}>
							By: {playlist.ownerUsername}
						</Typography>
					</Grid>
				{publishedFields}
				<EditToolbar playlist={playlist}/>
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
							playing={playing && index === store.playing!.index}
							published={published}
						/>
					))
				}
			</AccordionDetails>
		</Accordion>
	);
}

export default PlaylistCard;
