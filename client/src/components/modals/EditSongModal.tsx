import { useContext, useEffect, useState } from "react";
import { StoreContext, StoreAPICreator, ModalType } from "../../store";
import Modal from '@mui/material/Modal';
import { Box, Button } from "@mui/material";

function EditSongModal() {
	const { state: store, dispatch: storeDispatch } = useContext(StoreContext);
	const StoreAPI = StoreAPICreator(store, storeDispatch);

	useEffect(() => {
		if (store.currentModal.type === ModalType.EDIT_SONG) {
			setTitle(store.currentModal.fields.title);
			setArtist(store.currentModal.fields.artist);
			setYouTubeId(store.currentModal.fields.youTubeId);
		}
		else {
			setTitle('');
			setArtist('');
			setYouTubeId('');
		}

	}, [store.currentModal]);
	const [title, setTitle] = useState('');
	const [artist, setArtist] = useState('');
	const [youTubeId, setYouTubeId] = useState('');

	if (store.currentModal.type !== ModalType.EDIT_SONG) {
		return <></>;
	}

	function handleConfirmEditSong() {
		StoreAPI.addEditSongTransaction({
			title: title,
			artist: artist,
			youTubeId: youTubeId
		});
	}
	function handleCancelEditSong() {
		StoreAPI.closeModal();
	}
	function handleUpdateTitle(event: React.ChangeEvent<HTMLInputElement>) {
		setTitle(event.target.value);
	}
	function handleUpdateArtist(event: React.ChangeEvent<HTMLInputElement>) {
		setArtist(event.target.value);
	}
	function handleUpdateYouTubeId(event: React.ChangeEvent<HTMLInputElement>) {
		setYouTubeId(event.target.value);
	}

	return (
		<Modal open={true}>
			<Box className='modal'>
				<div className='modal-header'>
					Edit Song
				</div>
				<div className='modal-body'>
					<div id="title-prompt" className="modal-prompt">Title:</div>
					<input
						className='modal-textfield'
						type="text"
						defaultValue={title}
						onChange={handleUpdateTitle} />
					<div id="artist-prompt" className="modal-prompt">Artist:</div>
					<input
						className='modal-textfield'
						type="text"
						defaultValue={artist}
						onChange={handleUpdateArtist} />
					<div id="you-tube-id-prompt" className="modal-prompt">YouTube Id:</div>
					<input
						className='modal-textfield'
						type="text"
						defaultValue={youTubeId}
						onChange={handleUpdateYouTubeId} />
				</div>
				<div className='modal-footer'>
					<Button
						variant="contained"
						className="modal-button"
						onClick={handleConfirmEditSong}
					>
						Confirm
					</Button>
					<Button
						variant="contained"
						type="button"
						className="modal-button"
						onClick={handleCancelEditSong}
					>
						Cancel
					</Button>
				</div>
			</Box>
		</Modal>
	);
}

export default EditSongModal;
