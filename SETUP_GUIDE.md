# FarmMart - Farm Animals E-Commerce Platform

A modern, full-featured e-commerce platform for buying and selling farm animals built with Next.js, TypeScript, MySQL, and various integrations.

## 🚀 Features

- **User Authentication** - Email/password and Google OAuth via NextAuth
- **Animal Listings** - Browse, search, and filter farm animals
- **Shopping Cart** - Add animals to cart with quantity management
- **Secure Checkout** - Paystack integration for payment processing
- **User Dashboard** - Seller dashboard for managing listings and orders
- **Image Management** - Cloudinary integration for animal images
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **Type Safety** - Full TypeScript support

## 📋 Project Structure

```
farmmart/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── api/
│   │   │   ├── animals/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── cart/
│   │   │   └── orders/
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── dashboard/
│   │   ├── listings/
│   │   │   └── [id]/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── features/
│   │   │   ├── AnimalCard.tsx
│   │   │   ├── CartItem.tsx
│   │   │   └── FilterPanel.tsx
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       └── Badge.tsx
│   ├── lib/
│   │   ├── db.ts (MySQL connection)
│   │   ├── firebase.ts (Firebase config)
│   │   ├── cloudinary.ts (Image upload)
│   │   └── paystack.ts (Payment processing)
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
├── .env.local.example
├── package.json
└── tsconfig.json
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL
- **Authentication**: NextAuth.js with Google OAuth
- **Payment**: Paystack
- **File Storage**: Cloudinary
- **Backend**: Firebase (optional)
- **UI Components**: Custom components + Shadcn/ui patterns

## ⚙️ Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- MySQL server
- Firebase account (optional)
- Paystack account
- Cloudinary account
- Google OAuth credentials

### 1. Clone and Install Dependencies

```bash
cd farmmart
npm install
```

### 2. Set Up Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=farmmart

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Paystack
PAYSTACK_SECRET_KEY=your-paystack-secret-key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Firebase (optional)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
# ... other Firebase configs
```

### 3. Set Up Database

Create MySQL database and tables:

```sql
CREATE DATABASE farmmart;

USE farmmart;

-- Users table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  image VARCHAR(255),
  role ENUM('buyer', 'seller', 'admin') DEFAULT 'buyer',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Animals table
CREATE TABLE animals (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('cattle', 'goat', 'sheep', 'pig', 'poultry', 'other') NOT NULL,
  breed VARCHAR(255),
  age INT NOT NULL,
  weight DECIMAL(10, 2),
  price DECIMAL(15, 2) NOT NULL,
  description LONGTEXT,
  images JSON,
  sellerId VARCHAR(36) NOT NULL,
  location VARCHAR(255),
  health_status ENUM('healthy', 'vaccinated', 'treated', 'unknown') DEFAULT 'unknown',
  available BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sellerId) REFERENCES users(id)
);

-- Cart items table
CREATE TABLE cartitems (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  animalId VARCHAR(36) NOT NULL,
  quantity INT DEFAULT 1,
  addedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (animalId) REFERENCES animals(id)
);

-- Orders table
CREATE TABLE orders (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  totalAmount DECIMAL(15, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  paymentStatus ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  paymentReference VARCHAR(255),
  deliveryAddress VARCHAR(500),
  phoneNumber VARCHAR(20),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Order items table
CREATE TABLE orderitems (
  id VARCHAR(36) PRIMARY KEY,
  orderId VARCHAR(36) NOT NULL,
  animalId VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  pricePerUnit DECIMAL(15, 2) NOT NULL,
  totalPrice DECIMAL(15, 2) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (animalId) REFERENCES animals(id)
);

-- Create indexes
CREATE INDEX idx_animals_seller ON animals(sellerId);
CREATE INDEX idx_cartitems_user ON cartitems(userId);
CREATE INDEX idx_orders_user ON orders(userId);
CREATE INDEX idx_orderitems_order ON orderitems(orderId);
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 API Routes

### Animals

- `GET /api/animals` - Get all animals (with filters)
- `POST /api/animals` - Create new animal listing

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart` - Remove item from cart

### Orders

- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

### Authentication

- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `POST /api/auth/callback` - OAuth callback

## 🔐 Authentication

The project uses NextAuth.js with support for:

1. **Credentials Provider** (Email/Password)
2. **Google OAuth** - Social login integration

Users are automatically created in the database on first OAuth login.

## 💳 Payment Integration

Paystack integration handles:

- Payment initialization
- Payment verification
- Transfer to sellers
- Receipt generation

## 📸 Image Management

Cloudinary handles:

- Animal image uploads
- Image optimization
- Secure URL generation
- Image deletion

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel
```

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]
```

Build and run:

```bash
docker build -t farmmart .
docker run -p 3000:3000 farmmart
```

## 🧪 Testing

```bash
npm run test
```

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org)
- [Paystack API](https://paystack.com/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Firebase Docs](https://firebase.google.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@farmmart.com or create an issue in the repository.

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced search with AI
- [ ] Seller analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Video uploads for animals
- [ ] Direct messaging between buyers and sellers
- [ ] Reviews and ratings system
- [ ] Bulk upload for sellers
- [ ] Integration with delivery services
- [ ] Automated invoice generation

---

**FarmMart** - Connecting Farmers, Changing Lives 🐄
