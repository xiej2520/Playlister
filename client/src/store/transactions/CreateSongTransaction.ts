import { StoreAPICreator } from "..";
import tsTPSTransaction from "../../common/tsTPS";
import { ISong } from "../playlist-model";

export default class CreateSongTransaction extends tsTPSTransaction {
	StoreAPI: ReturnType<typeof StoreAPICreator>;
	index: number;
	song: ISong;
	constructor(StoreAPI: ReturnType<typeof StoreAPICreator>, initIndex: number, initSong: ISong) {
		super();
		this.StoreAPI = StoreAPI;
		this.index = initIndex;
		this.song = initSong;
	}
	doTransaction() {
		this.StoreAPI.addSong(this.index, this.song);
	}
	undoTransaction() {
		this.StoreAPI.removeSong(this.index);
	}
}
