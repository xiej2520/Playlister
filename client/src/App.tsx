import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from './auth'
import { GlobalStoreContextProvider } from './store'
import logo from './logo.svg';
import './App.css';

import { ThemeProvider } from "@mui/material";
import { appTheme } from './ThemeOptions';

import {
	AppBanner,
	LoginScreen,
	SplashScreen,
	RegisterScreen,
} from './components';

function App() {
	return (
		<ThemeProvider theme={appTheme}>
			<div className="App">
				<img src={logo} className="App-logo" alt="logo" />
			</div>
			<BrowserRouter>
				<AuthContextProvider>
					<GlobalStoreContextProvider>
						<AppBanner />
						<Routes>
							<Route path="/" element ={<SplashScreen/>} />
							<Route path="/login/" element={<LoginScreen/>} />
							<Route path="/register/" element={<RegisterScreen/>} />
						</Routes>
					</GlobalStoreContextProvider>
				</AuthContextProvider>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
