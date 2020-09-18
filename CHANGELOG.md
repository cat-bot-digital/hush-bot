# Changelog
This file tracks all notable changes to the Hush Bot Discord app.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
No features currently being worked on.

## [1.2.0] - 2020-09-18
### Changed
- The change log is now stored in this file.
### Security
- Created a [dotenv](https://www.npmjs.com/package/dotenv) file for storing private keys.

## [1.0.1] - 2020-08-30
### Added
- Handling for the 'Hushed' role, which deals with people who leave while still muted.
### Fixed
- Cleaned up channel clutter by having Hush Bot remove commands.
- Improved error & debugging verbiage to be more clear.
- Implemented handling for DMs sent to Hush Bot.
### Security
- Improved permission vetting for who can issue commands to Hush Bot.

## [1.0.0] - 2020-08-23
### Added
- Commands to mute/unmute all users in a voice channel.
