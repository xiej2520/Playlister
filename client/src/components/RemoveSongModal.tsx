import { useContext } from "react";
import { StoreContext, StoreAPICreator, ModalType } from "../store";
import Modal from '@mui/material/Modal';
import { Box, Button } from "@mui/material";

function RemoveSongModal() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	function handleConfirmRemoveSong() {
		StoreAPI.addRemoveSongTransaction()
	}
	function handleCancelRemoveSong() {
		StoreAPI.closeModal();
	}

	let isOpen = false;
	let title = '';
	if (store.currentModal.type === ModalType.REMOVE_SONG) {
		isOpen = true;
		title = store.currentModal.fields.title;
	}
	return (
		isOpen ? 
		<Modal open={isOpen}>
			<Box className='modal'>
				<div className='modal-header'>
					Remove {title}?
				</div>
				<div className='modal-body'>
					Are you sure you want to permanently remove <strong>{title}</strong>&nbsp;
					from the playlist?
				</div>
				<div className='modal-footer'>
					<Button
						variant="contained"
						className="modal-button"
						onClick={handleConfirmRemoveSong}
					>
						Confirm
					</Button>
					<Button
						variant="contained"
						type="button"
						className="modal-button"
						onClick={handleCancelRemoveSong}
					>
						Cancel
					</Button>
				</div>
			</Box>
		</Modal> : <></>
	);
}

export default RemoveSongModal;
