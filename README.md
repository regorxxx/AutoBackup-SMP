# AutoBackup-SMP
[![version][version_badge]][changelog]
[![CodeFactor][codefactor_badge]](https://www.codefactor.io/repository/github/regorxxx/AutoBackup-SMP/overview/main)
[![CodacyBadge][codacy_badge]](https://www.codacy.com/gh/regorxxx/AutoBackup-SMP/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=regorxxx/AutoBackup-SMP&amp;utm_campaign=Badge_Grade)
![GitHub](https://img.shields.io/github/license/regorxxx/AutoBackup-SMP)

A [Spider Monkey Panel](https://theqwertiest.github.io/foo_spider_monkey_panel)/[JSplitter](https://foobar2000.ru/forum/viewtopic.php?t=6378) Script, for [foobar2000](https://www.foobar2000.org), which allows periodic automatic saving of configuration and other data in foobar2000 and keeping backup copies of such data. Replacement of [foo_jesus](https://www.foobar2000.org/components/view/foo_jesus).

![auto](https://github.com/regorxxx/AutoBackup-SMP/assets/83307074/866db10b-2250-4559-be9d-b15b7dbda10f)

## Features
* Saves configuration ("File\Save Configuration"):
  * Whole configuration subfolder.
  * Media library database (database.*).
  * Playlists.
  * Additional data managed by other components (for example current theme or playback statistics).
* After saving, a backup of the changed files is created, as a ZIP archive (using 7zip).
* Rules to periodically save and backup can be set:
  * While playing (every X min, 0 = off).
  * When playback stops (every X min, 0 = off).
  * Always, since last autosave (every X min, 0 = off).
  * On startup, after X minutes (backup only, 0 = off).
  * Every X tracks (0 = off).
  * On foobar2000 exit (script unload), after X seconds (0 = off).
* Files and folders to backup can be set by name and mask (for example 'js_data\\playlistManager_*').
* Output Zip archive path and name is configurable.
* Backups to keep can be set by number and/or total file size.
* Headless mode: tool button may be invisible but working on background.

![auto2](https://github.com/regorxxx/AutoBackup-SMP/assets/83307074/8b5e85e2-7f91-4b30-bf34-5f9764c97f4c)

### Compatible with (toolbar)
 1. [Search-by-Distance-SMP](https://github.com/regorxxx/Search-by-Distance-SMP): creates intelligent "spotify-like" playlist using high-level data from tracks and computing their similarity using genres/styles.
 2. [Device-Priority-SMP](https://github.com/regorxxx/Device-Priority-SMP): Automatic output device selection.
 3. [ListenBrainz-SMP](https://github.com/regorxxx/ListenBrainz-SMP): Integrates Listenbrainz's feedback and recommendations.
 4. [Playlist-Tools-SMP](https://github.com/regorxxx/Playlist-Tools-SMP): Offers different pre-defefined examples for intelligent playlist creation.

## Requirements
 1. [Spider Monkey Panel](https://theqwertiest.github.io/foo_spider_monkey_panel): Component required to install this javaScript addon. Only x32.
 2. [JSplitter](https://foobar2000.ru/forum/viewtopic.php?t=6378): Component required to install this javaScript addon. Both x32 and x64.
 3. FontAwesome: found at ’.\ resources\fontawesome-webfont.ttf’. See installation notes.

## Installation
See [_INSTALLATION (txt)](https://github.com/regorxxx/AutoBackup-SMP/blob/main/_INSTALLATION.txt) and the [Wiki](https://github.com/regorxxx/AutoBackup-SMP/wiki/Installation).
Not properly following the installation instructions will result in scripts not working as intended. Please don't report errors before checking this.

## Support
 1. [Issues tracker](https://github.com/regorxxx/AutoBackup-SMP/issues).
 2. [Hydrogenaudio forum](https://hydrogenaud.io/index.php/topic,125093.0.html).
 3. [Wiki](https://github.com/regorxxx/AutoBackup-SMP/wiki).

## Nightly releases
Zip file [from GitHub](https://github.com/regorxxx/AutoBackup-SMP/archive/refs/heads/main.zip) (using the latest commit).

[changelog]: CHANGELOG.md
[version_badge]: https://img.shields.io/github/release/regorxxx/AutoBackup-SMP.svg
[codacy_badge]: https://api.codacy.com/project/badge/Grade/e04be28637dd40d99fae7bd92f740677
[codefactor_badge]: https://www.codefactor.io/repository/github/regorxxx/AutoBackup-SMP/badge/main
