# Changelog

All notable changes to **takeCode** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.7] - 2025-01-09

### Added
- **Minimum Search Term Length**: Added `SEARCH_TERM_MIN_LENGTH` environment variable to set minimum character requirement for search terms (default: 0, no minimum)

### Technical Details
- Added configurable minimum search term length with validation and user feedback
- Updated configuration system to support new environment variable across all deployment methods
- Enhanced search input handler to enforce minimum length requirements

## [1.0.6] - 2025-09-20

### Fixed
- **XML/HTML Search Highlighting**: Fixed search highlighting for XML/HTML snippets that was causing content loss by preserving `<mark>` tags during HTML entity encoding
- **Prism Theme Loading**: Replaced external CDN dependencies for Prism themes with local files for better reliability and performance

### Added
- **Search Auto-Scroll**: Automatically scroll snippet list to top when search input changes for better user experience
- **Local Prism Themes**: Downloaded and integrated Prism.js theme files locally (light and dark themes)

### Changed
- **Prism Light Theme**: Updated Prism.js light theme CSS for improved syntax highlighting readability

### Technical Details
- Modified `encodeHtmlEntities()` function to preserve search highlighting markup in XML/HTML content
- Updated theme loading to use local CSS files instead of external CDN resources
- Added scroll-to-top behavior in search input event handler for improved UX

## [1.0.5] - 2025-09-20

### Fixed
- **Tailwind CSS Build Process**: Fixed custom styles not being included in production builds by properly configuring Tailwind CLI
- **Dark Theme Styling**: Resolved dark theme styling inconsistencies and improved theme switching reliability
- **About Modal**: Completed about modal implementation with proper licensing information display
- **Button Styling**: Styled about button as proper themed button with consistent appearance

### Added
- **Local Asset Hosting**: Downloaded external JS/CSS files locally for better performance and reliability
- **Build Pipeline Optimization**: Streamlined CI/CD pipeline by removing redundant operations and improving build efficiency
- **Documentation Structure**: Improved README organization with dedicated development setup section

### Changed
- **Project Rebranding**: Officially rebranded from "massCode Web" to "takeCode" across all documentation and branding
- **Docker Registry**: Updated Docker image references to use Docker Hub registry (`docker.io/codebude/takecode`)

### Technical Details
- Properly integrated Tailwind CSS with CLI build process instead of hardcoded scripts
- Enhanced build pipeline to remove redundant CSS file operations
- Consolidated development setup instructions in README for better clarity

## [1.0.4] - 2025-09-18

### Fixed
- **Workflow Permissions**: Fixed GitHub Actions permissions to enable repository dispatch events for automatic demo updates

### Added
- **Docker Hub Publishing**: Enhanced build workflow to publish Docker images to both GitHub Container Registry and Docker Hub
- **Multi-Registry Support**: Images now available on both `ghcr.io/codebude/takecode` and `docker.io/codebude/takecode`

### Technical Details
- Updated workflow permissions from `contents: read` to `contents: write` for repository dispatch functionality
- Added Docker Hub authentication and metadata configuration for dual registry publishing

## [1.0.3] - 2025-09-17

### Fixed
- **Mobile Responsiveness**: Fixed header overflow on small screens by implementing responsive flex-wrap layout
- **Search Box Positioning**: Fixed search box overflow on mobile devices with proper responsive margins
- **Snippet Container Overflow**: Fixed snippet content overflow on both mobile and desktop by implementing viewport width constraints
- **Desktop Sidebar Overflow**: Fixed content overflow when sidebar is open on desktop using responsive CSS with calc() functions and sibling selectors

### Added
- **Live Demo**: Added live demo section to README with link to https://demo.take-code.dev/
- **GitHub Actions Workflow**: Added manual workflow for updating live demo via SSH and Docker Compose
- **Automatic Demo Updates**: Modified build workflow to automatically trigger demo updates when tagging builds as latest


### Technical Details
- Implemented responsive CSS rules with viewport width calculations for sidebar state detection
- Added repository dispatch event handling for workflow chaining
- Updated README table of contents to include live demo section

## [1.0.2] - 2025-09-16

### Fixed
- **Infinite Scroll Functionality**: Fixed missing `loadMoreIfNeeded()` function that was causing ReferenceError and preventing proper batch loading
- **HTML Rendering Bug**: HTML code snippets now display as syntax-highlighted code instead of rendered HTML by properly encoding HTML entities
- **Search Navigation**: Fixed sidebar navigation for unloaded snippets by adding `ensureSnippetLoadedAndScroll()` function
- **Batch Loading Logic**: Implemented proper viewport-aware initial loading (max 3 batches) to prevent loading all snippets at page load

### Added
- **Version Input for CI/CD**: Added optional version parameter to Docker build workflow for manual version specification
- **Enhanced Tag Detection**: Improved Docker workflow to fetch all tags before checkout for better reliability

### Changed
- **Search Behavior**: Search now loads all matching results at once for complete visibility instead of using batch loading
- **Workflow Optimization**: Simplified Docker build workflow tag detection logic using unified regex pattern
- **Documentation**: Updated README to mention regex search and dark/light mode features

### Technical Details
- Added `loadMoreIfNeeded()` function with viewport detection and batch limiting
- Implemented HTML entity encoding for HTML language snippets in `renderSnippets()`
- Added `ensureSnippetLoadedAndScroll()` for on-demand snippet loading in sidebar navigation
- Enhanced Docker workflow with conditional tag detection and version input parameter
- Updated README description and screenshot to reflect current features

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
<parameter name="filePath">/home/raffael/git/takecode/CHANGELOG.md