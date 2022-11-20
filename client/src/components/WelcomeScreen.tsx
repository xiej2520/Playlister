import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import reactLogo from '../resources/logo.svg';
import logo from '../resources/PlaylisterLogo.png'
import { useNavigate } from 'react-router-dom';

let welcomeButtonSx = {
	fontSize: 20,
	height: 100,
	width: 150,
};

export default function WelcomeScreen() {
	const navigate = useNavigate();
	return (
		<Grid
			container spacing={3}
			direction='column'
			alignItems='center'
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
					onClick={() => navigate('/home')}
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
