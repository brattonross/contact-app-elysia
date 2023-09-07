type FlashMessage = {
	type: "success" | "error";
	message: string;
};

class Flash {
	#messages: Array<FlashMessage> = [];

	public all() {
		const messages = this.#messages;
		this.#messages = [];
		return messages;
	}

	public push(message: FlashMessage) {
		this.#messages.push(message);
	}

	public success(message: string) {
		this.push({ type: "success", message });
	}

	public error(message: string) {
		this.push({ type: "error", message });
	}
}

export const flash = new Flash();
