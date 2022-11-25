import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IPlaylistExport } from '../store/playlist-model';
import { Box, Grid, IconButton } from '@mui/material';
import { ThumbUp, ThumbDown } from '@mui/icons-material';
import SongCard from './SongCard';
import { StoreContext, StoreAPICreator, StoreActionType } from '../store';

function PlaylistCard(props: { playlist: IPlaylistExport }) {
	const { state: store, dispatch: storeDispatch } = React.useContext(StoreContext);
	const StoreAPI = StoreAPICreator(storeDispatch);

	const { playlist } = props;
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

	const publishedFields = playlist.publishDate !== null ? <></> : (
		<>
		<Grid item xs={6}>
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
		<Grid item xs={6}
			display='flex'
			sx={{flexDirection: 'column', justifyContent: 'center'}}
		>Published: </Grid>
		<Grid item xs={6}>
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
		<Grid item xs={6}
			display='flex'
			sx={{flexDirection: 'column', justifyContent: 'center'}}
		>Listens: </Grid>
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
			>
				<Grid container>
					<Grid item xs={6}>
						<Typography variant='h5' sx={{ width: '50%', flexShrink: 0 }}>
							{playlist.name}
						</Typography>
					</Grid>
					<Grid
						item xs={6}
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
