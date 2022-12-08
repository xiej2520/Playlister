
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import YouTube from 'react-youtube';
import CommentView from './CommentView';
import { Grid, IconButton } from '@mui/material';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';
import Stop from '@mui/icons-material/Stop';
import FastForward from '@mui/icons-material/FastForward';
import FastRewind from '@mui/icons-material/FastRewind';
import { useContext, useState } from 'react';
import { StoreContext, StoreAPICreator } from '../store';

interface TabPanelProps {
	children?: React.ReactNode;
	dir?: string;
	index: number;
	value: number;
}

function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
			style={{ height: "100%" }}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index: number) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	};
}


export default function YouTubeWrapper() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	const theme = useTheme();
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const [yplayer, setYplayer] = useState<any>(null);
	const [sIndex, setSIndex] = useState(0);

	function loadAndPlayCurrentSong(player: any) {
		if (store.playing !== null && store.playing.playlist !== null) {
			let song = store.playing.playlist.songs[store.playing.index];
			player.loadVideoById({
				videoId: song.youTubeId
			});
			player.playVideo();
		}
	}
	function incSong() {
		if (store.playing !== null) {
			store.playing.index++;
			store.playing.index %= store.playing.playlist.songs.length;
			setSIndex(store.playing.index);

		}
	}
	function decSong() {
		if (store.playing !== null) {
			store.playing.index--;
			store.playing.index += store.playing.playlist.songs.length;
			store.playing.index %= store.playing.playlist.songs.length;
			setSIndex(store.playing.index);

		}
	}
	function onPlayerReady(event: any) {
		setYplayer(event.target);
		loadAndPlayCurrentSong(event.target);
		event.target.playVideo();
	}
	function onPlayerStateChange(event: any) {
		let playerStatus = event.data;
		let player = event.target;
		if (playerStatus === -1) {
			// video not started
		}
		else if (playerStatus === 0) {
			// video done playing
			incSong();
			setSIndex(store.playing!.index);
			loadAndPlayCurrentSong(player);
		}
		else if (playerStatus === 1) {
			// video played
		}
		else if (playerStatus === 2) {
			// video paused
		}
		else if (playerStatus === 3) {
			// video buffering
		}
		else if (playerStatus === 5) {
			// video cued
		}
	}
	function handleRewind() {
		decSong();
		loadAndPlayCurrentSong(yplayer);
	}
	function handlePlay() {
		yplayer.playVideo();
	}
	function handlePause() {
		yplayer.pauseVideo();
	}
	function handleStop() {
		yplayer.stopVideo();
	}
	function handleForward() {
		incSong();
		loadAndPlayCurrentSong(yplayer);
	}
	const opts = {
		height: '400px',
		width: '100%',
		playerVars: {
			autoplay: 0
		}
	};
	
	if (store.playing !== null && sIndex !== store.playing.index) {
		setSIndex(store.playing.index);
	}

	const currentPlaylistName = store.playing !== null ? store.playing.playlist.name : "";
	let currentSong = store.playing !== null && store.playing.playlist.songs.length > 0 ?
		store.playing.playlist.songs[store.playing.index] : {
			title: "",
			artist: "",
			youTubeId: ""
		};
	loadAndPlayCurrentSong(yplayer);
	return (
		<Box sx={{ transform: 'rotate(-2deg)' }}>
			<AppBar position="static">
				<Tabs
					value={value}
					onChange={handleChange}
					indicatorColor="primary"
					textColor="inherit"
					variant="fullWidth"
					aria-label="youtube player and comments tabs"
				>
					<Tab label="Player" {...a11yProps(0)} />
					<Tab label="Comments" {...a11yProps(1)} />
				</Tabs>
			</AppBar>
			<TabPanel value={value} index={0} dir={theme.direction}>
				<YouTube
					videoId="dQw4w9WgXcQ"
					onReady={onPlayerReady}
					onStateChange={onPlayerStateChange}
					opts={opts}
				/>
				{store.playing === null ? <></> :
					<Grid container>
						<Grid item xs={12}>
							Now Playing:
						</Grid>
						<Grid item xs={4}>
							Playlist:
						</Grid>
						<Grid item xs={8}>
							{currentPlaylistName}
						</Grid>
						<Grid item xs={4}>
							Song #:
						</Grid>
						<Grid item xs={8}>
							{store.playing === null ? -1 : store.playing.index + 1}
						</Grid>
						<Grid item xs={4}>
							Title:
						</Grid>
						<Grid item xs={8}>
							{currentSong.title}
						</Grid>
						<Grid item xs={4}>
							Artist:
						</Grid>
						<Grid item xs={8}>
							{currentSong.artist}
						</Grid>
						<Box>
							<IconButton
								onClick={handleRewind}
							>
								<FastRewind />
							</IconButton>
							<IconButton
								onClick={handlePlay}
							>
								<PlayArrow />
							</IconButton>
							<IconButton
								onClick={handlePause}
							>
								<Pause />
							</IconButton>
							<IconButton
								onClick={handleStop}
							>
								<Stop />
							</IconButton>
							<IconButton
								onClick={handleForward}
							>
								<FastForward />
							</IconButton>
						</Box>
					</Grid>
				}
			</TabPanel>
			<TabPanel value={value} index={1} dir={theme.direction}>
				<CommentView></CommentView>
			</TabPanel>
		</Box>
	);
}
