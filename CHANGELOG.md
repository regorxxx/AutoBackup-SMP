# Changelog

## [Table of Contents]
- [Unreleased](#unreleased)
- [2.4.0](#240---2024-10-09)
- [2.3.1](#231---2024-08-13)
- [2.3.0](#230---2024-07-30)
- [2.2.0](#220---2024-07-24)
- [2.1.0](#210---2024-03-21)
- [2.0.0](#200---2024-02-28)
- [1.0.0](#100---2023-12-08)

## [Unreleased][]
### Added
- Events: new file retention strategy based on file creation date. It will try now to conserve backups from previous years (10%), months (10%), weeks (20%) and days of current week (25%) and preferably rotate those created at current day. The percentage correspond to the amount of backups from such date range relative to the max number of backups. This will ensure that backups from previous dates are always available, even if foobar2000 has been running for many hours.
- Files: added files at 'js_data\\helpers' to default files to backup.
- Files: added foo_input_sacd and foo_input_dvda databases to default files to backup.
- Files: added foobar v2 databases to default files to backup.
- UI: toolbar tooltip now shows 'Shift + Win + R. Click' shortcut to open SMP/JSpliter panel menu (which works globally on any script and panel, at any position).
- UI: exposed color settings via window.NotifyOthers() method for themes/multi-panel support. You may pass a color scheme -size 6 recommended- (output from GetColourScheme()) at 'Colors: set color scheme' (applies to all compatible panels) or 'Toolbar: set color scheme' (applies only to this script), which will set appropriate colors following panel's color logic; alternatively you may set direct color settings at 'Toolbar: set colors' which needs an array of 5 colors or an object {toolbar, text, button, hover, active}. Panel has also independent settings to listen to colors from other panels (but not for sending colors as a color-server to others). See [this](https://github.com/regorxxx/Not-A-Waveform-Seekbar-SMP/issues/4) and [this](https://hydrogenaudio.org/index.php/topic,120980.msg1069107.html#msg1069107).
- Readmes: Ctrl + L. Click on any entry within 'Add button' submenu on toolbar now opens directly their associated readme (without actually adding the button).
- Installation: new panel menu, accessed through 'Ctrl + Win + R. Click' (which works globally on any script and panel, at any position), used to export/import panel settings and any other associated data. These entries may be used to fully backup the panel data, help when moving between different JS components (JSplitter <-> SMP) or even foobar2000 installations,, without needing to manually backup the panel properties or other external files (like .json, etc.).
### Changed
- Events: 'Always, since last autosave' condition to run backups now fires when no other condition related to playback is enabled even if no backup even fired before. Previously it only fired if at least other event was executed too.
- Events: changed default backups max sixe to 5GB and number to 20.
- Installation: added popup warnings when scripts are installed outside foobar2000 profile folder. These checks can be tweaked at globSettings.json.
- Installation: script may now be installed at any path within the foobar profile folder, no longer limited to '[FOOBAR PROFILE FOLDER]\scripts\SMP\xxx-scripts\' folder. Obviously it may still be installed at such place, which may be preferred if updating an older version.
- Installation: multiple improvements to path handling for portable and non-portable installations. By default scripts will always try to use only relative paths to the profile folder, so scripts will work without any change when exporting the profile to any other installation. This change obviously doesn't apply to already existing installations unless restoring defaults.
- UI: Shift + L. Click action on button has been moved to Ctrl. + L. Click; for consistency with other buttons which have shift actions associated to settings menus (not available on this one).
- UI: unified script updates settings across all my scripts, look for 'Updates' submenu.
- UI: show shortcuts on tooltip setting moved to global setting for the toolbar.
- Helpers: updated helpers.
- Helpers: general code cleanup on menus internal code. Please report any bug on extra separators or menu entries not working as expected.
### Removed
- Files: removed references to files related to foobar v0.X or foo_playcount 2.x.
### Fixed
- UI: '&' being displayed as '_' on tooltips.
- UI: multiple workarounds for rounded rectangles not being painted properly or producing crashes (SMP limitation).
- UI: workaround for DPI checking under multiple OSes, specially for Wine (Unix).
- Fixed some misspelled terms on UI and variables (which also lead to some minor bugs).

## [2.4.0] - 2024-10-09
### Added
### Changed
- UI: folder and backup format preset entries can now be cloned.
- [JSplitter (SMP)](https://foobar2000.ru/forum/viewtopic.php?t=6378&start=360) support and ES2021 compatibility.
- Helpers: in case saving a file throws an error due to long paths (+255 chars) a warning popup will be shown.
- Helpers: updated helpers.
### Removed
### Fixed

## [2.3.1] - 2024-08-13
### Added
### Changed
- Helpers: updated helpers.
### Removed
### Fixed

## [2.3.0] - 2024-07-30
### Added
### Changed
- Helpers: updated helpers.
### Removed
### Fixed

## [2.2.0] - 2024-07-24
### Added
- Events: added setting to force a config save (without backup) every X tracks played. This is mostly meant to be used while rating tracks and previewing them, which probably doesn't require a backup but only changes to be saved (in case foobar2000 crashes).
- Configuration: expanded user configurable file at '[FOOBAR PROFILE FOLDER]\js_data\presets\global\globSettings.json' with a new setting for console logging to file. Disabled by default. Now this is a change from the previous behavior, where console was always logged to 'console.log' file at the [FOOBAR PROFILE FOLDER]. It can now be switched, but since it's probably not useful for most users is disabled by default.
- Readmes: added readme for global settings found at'foobar2000\js_data\presets\global' .json files.
### Changed
- Helpers: json button files are now saved with Windows EOL for compatibility improvements with Windows text editors.
### Removed
### Fixed
- Configuration: .json files at 'foobar2000\js_data\presets\global' not being saved with the calculated properties based on user values from other files.

## [2.1.0] - 2024-03-21
### Added
- Configuration: expanded user configurable file at '[FOOBAR PROFILE FOLDER]\js_data\presets\global\globSettings.json' with a new setting for panel repaint debugging purpose. Disabled by default.
- Configuration: expanded user configurable file at '[FOOBAR PROFILE FOLDER]\js_data\presets\global\globSettings.json' with a new setting to check OS features on every panel startup. Enabled by default. This has been the default behavior since OS' features check was implemented, but it can now be disabled to improve init performance a bit, specially at foobar2000 startup (since it seems to hang in some cases when running it on slow HDDs or systems).
### Changed
- UI: Improved panel repaint routines to minimize resources usage.
### Removed
### Fixed

## [2.0.0] - 2024-02-28
### Added
- Events: added setting to skip backups whenever free space on drive is below a threshold. Since old backups are sent to recycle bin, instead of deleting them, size usage may increase indefinitely if the recycle bin was not emptied by the user. This setting avoids this situation.On demand backups bypass this restriction.
- Events: added setting to create a backup after foobar2000 closes (or on script unloading). By default set to 20 seconds later.
- Configuration: added integrity checks to global user settings files, found at '[FOOBAR PROFILE FOLDER]\js_data\presets\global\[...].json'. In particular queries are now check to ensure they are valid and will throw a popup at init otherwise. Other settings are check to ensure they contain valid values too.
- Configuration: expanded user configurable file at '[FOOBAR PROFILE FOLDER]\js_data\presets\global\globSettings.json' with a new setting to output to console profiling logs at script init. They work globally. Disabled by default.
- Toolbar: new settings for text (or icon) position: left, right (default), top and bottom. These settings mimic CUI options at the buttons bar.
- Toolbar: new settings for text scale (now independent of button and icon scale).
- Toolbar: new settings for icon scale (now independent of button and text scale).
### Changed
- Backup is now done 2 seconds after foobar2000 configuration is saved.
- Buttons: changed filename for 'buttons_others_utils_autobackup.js' to 'buttons_utils_autobackup.js' Before updating, rename all instances of these names at '[foobar2000 profile]\js_data\buttons_XXXXX.json' with the new names. 'buttons_XXXXX.json' are all json button toolbar files.
- Helpers: updated helpers.
- Console: improved log file formatting on windows text editors which parse new lines only with CR+LF instead of LF.
- Code cleanup.
### Removed
### Fixed
- Events: configuration was not being forced to save before creating an automatic backup.
- Events: fixed temporary wrong setting of backups by number of tracks played after changing it (it was fixed by reloading the script).
- Toolbar: buttons' size not restored back to normal height after disabling 'Full size buttons' without reloading the panel.
- File formatting: error checking Regular Expressions on user input.
- UI: wrong parsing of png masks on unix systems (currently, it only affected the ListenBrainz icon when changing the font color).
- Minor fixes.

## [1.0.0] - 2023-12-08
### Added
- First release.
### Changed
### Removed
### Fixed

[Unreleased]: https://github.com/regorxxx/Autobackup-SMP/compare/v2.4.0...HEAD
[2.4.0]: https://github.com/regorxxx/Autobackup-SMP/compare/v2.3.1...v2.4.0
[2.3.1]: https://github.com/regorxxx/Autobackup-SMP/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/regorxxx/Autobackup-SMP/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/regorxxx/Autobackup-SMP/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/regorxxx/Autobackup-SMP/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/regorxxx/Autobackup-SMP/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/regorxxx/Autobackup-SMP/compare/8b303b...v1.0.0