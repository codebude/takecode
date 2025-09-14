# MassCode Web

A modern web interface for browsing and searching your MassCode snippets with syntax highlighting, themes, and copy-to-clipboard functionality.

![MassCode Web](https://img.shields.io/badge/MassCode-Web-blue?style=for-the-badge&logo=docker)
![Docker](https://img.shields.io/badge/Docker-Ready-green?style=flat-square&logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

[![GitHub stars](https://img.shields.io/github/stars/codebude/masscode-web?style=social)](https://github.com/codebude/masscode-web)
[![GitHub last commit](https://img.shields.io/github/last-commit/codebude/masscode-web)](https://github.com/codebude/masscode-web)
[![GitHub repo size](https://img.shields.io/github/repo-size/codebude/masscode-web)](https://github.com/codebude/masscode-web)
[![GitHub issues](https://img.shields.io/github/issues/codebude/masscode-web)](https://github.com/codebude/masscode-web/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/codebude/masscode-web)](https://github.com/codebude/masscode-web/pulls)

## ✨ Features

- 🔍 **Search & Filter**: Quickly find snippets by name, description, or content
- 🎨 **Themes**: Light, dark, and auto themes with smooth transitions
- 📋 **Copy to Clipboard**: One-click copying of code blocks with visual feedback
- 🌳 **Tree Navigation**: Browse snippets organized in folders
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🐳 **Docker Ready**: Easy deployment with Docker Compose

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Download the docker-compose.yml**:
   ```bash
   wget https://raw.githubusercontent.com/codebude/masscode-web/main/docker-compose.yml
   ```

2. **Edit the volume mapping**:
   Open `docker-compose.yml` and update the volume path to point to your local MassCode `db.json` file:
   ```yaml
   volumes:
     - /path/to/your/masscode/db.json:/usr/share/nginx/html/data/db.json:ro
   ```

3. **Run the application**:
   ```bash
   docker-compose up -d
   ```

4. **Open your browser**:
   ```
   http://localhost:8080
   ```

### Volume Mapping

The `docker-compose.yml` includes a volume mount that maps your local `db.json` file to the container:

```yaml
volumes:
  - ./db.json:/usr/share/nginx/html/data/db.json:ro
```

**Important**: Update the left side (`./db.json`) to the actual path of your MassCode database file. The volume is read-only to prevent accidental modifications to your data.

### Manual Docker Run

```bash
docker run -d -p 8080:80 -v /path/to/your/db.json:/usr/share/nginx/html/data/db.json:ro ghcr.io/codebude/masscode-web:latest
```

## 🎯 What is MassCode?

This project is a web frontend for [MassCode](https://masscode.io/), the ultimate code snippet manager for developers. MassCode is a free and open-source code snippets manager, built with Electron & Vue.js.

## 🤝 Contributing

Found a bug or have a feature request? Feel free to:
- [Open an issue](https://github.com/codebude/masscode-web/issues)
- [Create a pull request](https://github.com/codebude/masscode-web/pulls)
- ⭐ Star the repository if you find it useful!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Try MassCode Web today and supercharge your snippet management! 🚀**

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=codebude/masscode-web&type=Date)](https://star-history.com/#codebude/masscode-web&Date)