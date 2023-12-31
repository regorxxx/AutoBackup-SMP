'use strict';
//30/12/23

/* global menu_panelProperties:readable */
include('..\\helpers\\helpers_xxx.js');
/* global globFonts:readable, MK_SHIFT:readable, VK_SHIFT:readable, folders:readable */
include('..\\helpers\\buttons_xxx.js');
/* global getUniquePrefix:readable, buttonsBar:readable, addButton:readable, themedButton:readable */
include('..\\helpers\\menu_xxx.js');
/* global _menu:readable  */
include('..\\helpers\\menu_xxx_extras.js');
/* global _createSubMenuEditEntries:readable */
include('..\\helpers\\helpers_xxx_prototypes.js');
/* global isBoolean:readable, isInt:readable, isJSON:readable, isString:readable */
include('..\\helpers\\helpers_xxx_file.js');
/* global _open:readable, utf8:readable, _jsonParseFileCheck:readable, _isFile:readable, _explorer:readable */
include('..\\helpers\\helpers_xxx_UI.js');
/* global _gdiFont:readable, _gr:readable, _scale:readable, chars:readable */
include('..\\helpers\\helpers_xxx_properties.js');
/* global setProperties:readable, getPropertiesPairs:readable, checkProperty:readable, overwriteProperties:readable */
include('..\\helpers\\helpers_xxx_input.js');
/* global Input:readable */
include('..\\main\\autobackup\\autobackup.js');
/* global AutoBackup:readable */

var prefix = 'bak'; // NOSONAR[global]
var version = '1.0.0'; // NOSONAR[global]

try {window.DefineScript('AutoBackup Button', {author:'regorxxx', version, features: {drag_n_drop: false}});} catch (e) { /* May be loaded along other buttons */ }

prefix = getUniquePrefix(prefix, ''); // Puts new ID before '_'

var newButtonsProperties = { // NOSONAR[global]
	iPlaying:		['While playing (every X min, 0 = off)', 60, {func: isInt}, 60],
	iStop:			['When playback stops (after X min, 0 = off)', 5, {func: isInt}, 5],
	iInterval:		['Always, since last autosave (every X min, 0 = off)', 30, {func: isInt}, 30],
	iStart:			['On startup (after X min, 0 = off)', 1, {func: isInt}, 1],
	iTrack:			['Every X tracks (0 = off)', 0, {func: isInt}, 0],
	iClose:			['On Foobar2000 exit (after X secs, 0 = off)', 20, {func: isInt}, 20],
	files:			['Files and Folders mask',
		JSON.stringify([
			// Foobar folders
			{name: 'Main config', path: 'configuration'},
			{name: 'Playlists (1)', path: 'playlists*'},
			{name: 'Statistics (1)', path: 'index-data'},
			{name: 'VST config', path: 'vst-presets'},
			// Foobar Files
			{name: 'Theme', path: 'theme.fth'},
			{name: 'Statistics (2)', path: 'PlaybackStatistics.dat'},
			{name: 'Library', path: 'database.dat'},
			// JS scripts
			{name: 'Playlist Organizer', path: 'pl_organizer.txt'},
			{name: 'JS config', path: 'js_data\\presets'},
			{name: 'JS temp', path: 'js_data\\temp'},
			{name: 'Buttons', path: 'js_data\\buttons_*'},
			{name: 'Playlist Manager', path: 'js_data\\playlistManager_*'},
			{name: 'Devices (1)', path: 'js_data\\devices.json'},
			{name: 'Devices (2)', path: 'js_data\\devices_priority.json'},
			{name: 'ListenBrainz', path: 'js_data\\listenbrainz_feedback.json'},
			{name: 'Playlist Tools (1)', path: 'js_data\\playlistTools_presets.json'},
			{name: 'Playlist Tools (2)', path: 'js_data\\playlistTools_shortcuts.json'},
			{name: 'Playlist Tools (3)', path: 'js_data\\pools_presets.json'},
			{name: 'Similar Artists', path: 'js_data\\searchByDistance_artists.json'},
			{name: 'World Map (1)', path: 'js_data\\worldMap.json'},
			{name: 'World Map (2)', path: 'js_data\\worldMap_library.json'},
		]),
		{func: isJSON}],
	outputPath:		['Directory to store backup files', 'autobackup\\autobackup.', {func: isString}, 'autobackup\\autobackup.'],
	iBackups:		['Number of backups to keep', 8, {func: isInt}, 8],
	backupFormat:	['Backups file format replacers',
		JSON.stringify([
			{name: 'Remove \\- :,', regex: '[\\- :,]', flag: 'g', replacer: ''},
			{name: 'Replace T', regex: 'T', flag: 'g', replacer: '-'}
		]), {func: isJSON}
	],
	bAsync:			['Aynchronous backup processing', true, {func: isBoolean}, true],
	active:			['AutoBackup activated', true, {func: isBoolean}, true],
	bIconMode:		['Icon-only mode?', false, {func: isBoolean}, false],
	bStartActive:	['Always active on startup', true, {func: isBoolean}, true],
	bHeadlessMode:	['Headless mode', false, {func: isBoolean}, false],
	backupsMaxSize:	['Max size of backup files (MB)', 2000, {func: isInt}, 2000],
	minDriveSize:	['Min free space on drive (MB)', 4000, {func: isInt}, 4000],
};
newButtonsProperties.files.push(newButtonsProperties.files[1]);
newButtonsProperties.backupFormat.push(newButtonsProperties.backupFormat[1]);

setProperties(newButtonsProperties, prefix, 0); //This sets all the panel properties at once
newButtonsProperties = getPropertiesPairs(newButtonsProperties, prefix, 0);
buttonsBar.list.push(newButtonsProperties);

addButton({
	AutoBackup: new themedButton({x: 0, y: 0, w: _gr.CalcTextWidth('AutoBackup', _gdiFont(globFonts.button.name, globFonts.button.size * buttonsBar.config.scale)) + 25 * _scale(1, false) /_scale(buttonsBar.config.scale), h: 22}, 'AutoBackup', function (mask) {
		if ((MK_SHIFT & mask) === MK_SHIFT) { // NOSONAR [bitwise]
			this.autoBackup.forceBackup();
		} else {
			// Menu
			clearTimeout(buttonsBar.hidden.id);
			const menu = new _menu({
				onBtnUp: () => { // Don't hide button while using menu
					buttonsBar.hidden.id = setTimeout(on_mouse_mbtn_up, buttonsBar.config.hiddenTimeout);
				}
			});
			{
				const menuName = menu.newMenu('Interval settings...');
				['iPlaying', 'iStop', 'iInterval', 'iStart', 'iTrack', 'iClose'].forEach((key) => {
					const value = this.buttonsProperties[key][1];
					const entryText = this.buttonsProperties[key][0].replace(/[a-zA-Z]*[0-9]*_*[0-9]*\./,'') + '\t[' + value + ']';
					const unit = key === 'iTrack'
						? 'tracks'
						: key === 'iClose'
							? 'seconds'
							: 'minutes';
					menu.newEntry({menuName, entryText, func: () => {
						const input = Input.number('int', value, 'Enter ' +  unit + ':\n(0 = off)', 'AutoBackup', this.buttonsProperties[key][3]);
						if (input === null) {return;}
						if (!checkProperty(this.buttonsProperties[key], input)) {return;} // Apply properties check which should be personalized for input value
						this.buttonsProperties[key][1] = input;
						this.autoBackup[key] = unit === 'minutes' ? input * 60 * 1000 : input;
						overwriteProperties(this.buttonsProperties);
					}});
					menu.newCheckMenuLast(() => {return !!this.buttonsProperties[key][1];});
				});
			}
			_createSubMenuEditEntries(menu, void(0), {
				subMenuName: 'Files and folders to backup...',
				name: 'AutoBackup',
				list: this.autoBackup.files,
				defaults: JSON.parse(this.buttonsProperties.files[3]),
				input : () => {
					const entry = {
						path: Input.string(
							'string', '',
							'Enter folder path relative to profile folder:\n' +
							'Ex: js_data\\presets'
							, 'AutoBackup' , 'js_data\\presets', void(0), true
						)
					};
					if (!entry.path) {return;}
					return entry;
				},
				bNumbered: true,
				onBtnUp: (files) => {
					this.autoBackup.files = files;
					this.buttonsProperties.files[1] = JSON.stringify(files);
					overwriteProperties(this.buttonsProperties);
				}
			});
			{
				const menuName = menu.newMenu('Other settings...');
				{
					const value = this.buttonsProperties.outputPath[1];
					const entryText = this.buttonsProperties.outputPath[0].replace(/[a-zA-Z]*[0-9]*_*[0-9]*\./,'') + '\t[' + value + ']';
					menu.newEntry({menuName, entryText, func: () => {
						const input = Input.string('string', value, 'Enter path relative to profile folder:', 'AutoBackup',this.buttonsProperties.outputPath[3]);
						if (input === null) {return;}
						if (!checkProperty(this.buttonsProperties.outputPath, input)) {return;} // Apply properties check which should be personalized for input value
						this.buttonsProperties.outputPath[1] = input;
						overwriteProperties(this.buttonsProperties);
					}});
				}
				_createSubMenuEditEntries(menu, menuName, {
					subMenuName: 'Backup file formatting...',
					name: 'AutoBackup',
					list: this.autoBackup.backupFormat,
					defaults: JSON.parse(this.buttonsProperties.backupFormat[3]),
					input : () => {
						const entry = {
							...(Input.json(
								'object', JSON.stringify({regex: '[\\- :,]', flag: 'g', replacer: '_'}),
								'Enter regex and replacer:\n' +
								'Ex: ' + JSON.stringify({regex: '[\\- :,]', flag: 'g', replacer: '_'})
								, 'AutoBackup' , JSON.stringify({regex: '[\\- :,]', flag: 'g', replacer: '_'}), void(0), true
							) || {})
						};
						if (!Object.hasOwn(entry, 'regex') || !Object.hasOwn(entry, 'flag') || !Object.hasOwn(entry, 'replacer')) {return;}
						try {new RegExp(entry.regex, entry.flag);} catch (e) {return;}
						return entry;
					},
					bNumbered: true,
					onBtnUp: (backupFormat) => {
						this.autoBackup.backupFormat = backupFormat;
						this.buttonsProperties.backupFormat[1] = JSON.stringify(backupFormat);
						overwriteProperties(this.buttonsProperties);
					}
				});
				menu.newEntry({menuName, entryText: 'sep'});
				{
					const value = this.buttonsProperties.iBackups[1];
					const entryText = this.buttonsProperties.iBackups[0].replace(/[a-zA-Z]*[0-9]*_*[0-9]*\./,'') + '\t[' + value + ']';
					menu.newEntry({menuName, entryText, func: () => {
						const input = Input.number('int', value, 'Enter number' + ':\n(0 = off)', 'AutoBackup', this.buttonsProperties.iBackups[3]);
						if (input === null) {return;}
						if (!checkProperty(this.buttonsProperties.iBackups, input)) {return;} // Apply properties check which should be personalized for input value
						this.buttonsProperties.iBackups[1] = input;
						overwriteProperties(this.buttonsProperties);
					}});
				}
				{
					const value = this.buttonsProperties.backupsMaxSize[1];
					const entryText = this.buttonsProperties.backupsMaxSize[0].replace(/[a-zA-Z]*[0-9]*_*[0-9]*\./,'') + '\t[' + value + ' MB]';
					menu.newEntry({menuName, entryText, func: () => {
						const input = Input.number('int', value, 'Enter MB' + ':\n(0 = off)', 'AutoBackup', this.buttonsProperties.backupsMaxSize[3]);
						if (input === null) {return;}
						if (!checkProperty(this.buttonsProperties.backupsMaxSize, input)) {return;} // Apply properties check which should be personalized for input value
						this.buttonsProperties.backupsMaxSize[1] = input;
						this.autoBackup.backupsMaxSize = input * 1024 * 1024;
						overwriteProperties(this.buttonsProperties);
					}});
				}
				{
					const value = this.buttonsProperties.minDriveSize[1];
					const entryText = this.buttonsProperties.minDriveSize[0].replace(/[a-zA-Z]*[0-9]*_*[0-9]*\./,'') + '\t[' + value + ' MB]';
					menu.newEntry({menuName, entryText, func: () => {
						const input = Input.number('int', value, 'Enter MB' + ':\n(0 = off)', 'AutoBackup', this.buttonsProperties.minDriveSize[3]);
						if (input === null) {return;}
						if (!checkProperty(this.buttonsProperties.minDriveSize, input)) {return;} // Apply properties check which should be personalized for input value
						this.buttonsProperties.minDriveSize[1] = input;
						this.autoBackup.minDriveSize = input * 1024 * 1024;
						overwriteProperties(this.buttonsProperties);
					}});
				}
				menu.newEntry({menuName, entryText: 'sep'});
				['bAsync', 'sep', 'active', 'bStartActive'].forEach((key) => {
					if (key === 'sep') {menu.newEntry({menuName, entryText: 'sep'}); return;}
					const entryText = this.buttonsProperties[key][0].replace(/[a-zA-Z]*[0-9]*_*[0-9]*\./,'');
					menu.newEntry({menuName, entryText, func: () => {
						this.buttonsProperties[key][1] = !this.buttonsProperties[key][1];
						overwriteProperties(this.buttonsProperties);
						if (key === 'active') {this.active = this.autoBackup.active = this.buttonsProperties[key][1];}
					}});
					menu.newCheckMenuLast(() => {return this.buttonsProperties[key][1];});
				});
			}
			menu.newEntry({entryText: 'sep'});
			{
				const entryText = this.buttonsProperties.active[0].replace(/[a-zA-Z]*[0-9]*_*[0-9]*\./,'');
				menu.newEntry({entryText, func: () => {
					this.buttonsProperties.active[1] = !this.buttonsProperties.active[1];
					overwriteProperties(this.buttonsProperties);
					this.active = this.autoBackup.active = this.buttonsProperties.active[1];
				}});
				menu.newCheckMenuLast(() => {return this.buttonsProperties.active[1];});
			}
			menu.newEntry({entryText: 'sep'});
			menu.newEntry({entryText: 'Execute Save & Backup', func: this.autoBackup.forceBackup});
			menu.newEntry({entryText: 'sep'});
			menu.newEntry({entryText: 'Open backup folder...', func: () => {
				_explorer(fb.ProfilePath + this.autoBackup.outputPath.split('\\').slice(0, -1).join('\\'));
			}});
			menu.newEntry({entryText: 'sep'});
			menu.newEntry({entryText: 'Readme...', func: () => {
				const readmeList = _isFile(folders.xxx + 'helpers\\readme\\buttons_list.json') ? _jsonParseFileCheck(folders.xxx + 'helpers\\readme\\buttons_list.json', 'Readme list', window.Name, utf8) : null;
				if (readmeList) {
					const readmeFile = Object.hasOwn(readmeList, 'buttons_others_autobackup.js') ? readmeList['buttons_others_autobackup.js'] : '';
					const readme = readmeFile.length ? _open(folders.xxx + 'helpers\\readme\\' + readmeFile, utf8) : '';
					if (readme.length) {fb.ShowPopupMessage(readme, readmeFile);}
					else {console.log(readmeFile + ' not found.');}
				}
			}});
			menu.btn_up(this.currX, this.currY + this.currH);
		}
	}, null, void(0), (parent) => {
		const bShift = utils.IsKeyPressed(VK_SHIFT);
		const bInfo = typeof menu_panelProperties === 'undefined' || menu_panelProperties.bTooltipInfo[1];
		let info = 'AutoBackup foobar2000 config files:';
		// Entries
		const files = parent.autoBackup.files;
		info += '\nEntries:\t' + [...new Set(files.map(e => e.name.replace(/ \(.*\)/, '')))].joinEvery(', ', 3, '\n\t');
		if (bShift || bInfo) {
			info += '\n-----------------------------------------------------';
			info += '\n(Shift + L. Click to Save && Backup on demand)';
		}
		return info;
	}, prefix, newButtonsProperties, chars.clock, void(0), {
		autoBackup: new AutoBackup({
			iBackups: Number(newButtonsProperties.iBackups[1]),
			backupsMaxSize: Number(newButtonsProperties.backupsMaxSize[1]) * 1024 * 1024,
			bAsync: newButtonsProperties.bAsync[1],
			outputPath: newButtonsProperties.outputPath[1],
			files: JSON.parse(newButtonsProperties.files[1]),
			backupFormat: JSON.parse(newButtonsProperties.backupFormat[1]),
			iPlaying: Number(newButtonsProperties.iPlaying[1]) * 60000,
			iStop: Number(newButtonsProperties.iStop[1]) * 60000,
			iInterval: Number(newButtonsProperties.iInterval[1]) * 60000,
			iStart: Number(newButtonsProperties.iStart[1]) * 60000,
			iTrack: Number(newButtonsProperties.iTrack[1]),
			iClose: Number(newButtonsProperties.iClose[1]),
			minDriveSize: Number(newButtonsProperties.minDriveSize[1]) * 1024 * 1024,
		})
	}, void(0), function() {
		this.active = this.autoBackup.active = this.buttonsProperties.bStartActive[1] ? true : this.buttonsProperties.active[1];
		if (this.active !== this.buttonsProperties.active[1]) {
			this.buttonsProperties.active[1] = this.active;
			overwriteProperties(this.buttonsProperties);
		}
		this.bHeadlessMode = this.buttonsProperties.bHeadlessMode[1];
	}, {scriptName: 'AutoBackup-SMP', version})
});