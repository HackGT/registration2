import * as XLSX from 'xlsx';

class XLSXExporter {

	private hexathonInfo: {name: string, id: string};
	private workbook: XLSX.WorkBook;
	
	public currURL: string | null = null;

	constructor(hexathonInfo: {name: string, id: string}) {
		this.workbook = XLSX.utils.book_new();
		this.hexathonInfo = hexathonInfo;
		this.workbook.Props = {
			Title: `hexathon-${hexathonInfo.name}-statistics`,
			Subject: `Application Data for ${hexathonInfo.name}`,
			CreatedDate: new Date()
		};
	}

	/**
	 * Creates a new sheet (one of those tabs at the bottom of the excel file) and adds key-value data. 
	 */
	addKeyValueData(data: Record<string, any>, sheetLabel: string, keyLabel?: string, valueLabel?: string, ): void {
		
		// convert to [{key, value}] format so that they go on rows and not columns
		const rows = Object.entries(data).map(([key, value]) => ({
			[keyLabel || 'Key']: key,
			[valueLabel || 'Value']: value,
		}));
		
		const worksheet = XLSX.utils.json_to_sheet(rows); // Updated to use rows instead of [data]
		XLSX.utils.book_append_sheet(this.workbook, worksheet, sheetLabel);
	}

	/**
	 * Creates a new sheet (one of those tabs at the bottom of the excel file) and adds a 2D table of data.
	 * 
	 * `rowLabelName` is what describes the top-level keys of `data` - its basically what goes in the top left
	 * cell of the 2d table.
	 * 
	 * ### how to use
	 * Pass in `data` formatted like this:
	 * ```json
	 * {
	 *	"row1": {
	 *		"columnHeader1": 930,
	 *		"columnHeader2": 16,
	 *		"columnHeader3": 1266,
	 *		...
	 *	},
	 *	"row2": {
	 *		"columnHeader1": 23,
	 *		"columnHeader2": 0,
	 *		"columnHeader3": 29,
	 *		...
	 *	},
	 *	"row3": {
	 *		"columnHeader1": 13,
	 *		"columnHeader2": 0,
	 *		"columnHeader3": 23,
	 *		...
	 *	},
	 *	...
	 * ```
	 * 
	 * ^ This will result in a table that looks like this:
	 * ```text
	 * | rowLabelName | columnHeader1 | columnHeader2 | columnHeader3 |
	 * | ------------ | ------------- | ------------- | ------------- |
	 * | row1         | 930           | 16            | 1266          |
	 * | row2         | 23            | 0             | 29            |
	 * | row3         | 13            | 0             | 23            |
	 * ```
	 */
	addTableData(data: Record<string, Record<string, any>>, rowLabelName: string, sheetLabel: string): void {

		const headers = Object.keys(Object.values(data)[0]);

		const aoa = [];

		aoa.push([rowLabelName, ...headers]);

		for (const [key, values] of Object.entries(data)) {
			const row = [key];
			for (const header of headers) {
				row.push(values[header]);
			}
			aoa.push(row);
		}

		const worksheet = XLSX.utils.aoa_to_sheet(aoa);
		XLSX.utils.book_append_sheet(this.workbook, worksheet, sheetLabel);
	}

	getDownloadURL(): string {
		if (this.currURL) {
			return this.currURL;
		}
		this.exportToDownloadURL();

		// SCREW YOU ESLINT
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion 
		return this.currURL!;
	}

	cleanupDownloadURL(): void {
		if (this.currURL) {
			URL.revokeObjectURL(this.currURL);
			this.currURL = null;
		}
	}

	private exportToDownloadURL(): void {
		const out = XLSX.write(this.workbook, {
			bookType: 'xlsx',
			type: 'array', 
		});

		const blob = new Blob([out], { type: 'application/octet-stream' });
		this.currURL = URL.createObjectURL(blob);
	}
}

export default XLSXExporter;