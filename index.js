/**
 * Created by angus on 14/02/17.
 */

const { app, nativeImage, Menu, Tray } = require('electron');
const robot = require('robotjs');
let tray = null;
let day = 0;

String.prototype.lpad = function (length, char) {
	let padding = char.repeat(length);

	return padding.substr(0, padding.length - this.length) + this;
};

Number.prototype.lpad = function (length) {
	return this.toString().lpad(length, '0');
};

Array.prototype.last = function () {
	return this[this.length - 1];
};

app.on('ready', () => {
	let image;
	if (process.platform === 'darwin') {
		image = nativeImage.createFromPath('robo_Template.png');
	} else {
		image = nativeImage.createFromPath(process.argv.indexOf('dark') === -1 ? 'robo_Radiance.png' : 'robo_Ambiance.png');
	}

	tray = new Tray(image);

	tray.setToolTip('Click to type out the date');
	tray.setContextMenu(getContextMenu());

	tray.on('click', () => {
		tray.setContextMenu(getContextMenu());
		for (let item in contextMenu) {
			if (contextMenu.hasOwnProperty(item) && contextMenu[item].checked) {
				return robot.typeString(getDateString(contextMenu[item]));
			}
		}
	});
});

function getDateString(type) {
	let now = new Date();
	if (day) {
		now.setDate(now.getDate() + day);
	}

	switch (type) {
		case 'underscore':
			return `${now.getFullYear()}_${(now.getMonth() + 1).lpad(2)}_${now.getDate()}`;
		case 'dayOfWeek':
			return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
		case 'timeLocale':
			return now.toLocaleTimeString();
		case 'timeWithoutSeconds':
			return `${now.getHours().lpad(2)}:${now.getMinutes().lpad(2)}`;
		case 'timeWithSeconds':
			return `${now.getHours().lpad(2)}:${now.getMinutes().lpad(2)}:${now.getSeconds().lpad(2)}`;
		case 'timestamp':
			return Math.floor(now.getTime() / 1000);
		default:
			return now.toLocaleDateString();
	}
}

function typeString(str) {
	let match = typeof str === 'string' ? str.match(/[:_]/) : null;

	if (typeof match === 'object') {
		str = str.split(match);
		for (let chars of str) {
			robot.typeString(chars);

			if (str.last() !== chars) {
				robot.keyTap(match, 'shift')
			}
		}
	} else {
		robot.typeString(str);
	}

	tray.setContextMenu(getContextMenu());
}

function getContextMenu() {
	return Menu.buildFromTemplate([
		{
			label: `System Date				${getDateString()}`,
			date: null,
			type: 'radio',
			checked: true,
			click: () => typeString(getDateString())
		},
		{
			label: `Underscore Date			${getDateString('underscore')}`,
			date: 'underscore',
			type: 'radio',
			click: () => typeString(getDateString('underscore'))
		},
		{
			label: `Day of the week			${getDateString('dayOfWeek')}`,
			date: 'dayOfWeek',
			type: 'radio',
			click: () => typeString(getDateString('dayOfWeek'))
		},
		{
			label: `System Time				${getDateString('timeLocale')}`,
			date: 'timeLocale',
			type: 'radio',
			click: () => typeString(getDateString('timeLocale'))
		},
		{
			label: `Time without seconds	${getDateString('timeWithoutSeconds')}`,
			date: 'time',
			type: 'radio',
			click: () => typeString(getDateString('timeWithoutSeconds'))
		},
		{
			label: `Time with seconds		${getDateString('timeWithSeconds')}`,
			date: 'time',
			type: 'radio',
			click: () => typeString(getDateString('timeWithSeconds'))
		},
		{
			label: `Timestamp				${getDateString('timestamp')}`,
			date: 'timestamp',
			type: 'radio',
			click: () => typeString(getDateString('timestamp'))
		},
		{
			type: 'separator'
		},
		{
			label: 'Subtract 1 day',
			click: () => {
				day--;
				tray.setContextMenu(getContextMenu());
			}
		},
		{
			label: 'Add 1 day',
			click: () => {
				day++;
				tray.setContextMenu(getContextMenu());
			}
		},
		{
			label: 'Go to today',
			click: () => {
				day = 0;
				tray.setContextMenu(getContextMenu());
			}
		},
		{
			type: 'separator'
		},
		{
			label: 'Exit',
			click: () => app.quit()
		}
	]);
}