# Cloud Upload Frontend

A simple frontend application for uploading files to cloud storage using a backend-generated pre-signed URL.

This project demonstrates frontend integration with a cloud-native backend system.

---

## Features

- File upload via AWS S3 pre-signed URL
- Backend API integration
- Environment-based configuration (local / production)
- Deployed on cloud hosting platform (Vercel)

---

## Tech Stack

- React
- JavaScript
- HTML / CSS
- RESTful API

---

## Upload Flow

1. User selects a file from the browser
2. Frontend requests a pre-signed URL from backend API
3. File is uploaded directly to AWS S3
4. Upload result is returned to backend

---

## Purpose

This frontend project is part of a cloud upload system and focuses on frontend-to-backend integration in a real-world cloud workflow.

---

## 中文說明

此前端專案負責與後端 API 串接，透過 S3 Pre-signed URL 直接由瀏覽器上傳檔案至雲端，展示實際的雲端檔案上傳流程與前後端整合能力。
