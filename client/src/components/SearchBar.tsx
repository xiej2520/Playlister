import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { useContext, useState } from 'react';
import { CurrentScreen, StoreActionType, StoreAPICreator, StoreContext } from '../store';

// adapted from https://mui.com/material-ui/react-app-bar/

const Search = styled('div')(({ theme }) => ({
	position: 'relative',
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	width: '100%',
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(1),
		width: 'auto',
	},
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: 'inherit',
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: '20vw',
			'&:focus': {
				width: '60vw',
			},
		},
	},
}));

export default function SearchBar() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	const [text, setText] = useState('');

	function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.code === 'Enter') {
			storeDispatch({ type: StoreActionType.SET_SEARCH_TEXT, payload: { searchText: text }});
			StoreAPI.getPublishedPlaylists(text);
		}
	}
	function handleUpdateText(event: React.ChangeEvent<HTMLInputElement>) {
		setText(event.target.value);
	}
	if (store.currentScreen !== CurrentScreen.ALL_LISTS &&
		store.currentScreen !== CurrentScreen.USER_LISTS) {
			return <></>;
	}
	return (
		<Search>
			<SearchIconWrapper>
				<SearchIcon />
			</SearchIconWrapper>
			<StyledInputBase
				placeholder="Search"
				inputProps={{ 'aria-label': 'search' }}
				onKeyPress={handleKeyPress}
				onChange={handleUpdateText}
			/>
		</Search>);
}

