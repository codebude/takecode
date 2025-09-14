# Changelog

All notable changes to **massCode Web** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-09-16

### Fixed
- **Semantic Versioning in CI Pipeline**: Fixed version tag selection logic to properly prioritize releases over pre-releases according to semantic versioning standards
- **Docker Image Tagging**: Corrected CI/CD pipeline to select `v1.0.0` instead of `v1.0.0-rc.6` when both exist

### Technical Details
- Updated `.github/workflows/docker-build.yml` to prefer release versions over release candidates
- Fixed version comparison logic to respect semantic versioning hierarchy

## [1.0.0] - 2025-09-16

### Added
- **Regex Search Support**: Added full regular expression support to search functionality with case-sensitive matching
- **Configurable Highlight Limits**: Added `SEARCH_HIGHLIGHT_LIMIT` environment variable to control how many search matches are highlighted per snippet (default: 3, range: -1 to MAX_SAFE_INTEGER, -1 = unlimited)
- **Visual Search Highlighting**: Implemented visual highlighting of search matches using Prism.js keep-markup plugin for better code readability
- **Enhanced Multi-Fragment Search**: Improved search functionality to work seamlessly with tabbed code fragments
- **Favicon Updates**: Updated favicon design to match the header logo and removed distracting green X element

### Changed
- **Search Behavior**: Search is now case-sensitive by default and supports regex patterns
- **Highlight Limiting**: Limited search result highlighting to first 3 matches per snippet (configurable)
- **Docker Configuration**: Reverted to using pre-built Docker image for simpler deployment
- **Documentation**: Simplified README with cleaner configuration examples

### Technical Details
- Modified `highlightSearchMatches()` function to support configurable limits
- Added `matchesQuery()` function with regex support and case-sensitive matching
- Implemented runtime environment variable injection in Docker container
- Updated nginx configuration for environment variable access
- Enhanced search logic to work with multi-fragment snippets and tabbed interface

## [1.0.0-rc.5] - 2025-09-16

### Added
- **Documentation Enhancement**: Added comprehensive table of contents to README.md for better navigation
- **Screenshot Integration**: Added project screenshot to img/ directory and integrated into README
- **Visual Improvements**: Fixed corrupted emojis in documentation (📜 Table of Contents, 📸 Screenshot)

### Changed
- **Branding Consistency**: Updated all documentation references to use consistent "massCode" lowercase branding

### Technical Details
- Added img/ directory to version control
- Enhanced README structure with better organization
- Fixed emoji rendering issues in GitHub markdown

## [1.0.0-rc.4] - 2025-09-16

### Added
- **UI Enhancement**: Added left-aligned title for better visual hierarchy
- **Branding**: Implemented distinctive logo and improved visual identity

### Changed
- **Layout Improvements**: Enhanced header layout and visual presentation

## [1.0.0-rc.3] - 2025-09-16

### Changed
- **Docker Configuration**: Changed symlink approach to directory-based mounting (`ln -s /data /usr/share/nginx/html/data`)
- **Volume Management**: Improved data directory handling for better container reliability

### Technical Details
- Updated Dockerfile symlink creation method
- Enhanced volume mounting strategy for production deployments

## [1.0.0-rc.2] - 2025-09-16

### Added
- **Dynamic Versioning**: Implemented dynamic version injection at Docker build time
- **Build Automation**: Added git tag-based version detection for container builds

### Changed
- **Version Management**: Made app version dynamic instead of hardcoded
- **Build Process**: Enhanced Docker build process with version metadata

### Technical Details
- Modified Dockerfile to accept VERSION build argument
- Updated build scripts to inject version information
- Improved CI/CD pipeline with version tagging

## [1.0.0-rc.1] - 2025-09-16

### Fixed
- **Tag Detection**: Fixed version detection to properly handle pre-release tags (e.g., `v1.0.0-rc.1`)
- **Build System**: Corrected tag parsing logic for release candidate versions

### Technical Details
- Updated version detection regex patterns
- Fixed pre-release tag handling in build scripts
- Improved tag validation for CI/CD pipelines

---

## Release Notes

### Version Numbering
This project uses [Semantic Versioning](https://semver.org/):
- **MAJOR.MINOR.PATCH** (e.g., `1.0.0`)
- **Pre-releases** use `-rc.N` suffix (e.g., `1.0.0-rc.1`)

### Development Status
- **Release Candidates (RC)**: Stable pre-releases ready for testing
- **Final Release (1.0.0)**: Planned after RC testing and feedback

### Key Features (v1.0.0)
- 🏗️ **Modern Web Interface**: Clean, responsive design for massCode snippets
- 🔍 **Advanced Search**: Real-time filtering and search functionality
- 🎨 **Theme Support**: Light, dark, and auto themes with smooth transitions
- 📋 **Tabbed Fragments**: Side-by-side display of multi-part code snippets
- 🐳 **Docker Ready**: Easy containerized deployment
- 📱 **Cross-Platform**: Works on any device with a web browser
- 🎯 **massCode Integration**: Direct compatibility with massCode database files

---

**Legend:**
- ✨ **Added** - New features
- 🔧 **Changed** - Changes in existing functionality
- 🐛 **Fixed** - Bug fixes
- 🗑️ **Removed** - Removed features
- 🚨 **Breaking** - Breaking changes</content>
<parameter name="filePath">/home/raffael/git/masscode-web/CHANGELOG.md