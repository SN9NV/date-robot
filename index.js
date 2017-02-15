/**
 * Created by angus on 14/02/17.
 */

const { app, BrowserWindow, globalShortcut, ipcMain, nativeImage, Menu, Tray } = require('electron');
const robot = require('robotjs');

let tray = null;
let window = null;
let day = 0;
let writing = false;
let contextMenu = returnContextMenu();

app.on('ready', () => {
	window = new BrowserWindow({width: 220, height: 285, show: false, frame: false});

	window.loadURL(require('url').format({
		pathname:require('path').join(__dirname, 'date_picker.html'),
		protocol: 'file:',
		slashes: true
	}));

	ipcMain.on('picked', updateDay);
	ipcMain.on('message', (event, data) => console.log(data));

	let image;
	if (process.platform === 'darwin') {
		image = nativeImage.createFromPath('robo_Template.png');
	} else {
		image = nativeImage.createFromPath(process.argv.indexOf('dark') === -1 ? 'robo_Radiance.png' : 'robo_Ambiance.png');
	}

	tray = new Tray(image);

	tray.setToolTip('Click to type out the date');
	updateTimes();

	tray.on('click', typeDate);
	
	globalShortcut.register('CmdOrCtrl+Shift+d', () => {
		console.log('Writing');
		setTimeout(typeDate, 500);
	});
});

app.on('will-quit', () => {
	globalShortcut.unregisterAll();
	window = null;
});

function typeDate() {
	if (writing === false) {
		writing = true;
		setTimeout(() => writing = false, 1000);

		contextMenu.forEach(item => {
			if (item.checked && item.type === 'radio') {
				return typeString(getDateString(item.date));
			}
		});
	}
	
	updateTimes();
}

function getDateString(type) {
	let now = new Date();
	if (day) {
		now.setDate(now.getDate() + day);
	}

	switch (type) {
		case 'underscore':
			return `${now.getFullYear()}_${lpad(now.getMonth() + 1, 2)}_${now.getDate()}`;
		case 'dayOfWeek':
			return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
		case 'timeLocale':
			return now.toLocaleTimeString();
		case 'timeWithoutSeconds':
			return `${lpad(now.getHours(), 2)}:${lpad(now.getMinutes(), 2)}`;
		case 'timeWithSeconds':
			return `${lpad(now.getHours(), 2)}:${lpad(now.getMinutes(), 2)}:${lpad(now.getSeconds(), 2)}`;
		case 'timestamp':
			return Math.floor(now.getTime() / 1000);
		default:
			return now.toLocaleDateString();
	}
}

function typeString(str) {
	let match = (typeof str === 'string') ? str.match(/[:_]/) : null;

	if (match && match[0]) {
		str = str.split(match);
		str.forEach((chars, index) => {
			robot.typeString(chars);

			if (str.length - 1 !== index) {
				robot.keyTap(match, 'shift')
			}
		});
	} else {
		robot.typeString(str);
	}
}

function updateTimes() {
	contextMenu = contextMenu.map(item => {
		if (item.hasOwnProperty('date')) {
			let label = item.label.split('\t');
			label.pop();
			label.push(getDateString(item.date));
			item.label = label.join('\t');
		}

		return item;
	});

	tray.setContextMenu(Menu.buildFromTemplate(contextMenu));
}

function setActive(menuItem) {
	contextMenu.forEach(item => {
		if (item.date !== undefined) {
			item.checked = (item.date === menuItem.date);
		}
	});
}

function updateDay(event, date) {
	date = new Date(date);
	let now = new Date();

	// now.setHours(0, 0, 0, 0);
	// date.setHours(0, 0, 0, 0);

	let diff = (date - new Date()) / (86400 * 1000);

	day = Math.ceil(diff);
	console.log(day);

	window.hide();

	updateTimes();
}

/**
 * Takes a string or number and returns the string representation of that, left padded with the char of choice.
 *   If the char is not given and the value is a number, the padding will be '0', and if the value is a string,
 *   the padding will be spaces.
 *
 * @param {string|number}  value   String or number to left pad
 * @param {number}         length  Total length of the final string
 * @param {string}         [char]  Char to use as padding. If char is longer than 1 char, it will use only the beginning part for the padding
 * @returns {string}
 */
function lpad(value, length, char) {
	if (typeof value === 'number') {
		value = value.toString();
		char = char || '0';
	}

	if (typeof value === 'string') {
		char = char || ' ';
		return char.repeat(length).substr(0, length - value.length) + value;
	}
}

function showWindow() {
	window.show();
}

function returnContextMenu() {
	return [
		{
			label: `Write					${process.platform === 'darwin' ? 'Command' : 'Ctrl'}+Shift+D`,
			click: typeDate
		},
		{
			type: 'separator'
		},
		{
			label: `System Date				${getDateString()}`,
			date: 'systemDate',
			type: 'radio',
			checked: true,
			click: setActive
		},
		{
			label: `Underscore Date			${getDateString('underscore')}`,
			date: 'underscore',
			type: 'radio',
			click: setActive
		},
		{
			label: `Day of the week			${getDateString('dayOfWeek')}`,
			date: 'dayOfWeek',
			type: 'radio',
			click: setActive
		},
		{
			label: `System Time				${getDateString('timeLocale')}`,
			date: 'timeLocale',
			type: 'radio',
			click: setActive
		},
		{
			label: `Time without seconds	${getDateString('timeWithoutSeconds')}`,
			date: 'timeWithoutSeconds',
			type: 'radio',
			click: setActive
		},
		{
			label: `Time with seconds		${getDateString('timeWithSeconds')}`,
			date: 'timeWithSeconds',
			type: 'radio',
			click: setActive
		},
		{
			label: `Timestamp				${getDateString('timestamp')}`,
			date: 'timestamp',
			type: 'radio',
			click: setActive
		},
		{
			type: 'separator'
		},
		{
			label: 'Pick date',
			click: showWindow
		},
		{
			label: 'Go to today',
			click: () => {
				day = 0;
				updateTimes();
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Exit',
			click: app.quit
		}
	];
}
