import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Sparkles, DollarSign, ShoppingBag, Home, Upload, X, Bed, Sofa, BookOpen, Check,
  Wand2, ArrowRight, Heart, Paintbrush, Lamp, Flower2, TrendingUp, ExternalLink, RotateCcw
} from 'lucide-react'

// Types
type RoomType = 'bedroom' | 'living_room' | 'study_room'
type DesignStyle = 'minimal' | 'luxury' | 'modern' | 'gaming'
type AppStep = 'landing' | 'upload' | 'makeover' | 'budget' | 'furniture'

// Data
const roomTypes = [
  { id: 'bedroom' as RoomType, label: 'Bedroom', icon: Bed, image: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'living_room' as RoomType, label: 'Living Room', icon: Sofa, image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'study_room' as RoomType, label: 'Study Room', icon: BookOpen, image: 'https://images.pexels.com/photos/1597116/pexels-photo-1597116.jpeg?auto=compress&cs=tinysrgb&w=600' },
]

const designStyles = [
  { id: 'minimal' as DesignStyle, label: 'Minimal', description: 'Clean lines, neutral tones', icon: Sparkles, color: 'from-gray-100 to-gray-300' },
  { id: 'luxury' as DesignStyle, label: 'Luxury', description: 'Premium finishes, elegance', icon: Paintbrush, color: 'from-amber-100 to-amber-300' },
  { id: 'modern' as DesignStyle, label: 'Modern', description: 'Contemporary, bold accents', icon: Lamp, color: 'from-blue-100 to-blue-300' },
  { id: 'gaming' as DesignStyle, label: 'Gaming Setup', description: 'RGB lights, gaming gear', icon: Home, color: 'from-purple-100 to-pink-300' },
]

const loadingStages = [
  { text: 'Analyzing room structure...', icon: '🔍' },
  { text: 'Detecting walls and furniture...', icon: '🏠' },
  { text: 'Generating new design...', icon: '✨' },
  { text: 'Finalizing dream room...', icon: '💫' },
]

const budgetData: Record<DesignStyle, { paint: number; furniture: number; lighting: number; decoration: number }> = {
  minimal: { paint: 250, furniture: 800, lighting: 150, decoration: 100 },
  luxury: { paint: 800, furniture: 5000, lighting: 1200, decoration: 2500 },
  modern: { paint: 400, furniture: 1500, lighting: 350, decoration: 400 },
  gaming: { paint: 300, furniture: 2000, lighting: 600, decoration: 800 },
}

const budgetCategories = [
  { id: 'paint' as const, label: 'Paint Cost', icon: Paintbrush, color: 'from-blue-200 to-blue-300' },
  { id: 'furniture' as const, label: 'Furniture Cost', icon: Sofa, color: 'from-amber-200 to-amber-300' },
  { id: 'lighting' as const, label: 'Lighting Cost', icon: Lamp, color: 'from-yellow-200 to-yellow-300' },
  { id: 'decoration' as const, label: 'Decoration Cost', icon: Flower2, color: 'from-pink-200 to-pink-300' },
]

// Different transformed room images for each style

const furnitureData: Record<DesignStyle, Array<{ name: string; description: string; price: number; image: string; link: string }>> = {
  minimal: [
    { name: 'White Ceramic Lamp', description: 'Clean, modern design with soft lighting', price: 89, image: 'https://images.pexels.com/photos/1112529/pexels-photo-1112529.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=minimalist+table+lamp' },
    { name: 'Wooden Desk', description: 'Natural oak finish, minimalist silhouette', price: 349, image: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=minimalist+oak+desk' },
    { name: 'Simple Chair', description: 'Ergonomic design with breathable fabric', price: 199, image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=minimalist+chair' },
    { name: 'Floating Shelves', description: 'Set of 3 white wall shelves', price: 59, image: 'https://images.pexels.com/photos/1597116/pexels-photo-1597116.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=floating+shelves+white' },
  ],
  luxury: [
    { name: 'Premium Velvet Sofa', description: 'Italian design, premium velvet fabric', price: 2899, image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=velvet+sofa+luxury' },
    { name: 'Designer Floor Lamp', description: 'Crystal base with silk shade', price: 799, image: 'https://images.pexels.com/photos/1112529/pexels-photo-1112529.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=crystal+floor+lamp' },
    { name: 'Marble Coffee Table', description: 'Italian carrara marble, gold accents', price: 1299, image: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=marble+coffee+table+gold' },
    { name: 'Luxury Decor Set', description: 'Handcrafted ceramic vases collection', price: 449, image: 'https://images.pexels.com/photos/1597116/pexels-photo-1597116.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=ceramic+vase+set+luxury' },
  ],
  modern: [
    { name: 'Smart LED Floor Lamp', description: 'Adjustable color temperature, voice controlled', price: 299, image: 'https://images.pexels.com/photos/1112529/pexels-photo-1112529.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=smart+led+floor+lamp' },
    { name: 'Modular Sofa', description: 'Customizable configuration, premium fabric', price: 1599, image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=modular+sofa+modern' },
    { name: 'Geometric Bookshelf', description: 'Modern asymmetric design, matte finish', price: 399, image: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=geometric+bookshelf+modern' },
    { name: 'Contemporary Rug', description: 'Abstract pattern, hand-tufted wool', price: 249, image: 'https://images.pexels.com/photos/1597116/pexels-photo-1597116.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=modern+abstract+rug' },
  ],
  gaming: [
    { name: 'RGB Gaming Chair', description: 'Ergonomic design with LED lighting', price: 449, image: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=rgb+gaming+chair' },
    { name: 'RGB LED Strip Kit', description: '16M colors, voice sync, 10m total', price: 79, image: 'https://images.pexels.com/photos/1112529/pexels-photo-1112529.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=rgb+led+strip+lights+gaming' },
    { name: 'Gaming Desk', description: 'Carbon fiber surface, cable management', price: 299, image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=gaming+desk+rgb' },
    { name: 'Monitor Stand', description: 'Dual arm with USB hub, adjustable', price: 129, image: 'https://images.pexels.com/photos/1597116/pexels-photo-1597116.jpeg?auto=compress&cs=tinysrgb&w=400', link: 'https://www.amazon.com/s?k=monitor+arm+gaming' },
  ],
}

// Floating Elements Component
function FloatingElements() {
  const hearts = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left:
      Math.random() < 0.5
        ? Math.random() * 20 // Left side
        : 80 + Math.random() * 20, // Right side
    delay: Math.random() * 10,
    duration: 10 + Math.random() * 8,
    size: 10 + Math.random() * 14,
    opacity: 0.15 + Math.random() * 0.35,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">

      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute"
          style={{
            left: `${heart.left}%`,
            bottom: "-50px",
            opacity: heart.opacity,
          }}
          animate={{
            y: [0, -1200],
            x: [0, 25, -20, 15, 0],
            rotate: [0, 15, -15, 10, 0],
            scale: [0.7, 1.1, 0.9, 1],
          }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Heart
            size={heart.size}
            fill="#f9a8d4"
            stroke="none"
          />
        </motion.div>
      ))}

      {/* Soft Glow Left */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 450,
          height: 450,
          background:
            "radial-gradient(circle,#f9a8d455 0%,transparent 70%)",
          left: -150,
          top: 150,
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
        }}
      />

      {/* Soft Glow Right */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{
          width: 380,
          height: 380,
          background:
            "radial-gradient(circle,#f472b655 0%,transparent 70%)",
          right: -100,
          bottom: 0,
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
        }}
      />
    </div>
  );
}

// Landing Page Component
function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <motion.div className="text-center max-w-4xl mx-auto z-10" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card mb-8">
          <Sparkles className="w-4 h-4 text-pink-500" />
          <span className="text-sm font-medium text-gray-700">AI-Powered Interior Design</span>
        </motion.div>

        <motion.h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <span className="gradient-text">Design Your Dream Room</span><br />
          <span className="text-gray-800">With AI</span>
        </motion.h1>

        <motion.p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          Upload your room and let AI transform it beautifully in seconds.
        </motion.p>

        <motion.button onClick={onStart} className="btn-primary inline-flex items-center gap-3 text-lg px-10 py-5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
          <Wand2 className="w-5 h-5" />
          Start Designing
          <ArrowRight className="w-5 h-5" />
        </motion.button>

        <motion.div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          {[{ label: 'Smart AI', value: 'Analysis' }, { label: 'Multiple', value: 'Styles' }, { label: 'Instant', value: 'Results' }, { label: 'Budget', value: 'Estimates' }].map((f, i) => (
            <motion.div key={i} className="glass-card rounded-2xl p-4 card-hover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.1 }}>
              <div className="text-2xl md:text-3xl font-bold gradient-text">{f.value}</div>
              <div className="text-gray-500 text-sm mt-1">{f.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

// Room Upload Component
function RoomUpload({ onUpload }: { onUpload: (image: string, roomType: RoomType) => void }) {
  const [selectedRoom, setSelectedRoom] = useState<RoomType>('bedroom')
  const [image, setImage] = useState<string>('')
  const [isDragActive, setIsDragActive] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(URL.createObjectURL(file))
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(URL.createObjectURL(file))
    }
  }

  return (
    <div className="min-h-screen px-6 py-12 pt-24">
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-3">Upload Your <span className="gradient-text">Room</span></h2>
          <p className="text-gray-500 text-lg">Select your room type and upload an image</p>
        </motion.div>

        <motion.div className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roomTypes.map((room) => {
              const Icon = room.icon
              return (
                <motion.button key={room.id} onClick={() => setSelectedRoom(room.id)} className={`style-card glass-card rounded-2xl p-4 flex items-center gap-4 ${selectedRoom === room.id ? 'selected' : ''}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={room.image} alt={room.label} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-left flex items-center gap-2">
                    <Icon className="w-5 h-5 text-pink-500" />
                    <span className="font-semibold text-gray-800">{room.label}</span>
                  </div>
                  {selectedRoom === room.id && <Check className="w-5 h-5 text-pink-500" />}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {!image ? (
            <motion.div
              key="upload"
              className={`upload-zone glass-card rounded-3xl p-12 md:p-20 cursor-pointer ${isDragActive ? 'active' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragActive(true) }}
              onDragLeave={() => setIsDragActive(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('fileInput')?.click()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
              <div className="text-center">
                <motion.div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 mx-auto mb-6 flex items-center justify-center shadow-lg" animate={{ y: isDragActive ? -10 : 0 }}>
                  <Upload className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{isDragActive ? 'Drop your image here' : 'Drag & drop your room image'}</h3>
                <p className="text-gray-500">or click to browse files</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="preview" className="glass-card rounded-3xl overflow-hidden" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="relative">
                <img src={image} alt="Uploaded" className="w-full h-64 md:h-96 object-cover" />
                <button onClick={() => setImage('')} className="absolute top-4 right-4 w-10 h-10 rounded-full glass-button flex items-center justify-center hover:bg-white">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-6 text-center">
                <motion.button onClick={() => onUpload(image, selectedRoom)} className="btn-primary text-lg px-10 py-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  Transform This Room
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Room Makeover Component
function RoomMakeover({ image, roomType, onComplete }: { image: string; roomType: RoomType; onComplete: (style: DesignStyle, generated: string) => void }) {
  const [style, setStyle] = useState<DesignStyle>('minimal')
  const [isGenerating, setIsGenerating] = useState(false)
  const [stage, setStage] = useState(0)
  const [generated, setGenerated] = useState('')

  const handleGenerate = async () => {
  setIsGenerating(true);
  setStage(0);
  setGenerated("");

  const interval = setInterval(() => {
    setStage((s) => {
      if (s >= 3) {
        clearInterval(interval);
        return s;
      }
      return s + 1;
    });
  }, 1500);

  try {
    // Gemini API will be added here in the next step.

    await new Promise((resolve) => setTimeout(resolve, 6000));

    // Temporary placeholder
    setGenerated(image);
    onComplete(style, image);
  } catch (error) {
    console.error("Generation failed:", error);
  } finally {
    setIsGenerating(false);
  }
};

// Budget Estimator Component
function BudgetEstimator({ style }: { style: DesignStyle }) {
  const budget = budgetData[style]
  const total = budget.paint + budget.furniture + budget.lighting + budget.decoration

  return (
    <div className="min-h-screen px-6 py-12 pt-24">
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-3">Budget <span className="gradient-text">Estimator</span></h2>
          <p className="text-gray-500 text-lg">Estimated costs for your {style} makeover</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {budgetCategories.map((cat, i) => {
            const Icon = cat.icon
            const amount = budget[cat.id]
            return (
              <motion.div key={cat.id} className="glass-card rounded-3xl p-6 card-hover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-7 h-7 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm">{cat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">${amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className={`h-full rounded-full bg-gradient-to-r ${cat.color}`} initial={{ width: 0 }} animate={{ width: `${(amount / 5000) * 100}%` }} transition={{ delay: 0.3 + i * 0.1 }} />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div className="glass-card rounded-3xl overflow-hidden" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={{ background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.1) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(251, 207, 232, 0.2) 100%)' }}>
          <div className="p-8 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mb-6">
              <TrendingUp className="w-4 h-4" /> Total Estimated Cost
            </span>
            <DollarSign className="w-10 h-10 text-pink-500 mx-auto mb-4" />
            <motion.p className="text-6xl md:text-7xl font-bold gradient-text" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: 'spring' }}>
              ${total.toLocaleString()}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Furniture Recommendations Component
function FurnitureRecommendations({ style, onRestart }: { style: DesignStyle; onRestart: () => void }) {
  const items = furnitureData[style]
  const total = items.reduce((sum, item) => sum + item.price, 0)

  const handleViewDetails = (item: typeof items[0]) => {
    window.open(item.link, '_blank')
  }

  const handleShopAll = () => {
    const searchLinks = items.map(item => item.link)
    window.open(searchLinks[0], '_blank')
  }

  return (
    <div className="min-h-screen px-6 py-12 pt-24">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-3">Smart Furniture <span className="gradient-text">Recommendations</span></h2>
          <p className="text-gray-500 text-lg">Curated pieces for your {style} style</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {items.map((item, i) => (
            <motion.div key={item.name} className="glass-card rounded-3xl overflow-hidden card-hover group" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
              <div className="relative h-48 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <motion.button className="absolute top-3 right-3 w-9 h-9 rounded-full glass-button flex items-center justify-center opacity-0 group-hover:opacity-100" whileHover={{ scale: 1.1 }} onClick={() => handleViewDetails(item)}>
                  <Heart className="w-4 h-4 text-pink-500" />
                </motion.button>
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 text-pink-600 font-semibold text-sm">${item.price}</span>
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                <motion.button onClick={() => handleViewDetails(item)} className="w-full py-2.5 rounded-xl bg-pink-50 text-pink-600 font-medium text-sm flex items-center justify-center gap-2 hover:bg-pink-100 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <ShoppingBag className="w-4 h-4" /> View Details
                  <ExternalLink className="w-3 h-3" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div className="glass-card rounded-3xl overflow-hidden" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 p-8 text-center text-white">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-6 h-6" />
              <span className="font-medium">Complete Package Price</span>
            </div>
            <motion.p className="text-5xl md:text-6xl font-bold mb-4" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: 'spring' }}>
              ${total.toLocaleString()}
            </motion.p>
            <p className="text-white/80 text-sm mb-6">Save 15% when you bundle all items</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button onClick={handleShopAll} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-pink-500 font-semibold hover:bg-pink-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <ShoppingBag className="w-5 h-5" /> Shop All Items <ExternalLink className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Start Again Button */}
        <motion.div className="mt-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <motion.button
            onClick={onRestart}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full glass-card text-pink-600 font-semibold hover:bg-white transition-colors border-2 border-pink-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="w-5 h-5" />
            Start Again
          </motion.button>
          <p className="mt-4 text-gray-500 text-sm">Design another room with RoomAI</p>
        </motion.div>
      </div>
    </div>
  )
}

// Main App
export default function App() {
  const [step, setStep] = useState<AppStep>('landing')
  const [image, setImage] = useState('')
  const [roomType, setRoomType] = useState<RoomType>('bedroom')
  const [style, setStyle] = useState<DesignStyle>('minimal')
  const [generatedImage, setGeneratedImage] = useState('')

  const steps = [
    { id: 'upload', label: 'Upload', icon: Home },
    { id: 'makeover', label: 'Transform', icon: Sparkles },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'furniture', label: 'Shop', icon: ShoppingBag },
  ]

  const stepIndex = () => {
    if (step === 'landing' || step === 'upload') return 0
    return steps.findIndex(s => s.id === step)
  }

  const handleRestart = () => {
    setStep('landing')
    setImage('')
    setRoomType('bedroom')
    setStyle('minimal')
    setGeneratedImage('')
  }

  return (
    <div className="min-h-screen relative">
      <FloatingElements />

      {step !== 'landing' && (
        <motion.header className="fixed top-0 left-0 right-0 z-50 px-6 py-4" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="max-w-6xl mx-auto">
            <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => {
                  if (step === 'upload') setStep('landing')
                  else if (step === 'makeover') setStep('upload')
                  else if (step === 'budget') setStep('makeover')
                  else setStep('budget')
                }} className="w-10 h-10 rounded-xl glass-button flex items-center justify-center hover:bg-white">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-display font-bold text-xl text-gray-800">RoomAI</span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-1">
                {steps.map((s, i) => {
                  const Icon = s.icon
                  const isActive = stepIndex() >= i
                  const isCurrent = s.id === step
                  return (
                    <div key={s.id} className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all" style={{ background: isCurrent ? '#ec4899' : isActive ? '#fce7f3' : '#f3f4f6', color: isCurrent ? 'white' : isActive ? '#db2777' : '#9ca3af' }}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{s.label}</span>
                    </div>
                  )
                })}
              </div>

              {step === 'upload' ? null : step === 'makeover' ? (
                generatedImage && (
                  <motion.button onClick={() => setStep('budget')} className="px-6 py-2.5 rounded-xl font-medium text-sm bg-pink-500 text-white hover:bg-pink-600 shadow-lg" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    Continue
                  </motion.button>
                )
              ) : step === 'budget' ? (
                <motion.button onClick={() => setStep('furniture')} className="px-6 py-2.5 rounded-xl font-medium text-sm bg-pink-500 text-white hover:bg-pink-600 shadow-lg" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  Continue
                </motion.button>
              ) : null}
            </div>
          </div>
        </motion.header>
      )}

      <main className={step !== 'landing' ? 'pt-24' : ''}>
        <AnimatePresence mode="wait">
          {step === 'landing' && <LandingPage key="landing" onStart={() => setStep('upload')} />}
          {step === 'upload' && <RoomUpload key="upload" onUpload={(img, type) => { setImage(img); setRoomType(type); setStep('makeover') }} />}
          {step === 'makeover' && <RoomMakeover key="makeover" image={image} roomType={roomType} onComplete={(s, gen) => { setStyle(s); setGeneratedImage(gen) }} />}
          {step === 'budget' && <BudgetEstimator key="budget" style={style} />}
          {step === 'furniture' && <FurnitureRecommendations key="furniture" style={style} onRestart={handleRestart} />}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>Made with love by RoomAI</p>
      </footer>
    </div>
  )
}
