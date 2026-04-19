import { Sparkles, Camera, Smartphone, RefreshCw, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react'
import { Button } from '../components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

export default function TryOn() {
  const [searchParams] = useSearchParams()
  const productImg = searchParams.get('img')
  const productName = searchParams.get('name') || 'Selected Item'

  const [isLive, setIsLive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const startLiveMode = async () => {
    setError(null)
    setUploadedImage(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsLive(true)
        setIsComplete(false)
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)
      setError("Camera access denied. Please check permissions.")
      setIsLive(false)
    }
  }

  const stopLiveMode = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsLive(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      stopLiveMode()
      setError(null)
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
        setIsComplete(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  const handleTryOn = () => {
    if (!isLive && !uploadedImage) {
      setError("Please connect camera or upload an image first.")
      return
    }
    setIsProcessing(true)
    setError(null)
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
    }, 2500)
  }

  useEffect(() => {
    return () => stopLiveMode()
  }, [])

  return (
    <div className="container mx-auto px-6 py-20 min-h-[80vh]">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

      <div className="flex flex-col lg:flex-row items-center gap-20">
        {/* Left: Interactive Preview */}
        <div className="flex-1 w-full max-w-xl">
           <div className="relative aspect-[3/4] bg-slate-900 rounded-[60px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[12px] border-slate-800">
              
              {/* Background states */}
              {!isLive && !uploadedImage && (
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1539109132314-3477524c859c?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale" />
              )}

              {/* Uploaded Image Feed */}
              {uploadedImage && !isLive && (
                <img src={uploadedImage} className="absolute inset-0 w-full h-full object-cover" alt="Uploaded" />
              )}

              {/* Live Webcam Feed */}
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className={`absolute inset-0 w-full h-full object-cover grayscale opacity-60 ${isLive ? 'block' : 'hidden'}`}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              
              {/* AR Overlay (The ACTUAL selected product) */}
              <AnimatePresence>
                {isComplete && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-40"
                  >
                    <img 
                      src={productImg || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"} 
                      className="w-full h-full object-cover mix-blend-normal opacity-90 scale-95"
                      alt="Virtual Try-On Result"
                    />
                    <div className="absolute bottom-40 bg-white/95 backdrop-blur-xl px-8 py-3 rounded-full shadow-2xl border border-pink-100 flex items-center gap-3">
                       <CheckCircle2 className="w-5 h-5 text-green-500" />
                       <span className="text-sm font-bold text-black uppercase tracking-widest">AI Fit: 99.4% Match</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Processing Animation */}
              {isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-30">
                   <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-pink-500 animate-spin mb-6" />
                   <p className="text-white font-serif text-2xl italic">AI Fitting {productName}...</p>
                </div>
              )}
              
              {/* AI Scanning Line */}
              {(isLive || uploadedImage) && !isComplete && (
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent shadow-[0_0_25px_rgba(236,72,153,1)] z-20"
                />
              )}

              {/* Status Header */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10 w-full px-12 text-center">
                 {error && (
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 backdrop-blur-md border border-red-500/30 text-red-200 text-[10px] font-bold uppercase tracking-widest animate-bounce">
                      <AlertCircle className="w-3 h-3" />
                      {error}
                   </div>
                 )}
                 {!error && (
                   <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest">
                      <Sparkles className="w-3 h-3 text-pink-400" />
                      {isLive ? 'Neural Stream: Active' : uploadedImage ? 'Source: Local Asset' : 'Neural Engine: Standby'}
                   </div>
                 )}
              </div>

              {/* Control Buttons */}
              <div className="absolute top-8 right-8 flex flex-col gap-4 z-20">
                 {(isLive || uploadedImage) && (
                   <button 
                     onClick={() => { stopLiveMode(); setUploadedImage(null); setIsComplete(false); }}
                     className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-all shadow-lg"
                   >
                      <RefreshCw className="w-5 h-5" />
                   </button>
                 )}
              </div>
           </div>
        </div>

        {/* Right: Controls & Info */}
        <div className="flex-1 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-primary">
               <ShoppingBag className="w-6 h-6" />
               <span className="text-sm font-bold uppercase tracking-widest">Now Trying On:</span>
            </div>
            <h1 className="font-serif text-6xl font-black leading-tight italic text-slate-900">{productName}</h1>
            <p className="text-slate-500 text-xl leading-relaxed font-light">
              Our AI engine drapes the <span className="font-bold text-black">{productName}</span> onto your silhouette with 99.2% accuracy in drape and fit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div onClick={isLive ? stopLiveMode : startLiveMode} className={`p-8 rounded-[40px] border transition-all group cursor-pointer ${isLive ? 'bg-slate-900 border-slate-900 text-white shadow-2xl' : 'bg-slate-50 border-slate-100 hover:border-black'}`}>
               <div className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${isLive ? 'bg-white/10 text-white' : 'bg-white text-slate-900'}`}><Camera className="w-7 h-7" /></div>
               <h3 className="text-xl font-bold mb-2">{isLive ? 'Stop Feed' : 'Live Camera'}</h3>
            </div>
            <div onClick={triggerUpload} className={`p-8 rounded-[40px] border transition-all group cursor-pointer ${uploadedImage ? 'bg-pink-50 border-pink-200 text-pink-900 shadow-xl' : 'bg-slate-50 border-slate-100 hover:border-black'}`}>
               <div className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${uploadedImage ? 'bg-pink-500 text-white' : 'bg-white text-slate-900'}`}><Smartphone className="w-7 h-7" /></div>
               <h3 className="text-xl font-bold mb-2">{uploadedImage ? 'Change Image' : 'Upload Portrait'}</h3>
            </div>
          </div>

          <Button 
            disabled={(!isLive && !uploadedImage) || isProcessing}
            onClick={handleTryOn}
            size="lg" 
            className="h-16 px-12 rounded-full bg-slate-900 text-white hover:bg-black font-bold uppercase text-xs tracking-[0.2em] w-full md:w-auto shadow-2xl transition-all hover:scale-105"
          >
             {isProcessing ? 'Mapping Silhouette...' : isComplete ? 'Reset & Try Another' : `Try On ${productName}`}
          </Button>

          <div className="pt-10 border-t">
             <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors flex items-center gap-2">
                ← Back to Shop to change item
             </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
