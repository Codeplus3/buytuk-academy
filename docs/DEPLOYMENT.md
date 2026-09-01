# Deployment Guide

## 1. Development
```bash
docker-compose up -d postgres redis
pnpm install
pnpm db:push
pnpm dev