import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import reactLogo from '../resources/logo.svg';
import logo from '../resources/PlaylisterLogo.png'

let welcomeButtonSx = {
	fontSize: 20,
	height: 100,
	width: 150,
};

export default function WelcomeScreen() {
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
				sx={{
					width: 800
				}}
				xs>
				<Button
					variant='contained'
					className='modal-button'
					sx={welcomeButtonSx}
				>
					Create Account
				</Button>
				<Button
					variant='contained'
					className='modal-button'
					sx={welcomeButtonSx}
				>
					Login
				</Button>
				<Button
					variant='contained'
					className='modal-button'
					sx={welcomeButtonSx}
				>
					Continue as Guest
				</Button>
			</Grid>
				{/*<Box
					className='App-logo' 
					component='img'
					height='25%'
					width='25%'
					alt='Playlister'
					src={reactLogo}
	/>*/}
			<Grid item xs>
			By: Jacky Xie
			</Grid>
		</Grid>
	)
}
