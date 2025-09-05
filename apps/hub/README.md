# Status Hub

A DeFi dashboard application for the Status Network ecosystem, built with Next.js 15 and TypeScript.

## 🚀 Features

- **Dashboard**: Overview of vaults, APY rates, and rewards
- **Vault Management**: Deposit funds into various token vaults
- **App Discovery**: Explore curated applications built on Status Network
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Design System**: Consistent with Status Network branding

## 🏗️ Architecture

### File Structure

```
src/
├── app/
│   ├── _components/          # Shared components
│   │   ├── hub-layout.tsx   # Main layout wrapper
│   │   ├── sidebar.tsx      # Navigation sidebar
│   │   ├── top-bar.tsx      # Top navigation bar
│   │   ├── vault-card.tsx   # Vault information cards
│   │   └── app-card.tsx     # Application showcase cards
│   ├── dashboard/           # Dashboard page
│   │   └── page.tsx
│   ├── stake/              # Staking page (future)
│   │   └── page.tsx
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Root page (redirects to dashboard)
│   └── globals.css         # Global styles
```

### Key Components

- **HubLayout**: Main layout wrapper with sidebar and top navigation
- **Sidebar**: Navigation menu with core features and native apps
- **TopBar**: Status Network branding and wallet connection
- **VaultCard**: Displays vault information, APY, and rewards
- **AppCard**: Showcases featured applications

## 🎨 Design System

### Colors

- **Primary**: Purple (`#7140FD`)
- **Neutral**: Dark theme with various opacity levels
- **Background**: White content areas on dark background

### Typography

- **Font**: Inter (Google Fonts)
- **Sizes**: 64px → 27px → 19px → 15px → 13px → 11px
- **Weights**: Regular, Medium, Semibold, Bold

### Layout

- **Breakpoints**: Mobile-first with desktop optimization
- **Grid**: CSS Grid and Flexbox for responsive layouts
- **Spacing**: Consistent 8px grid system

## 🛠️ Development

### Prerequisites

- Node.js 20.x
- pnpm

### Installation

```bash
pnpm install
```

### Development Server

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

## 🔗 Dependencies

- **@status-im/components**: Shared component library
- **@status-im/icons**: Icon library
- **@status-im/colors**: Color system
- **Next.js 15**: React framework
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type safety

## 🚧 Future Enhancements

- [ ] Wallet integration
- [ ] Real-time APY data
- [ ] Transaction history
- [ ] Portfolio analytics
- [ ] Mobile app
- [ ] Dark/light theme toggle
- [ ] Internationalization
- [ ] Analytics and tracking

## 📱 Responsive Design

The application is designed to work seamlessly across all device sizes:

- **Mobile**: Stacked layout with collapsible sidebar
- **Tablet**: Optimized spacing and touch targets
- **Desktop**: Full sidebar with enhanced navigation

## 🎯 Key Routes

- `/` → Redirects to `/dashboard`
- `/dashboard` → Main dashboard with vaults and apps
- `/stake` → Staking interface (future)
- `/deposit` → Deposit interface (future)
- `/discover` → App discovery (future)
- `/karma` → Karma system (future)

## 🔐 Security

- No sensitive data stored in client
- Secure wallet connections
- HTTPS enforcement in production
- Content Security Policy (CSP) headers

## 📄 License

This project is part of the Status Network ecosystem and follows the same licensing terms.

