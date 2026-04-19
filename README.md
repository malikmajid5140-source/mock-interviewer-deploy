# ✨ Style Sphere — Luxury Fashion E-Commerce

> A world-class luxury shopping experience for **Zainab Clothing House** — featuring AR Virtual Try-On, AI Visual Search, and an elegant editorial-grade UI.

---

## 📸 Features

| Feature | Description |
|---|---|
| 🏠 **Home Page** | Cinematic hero banner with editorial product showcases |
| 🛍️ **Shop Page** | Filterable, animated product grid with luxury card design |
| 🪄 **AR Try-On** | Virtual fitting room using device camera |
| 🔍 **Visual Search** | AI-powered image-based product discovery |
| ❤️ **Wishlist** | Save and manage favorite items |
| 🛒 **Cart** | Full cart management with quantity controls |
| 📦 **Product Detail** | Rich product pages with gallery and size selection |

---

## 📁 Project Structure

```
StyleSphere/
├── public/
│   └── images/            # Hero, product & lifestyle images
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── ui/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Wishlist.tsx
│   │   ├── TryOn.tsx
│   │   └── VisualSearch.tsx
│   ├── lib/
│   │   └── supabase.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
└── vite.config.ts
```

---

## ⚙️ Getting Started Locally

### Prerequisites
- Node.js `v18+`
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/malikmajid161/zainab-clothing-house.git

# Navigate into the project
cd zainab-clothing-house

# Install dependencies
npm install

# Start the development server
npm run dev
```

App runs at **http://localhost:5173**

---

## 🔑 Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 👤 Author

**Majid** — [github.com/malikmajid161](https://github.com/malikmajid161)

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">
  <sub>Built with ❤️ for Zainab Clothing House</sub>
</div>