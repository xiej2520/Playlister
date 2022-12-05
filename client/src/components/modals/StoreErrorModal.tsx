import { useContext } from "react";
import Modal from '@mui/material/Modal';
import { Box, Button } from "@mui/material";
import { ModalType, StoreAPICreator, StoreContext } from "../../store";

function StoreErrorModal() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	function handleDismissModal() {
		StoreAPI.closeModal();
	}

	if (store.currentModal.type !== ModalType.ERROR) {
		return <></>;
	}
	return (
		<Modal open={store.currentModal.fields.errorMsg !== null}>
			<Box className='modal'>
				<div></div>
				<Box className='modal-body'>
					{store.currentModal.fields.errorMsg}
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

export default StoreErrorModal;
