import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function PlaylistCard(props: { openPlaylist: any; setOpenPlaylist: any; playlist: any; }) {
	const { openPlaylist, setOpenPlaylist, playlist } = props;
	const handleChange =
		(panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
			setOpenPlaylist(isExpanded ? panel : false);
		};
	console.log(playlist);

	return (
		<Accordion expanded={openPlaylist === playlist._id} onChange={handleChange(playlist._id)}>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1bh-content"
				id="panel1bh-header"
			>
				<Typography sx={{ width: '33%', flexShrink: 0 }}>
					{playlist.name}
				</Typography>
				<Typography sx={{ color: 'text.secondary' }}>By: {playlist.ownerEmail}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Typography>
				{playlist.songs.toString()}
				</Typography>
			</AccordionDetails>
		</Accordion>
	);
}

export default PlaylistCard;
