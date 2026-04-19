import { Search, SlidersHorizontal, ShoppingBag, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Link } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'

const products = [
  // Ready to Wear
  { id: 1, name: 'Crimson Velvet Pheran', price: 185, category: 'Ready to Wear', image: '/images/product_1.png', tag: 'Handcrafted' },
  { id: 2, name: 'Midnight Silk Co-ord', price: 210, category: 'Ready to Wear', image: 'https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=800&auto=format&fit=crop', tag: 'Luxury' },
  { id: 3, name: 'Ivory Cotton Kurta', price: 95, category: 'Ready to Wear', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop', tag: 'Daily' },
  { id: 4, name: 'Saffron Embroidered Tunic', price: 160, category: 'Ready to Wear', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop', tag: 'New' },
  { id: 5, name: 'Onyx Silk Wrap', price: 230, category: 'Ready to Wear', image: 'https://images.unsplash.com/photo-1554412930-07175409985c?q=80&w=800&auto=format&fit=crop', tag: 'Editorial' },
  { id: 21, name: 'Olive Linen Set', price: 175, category: 'Ready to Wear', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop', tag: 'Summer' },
  
  // Unstitched
  { id: 6, name: 'Embroidered Lawn - 3pc', price: 120, category: 'Unstitched', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop', tag: 'New' },
  { id: 7, name: 'Digital Printed Satin', price: 145, category: 'Unstitched', image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop', tag: 'Premium' },
  { id: 8, name: 'Festive Organza Suit', price: 250, category: 'Unstitched', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3f416?q=80&w=800&auto=format&fit=crop', tag: 'Festive' },
  { id: 9, name: 'Raw Silk Unstitched Set', price: 190, category: 'Unstitched', image: 'https://images.unsplash.com/photo-1535633302723-997f858509ec?q=80&w=800&auto=format&fit=crop', tag: 'Luxury' },
  { id: 10, name: 'Chiffon Evening Wrap', price: 85, category: 'Unstitched', image: '/images/shawl.png', tag: 'Elegant' },
  { id: 22, name: 'Peach Organza - 3pc', price: 280, category: 'Unstitched', image: 'https://images.unsplash.com/photo-1539109132314-3477524c859c?q=80&w=800&auto=format&fit=crop', tag: 'New In' },

  // Western
  { id: 11, name: 'Oversized Linen Blazer', price: 165, category: 'Western', image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=800&auto=format&fit=crop', tag: 'Trending' },
  { id: 12, name: 'Wide Leg Silk Trousers', price: 130, category: 'Western', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop', tag: 'Chic' },
  { id: 13, name: 'Abstract Midi Dress', price: 195, category: 'Western', image: 'https://images.unsplash.com/photo-1539109132314-3477524c859c?q=80&w=800&auto=format&fit=crop', tag: 'Runway' },
  { id: 14, name: 'Denim Couture Jacket', price: 220, category: 'Western', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop', tag: 'Designer' },
  { id: 15, name: 'Leather Slim Fit Vest', price: 180, category: 'Western', image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?q=80&w=800&auto=format&fit=crop', tag: 'Bold' },
  { id: 23, name: 'Silk Trench Coat', price: 350, category: 'Western', image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800&auto=format&fit=crop', tag: 'Winter' },

  // Accessories
  { id: 16, name: 'Hand-Embellished Clutch', price: 85, category: 'Accessories', image: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?q=80&w=800&auto=format&fit=crop', tag: 'Handmade' },
  { id: 17, name: 'Gold Filigree Earrings', price: 55, category: 'Accessories', image: '/images/jewelry.png', tag: 'Gifts' },
  { id: 18, name: 'Saffron Silk Shawl', price: 75, category: 'Accessories', image: 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?q=80&w=800&auto=format&fit=crop', tag: 'Winter' },
  { id: 19, name: 'Pearl Statement Belt', price: 45, category: 'Accessories', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3f416?q=80&w=800&auto=format&fit=crop', tag: 'Iconic' },
  { id: 20, name: 'Embroidered Velvet Potli', price: 65, category: 'Accessories', image: 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop', tag: 'Classic' },
  { id: 24, name: 'Artisan Silver Necklace', price: 120, category: 'Accessories', image: 'https://images.unsplash.com/photo-1535633302723-997f858509ec?q=80&w=800&auto=format&fit=crop', tag: 'Artisan' },
  { id: 25, name: 'Floral Print Scarf', price: 35, category: 'Accessories', image: 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?q=80&w=800&auto=format&fit=crop', tag: 'Lightweight' },
]

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const cat = searchParams.get('cat')
    if (cat) {
      if (cat === 'pret') setActiveCategory('Ready to Wear')
      else if (cat === 'unstitched') setActiveCategory('Unstitched')
      else if (cat === 'western') setActiveCategory('Western')
      else if (cat === 'accessories') setActiveCategory('Accessories')
      else if (cat === 'new') setActiveCategory('New In') 
    } else {
      setActiveCategory('All')
    }
  }, [searchParams])

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    if (cat === 'All') {
      setSearchParams({})
    } else {
      const slug = cat.toLowerCase().replace(/ /g, '-')
      setSearchParams({ cat: slug === 'ready-to-wear' ? 'pret' : slug === 'new-in' ? 'new' : slug })
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      let matchesCat = activeCategory === 'All' || p.category === activeCategory
      if (activeCategory === 'New In') {
        matchesCat = p.tag === 'New' || p.tag === 'New In'
      }
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCat && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      {/* Seasonal Banner - Modest & High Fashion */}
      <section className="relative h-[400px] md:h-[500px] w-full rounded-[40px] md:rounded-[60px] overflow-hidden mb-16 md:mb-24 group bg-slate-100 shadow-2xl">
        <img 
          src="/images/hero.png" 
          className="w-full h-full object-cover transition-transform duration-[20s] group-hover:scale-110"
          alt="Campaign"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-center px-8 md:px-16 text-white space-y-4 md:space-y-6">
           <motion.span 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="text-[10px] font-bold uppercase tracking-[0.5em] md:tracking-[0.8em] text-primary"
           >
             The Art of Luxury
           </motion.span>
           <motion.h2 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="font-serif text-5xl md:text-8xl font-black italic leading-tight"
           >
             TRENDING <br /> LUXE '26
           </motion.h2>
           <motion.p 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="max-w-md md:max-w-lg text-slate-300 font-light text-sm md:text-lg leading-relaxed"
           >
             Experience redefined elegance with our new seasonal edit, featuring artisanal craftsmanship and modest silhouettes.
           </motion.p>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 space-y-12 shrink-0">
          <div className="space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400">Shop By Category</h3>
            <div className="flex flex-wrap lg:flex-col gap-x-6 gap-y-4">
              {['All', 'New In', 'Unstitched', 'Ready to Wear', 'Western', 'Accessories'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`text-sm text-left transition-all relative group py-1 ${activeCategory === cat ? 'text-black font-black' : 'text-slate-500 hover:text-black'}`}
                >
                  {cat}
                  {activeCategory === cat && (
                    <motion.div layoutId="underline" className="absolute -left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-[40px] p-8 md:p-10 space-y-6 border border-slate-100 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <Sparkles className="w-8 h-8 text-primary" />
            <h4 className="font-serif text-2xl font-bold leading-tight italic">AI Fitting Room</h4>
            <p className="text-slate-500 text-xs leading-relaxed">Don't guess your size. Try any item in our AR mirror instantly.</p>
            <Button asChild className="w-full rounded-full bg-black text-white hover:bg-slate-800 text-[9px] font-bold uppercase tracking-widest h-12">
               <Link to="/try-on">Open Mirror</Link>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 md:mb-16 gap-8">
            <div className="space-y-2">
               <motion.h1 
                 key={activeCategory}
                 initial={{ opacity: 0, x: -20 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="font-serif text-5xl md:text-7xl font-black"
               >
                 {activeCategory}
               </motion.h1>
               <p className="text-slate-400 text-sm italic font-light tracking-wide">Handcrafted luxury pieces</p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search collections..." 
                  className="w-full pl-14 pr-8 py-4 bg-slate-50 border border-slate-100 rounded-full text-sm focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                />
              </div>
              <Button variant="outline" className="h-12 w-12 rounded-full border-slate-200 shrink-0">
                 <SlidersHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-24">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={product.id} 
                  className="flex flex-col group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-slate-200 rounded-[20px] mb-6 shadow-sm transition-shadow hover:shadow-xl">
                    <img 
                      src={product.image} 
                      className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                      alt={product.name}
                      onLoad={(e) => (e.currentTarget.style.opacity = '1')}
                      style={{ opacity: 0, transition: 'opacity 0.5s ease-in' }}
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] shadow-2xl rounded-sm">
                      {product.tag}
                    </div>
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4 backdrop-blur-[2px]">
                       <div className="flex gap-3">
                          <Button asChild size="icon" className="h-12 w-12 rounded-full bg-white text-black hover:bg-primary hover:text-white transition-all scale-75 group-hover:scale-100 duration-500 shadow-2xl">
                             <Link to={`/product/${product.id}`}>
                               <ShoppingBag className="w-5 h-5" />
                             </Link>
                          </Button>
                          <Button size="icon" asChild className="h-12 w-12 rounded-full bg-primary text-white hover:bg-white hover:text-black transition-all scale-75 group-hover:scale-100 duration-500 delay-75 shadow-2xl">
                             <Link to={`/try-on?img=${encodeURIComponent(product.image)}&name=${encodeURIComponent(product.name)}`}>
                               <Sparkles className="w-5 h-5" />
                             </Link>
                          </Button>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-center px-2">
                    <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">{product.category}</p>
                    <h3 className="font-serif text-xl md:text-2xl font-bold group-hover:text-primary transition-colors leading-tight min-h-[3rem] flex items-center justify-center">{product.name}</h3>
                    <div className="flex items-center justify-center gap-4">
                       <span className="font-bold text-lg md:text-xl text-slate-900">${product.price}.00</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
