'use strict';
//31/12/23

/* exported AutoBackup */

include('..\\..\\helpers\\helpers_xxx.js');
/* global doOnce:readable */
include('..\\..\\helpers\\helpers_xxx_prototypes.js');
/* global round:readable */
include('..\\..\\helpers\\helpers_xxx_file.js');
/* global _createFolder:readable, getFiles:readable, _recycleFile:readable, getPathMeta:readable */
include('..\\..\\helpers\\helpers_xxx_file_zip.js');
/* global _zip:readable */

function AutoBackup({
	iBackups = 8,
	backupsMaxSize = 1024 * 1024 * 2000,
	bAsync = true,
	iPlaying = 60 * 60 * 1000,
	iStop = 60 * 60 * 1000,
	iInterval = 10 * 60 * 1000,
	iStart = 10 * 60 * 1000,
	iTrack = 0,
	iClose = 20,
	minDriveSize = backupsMaxSize * 2,
	outputPath, files, backupFormat
} = {}) {
	this.addEventListeners = () => {
		this.listeners = [
			addEventListener('on_playback_new_track', () => {
				if (!this.timePlaying) { this.timePlaying = Date.now(); }
				else { this.playedTracks++; }
			}),
			addEventListener('on_playback_stop', (reason) => {
				if (reason === 0 || reason === 1) {
					this.timePlaying = 0;
					if (!this.timePaused) { this.timePaused = Date.now(); }
				} else if (reason === 2) {
					this.playedTracks++;
				}
			}),
			addEventListener('on_playback_pause', (state) => {
				if (state && !this.timePaused) { this.timePaused = Date.now(); }
				if (!state && this.timePaused) {
					if (this.timePlaying) { this.timePlaying = Date.now() - (this.timePaused - this.timePlaying); }
					this.timePaused = 0;
				}
			}),
			addEventListener('on_script_unload', () => {
				if (this.active && this.iClose) {
					if (!this.checkDriveSpace(false)) { return; }
					this.backup({ reason: 'unload', bAsync: true, timeout: this.iClose });
				}
			}),
		];
	};

	this.init = () => {
		this.addEventListeners();
		this.id = setInterval(this.backupDebounced, 2500);
		this.active = true;
		this.timeInit = Date.now();
	};

	this.clear = () => {
		this.listeners.forEach((listener) => removeEventListener(listener.event, void (0), listener.id));
		if (this.id !== null) {
			clearInterval(this.id);
			this.id = null;
		}
		this.lastBackup = this.timePaused = this.playedTracks = this.timePlaying = this.timePaused = 0;
	};

	this.saveFooConfig = () => {
		try { fb.RunMainMenuCommand('Save configuration'); } catch (e) { console.log(e); return false; }
		return true;
	};

	this.getFreeSpace = () => {
		const driveMeta = getPathMeta(fb.ProfilePath, 'B');
		return driveMeta.size.free || 0;
	};

	this.checkDriveSpace = (bShowPopup = true) => {
		if (this.minDriveSize) {
			const space = this.getFreeSpace();
			if (space < this.minDriveSize) {
				bShowPopup && doOnce('AutoBackup: full drive',
					() => {
						fb.ShowPopupMessage(
							'Free drive space is under the minimum threshold:\n' +
							round(space / 1024 ** 2, 1) + ' MB < ' + round(this.minDriveSize / 1024 ** 2, 1) + ' MB'
							, 'AutoBackup'
						);
					})();
				return false;
			}
		}
		return true;
	};

	this.backup = ({ iBackups = this.iBackups, backupsMaxSize = this.backupsMaxSize, bAsync = this.bAsync, outputPath = this.outputPath, reason = '', timeout = 0 } = {}) => {
		if (timeout) { bAsync = true; }
		let test = !bAsync ? new FbProfiler('AutoBackup') : null;
		const folderPath = fb.ProfilePath + outputPath.split('\\').slice(0, -1).join('\\') + '\\' || '';
		_createFolder(folderPath);
		if (iBackups && iBackups > -1) {
			const files = getFiles(folderPath, new Set(['.zip']))
				.filter((file) => file.startsWith(fb.ProfilePath + outputPath))
				.reverse();
			while (files.length >= iBackups) {
				_recycleFile(files.pop(), true);
			}
		}
		if (backupsMaxSize && backupsMaxSize > -1) {
			const files = getFiles(folderPath, new Set(['.zip']))
				.filter((file) => file.startsWith(fb.ProfilePath + outputPath))
				.reverse();
			const fileSizes = files.map((file) => utils.GetFileSize(file));
			while (fileSizes.reduce((acc, curr) => acc + curr, 0) >= backupsMaxSize) {
				fileSizes.pop();
				_recycleFile(files.pop(), true);
			}
		}
		const fileMask = this.files.map((e) => e.path);
		const backupFormat = this.backupFormat;
		const zipName = backupFormat.reduce(
			(acc, curr) => acc.replace(new RegExp(curr.regex, curr.flag), curr.replacer),
			new Date().toISOString().split('.')[0]
		);
		_zip(fileMask, fb.ProfilePath + outputPath + zipName + '.zip', bAsync, fb.ProfilePath, timeout);
		if (timeout) {
			console.log(this.name + ' (' + reason + '): Scheduled backup of items on ' + timeout + ' seconds to ' + outputPath + zipName);
		} else {
			console.log(this.name + ' (' + reason + '): Backed up items to ' + outputPath + zipName);
		}
		if (!bAsync) { test.Print(reason); }
		return true;
	};
	this.backupDebounced = () => {
		if (!this.active) { return false; }
		const now = Date.now();
		if ((now - this.lastBackup) >= this.backupMinInterval) {
			if (this.iPlaying && this.timePlaying && (now - this.timePlaying) >= this.iPlaying) {
				this.saveFooConfig();
				if (!this.checkDriveSpace()) { return false; }
				setTimeout(() => this.backup({ reason: 'playing' }), this.configTimeout);
				this.lastBackup = now;
				this.timePlaying = this.timePlaying + this.iPlaying;
			} else if (this.iStop && this.timePaused && (now - this.timePaused) >= this.iStop) {
				this.saveFooConfig();
				if (!this.checkDriveSpace()) { return false; }
				setTimeout(() => this.backup({ reason: 'paused' }), this.configTimeout);
				this.lastBackup = now;
				this.timePaused = 0;
			} else if (this.iTrack && this.timePlaying && this.playedTracks >= this.iTrack) {
				this.saveFooConfig();
				if (!this.checkDriveSpace()) { return false; }
				setTimeout(() => this.backup({ reason: 'tracks' }), this.configTimeout);
				this.lastBackup = now;
				this.playedTracks -= this.iTrack;
			} else if (this.iStart && this.timeInit && (now - this.timeInit) >= this.iStart) {
				this.saveFooConfig();
				if (!this.checkDriveSpace()) { return false; }
				setTimeout(() => this.backup({ reason: 'startup' }), this.configTimeout);
				this.lastBackup = now;
				this.timeInit = 0;
			} else if (this.iInterval && this.lastBackup && (now - this.lastBackup) >= this.iInterval) {
				this.saveFooConfig();
				if (!this.checkDriveSpace()) { return false; }
				setTimeout(() => this.backup({ reason: 'interval' }), this.configTimeout);
				this.lastBackup = now;
			}
		}
		return this.lastBackup === now;
	};
	this.forceBackup = () => {
		return this.saveFooConfig() && setTimeout(() => this.backup({ reason: 'forced' }), this.configTimeout);
	};
	// Internals
	this.lastBackup = 0;
	this.playedTracks = 0;
	this.timePlaying = 0;
	this.timePaused = 0;
	this.timeInit = 0;
	this.id = null;
	this.listeners = [];
	this.active = true;
	this.name = 'AutoBackup-SMP';
	this.backupMinInterval = 30000;
	this.configTimeout = 2000;
	// Vars
	this.iBackups = iBackups;
	this.backupsMaxSize = backupsMaxSize;
	this.bAsync = bAsync;
	this.outputPath = outputPath;
	this.files = files;
	this.backupFormat = backupFormat;
	this.iPlaying = iPlaying;
	this.iStop = iStop;
	this.iInterval = iInterval;
	this.iStart = iStart;
	this.iTrack = iTrack;
	this.iClose = iClose;
	this.minDriveSize = minDriveSize;

	this.init();
}