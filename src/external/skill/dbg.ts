export const	FALSE	= false;

export const	EXIT = process.exit;



/*	色のコードを定義	*/
const _colors = {
	reset:			"[0m",

	bold:			"[1m",		//	太字
	dim:			"[2m",		//	薄い文字
	italic:			"[3m",		//	
	underscore:		"[4m",
	blink:			"[5m",
	reverse:		"[7m",
	hidden:			"[8m",

	black:			"[30m",
	red:			"[31m",
	green:			"[32m",
	yellow:			"[33m",
	blue:			"[34m",
	magenta:		"[35m",
	cyan:			"[36m",
	white:			"[37m",

	bgBlack:		"[40m",
	bgRed:			"[41m",
	bgGreen:		"[42m",
	bgYellow:		"[43m",
	bgBlue:			"[44m",
	bgMagenta:		"[45m",
	bgCyan:			"[46m",
	bgWhite:		"[47m"
}/*	_colors	*/;
const colors = {
	reset:				"[0m",				// 全てのスタイルをリセット

	bold:				"[1m",				// 太字
	dim:				"[2m",				// 薄い文字
	italic:				"[3m",				// イタリック（斜体）
	underline:			"[4m",		 		// 下線
	blink:				"[5m",				// 点滅
	inverse:			"[7m",				// 文字色と背景色を反転
	hidden:				"[8m",				// 隠し文字（不可視）
	strikethrough:		"[9m",	 			// 打ち消し線

	black:				"[30m",				// 文字色：黒
	red:				"[31m",				// 文字色：赤
	green:				"[32m",				// 文字色：緑
	yellow:				"[33m",				// 文字色：黄
	blue:				"[34m",				// 文字色：青
	magenta:			"[35m",				// 文字色：マゼンタ
	purple:				"[35m",				// 文字色：マゼンタ
	cyan:				"[36m",				// 文字色：シアン
	white:				"[37m",				// 文字色：白

	brightBlack:		"[90m",				// 明るい黒
	brightRed:			"[91m",				// 明るい赤
	brightGreen:		"[92m",				// 明るい緑
	brightYellow:		"[93m",				// 明るい黄
	brightBlue:		"[94m",				// 明るい青
	brightMagenta:		"[95m",				// 明るいマゼンタ
	brightPurple:		"[95m",				// 明るいマゼンタ
	brightCyan:		"[96m",				// 明るいシアン
	brightWhite:		"[97m",				// 明るい白

	bgBlack:			"[40m",				// 背景色：黒
	bgRed:				"[41m",				// 背景色：赤
	bgGreen:			"[42m",				// 背景色：緑
	bgYellow:			"[43m",				// 背景色：黄
	bgBlue:				"[44m",				// 背景色：青
	bgMagenta:			"[45m",				// 背景色：マゼンタ
	bgPurple:			"[45m",				// 背景色：マゼンタ
	bgCyan:				"[46m",				// 背景色：シアン
	bgWhite:			"[47m",				// 背景色：白

	brightBgBlack:		"[100m",			// 明るい背景色：黒
	brightBgRed:		"[101m",			// 明るい背景色：赤
	brightBgGreen:		"[102m",			// 明るい背景色：緑
	brightBgYellow:	"[103m",			// 明るい背景色：黄
	brightBgBlue:		"[104m",			// 明るい背景色：青
	brightBgMagenta:	"[105m",			// 明るい背景色：マゼンタ
	brightBgPurple:	"[105m",			// 明るい背景色：マゼンタ
	brightBgCyan:		"[106m",			// 明るい背景色：シアン
	brightBgWhite:		"[107m",			// 明るい背景色：白

	clearScreen:		"[2J",				// 画面全体をクリア
	clearLine:			"[K",				// カーソルから行末までをクリア

};/*	colors	*/
type ColorKey = keyof typeof colors;
export function COL(text: string, styles: string): string {
//	const escs = styles.split(',').map(style => "\x1b"+colors[style as ColorKey] || "").join("");
	const escs = styles.split(',').map(style => "\x1b"+(colors[style as ColorKey] || colors.reset)).join("");
	return `${escs}${text}${"\x1b"+colors.reset}`;
}/*	COL	*/





export function WARN(format: string, ...args: any[]): string {
	format = COL(format, "yellow");
	return	printf(format, ...args);
}/*	WARN()	*/


let	noDebugPrintFlg	= false;

export function ON(): void {
	noDebugPrintFlg	= false;
}/*	ON()	*/
export function OFF(): void {
	noDebugPrintFlg	= true;
}/*	OFF()	*/

export	function LOG(...args: any[]): void {
	process.stdout.write(getCallFname(1));		/* 呼び出し関数名追加	*/
	console.log(...args);
}/*	LOG()	*/
export	function ERR(...args: any[]): void {
	process.stdout.write(getCallFname(1));		/* 呼び出し関数名追加	*/
	console.error(...args);
}/*	ERR()	*/

export function HASH(hash: { [key: string]: unknown}): void {
	if (noDebugPrintFlg)	return

	for (const key in hash) {
		if (hash.hasOwnProperty(key)) {
			LOG(`\t${key}: ${hash[key]}`);
		}
	}
}/*	HASH()	*/

export function ARY<T>(array: T[]): void {
	if (noDebugPrintFlg)	return

	array.forEach((item, index) => {
//		LOG(`${index}:`, item);
		LOG(`${index} : <`, item, ">");
	});
}/*	ARY()	*/

export function INF(format: string, ...args: any[]): string {
	format = COL(format, "cyan");
	return	printf(format, ...args);
}/*	INF()	*/
export function PF(format: string, ...args: any[]): string {
	return	printf(format, ...args);
}/*	PF()	*/

export function VAL<T>(value: T, name?: string): T {
	if (noDebugPrintFlg)	return	value;

	process.stdout.write(getCallFname(1));		/* 呼び出し関数名追加	*/

	return	print_val(value, name);
}/*	VAL()	*/

function print_val<T>(value: T, name?: string): T {
	if (Array.isArray(value)) {
		console.log(sprintf("%s:", name || "ARRAY"), value);
	}
	else if (typeof value === 'object' && value !== null) {
		console.log(sprintf("%s:", name || "OBJECT"), value);
	}
	else {
		console.log(sprintf("%s:", name || "VALUE"), value);
	}
	return value;
}/*	print_val()	*/

function _sprintf(format: string, ...args: any[]): string {
	let i = 0;
//	return format.replace(/%s/g, () => args[i++]);
	return format.replace(/%s|%d/g, () => args[i++]);
}/*	_sprintf()	*/

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

function printf(format: string, ...args: any[]): string {
	const res = sprintf(format, ...args);
	console.log(res);
	return	res;
}/*	printf()	*/

export function HERE0() {
	const error = new Error();
	const stack = error.stack?.split('\n');

	if (stack && stack.length > 2) {
		// 3行目が呼び出し元の情報を含んでいる
		const callerInfo = stack[2].trim();
		console.log(`HERE0(): ${callerInfo}`);
	}
}/*	HERE0()	*/





type StackInf = {
	funcName:	string;
	filePath:	string;
	fileName:	string;
	lineNum:	number;
}/*	StackInf	*/;

const regStcPtFnLn = new RegExp(/at\s+(.*?)\s+\((.*?):(\d+):(\d+)\)/);
function getStackInfs(endId: number = -1) : StackInf[] {
	let	result: StackInf[] = [];
	// エラーオブジェクトを作成してスタックトレースを取得
	const error = new Error();
	const stack = error.stack?.split('\n');

//console.log(stack)

	let	addNum = 0;
	if (stack && stack.length > 2) {
		for (let i = 2; stack.length > i; i++) {

			// スタックトレースの3行目が呼び出し元の関数の情報を含む行
			const callerLine = stack[i].trim();

			// 正規表現で関数名、ファイルパス、ファイル名、行番号を抽出
			const match = callerLine.match(regStcPtFnLn);
			if (match) {
				const funcName		= match[1];
				const filePath		= match[2];
//				const fileName		= filePath.split('/').pop(); // ファイル名のみを取得
				const fileName		= filePath.split(/[/\\]/).pop() as string; // ファイル名のみを取得
				const lineNum		= parseInt(match[3], 10);
				result.push({ funcName, filePath, fileName, lineNum });
				addNum++;
				if ((0 <= endId)&&(endId+1 <= addNum)) {
//console.log(match);
//console.log(stack);
//process.exit(0);
					break;
				}
			}
		}
	}

	return result;
}/*	getStackInfs()	*/

export function CURFUNC(sadd: number = 0): string {
	return	getCallFname(sadd+1);
}/*	CURFUNC()	*/

function getCallFname(sadd: number = 0, col: string = "brightGreen,italic,dim"){
	let		resStr	= "";
	const	sid = 1 + sadd;

	const stacks = getStackInfs(sid);
//	if (1 < stacks.length) {
	if (sid < stacks.length) {
		resStr = stacks[sid].funcName + "():";
//		resStr = stacks[sid].funcName + "():" + stacks[sid].fileName + ":" + stacks[sid].lineNum + ":";
		if (col) resStr = COL(resStr, col);
	}
	else {
	}
	return	resStr;
}/*	getCallFname()	*/

export function HERE() {
	const	sid = 1;
	const stacks = getStackInfs(sid);

	if (1 < stacks.length) {
//		PF("%s%s:%d", COL(stacks[sid].funcName+"():", "green"), stacks[sid].fileName, stacks[sid].lineNum);
		PF("%s at %s (%s:%d)", 
				COL("HERE():", "green"), 
				stacks[sid].funcName+"()", 
				stacks[sid].fileName, 
				stacks[sid].lineNum
		);
	}
}/*	HERE()	*/

