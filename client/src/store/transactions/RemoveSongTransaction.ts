import { StoreAPICreator } from "..";
import tsTPSTransaction from "../../common/tsTPS";
import { ISong } from "../playlist-model";

export default class RemoveSongTransaction extends tsTPSTransaction {
	StoreAPI: ReturnType<typeof StoreAPICreator>;
	index: number;
	song: ISong;
	constructor(StoreAPI: any, initIndex: number, initSong: ISong) {
		super();
		this.StoreAPI = StoreAPI;
		this.index = initIndex;
		this.song = initSong;
	}
	doTransaction() {
		this.StoreAPI.removeSong(this.index);
	}
	undoTransaction() {
		this.StoreAPI.addSong(this.index, this.song);
	}
}
