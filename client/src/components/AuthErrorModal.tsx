import { useContext } from "react";
import Modal from '@mui/material/Modal';
import { Box, Button } from "@mui/material";
import { AuthAPICreator, AuthContext } from "../auth";

function AuthErrorModal() {
	const { state: auth, dispatch: authDispatch } = useContext(AuthContext);
	const AuthAPI = AuthAPICreator(authDispatch);

	function handleDismissModal() {
		AuthAPI.setErrorMessage(null);
	}
	console.log(auth.errorMsg);

	return (
		<Modal open={auth.errorMsg !== null}>
			<Box className='modal'>
				<div></div>
				<Box className='modal-body'>
					{auth.errorMsg}
				</Box>
				<div className='modal-footer'>
					<Button
						variant="contained"
						className="modal-button"
						onClick={handleDismissModal}
					>
						Dismiss
					</Button>
				</div>
			</Box>
		</Modal>
	);
}

export default AuthErrorModal;
