export default class Logger {

	public info(text: string, metadata?: { [key: string]: any }) {
		this.print('INFO', text, metadata);
	}

	public warn(text: string, metadata?: { [key: string]: any }) {
		this.print('WARN', text, metadata);
	}

	public error(text: string, metadata?: { [key: string]: any }) {
		this.print('ERROR', text, metadata);
	}

	private print(logLevel: string, text: string, metadata?: { [key: string]: any }) {
		// tslint:disable-next-line: no-console
		console.log(`[${logLevel}] ${text} [${this.generateMetadataText(metadata)}]`);
	}

	private generateMetadataText(metadata?: { [key: string]: any }) {
		if (!metadata) { return ''; }
		const result: string[] = [];
		Object.keys(metadata).forEach((key) => {
			result.push(`${key}="${metadata[key].toString()}"`);
		});
		return result.join(' ');
	}

}
