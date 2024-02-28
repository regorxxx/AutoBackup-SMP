# Changelog

## [Table of Contents]
- [Unreleased](#unreleased)
- [2.0.0](#200---2024-02-28)
- [1.0.0](#100---2023-12-08)

## [Unreleased][]
### Added
### Changed
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
- Buttons: changed filename for 'buttons_others_utils_autobackup.js' to 'buttons_utils_autobackup.js' Before updating, rename all instances of these names at '[foobar2000 profile]\js_data\buttons_XXX.json' with the new names. 'buttons_XXXXX.json' are all json button toolbar files.
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

[Unreleased]: https://github.com/regorxxx/Autobackup-SMP/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/regorxxx/Autobackup-SMP/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/regorxxx/Autobackup-SMP/compare/8b303b...v1.0.0