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
import { useContext, useEffect, useState } from 'react';
import { StoreContext, StoreAPICreator, StoreActionType } from '../store';

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
	const [value, setValue] = useState(0);
	
	useEffect(() => {
		loadAndPlayCurrentSong(yplayer);
	}, [store.playing && store.playing.index]); // allow checking nullable

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const [playerStatus, setPlayerStatus] = useState(-1);
	const [yplayer, setYplayer] = useState<any>(null);

	function loadAndPlayCurrentSong(player: any) {
		if (store.playing !== null && store.playing.playlist !== null && player !== null) {
			let song = store.playing.playlist.songs[store.playing.index];
			try {
				player.loadVideoById({
					videoId: song.youTubeId
				});
				player.playVideo();
			}
			catch (err) {
				console.log(err)
			}
		}
	}
	function incSong() {
		if (store.playing !== null) {
			storeDispatch({ type: StoreActionType.SET_PLAYING_PLAYLIST, payload: {
				playlist: store.playing.playlist,
				index: (store.playing.index + 1) % store.playing.playlist.songs.length
			}});
		}
	}
	function decSong() {
		if (store.playing !== null) {
			let n = store.playing.playlist.songs.length;
			storeDispatch({ type: StoreActionType.SET_PLAYING_PLAYLIST, payload: {
				playlist: store.playing.playlist,
				index: (store.playing.index - 1 + n) % n
			}});
		}
	}
	function onPlayerReady(event: any) {
		setYplayer(event.target);
		if (store.playing !== null) {
			loadAndPlayCurrentSong(event.target);
			event.target.playVideo();
		}
	}
	function onPlayerStateChange(event: any) {
		const ps = event.data;
		setPlayerStatus(ps);
		let player = event.target;
		if (ps === -1) {
			// video not started
		}
		else if (ps === 0) {
			// video done playing
			incSong();
			loadAndPlayCurrentSong(player);
		}
		else if (ps === 1) {
			// video played
		}
		else if (ps === 2) {
			// video paused
		}
		else if (ps === 3) {
			// video buffering
		}
		else if (ps === 5) {
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
		storeDispatch({ type: StoreActionType.SET_PLAYING_PLAYLIST, payload: null });
	}
	function handleForward() {
		incSong();
		loadAndPlayCurrentSong(yplayer);
	}
	const opts = {
		height: '400px',
		width: '100%',
		autoplay: 0,
		playerVars: {
			autoplay: 0
		}
	};

	const currentPlaylistName = store.playing !== null ? store.playing.playlist.name : "";
	const currentSong = store.playing !== null && store.playing.playlist.songs.length > 0 ?
		store.playing.playlist.songs[store.playing.index] : {
			title: "",
			artist: "",
			youTubeId: ""
		};
	if (store.playing !== null && store.playing.index === -1) {
		store.playing.index = 0;
		loadAndPlayCurrentSong(yplayer);
	}
	const labelStyle = {
		color: 'grey.400',
		paddingRight: '25px',
		textAlign: 'right'
	};
	return (
		<Box sx={{ /*transform: 'rotate(-0.4deg)'*/ }}>
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
					<Grid container sx={{
						bgcolor: 'primary.dark',
						padding: '10px'
					}}>
						<Grid item xs={12}
							sx={{
								borderBottom: '1px solid white',
								padding: '5px',
								textAlign: 'center'
							}}
						>
							<Typography variant='h5'>Now Playing:</Typography>
						</Grid>
						<Grid item xs={6} sx={labelStyle}>
							Playlist:
						</Grid>
						<Grid item xs={6}>
							{currentPlaylistName}
						</Grid>
						<Grid item xs={6} sx={labelStyle}>
							Song #
						</Grid>
						<Grid item xs={6}>
							{store.playing === null ? -1 : store.playing.index + 1}
						</Grid>
						<Grid item xs={6} sx={labelStyle}>
							Title:
						</Grid>
						<Grid item xs={6}>
							{currentSong.title}
						</Grid>
						<Grid item xs={6} sx={labelStyle}>
							Artist:
						</Grid>
						<Grid item xs={6}>
							{currentSong.artist}
						</Grid>
						<Grid item xs={12} sx={{
							bgcolor: 'grey.900',
							marginTop: '10px',
							textAlign: 'center'
							}}>
							<IconButton
								onClick={handleRewind}
							>
								<FastRewind/>
							</IconButton>
							{
								playerStatus !== 1 ?
								<IconButton
								onClick={handlePlay}
							>
								<PlayArrow/>
							</IconButton> : <></>
							}
							{
								playerStatus === 1 ?
								<IconButton
									onClick={handlePause}
								>
									<Pause/>
								</IconButton> : <></>
							}
							<IconButton
								onClick={handleStop}
							>
								<Stop/>
							</IconButton>
							<IconButton
								onClick={handleForward}
							>
								<FastForward />
							</IconButton>
						</Grid>
					</Grid>
				}
			</TabPanel>
			<TabPanel value={value} index={1} dir={theme.direction}>
				<CommentView></CommentView>
			</TabPanel>
		</Box>
	);
}
