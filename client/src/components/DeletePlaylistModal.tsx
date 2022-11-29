import { useContext } from "react";
import { StoreContext, StoreAPICreator, ModalType } from "../store";
import Modal from '@mui/material/Modal';
import { Box, Button } from "@mui/material";

function DeletePlaylistModal() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	function handleConfirmDeletePlaylist() {
		StoreAPI.deletePlaylist()
	}
	function handleCancelDeletePlaylist() {
		StoreAPI.closeModal();
	}

	let isOpen = false;
	let playlistName = '';
	if (store.currentModal.type === ModalType.DELETE_PLAYLIST) {
		isOpen = true;
		playlistName = store.currentModal.fields.playlistName;
	}
	return (
		isOpen ? 
		<Modal open={isOpen}>
			<Box className='modal'>
				<div className='modal-header'>
					Delete {playlistName}?
				</div>
				<div className='modal-body'>
					Are you sure you want to delete the <strong>{playlistName}</strong> playlist?
				</div>
				<div className='modal-footer'>
					<Button
						variant="contained"
						className="modal-button"
						onClick={handleConfirmDeletePlaylist}
					>
						Confirm
					</Button>
					<Button
						variant="contained"
						type="button"
						className="modal-button"
						onClick={handleCancelDeletePlaylist}
					>
						Cancel
					</Button>
				</div>
			</Box>
		</Modal> : <></>
	);
}

export default DeletePlaylistModal;
