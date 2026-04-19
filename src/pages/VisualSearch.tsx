import { Camera, Upload, Search } from 'lucide-react'
import { Button } from '../components/ui/button'
import { motion } from 'framer-motion'

export default function VisualSearch() {
  return (
    <div className="container mx-auto px-6 py-20 min-h-[70vh]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-200"
          >
            <Camera className="w-10 h-10" />
          </motion.div>
          <h1 className="font-serif text-6xl font-black tracking-tight">AI Visual Search</h1>
          <p className="text-slate-500 text-xl max-w-2xl mx-auto font-light">
            Upload an image of any outfit or fabric, and our neural engine will find its nearest match in our luxury catalog.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[4/5] bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center group hover:border-black transition-colors cursor-pointer relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 relative z-10">
              <Upload className="w-10 h-10 text-slate-900" />
            </div>
            <h3 className="text-2xl font-serif font-bold mb-4 relative z-10">Drag & Drop Image</h3>
            <p className="text-slate-400 text-sm mb-8 relative z-10">Supports JPG, PNG, WEBP (Max 5MB)</p>
            <Button size="lg" className="h-14 px-10 rounded-full bg-black text-white hover:bg-slate-800 font-bold uppercase tracking-widest text-xs relative z-10">
              Browse Files
            </Button>
          </motion.div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[32px] border shadow-sm space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-3">
                <Search className="w-5 h-5 text-primary" />
                Or Paste URL
              </h3>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="https://pinterest.com/pin/..." 
                  className="flex-1 bg-slate-50 border-none rounded-full px-6 py-4 text-sm focus:ring-2 focus:ring-slate-200 outline-none"
                />
                <Button size="icon" className="h-14 w-14 rounded-full bg-black shrink-0">
                  <Search className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 text-white p-8 rounded-[32px] space-y-4">
                 <h4 className="font-serif text-2xl font-bold">98.4%</h4>
                 <p className="text-slate-400 text-xs uppercase tracking-widest">Accuracy Rate</p>
              </div>
              <div className="bg-primary/10 p-8 rounded-[32px] space-y-4 border border-primary/20">
                 <h4 className="font-serif text-2xl font-bold text-primary">Instant</h4>
                 <p className="text-primary/60 text-xs uppercase tracking-widest">Processing Time</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
               <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Sample Searches</h3>
               <div className="flex gap-4">
                  {[
                    '/images/product_1.png',
                    'https://images.unsplash.com/photo-1539109132314-3477524c859c?q=80&w=200&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=200&auto=format&fit=crop'
                  ].map((url, i) => (
                    <div key={i} className="w-20 h-20 rounded-2xl overflow-hidden cursor-pointer hover:opacity-70 transition-opacity ring-2 ring-transparent hover:ring-primary">
                       <img src={url} className="w-full h-full object-cover" />
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
