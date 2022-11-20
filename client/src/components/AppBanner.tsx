import { Box, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext, AuthAPICreator } from '../auth';
import store from '../store';
import SearchBar from './SearchBar';

import AccountCircle from '@mui/icons-material/AccountCircle';
import Group from '@mui/icons-material/Group';
import Person from '@mui/icons-material/Person';
import Sort from '@mui/icons-material/Sort';

export default function AppBanner() {
	const [accountMenu, setAccountMenu] = useState(<AccountCircle/>);
	const { state: auth, dispatch: authDispatch } = useContext(AuthContext);
	const AuthAPI = AuthAPICreator(authDispatch);
	useEffect(() => {
		getAccountMenu().then((menu) => setAccountMenu(menu));
	}, [])

	const [profileAnchorEl, setProfileAnchorEl] = useState<HTMLElement | null>(null);
	const isProfileMenuOpen = Boolean(profileAnchorEl);
	const [sortAnchorEl, setSortAnchorEl] = useState<HTMLElement | null>(null);
	const isSortMenuOpen = Boolean(sortAnchorEl);

	const handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		setProfileAnchorEl(event.currentTarget);
	}
	const handleSortMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		setSortAnchorEl(event.currentTarget);
	}

	const handleProfileMenuClose = () => {
		setProfileAnchorEl(null);
	}
	const handleSortMenuClose = () => {
		setSortAnchorEl(null);
	}
	
	const handleLogout = () => {
		handleProfileMenuClose();
		AuthAPI.logoutUser();
	}
	const menuId = 'primary-search-account-menu';
	const loggedOutMenu = (
		<Menu
			anchorEl={profileAnchorEl}
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
			open={isProfileMenuOpen}
			onClose={handleProfileMenuClose}
		>
			<MenuItem onClick={handleProfileMenuClose} component={Link} to='/login/'>Login</MenuItem>
			<MenuItem onClick={handleProfileMenuClose} component={Link} to='/register/'>Create New Account</MenuItem>
		</Menu>
	);
	const loggedInMenu = (
		<Menu
			anchorEl={profileAnchorEl}
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
			open={isProfileMenuOpen}
			onClose={handleProfileMenuClose}
		>
			<MenuItem onClick={handleLogout}>Logout</MenuItem>
		</Menu>
	);
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
						<IconButton
							size="large"
							edge="end"
							aria-label="account of current user"
							aria-controls={menuId}
							aria-haspopup="true"
							color="inherit"
						>
							<Person/>
						</IconButton>
						<IconButton
							size="large"
							edge="end"
							aria-label="account of current user"
							aria-controls={menuId}
							aria-haspopup="true"
							color="inherit"
						>
							<Group/>
						</IconButton>
						
						<Box sx={{ flexGrow: 1}}/>

					<SearchBar></SearchBar>

						<Box sx={{ flexGrow: 1}}/>
					<Button
						size="large"
						aria-label="sort by menu button"
						aria-controls={isSortMenuOpen ? 'sort-menu' : undefined}
						aria-haspopup="true"
						onClick={handleSortMenuOpen}
						color="inherit"
					>
						Sort By&nbsp;
						<Sort/>
					</Button>

					<Menu
						anchorEl={sortAnchorEl}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={isSortMenuOpen}
						onClose={handleSortMenuClose}
					>
						<MenuItem onClick={handleSortMenuClose}>Name (A - Z)</MenuItem>
						<MenuItem onClick={handleSortMenuClose}>Publish Date (Newest)</MenuItem>
						<MenuItem onClick={handleSortMenuClose}>Listens (High - Low)</MenuItem>
						<MenuItem onClick={handleSortMenuClose}>Likes (High - Low)</MenuItem>
						<MenuItem onClick={handleSortMenuClose}>Dislikes (High - Low)</MenuItem>
					</Menu>

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
