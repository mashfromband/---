const FALSE	= false;

export function toHalfWidth(str: string): string {
	return str.replace(/[！-～]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
			  .replace(/　/g, ' ')  // 全角スペースを半角スペースに変換
			  .replace(/[“”]/g, '"') // 全角ダブルクォートを半角ダブルクォートに変換
			  .replace(/[‘’]/g, "'"); // 全角シングルクォートを半角シングルクォートに変換
}/*	toHalfWidth()	*/
export function toFullWidth(str: string): string {
	return str.replace(/[!-~]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0xFEE0))
			  .replace(/ /g, '　')  // 半角スペースを全角スペースに変換
			  .replace(/"/g, '“')	// 半角ダブルクォートを全角ダブルクォートに変換
			  .replace(/'/g, '‘');   // 半角シングルクォートを全角シングルクォートに変換
}/*	toFullWidth()	*/

// 全角数字を半角数字に変換する関数
export function numToHalfWidth(str: string): string {
	return str.replace(/[０-９]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0));
}/*	numToHalfWidth()	*/

// 半角数字を全角数字に変換する関数
export function numToFullWidth(str: string): string {
	return str.replace(/[0-9]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0xFEE0));
}/*	numToFullWidth()	*/

export function _sprintf(format: string, ...args: any[]): string {
	let i = 0;
	return format.replace(/%s/g, () => args[i++]);
}/*	sprintf()	*/



export function __sprintf(format: string, ...args: any[]): string {
	let i = 0;
	return format.replace(/%(\d+)?(\.\d+)?([sdif])/g, (_, width, precision, type) => {
		let arg = args[i++];
		switch (type) {
			case 's':
				arg = String(arg);
				if (width) {
					arg = arg.padStart(parseInt(width, 10));
				}
				return arg;
			case 'd':
			case 'i':
				arg = parseInt(arg, 10).toString();
				if (width) {
					arg = arg.padStart(parseInt(width, 10), '0');
				}
				return arg;
			case 'f':
				arg = parseFloat(arg).toFixed(precision ? parseInt(precision.slice(1), 10) : 6);
				if (width) {
					arg = arg.padStart(parseInt(width, 10), ' ');
				}
				return arg;
			default:
				return arg;
		}
	});
}/*	__sprintf()	*/



export function sprintf(format: string, ...args: any[]): string {
	let i = 0;
	
	// Helper function to calculate the display width of a string
	const getDisplayWidth = (str: string): number => {
		return Array.from(str).reduce((acc, char) => {
			const codePoint = char.codePointAt(0);
			if (codePoint !== undefined) {
				// Check if the character is a full-width character
				if (
					(codePoint >= 0x1100 && codePoint <= 0x115F) || // Hangul Jamo
					(codePoint >= 0x2329 && codePoint <= 0x232A) || // Miscellaneous Technical
					(codePoint >= 0x2E80 && codePoint <= 0xA4CF && codePoint !== 0x303F) || // CJK Radicals Supplement and others
					(codePoint >= 0xAC00 && codePoint <= 0xD7A3) || // Hangul Syllables
					(codePoint >= 0xF900 && codePoint <= 0xFAFF) || // CJK Compatibility Ideographs
					(codePoint >= 0xFE10 && codePoint <= 0xFE19) || // Vertical forms
					(codePoint >= 0xFE30 && codePoint <= 0xFE6F) || // CJK Compatibility Forms
					(codePoint >= 0xFF00 && codePoint <= 0xFF60) || // Fullwidth Forms
					(codePoint >= 0xFFE0 && codePoint <= 0xFFE6) // Fullwidth forms (currency symbols and the like)
				) {
					return acc + 2;
				}
				// For half-width characters, count as 1
				return acc + 1;
			}
			return acc;
		}, 0);
	};

	return format.replace(/%(-?\d+)?(\.\d+)?([sdif])/g, (_, width, precision, type) => {
		let arg = args[i++];

		// If width is provided, parse it as an integer
		const intWidth = width ? parseInt(width, 10) : undefined;

		// Function to strip ANSI escape sequences
		const stripAnsi = (str: string) => str.replace(/\x1B\[[0-9;]*m/g, '');

		switch (type) {
			case 's':
				arg = String(arg);
				const plainArg = stripAnsi(arg); // Strip escape sequences for length calculation
				const displayWidth = getDisplayWidth(plainArg); // Calculate display width considering full-width characters
				
				if (intWidth !== undefined) {
					const padding = Math.abs(intWidth) - displayWidth;
					const padStr = ' '.repeat(Math.max(0, padding));
					// If width is negative, pad on the right (left align)
					if (intWidth < 0) {
						arg = arg + padStr;
					} else {
						arg = padStr + arg;
					}
				}
				return arg;
			case 'd':
			case 'i':
				arg = parseInt(arg, 10).toString();
				if (intWidth !== undefined) {
					const padding = Math.abs(intWidth) - arg.length;
					const padStr = '0'.repeat(Math.max(0, padding));
					// If width is negative, pad on the right (left align)
					if (intWidth < 0) {
						arg = arg + padStr;
					} else {
						arg = padStr + arg;
					}
				}
				return arg;
			case 'f':
				arg = parseFloat(arg).toFixed(precision ? parseInt(precision.slice(1), 10) : 6);
				if (intWidth !== undefined) {
					const padding = Math.abs(intWidth) - arg.length;
					const padStr = ' '.repeat(Math.max(0, padding));
					// If width is negative, pad on the right (left align)
					if (intWidth < 0) {
						arg = arg + padStr;
					} else {
						arg = padStr + arg;
					}
				}
				return arg;
			default:
				return arg;
		}
//	}).replace(/\\t/g, '\t'); // Replace \t with actual tab character
	});
}/*	sprintf()	*/



export function printf(format: string, ...args: any[]): string {
	const res = sprintf(format, ...args);
	console.log(res);
	return	res;
}/*	printf()	*/


export function formatDate(date: Date, format: string): string {
	const year = date.getFullYear().toString(); // 数値を文字列に変換
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');

	// フォーマットに応じた置換
	return format
		.replace('yyyy', year)
		.replace('MM', month)
		.replace('dd', day)
		.replace('HH', hours)
		.replace('mm', minutes)
		.replace('ss', seconds);
}/*	formatDate()	*/


export function parseCommandLineArgs(): { [key: string]: string | boolean } {
	const args = process.argv.slice(2); // 最初の2つの要素は無視する (nodeとスクリプトパス)
	const result: { [key: string]: string | boolean } = {};

	args.forEach(arg => {
		const [key, value] = arg.split('=');

		if (key.startsWith('--')) {
			const formattedKey = key.slice(2);

			// 値が存在しない場合は true をセット
			if (value === undefined) {
				result[formattedKey] = true;
			} else {
				result[formattedKey] = value;
			}
		}
	});

	return result;
}/*	parseCommandLineArgs()	*/


export function camelToSnake(camel: string): string {
	return camel.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}/*	camelToSnake()	*/
export function snakeToCamel(snake: string): string {
	return snake.replace(/(_\w)/g, match => match[1].toUpperCase());
}/*	snakeToCamel()	*/

export function convertObjectKeys(
				obj: { [key: string]: any },
				convertFunc: (key: string) => string): { [key: string]: any } {

	const result: { [key: string]: any } = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			const newKey = convertFunc(key);
			const value = obj[key];

			// 値がオブジェクトまたは配列であれば再帰的に処理
			if (typeof value === 'object' && value !== null) {
				result[newKey] = Array.isArray(value)
					? value.map(item => convertObjectKeys(item, convertFunc))
					: convertObjectKeys(value, convertFunc);
			} else {
				result[newKey] = value;
			}
		}
	}
	return result;
}/*	convertObjectKeys()	*/

export function filterObjectByObjectKeys(obj: {}, interfaceDef: {}): object {
	const filteredObj = {};
	(Object.keys(interfaceDef) as []).forEach((key) => {
		if (key in obj) {
			filteredObj[key] = obj[key];
		}
	});
	return filteredObj;
}/*	filterObjectByObjectKeys()	*/

export function deepCopy<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') {
		return obj; // 値がオブジェクトでない場合、そのまま返す（基本型）
	}

	if (Array.isArray(obj)) {
		const copy: any[] = [];
		for (let i = 0; i < obj.length; i++) {
			copy[i] = deepCopy(obj[i]);
		}
		return copy as unknown as T;
	}

	if (obj instanceof Date) {
		return new Date(obj.getTime()) as unknown as T; // Dateオブジェクトの場合は新しいインスタンスを作成
	}

	if (obj instanceof Set) {
		return new Set(Array.from(obj).map(item => deepCopy(item))) as unknown as T; // Setオブジェクトのコピー
	}

	if (obj instanceof Map) {
		const copy = new Map();
		obj.forEach((value, key) => {
			copy.set(key, deepCopy(value));
		});
		return copy as unknown as T; // Mapオブジェクトのコピー
	}

	const copy: { [key: string]: any } = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			copy[key] = deepCopy((obj as { [key: string]: any })[key]);
		}
	}
	return copy as T;
}/*	deepCopy()	*/




export function getRecursiveMemorySizeOfObject(obj: any, recursiveFlag = true, visited = new WeakSet()): number {
	// 循環参照を防ぐためにWeakSetで追跡
	if (obj === null || typeof obj !== 'object' || visited.has(obj)) {
		return 0;
	}

	visited.add(obj); // 現在のオブジェクトをWeakSetに追加

	let totalSize = 0;

	// オブジェクトが配列の場合、その要素のサイズも計算する
	if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			totalSize += getMemorySizeRecursiveOfValue(obj[i], recursiveFlag, visited);
		}
	}
	else {
		// オブジェクトの各プロパティを走査
		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {	// オブジェクト自身のプロパティのみを対象にする
				totalSize += getMemorySizeRecursiveOfValue(key, recursiveFlag, visited);	// キーのサイズ
				if (recursiveFlag) {
					totalSize += getMemorySizeRecursiveOfValue(obj[key], recursiveFlag, visited);	// 値のサイズ
				}
			}
		}
	}

	return totalSize;
}/*	getRecursiveMemorySizeOfObject()	*/

export function getMemorySizeRecursiveOfValue(value: any, recursiveFlag = true, visited: WeakSet<any>): number {
	if (typeof value === 'string') {
		return value.length * 2; // 文字列は通常2バイト/文字
	}
	else if (typeof value === 'number') {
		return 8; // 数値は通常8バイト
	}
	else if (typeof value === 'boolean') {
		return 4; // booleanは4バイト
	}
	else if (typeof value === 'object' && value !== null && recursiveFlag) {
		return getRecursiveMemorySizeOfObject(value, recursiveFlag, visited); // 再帰的にサイズを取得
	}
	else {
		return 0; // その他の型は無視
	}
}/*	getMemorySizeRecursiveOfValue()	*/

export function isNumber(value: any): boolean {
	return typeof value === 'number' && !isNaN(value);
}/*	isNumber()	*/

