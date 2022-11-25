import { useContext } from 'react';
import { AuthContext, AuthAPICreator } from '../auth';


import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Paper } from '@mui/material';

export default function RegisterScreen() {
	const { state: auth, dispatch: authDispatch } = useContext(AuthContext);
	const AuthAPI = AuthAPICreator(authDispatch);

	interface RegisterFormElements extends HTMLFormControlsCollection {
		firstName: HTMLInputElement,
		lastName: HTMLInputElement,
		email: HTMLInputElement,
		password: HTMLInputElement,
		passwordVerify: HTMLInputElement
	};
	interface RegisterFormElement extends HTMLFormElement {
		readonly elements: RegisterFormElements
	};
	const handleSubmit = (event: React.FormEvent<RegisterFormElement>) => {
		event.preventDefault();
		const formElements = event.currentTarget.elements;
		AuthAPI.registerUser(
			formElements.firstName.value,
			formElements.lastName.value,
			formElements.email.value,
			formElements.password.value,
			formElements.passwordVerify.value
		);
	};
	let modalJSX = ""
	if (auth.errorMsg !== null) {
		//modalJSX = <MUIAccountError />
	}

	return (
		<Container component="main" maxWidth="sm">
			<Box
				component={Paper}
				sx={{
					alignItems: 'center',
					display: 'flex',
					flexDirection: 'column',
					marginTop: 8,
					padding: "20px"
				}}
			>
				<Avatar sx={{ m: 1, bgcolor: 'text.secondary' }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="fname"
								name="firstName"
								required
								fullWidth
								id="firstName"
								label="First Name"
								autoFocus
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								fullWidth
								id="lastName"
								label="Last Name"
								name="lastName"
								autoComplete="lname"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name="password"
								label="Password"
								type="password"
								id="password"
								autoComplete="new-password"
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name="passwordVerify"
								label="Password Verify"
								type="password"
								id="passwordVerify"
								autoComplete="new-password"
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign Up
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link href="/login" variant="body2">
								Already have an account? Sign in
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
			{modalJSX}
		</Container>
	);
}
