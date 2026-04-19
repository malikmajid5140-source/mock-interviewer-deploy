import { Link } from 'react-router-dom'
import { Trash2, ArrowRight, Minus, Plus, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { motion } from 'framer-motion'

const cartItems = [
  { id: 1, name: 'Midnight Silk Embroidered Kurta', price: 185, category: 'Ready to Wear', size: 'M', image: '/images/product_1.png', quantity: 1 },
]

export default function Cart() {
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shipping = 0
  const total = subtotal + shipping

  return (
    <div className="container mx-auto px-6 py-20 min-h-[80vh]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="font-serif text-6xl font-black mb-4">Your Shopping Bag</h1>
          <p className="text-slate-500 text-lg font-light">Secure checkout with AI-powered fit validation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Item List */}
          <div className="lg:col-span-8 space-y-8">
            {cartItems.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row items-center gap-8 p-8 bg-slate-50 rounded-[40px] border border-transparent hover:border-slate-100 hover:bg-white transition-all group"
              >
                <div className="w-32 h-44 bg-slate-200 rounded-3xl overflow-hidden shrink-0 shadow-lg">
                   <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                  <h3 className="font-serif text-2xl font-bold">{item.name}</h3>
                  <p className="text-sm text-slate-500 italic">Size: {item.size}</p>
                  <p className="font-bold text-xl mt-4">${item.price}.00</p>
                </div>

                <div className="flex items-center gap-6 bg-white rounded-full px-6 py-3 shadow-sm border">
                   <button className="text-slate-400 hover:text-black"><Minus className="w-4 h-4" /></button>
                   <span className="font-bold text-sm min-w-[1rem] text-center">{item.quantity}</span>
                   <button className="text-slate-400 hover:text-black"><Plus className="w-4 h-4" /></button>
                </div>

                <button className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}

            <div className="pt-8 border-t flex justify-between items-center">
               <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors flex items-center gap-3">
                 ← Continue Shopping
               </Link>
               <p className="text-sm text-slate-500 font-light italic">All taxes and duties included at checkout.</p>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 bg-slate-900 rounded-[50px] p-10 md:p-12 text-white space-y-10 shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32" />
             
             <h3 className="font-serif text-3xl font-bold italic relative z-10">Order Summary</h3>
             
             <div className="space-y-6 relative z-10">
                <div className="flex justify-between text-slate-400 text-sm">
                   <span>Subtotal</span>
                   <span className="text-white font-bold">${subtotal}.00</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                   <span>Shipping</span>
                   <span className="text-white font-bold">{shipping === 0 ? 'FREE' : `$${shipping}.00`}</span>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                   <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Total Amount</p>
                      <p className="text-4xl font-black font-serif">${total}.00</p>
                   </div>
                </div>
             </div>

             <Button className="w-full h-20 rounded-full bg-white text-black hover:bg-slate-100 font-black uppercase text-xs tracking-widest shadow-2xl flex items-center justify-center gap-3 relative z-10">
               Secure Checkout <ArrowRight className="w-4 h-4" />
             </Button>

             <div className="pt-10 border-t border-white/5 space-y-6 relative z-10">
                <div className="flex items-center gap-4 text-slate-400">
                   <ShieldCheck className="w-6 h-6 text-primary" />
                   <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">Secure Payment Protocol <br /> SSL Encrypted</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
