import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import reactLogo from '../resources/logo.svg';
import logo from '../resources/PlaylisterLogo.png'
import { useNavigate } from 'react-router-dom';
import { CurrentScreen, StoreActionType, StoreContext } from '../store';
import { useContext } from 'react';

let welcomeButtonSx = {
	fontSize: 20,
	height: 100,
	width: 150,
};

export default function WelcomeScreen() {
	const navigate = useNavigate();
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	return (
		<Grid
			container spacing={3}
			direction='column'
			alignItems='center'
			sx={{
				backgroundImage: 'linear-gradient(0deg, rgba(148,145,203,1) 0%, rgba(217,143,226,1) 32%, rgba(237,139,209,1) 66%, rgba(241,228,255,0) 100%)',
				margin: 0,
				height: 'calc(100vh - 64px)', // appbar 64px statusbar 64px
				width: "100%"
			}}
		>
			<Grid item xs>
				<Typography variant='h1'>Welcome to...</Typography>
			</Grid>
			<Grid item xs>
				<Box
					component='img'
					alt='Playlister'
					src={logo}
				/>
			</Grid>
			<Grid item xs>
				<Typography variant='h5'>
					A website where users can make, view, edit, and share playlists!
				</Typography>
			</Grid>
			<Grid
				container
				item
				direction='row'
				justifyContent='space-evenly'
				alignItems='center'
				sx={{ width: '800px' }}
				xs>
				<Button
					variant='contained'
					sx={welcomeButtonSx}
					onClick={() => navigate('/register')}
				>
					Create Account
				</Button>
				<Button
					variant='contained'
					sx={welcomeButtonSx}
					onClick={() => navigate('/login')}
				>
					Login
				</Button>
				<Button
					variant='contained'
					sx={welcomeButtonSx}
					onClick={() =>	{
						navigate('/home')
							storeDispatch({ type: StoreActionType.LOAD_SCREEN, payload: {
								currentScreen: CurrentScreen.ALL_LISTS
							}});
					}}
				>
					Continue as Guest
				</Button>
			</Grid>
				<Box
					className='App-logo' 
					component='img'
					height='15%'
					width='15%'
					alt='Playlister'
					src={reactLogo}
				/>
			<Grid item xs>
				By: Jacky Xie
			</Grid>
		</Grid>
	)
}
