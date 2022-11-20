import { createTheme } from '@mui/material';

export const appTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			dark: '#8844ee',
			main: '#8844ee',
		},
		secondary: {
			dark: '#ee44bb',
			main: '#ee44bb',
		},
	},
	typography: {
		fontFamily: [
			'"Lexend Deca"'
		].join(','),
	},
});
