import { ShoppingBag, Heart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

const wishlistItems = [
  { id: 1, name: 'Silk Embroidered Kurta', price: 120, category: 'Ready to Wear', image: '/images/product_1.png' },
  { id: 2, name: 'Hand-Crafted Jutti', price: 85, category: 'Footwear', image: 'https://images.unsplash.com/photo-1603189343302-e603f7add05a?q=80&w=400&auto=format&fit=crop' },
]

export default function Wishlist() {
  return (
    <div className="container mx-auto px-6 py-20 min-h-[70vh]">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <h1 className="font-serif text-6xl font-black">Your Wishlist</h1>
          <p className="text-slate-500 font-light text-xl">Pieces you love, saved for later.</p>
        </div>

        {wishlistItems.length > 0 ? (
          <div className="space-y-8">
            {wishlistItems.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50 rounded-[32px] group transition-all hover:bg-white hover:shadow-xl border border-transparent hover:border-slate-100">
                <div className="w-32 h-40 bg-slate-200 rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                  <h3 className="font-serif text-2xl font-bold">{item.name}</h3>
                  <p className="font-medium text-lg">${item.price}.00</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                   <Button className="h-14 px-8 rounded-full bg-black text-white hover:bg-slate-800 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" /> Add to Cart
                   </Button>
                   <Button variant="outline" size="icon" className="h-14 w-14 rounded-full border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors">
                      <Trash2 className="w-5 h-5" />
                   </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 space-y-8">
            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-12 h-12 text-slate-200" />
            </div>
            <h2 className="text-2xl font-serif font-bold">Your wishlist is empty</h2>
            <p className="text-slate-400 max-w-sm mx-auto">Start exploring our collection and tap the heart icon to save items you love.</p>
            <Button asChild size="lg" className="h-16 px-12 rounded-full bg-black text-white hover:bg-slate-800 font-bold uppercase text-xs tracking-widest">
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
