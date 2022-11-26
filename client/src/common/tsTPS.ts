export class tsTPS_Transaction {
	doTransaction() {};
	undoTransaction() {};
}

export class tsTPS {
	transactions: tsTPS_Transaction[];
	mostRecentTransaction: number;
	performingDo: boolean;
	performingUndo: boolean;
	constructor() {
		this.transactions = [];
		this.mostRecentTransaction = -1;
		
		this.performingDo = false;
		this.performingUndo = false;
	}
	
	isPerformingDo() {
		return this.performingDo;
	}
	isPerformingUndo() {
		return this.performingUndo;
	}
	
	size() {
		return this.transactions.length;
	}
	redoSize() {
		return this.size() - this.mostRecentTransaction - 1;
	}
	undoSize() {
		return this.mostRecentTransaction + 1;
	}
	hasTransactionToRedo() {
		return this.mostRecentTransaction + 1 < this.size();
	}
	hasTransactionToUndo() {
		return this.mostRecentTransaction >= 0;
	}
	addTransaction(newTransaction: tsTPS_Transaction) {
		this.transactions.splice(this.mostRecentTransaction+1, Infinity);
		this.transactions.push(newTransaction)
		this.doTransaction();
	}
	doTransaction() {
		if (this.hasTransactionToRedo()) {
			this.performingDo = true;
			let transaction = this.transactions[this.mostRecentTransaction+1];
			transaction.doTransaction();
			this.mostRecentTransaction++;
			this.performingDo = false;
		}
	}
	undoTransaction() {
		if (this.hasTransactionToUndo()) {
			this.performingUndo = true;
			this.transactions[this.mostRecentTransaction].undoTransaction();
			this.mostRecentTransaction--;
			this.performingUndo = false;
		}
	}
	clearAllTransactions() {
		this.transactions = [];
		this.mostRecentTransaction = -1;
	}
	toString() {
		return `--Number of Transactions: ${this.size()}\n\
--Current index on Stack: ${this.mostRecentTransaction}\n\
--Current Transaction Stack:\n\
		${this.transactions.slice(0, this.mostRecentTransaction+1)
			.map(T => `----${T.toString()}\n`)}`;
	}
}

export default {
	tsTPS,
	tsTPS_Transaction
}