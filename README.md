# BuyTuk Academy

**BuyTuk Academy: A smart integrated educational platform connecting schools, teachers, and students**

## 🚀 Features

- **Multi-user Platform**: Support for schools, teachers, students, and parents
- **Smart Learning Tools**: AI-powered question generation, tutoring, and personalized learning paths
- **Offline Support**: Full offline functionality with service workers
- **Real-time Collaboration**: Live sessions, messaging, and peer review
- **Mobile-First**: Progressive Web App (PWA) with RTL support
- **Comprehensive Assessment**: Quizzes, exams, attendance tracking, and progress reports
- **Multilingual**: Arabic and English support with i18n

## 📋 Prerequisites

- **Node.js**: >= 18.0.0
- **pnpm**: >= 9.0.0 (required package manager)

## 🛠️ Setup & Development

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Development Server

```bash
pnpm dev
```

Server runs on `http://localhost:3000`

### 4. Build for Production

```bash
pnpm build
```

### 5. Preview Production Build

```bash
pnpm preview
```

## 📁 Project Structure

```
buytuk-academy/
├── artifacts/           # API server and standalone artifacts
│   └── api-server/     # Express.js backend API
├── lib/                # Shared libraries
│   ├── db/             # Database layer (Drizzle ORM)
│   ├── api-zod/        # API validation schemas
│   └── api-client-react/ # React Query integration
├── src/                # Main frontend application
├── docs/               # Documentation
│   └── business/       # Business model & strategy docs
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── pnpm-workspace.yaml # pnpm monorepo configuration
```

## 🔧 TypeScript & React Configuration

- **TypeScript**: 5.10.2+ (React 19 compatible)
- **React**: 19.1.0 with new JSX transform
- **Target**: ES2022
- **Strict Mode**: Enabled for all files
- **Build Tool**: Vite 7 with fast HMR

## 📦 Key Dependencies

- **Frontend**: React 19, Framer Motion, TailwindCSS 4
- **UI**: Radix UI components with shadcn/ui patterns
- **Forms**: React Hook Form + Zod validation
- **State**: TanStack React Query
- **Styling**: TailwindCSS 4 with Tailwind Merge
- **i18n**: i18next for multilingual support
- **Database**: Drizzle ORM with SQL
- **Server**: Express.js for API

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server with HMR |
| `pnpm build` | Build for production (typecheck + build) |
| `pnpm preview` | Preview production build locally |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm typecheck:libs` | Check monorepo libraries |
| `pnpm lint` | Run TypeScript linter |

## 🔐 Type Checking

The project uses strict TypeScript configuration. All files must pass type checking before building:

```bash
# Check types before committing
pnpm typecheck

# Or check continuously during development
pnpm lint
```

## 🌐 Internationalization (i18n)

The application supports multiple languages:

- **Arabic (ar)**: Default language with RTL layout
- **English (en)**: LTR layout

Language configuration in `.env`:
```env
VITE_DEFAULT_LANGUAGE=ar
VITE_SUPPORTED_LANGUAGES=ar,en
```

## 📱 Progressive Web App (PWA)

The project includes PWA support:
- Service Worker registration
- Offline capability
- Install prompt
- Web manifest configuration

## 🔍 Compatibility Issues Fixed

### TypeScript 5.10.2 Compatibility
- ✅ ES2022 target for modern JavaScript features
- ✅ `react-jsx` transform (no React import needed in files)
- ✅ Strict null checks and type safety
- ✅ Source maps for debugging

### React 19 Compatibility
- ✅ New JSX transform support
- ✅ Latest React types with improved typing
- ✅ Proper @types/react and @types/react-dom versions

### Package Manager Consistency
- ✅ pnpm monorepo with workspace catalog
- ✅ Locked dependency versions via pnpm-lock.yaml
- ✅ Peer dependencies auto-install

## 🐛 Known Issues & Solutions

### "Cannot find module 'react'" errors
→ Ensure TypeScript target is set to `ES2022` and jsx mode is `react-jsx`

### Type errors with Radix UI
→ Update @types/react to ^19.2.0 and @types/react-dom to ^19.2.0

### pnpm install fails
→ Delete pnpm-lock.yaml and node_modules, then reinstall:
```bash
rm -rf pnpm-lock.yaml node_modules
pnpm install
```

## 📚 Documentation

- [Business Model](./docs/business/Business_Model.md)
- [Pricing Strategy](./docs/business/Pricing_Model.md)
- [Go-to-Market](./docs/business/Go_To_Market.md)
- [Engineering Docs](./docs/buytuk-master/) (if available)

## 🤝 Contributing

1. Ensure Node.js >= 18 and pnpm >= 9
2. Run `pnpm install` to set up dependencies
3. Create a feature branch from `main`
4. Make your changes and ensure `pnpm typecheck` passes
5. Submit a pull request with a clear description

## 📄 License

MIT License - See LICENSE file for details

## 💡 Support

For issues and feature requests, please use GitHub Issues.

---

**Last Updated**: 2026-07-19  
**TypeScript**: 5.10.2  
**React**: 19.1.0  
**Node**: >= 18.0.0
