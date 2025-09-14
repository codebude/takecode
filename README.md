# MassCode Web

A modern web interface for browsing and searching your MassCode snippets with syntax highlighting, themes, and copy-to-clipboard functionality.

![MassCode Web](https://img.shields.io/badge/MassCode-Web-blue?style=for-the-badge&logo=docker)
![Docker](https://img.shields.io/badge/Docker-Ready-green?style=flat-square&logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## ✨ Features

- 🔍 **Search & Filter**: Quickly find snippets by name, description, or content
- 🎨 **Themes**: Light, dark, and auto themes with smooth transitions
- 📋 **Copy to Clipboard**: One-click copying of code blocks with visual feedback
- 🌳 **Tree Navigation**: Browse snippets organized in folders
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🐳 **Docker Ready**: Easy deployment with Docker Compose

## 🚀 Quick Start

### Using Docker Compose (Recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/codebude/masscode-web.git
   cd masscode-web
   ```

2. **Place your data**:
   ```bash
   # Copy your MassCode db.json file to the project root
   cp /path/to/your/masscode/db.json ./db.json
   ```

3. **Run with Docker Compose**:
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

This allows you to:
- Keep your data file outside the container
- Update snippets without rebuilding the image
- Maintain data persistence

### Manual Docker Run

```bash
docker run -d -p 8080:80 -v $(pwd)/db.json:/usr/share/nginx/html/data/db.json:ro ghcr.io/codebude/masscode-web:latest
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