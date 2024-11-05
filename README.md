# Online Course Products Management System

A modern web application for managing online course products, built with Next.js, React, and TypeScript. This application provides a complete interface for authentication and product management with features like sorting, searching, pagination, and CRUD operations.

## 🚀 Features

- **Authentication System**
  - Secure login/logout functionality
  - Protected routes
  - Session management

- **Product Management**
  - Create, read, update, and delete products
  - Real-time search functionality
  - Sort products by title or brand
  - Pagination for better performance
  - Responsive product cards with image handling
  - Modal form for product creation/editing

- **User Interface**
  - Responsive design for all screen sizes
  - Loading states and skeletons
  - Error handling and user feedback
  - Modern and clean UI with Tailwind CSS
  - Optimized image loading

## 🛠 Tech Stack

- **Frontend Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Testing**: Jest & React Testing Library
- **UI Components**: Custom components with shadcn/ui

## 🏗 Project Structure

```
src/
├── app/
│   ├── _tests_/
│   │   ├── LoginPage.test.tsx
│   │   └── Dashboard.test.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── fonts/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── _tests_/
│   │   ├── Loader.test.tsx
│   │   ├── Pagination.test.tsx
│   │   ├── ProductCard.test.tsx
│   │   ├── ProductHeader.test.tsx
│   │   └── ProductModal.test.tsx
│   ├── Loader.tsx
│   ├── Pagination.tsx
│   ├── ProductCard.tsx
│   ├── ProductCardSkeleton.tsx
│   ├── ProductHeader.tsx
│   └── ProductModal.tsx
├── hooks/
│   ├── _tests_/
│   │   ├── useAuth.test.tsx
│   │   └── useProducts.test.tsx
│   ├── useAuth.ts
│   └── useProducts.ts
├── services/
│   ├── _tests_/
│   │   └── products.test.ts
│   ├── api.ts
│   └── products.ts
├── tests/
├── types/
│   └── product.ts
└── utils/
```

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone git@github.com:Luisfp0/online-course-products.git
   cd online-course-products
   ```

2. **Install dependencies**
   ```bash
   # Using yarn
   yarn
   
   # Using npm
   npm install

   # Using pnpm
   pnpm install
   ```

3. **Run the development server**
   ```bash
   # Using yarn
   yarn dev

   # Using npm
   npm run dev

   # Using pnpm
   pnpm dev
   ```

4. **Build for production**
   ```bash
   # Using yarn
   yarn build
   yarn start
   
   # Using npm
   npm run build
   npm start

   # Using pnpm
   pnpm build
   pnpm start
   ```

5. **Run tests**
   ```bash
   # Using yarn
   yarn test
   yarn test:watch
   yarn test:coverage

   # Using npm
   npm test
   npm run test:watch     # Watch mode
   npm run test:coverage  # Coverage report

   # Using pnpm
   pnpm test
   pnpm test:watch
   pnpm test:coverage
   ```

## 🔐 Authentication

The application uses a simple authentication system with the following credentials:
- Username: `admin`
- Password: `password`

## 🧪 Testing

The project includes comprehensive test coverage using Jest and React Testing Library:

- Component tests
- Hook tests
- Service tests
- Integration tests

Run the test suite with your preferred package manager:

```bash
# Unit tests
yarn test       # Using yarn
npm test        # Using npm
pnpm test       # Using pnpm

# Watch mode
yarn test:watch
npm run test:watch
pnpm test:watch

# Coverage report
yarn test:coverage
npm run test:coverage
pnpm test:coverage
```

## 🔄 State Management

The application uses Zustand for state management with the following stores:
- `useAuth`: Handles authentication state
- `useProducts`: Manages product data and operations

## 📝 API Integration

The application integrates with the DummyJSON API for product management:
- Base URL: `https://dummyjson.com`
- Endpoints:
  - GET `/products`: List products
  - POST `/products/add`: Create product
  - PUT `/products/:id`: Update product
  - DELETE `/products/:id`: Delete product

## 🚨 Common Issues & Solutions

### Installation Issues
```bash
# Clear package manager cache
yarn cache clean        # Using yarn
npm cache clean --force  # Using npm
pnpm store prune        # Using pnpm

# Remove node_modules and reinstall
rm -rf node_modules yarn.lock
rm -rf node_modules package-lock.json
rm -rf node_modules pnpm-lock.yaml
```

### Port Already in Use
```bash
# Find and kill process on port 3000
sudo lsof -i :3000
kill -9 <PID>
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [DummyJSON](https://dummyjson.com)
- [shadcn/ui](https://ui.shadcn.com)
