import { createTheme } from '@mui/material';

export const appTheme = createTheme({
	palette: {
		type: 'dark',
		primary: {
			main: '#8844ee',
		},
		secondary: {
			main: '#ee44bb',
		},
	},
	typography: {
		fontFamily: [
			'"Lexend Deca"'
		].join(','),
	},
});
