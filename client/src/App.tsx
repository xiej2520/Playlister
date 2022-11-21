import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './auth'
import { GlobalStoreContextProvider } from './store'
import './App.css';

import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from './ThemeOptions';

import {
	AppBanner,
	HomeWrapper,
	LoginScreen,
	RegisterScreen,
	WelcomeScreen,
} from './components';

function App() {
	return (
		<ThemeProvider theme={appTheme}>
			<CssBaseline/>
			<BrowserRouter>
				<AuthContextProvider>
					<GlobalStoreContextProvider>
						<AppBanner/>
						<Routes>
							<Route path="/" element ={<WelcomeScreen/>}/>
							<Route path="/login" element={<LoginScreen/>}/>
							<Route path="/register" element={<RegisterScreen/>}/>
							<Route path="/home" element={<HomeWrapper/>}/>
						</Routes>
					</GlobalStoreContextProvider>
				</AuthContextProvider>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
