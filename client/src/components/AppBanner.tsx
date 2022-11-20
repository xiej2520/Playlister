import { Box, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, AuthAPICreator } from '../auth';
import store from '../store';

import AccountCircle from '@mui/icons-material/AccountCircle';

export default function AppBanner() {
	const [accountMenu, setAccountMenu] = useState(<AccountCircle/>);
	const { state: auth, dispatch: authDispatch } = useContext(AuthContext);
	const AuthAPI = AuthAPICreator(authDispatch);
	useEffect(() => {
		getAccountMenu().then((menu) => setAccountMenu(menu));
	}, [])

	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
	const isMenuOpen = Boolean(anchorEl);

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		setAnchorEl(event.currentTarget);
	}

	const handleMenuClose = () => {
		setAnchorEl(null);
	}
	
	const handleLogout = () => {
		handleMenuClose();
		AuthAPI.logoutUser();
	}
	const menuId = 'primary-search-account-menu';
	const loggedOutMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			id={menuId}
			keepMounted
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<Link to='/login/'><MenuItem onClick={handleMenuClose}>Login</MenuItem></Link>
			<Link to='/register/'><MenuItem onClick={handleMenuClose}>Create New Account</MenuItem></Link>
		</Menu>
	);
	const loggedInMenu = (
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			id={menuId}
			keepMounted
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			open={isMenuOpen}
			onClose={handleMenuClose}
		>
			<MenuItem onClick={handleLogout}>Logout</MenuItem>
		</Menu>
	);
	let editToolbar = <></>;
	let menu = loggedOutMenu;
	if (auth.loggedIn) {
		menu = loggedInMenu;
	}

	async function getAccountMenu() {
		let loggedIn = await AuthAPI.getLoggedIn();
		let userInitials = AuthAPI.getUserInitials(auth);
		if (loggedIn) { return <div>{userInitials}</div>; }
		else { return <AccountCircle />; }
	}
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar>
					<Typography
						variant="h4"
						noWrap
						component="div"
						sx={{ display: { xs: 'none', sm: 'block' } }}
					>
						<Link style={{ textDecoration: 'none', color: 'white' }} to='/'
							onClick={() => {}/*store.clearTPS*/}>⌂</Link>
					</Typography>
					<Box sx={{ display: { xs: 'none', md: 'flex' } }}>
						<IconButton
							size="large"
							edge="end"
							aria-label="account of current user"
							aria-controls={menuId}
							aria-haspopup="true"
							onClick={handleProfileMenuOpen}
							color="inherit"
						>
							{accountMenu}
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>
			{
				menu
			}
		</Box>
	);
}
