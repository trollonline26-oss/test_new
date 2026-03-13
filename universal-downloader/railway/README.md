# Railway Deployment Guide

This project is optimized for [Railway](https://railway.app/).

## Steps to Deploy:

1. **GitHub Sync**: Push this `universal-downloader` folder to a new GitHub repository.
2. **Connect to Railway**: 
   - Go to Railway.app and create a new project.
   - Select "Deploy from GitHub repo".
   - Choose the repo you just created.
3. **Environment Setup**:
   - Railway will automatically detect the `package.json` and `nixpacks.toml`.
   - The `nixpacks.toml` in the root ensures `yt-dlp` and `ffmpeg` are installed.
4. **Deploy**:
   - Once connected, Railway will build and deploy the app.
   - Your "Universal Downloader" will be live at a Railway-provided URL (e.g., `universal-downloader-production.up.railway.app`).

## Features:
- **Server-side streaming**: Bypasses browser CORS and YouTube restrictions.
- **yt-dlp integration**: Uses the most powerful download engine available.
- **Nixpacks support**: Automatic dependency management for Linux environments.
