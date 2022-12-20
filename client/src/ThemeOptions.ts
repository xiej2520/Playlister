import { createTheme } from '@mui/material';

export const appTheme = createTheme({
	palette: {
		mode: 'dark',
		primary: {
			dark: '#4411aa',
			main: '#8844ee',
		},
		secondary: {
			dark: '#880077',
			main: '#ee44bb',
		},
	},
	typography: {
		fontFamily: [
			'"Lexend Deca"'
		].join(','),
	},
});
