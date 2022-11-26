import { StoreAPICreator } from "..";
import tsTPS_Transaction from "../../common/tsTPS";

export default class MoveSongTransaction extends tsTPS_Transaction {
	StoreAPI: ReturnType<typeof StoreAPICreator>;
	startIndex: number;
	endIndex: number
	constructor(
		StoreAPI: ReturnType<typeof StoreAPICreator>,
		initStartIndex: number,
		initEndIndex: number
		) {
		super();
		this.StoreAPI = StoreAPI;
		this.startIndex = initStartIndex;
		this.endIndex = initEndIndex;
	}
	doTransaction() {
		this.StoreAPI.moveSong(this.startIndex, this.endIndex);
	}
	undoTransaction() {
		this.StoreAPI.moveSong(this.endIndex, this.startIndex);
	}
}
