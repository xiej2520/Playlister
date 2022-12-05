import { Box, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button } from '@mui/material';
import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext, AuthAPICreator } from '../auth';
import { CurrentScreen, SortType, StoreActionType, StoreAPICreator, StoreContext } from '../store';

import SearchBar from './SearchBar';

import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import Sort from '@mui/icons-material/Sort';

export default function AppBanner() {
	const { state: auth, dispatch: authDispatch } = useContext(AuthContext);
	const AuthAPI = AuthAPICreator(authDispatch);
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	const navigate = useNavigate();
	const location = useLocation();
	const isOnPlaylists = location.pathname.split('/').includes('home');

	const [profileAnchorEl, setProfileAnchorEl] = useState<HTMLElement | null>(null);
	const isProfileMenuOpen = Boolean(profileAnchorEl);
	const [sortAnchorEl, setSortAnchorEl] = useState<HTMLElement | null>(null);
	const isSortMenuOpen = Boolean(sortAnchorEl);

	function handleProfileMenuOpen(event: React.MouseEvent<HTMLButtonElement>) {
		setProfileAnchorEl(event.currentTarget);
	}
	function handleSortMenuOpen(event: React.MouseEvent<HTMLButtonElement>) {
		setSortAnchorEl(event.currentTarget);
	}

	function handleProfileMenuClose() {
		setProfileAnchorEl(null);
	}
	function handleSortMenuClose(sortType: SortType | null) {
		setSortAnchorEl(null);
		if (sortType !== null) {
			storeDispatch({ type: StoreActionType.SET_SORT_TYPE, payload: {
				sortType: sortType
			}});
		}
	}
	
	function handleLogout() {
		handleProfileMenuClose();
		AuthAPI.logoutUser();
		StoreAPI.unloadPlaylists();
		navigate('/');
	}

	function handleLoadScreen(screen: CurrentScreen) {
		StoreAPI.unloadPlaylists();
		if (auth.user === null && screen === CurrentScreen.HOME) {
			navigate('/');
			storeDispatch({ type: StoreActionType.LOAD_SCREEN, payload: {
				currentScreen: CurrentScreen.NONE
			}});
		}
		storeDispatch({ type: StoreActionType.LOAD_SCREEN, payload: {
			currentScreen: screen
		}});
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
	
	const isOnHome = store.currentScreen === CurrentScreen.HOME;
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
						<IconButton
							size='large'
							aria-label='home'
							color={store.currentScreen==CurrentScreen.HOME ? 'secondary' : 'inherit'}
							onClick={() => { handleLoadScreen(CurrentScreen.HOME) }}
						>
							<HomeIcon/>
						</IconButton>
					</Typography>
						{isOnPlaylists ? <>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls={menuId}
								aria-haspopup="true"
								color={store.currentScreen==CurrentScreen.ALL_LISTS ? 'secondary' : 'inherit'}
								onClick={() => { handleLoadScreen(CurrentScreen.ALL_LISTS) }}
							>
								<GroupsIcon/>
							</IconButton>
							<IconButton
								size="large"
								aria-label="account of current user"
								aria-controls={menuId}
								aria-haspopup="true"
								color={store.currentScreen==CurrentScreen.USER_LISTS ? 'secondary' : 'inherit'}
								onClick={() => { handleLoadScreen(CurrentScreen.USER_LISTS) }}
							>
								<PersonIcon/>
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
						onClose={() => handleSortMenuClose(null)}
					>
						<MenuItem onClick={() => handleSortMenuClose(SortType.NAME)}>
							Name (A - Z)</MenuItem>
						{isOnHome ? <MenuItem onClick={() => handleSortMenuClose(SortType.EDIT_DATE)}>
							Last Edit Date (New - Old)</MenuItem> : null}
						{isOnHome ? <MenuItem onClick={() => handleSortMenuClose(SortType.CREATION_DATE)}>
							Creation Date (Old - New)</MenuItem> : null}
						{isOnHome ? null : 
							<MenuItem onClick={() => handleSortMenuClose(SortType.PUBLISH_DATE)}>
								Publish Date (Newest)</MenuItem> }
						{isOnHome ? null : 
							<MenuItem onClick={() => handleSortMenuClose(SortType.LISTENS)}>
								Listens (High - Low)</MenuItem>}
						{isOnHome ? null : 
							<MenuItem onClick={() => handleSortMenuClose(SortType.LIKES)}>
								Likes (High - Low)</MenuItem> }
						{isOnHome ? null : 
							<MenuItem onClick={() => handleSortMenuClose(SortType.DISLIKES)}>
								Dislikes (High - Low)</MenuItem>}
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
