import { Box, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button } from '@mui/material';
import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext, AuthAPICreator } from '../auth';
import store from '../store';
import SearchBar from './SearchBar';

import AccountCircle from '@mui/icons-material/AccountCircle';
import People from '@mui/icons-material/Group';
import Person from '@mui/icons-material/Person';
import Sort from '@mui/icons-material/Sort';

export default function AppBanner() {
	const { state: auth, dispatch: authDispatch } = useContext(AuthContext);
	const AuthAPI = AuthAPICreator(authDispatch);

	const navigate = useNavigate();
	const location = useLocation();
	const isOnHome = location.pathname.split('/').includes('home');

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
		navigate('/');
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
			<MenuItem onClick={handleProfileMenuClose} component={Link} to='/login'>Login</MenuItem>
			<MenuItem onClick={handleProfileMenuClose} component={Link} to='/register'>Create New Account</MenuItem>
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

	function getAccountMenu(loggedIn: boolean) {
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
						{isOnHome ? <>
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
								<People/>
							</IconButton>
							
							<Box sx={{ flexGrow: 1}}/>

							<SearchBar/>

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
						</>
						: <Box sx={{ flexGrow: 1}}/>
					}

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
							{getAccountMenu(auth.loggedIn)}
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
