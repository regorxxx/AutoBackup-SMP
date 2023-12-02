'use strict';
//02/12/23

include('..\\..\\helpers\\helpers_xxx_file.js');
include('..\\..\\helpers\\helpers_xxx_file_zip.js');

function AutoBackup({
		iBackups = 8, 
		backupsMaxSize = 1024 * 1024 * 2000,
		bAsync = true, 
		iPlaying = 60 * 60 * 1000, 
		iStop = 60 * 60 * 1000, 
		iInterval = 10 * 60 * 1000, 
		iStart = 10 * 60 * 1000,
		iTrack = 0, 
		outputPath, files, backupFormat
	} = {}) {
	this.addEventListeners = () => {
		this.listeners = [
			addEventListener('on_playback_new_track', (handle) => {
				if (!this.timePlaying) {this.timePlaying = Date.now();}
				else {this.playedTracks++;}
			}),
			addEventListener('on_playback_stop', (reason) => {
				if (reason === 0 || reason === 1) {
					this.timePlaying = 0;
					if (!this.timePaused) {this.timePaused = Date.now();}
				} else if (reason === 2) {
					this.playedTracks++;
				}
			}),
			addEventListener('on_playback_pause', (state) => {
				if (state && !this.timePaused) {this.timePaused = Date.now();}
				if (!state && this.timePaused) {
					if (this.timePlaying) {this.timePlaying = Date.now() - (this.timePaused - this.timePlaying);}
					this.timePaused = 0;
				}
			}),
		]
	};
	
	this.init = () => {
		this.addEventListeners();
		this.id = setInterval(this.backupDebounced, 2500);
		this.active = true;
		this.timeInit = Date.now();
	};
	
	this.clear = () => {
		this.listeners.forEach((listener) => removeEventListener(listener.event, void(0), listener.id));
		if (this.id !== null) {
			clearInterval(this.id);
			this.id = null;
		}
		this.lastBackup = this.timePaused = this.playedTracks = this.timePlaying = this.timePaused = 0;
	}
	
	this.saveFooConfig = () => {
		try {fb.RunMainMenuCommand('Save configuration')} catch (e) {console.log(e);}
	};
	
	this.backup = ({iBackups = this.iBackups, backupsMaxSize = this.backupsMaxSize, bAsync = this.bAsync, outputPath = this.outputPath, reason = ''} = {}) => {
		let test = !bAsync ? new FbProfiler('Autobackup') : null;
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
		_zip(fileMask, fb.ProfilePath + outputPath + zipName + '.zip', bAsync, fb.ProfilePath);
		console.log('Autobackup-SMP (' + reason + '): Backed up items to ' + outputPath + zipName);
		if (!bAsync) {test.Print(reason);}
		return true;
	};
	this.backupDebounced = () => {
		if (!this.active) {return false;}
		const now = Date.now();
		if ((now - this.lastBackup) >= 30000) {
			if (this.iPlaying && this.timePlaying && (now - this.timePlaying) >= this.iPlaying) {
				this.backup({reason: 'playing'});
				this.lastBackup = now;
				this.timePlaying = this.timePlaying + this.iPlaying;
			} else if (this.iStop && this.timePaused && (now - this.timePaused) >= this.iStop) {
				this.backup({reason: 'paused'});
				this.lastBackup = now
				this.timePaused = 0;
			} else if (this.iTrack && this.timePlaying && playedTracks >= this.iTrack) {
				this.backup({reason: 'tracks'});
				this.lastBackup = now;
				this.playedTracks -= this.iTrack;
			} else if (this.iStart && this.timeInit && (now - this.timeInit) >= this.iStart) {
				this.backup({reason: 'startup'});
				this.lastBackup = now;
				this.timeInit = 0;
			} else if (this.iInterval && this.lastBackup && (now - this.lastBackup) >= this.iInterval) {
				this.backup({reason: 'interval'});
				this.lastBackup = now
			}
		}
		return this.lastBackup === now;
	}
	// Internals
	this.lastBackup = 0;
	this.playedTracks = 0;
	this.timePlaying = 0;
	this.timePaused = 0;
	this.timeInit = 0;
	this.id = null;
	this.listeners = [];
	this.active = true;
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
	
	this.init();
};