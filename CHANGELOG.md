# Changelog

## [Table of Contents]
- [Unreleased](#unreleased)
- [1.0.0](#100---2023-12-08)

## [Unreleased][]
### Added
- Events: added setting to create a backup after foobar2000 closes (or on script unloading). By default set to 20 seconds later.
### Changed
- Backup is now done 2 seconds after foobar2000 configuration is saved.
### Removed
### Fixed
- Events: configuration was not being forced to save before creating an automatic backup.
- Events: fixed temporary wrong setting of backups by number of tracks played after changing it (it was fixed by reloading the script).

## [1.0.0] - 2023-12-08
### Added
- First release.
### Changed
### Removed
### Fixed

[Unreleased]: https://github.com/regorxxx/Autobackup-SMP/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/regorxxx/Autobackup-SMP/compare/8b303b...v1.0.0