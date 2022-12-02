import { useContext } from "react";
import { StoreContext, StoreAPICreator, ModalType } from "../../store";
import Modal from '@mui/material/Modal';
import { Box, Button } from "@mui/material";

function PublishPlaylistModal() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	function handleConfirmPublishPlaylist() {
		StoreAPI.publishPlaylist();
		StoreAPI.closeModal();
	}
	function handleCancelPublishPlaylist() {
		StoreAPI.closeModal();
	}

	let isOpen = false;
	let playlistName = '';
	if (store.currentModal.type === ModalType.PUBLISH_PLAYLIST) {
		isOpen = true;
		playlistName = store.currentModal.fields.playlistName;
	}
	return (
		isOpen ? 
		<Modal open={isOpen}>
			<Box className='modal'>
				<div className='modal-header'>
					Publish {playlistName}?
				</div>
				<div className='modal-body'>
					Are you sure you want to publish the <strong>{playlistName}</strong> playlist?
				</div>
				<div className='modal-footer'>
					<Button
						variant="contained"
						className="modal-button"
						onClick={handleConfirmPublishPlaylist}
					>
						Confirm
					</Button>
					<Button
						variant="contained"
						type="button"
						className="modal-button"
						onClick={handleCancelPublishPlaylist}
					>
						Cancel
					</Button>
				</div>
			</Box>
		</Modal> : <></>
	);
}

export default PublishPlaylistModal;
