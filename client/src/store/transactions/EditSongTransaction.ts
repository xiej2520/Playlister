import { StoreAPICreator } from "..";
import tsTPS_Transaction from "../../common/tsTPS";
import { ISong } from "../playlist-model";

export default class EditSongTransaction extends tsTPS_Transaction {
	StoreAPI: ReturnType<typeof StoreAPICreator>;
	index: number;
	oldSong: ISong;
	newSong: ISong;
	constructor(
		StoreAPI: ReturnType<typeof StoreAPICreator>,
		initIndex: number,
		initOldSong: ISong,
		initNewSong: ISong
		) {
		super();
		this.StoreAPI = StoreAPI;
		this.index = initIndex;
		this.oldSong = initOldSong;
		this.newSong = initNewSong;
	}
	doTransaction() {
		this.StoreAPI.editSong(this.index, this.newSong);
	}
	undoTransaction() {
		this.StoreAPI.editSong(this.index, this.oldSong);
	}
}
