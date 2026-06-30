import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Sparkles, DollarSign, ShoppingBag, Home, Upload, X, Bed, Sofa, BookOpen, Check,
  Wand2, ArrowRight, Heart, Paintbrush, Lamp, Flower2, TrendingUp, ExternalLink, RotateCcw,
  Maximize
} from 'lucide-react'

// Types
type RoomType = 'bedroom' | 'living_room' | 'study_room'
type DesignStyle = 'minimal' | 'luxury' | 'modern' | 'gaming'
type AppStep = 'landing' | 'upload' | 'makeover' | 'budget' | 'furniture'
type RoomSize = 'small' | 'medium' | 'large'

// Room Types Data
const roomTypes = [
  { id: 'bedroom' as RoomType, label: 'Bedroom', icon: Bed, image: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'living_room' as RoomType, label: 'Living Room', icon: Sofa, image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600' },
  { id: 'study_room' as RoomType, label: 'Study Room', icon: BookOpen, image: 'https://images.pexels.com/photos/1597116/pexels-photo-1597116.jpeg?auto=compress&cs=tinysrgb&w=600' },
]

// Room Sizes Data
const roomSizes = [
  { id: 'small' as RoomSize, label: 'Small', description: 'Up to 150 sq ft', multiplier: 0.7 },
  { id: 'medium' as RoomSize, label: 'Medium', description: '150-300 sq ft', multiplier: 1.0 },
  { id: 'large' as RoomSize, label: 'Large', description: '300+ sq ft', multiplier: 1.5 },
]

// Design Styles Data
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

// Budget Categories
const budgetCategories = [
  { id: 'paint' as const, label: 'Paint Cost', icon: Paintbrush, color: 'from-blue-200 to-blue-300' },
  { id: 'furniture' as const, label: 'Furniture Cost', icon: Sofa, color: 'from-amber-200 to-amber-300' },
  { id: 'lighting' as const, label: 'Lighting Cost', icon: Lamp, color: 'from-yellow-200 to-yellow-300' },
  { id: 'decoration' as const, label: 'Decoration Cost', icon: Flower2, color: 'from-pink-200 to-pink-300' },
]

// Real Furniture Data with INR prices and Amazon India links - Unique images for each product
const furnitureData: Record<DesignStyle, Array<{ name: string; description: string; price: number; image: string; link: string }>> = {
  minimal: [
    {
      name: 'White Ceramic Table Lamp',
      description: 'Minimalist design with soft warm white light, perfect for bedside or desk',
      price: 1499,
      image: 'https://images.pexels.com/photos/1112529/pexels-photo-1112529.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=minimalist+white+table+lamp'
    },
    {
      name: 'Solid Oak Wooden Study Desk',
      description: 'Natural oak finish with clean lines, cable management, sturdy build',
      price: 8999,
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=wooden+study+desk+oak'
    },
    {
      name: 'Breathable Mesh Office Chair',
      description: 'Ergonomic design with lumbar support, adjustable height, breathable back',
      price: 4999,
      image: 'https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=ergonomic+mesh+office+chair'
    },
    {
      name: 'Set of 3 Floating Wall Shelves',
      description: 'White matte finish floating shelves, easy wall mount installation',
      price: 1299,
      image: 'https://images.pexels.com/photos/1125135/pexels-photo-1125135.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=floating+wall+shelves+white+set+3'
    },
  ],
  luxury: [
    {
      name: 'Italian Velvet Premium Sofa Set',
      description: 'Handcrafted 3-seater velvet sofa with gold-finished wooden legs',
      price: 85000,
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=velvet+sofa+italian+luxury+3+seater'
    },
    {
      name: 'Crystal Floor Lamp with Silk Shade',
      description: 'Elegant crystal base standing lamp with premium silk fabric shade',
      price: 16999,
      image: 'https://images.pexels.com/photos/1112529/pexels-photo-1112529.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=crystal+floor+lamp+silk+shade'
    },
    {
      name: 'Italian Marble Coffee Table',
      description: 'Genuine carrera marble top with rose gold metal frame, premium finish',
      price: 45000,
      image: 'https://images.pexels.com/photos/279648/pexels-photo-279648.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=marble+coffee+table+gold+frame'
    },
    {
      name: 'Luxury Ceramic Vase Collection',
      description: 'Set of 5 handmade ceramic vases with gold accents, premium decor',
      price: 8999,
      image: 'https://images.pexels.com/photos/1125135/pexels-photo-1125135.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=luxury+ceramic+vase+set+gold'
    },
  ],
  modern: [
    {
      name: 'Smart LED Floor Lamp',
      description: 'Voice-controlled, adjustable color temperature 2700K-6500K, WiFi enabled',
      price: 6999,
      image: 'https://images.pexels.com/photos/1112582/pexels-photo-1112582.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=smart+led+floor+lamp+voice+control'
    },
    {
      name: 'L-Shaped Modular Sofa',
      description: 'Contemporary L-shape design, premium fabric, storage chaise section',
      price: 35000,
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=L+shaped+modular+sofa+modern'
    },
    {
      name: 'Geometric Asymmetric Bookshelf',
      description: 'Modern 5-tier open bookcase, MDF matte finish, wall mount capable',
      price: 8999,
      image: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=geometric+bookshelf+modern+asymmetric'
    },
    {
      name: 'Abstract Handwoven Area Rug',
      description: 'Modern geometric pattern, hand-tufted wool blend, non-slip backing',
      price: 7499,
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=abstract+area+rug+modern+geometric'
    },
  ],
  gaming: [
    {
      name: 'RGB Ergonomic Gaming Chair',
      description: 'High-back racing style with LED RGB lighting, lumbar pillow, footrest',
      price: 18999,
      image: 'https://images.pexels.com/photos/776892/pexels-photo-776892.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=rgb+gaming+chair+led+lights'
    },
    {
      name: 'Smart RGB LED Strip Kit 10M',
      description: '16 million colors, music sync, app control, cuttable DIY strips',
      price: 1599,
      image: 'https://images.pexels.com/photos/1112582/pexels-photo-1112582.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=rgb+led+strip+lights+music+sync'
    },
    {
      name: 'Professional Gaming Desk',
      description: 'Carbon fiber textured top, RGB edge lights, headphone hook, cup holder',
      price: 12999,
      image: 'https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=gaming+desk+rgb+carbon+fiber'
    },
    {
      name: 'Dual Monitor Arm Stand',
      description: 'Adjustable gas spring desk mount, USB hub integrated, cable management',
      price: 5499,
      image: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=400',
      link: 'https://www.amazon.in/s?k=dual+monitor+arm+stand+usb'
    },
  ],
}

// Real room transformation images that preserve similar layouts while changing style
// These show the same room type with different styling approaches
const transformedRooms: Record<DesignStyle, Record<RoomType, string>> = {
  minimal: {
    bedroom: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    living_room: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    study_room: 'https://images.pexels.com/photos/279648/pexels-photo-279648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  luxury: {
    bedroom: 'https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    living_room: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    study_room: 'https://images.pexels.com/photos/1112530/pexels-photo-1112530.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  modern: {
    bedroom: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    living_room: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    study_room: 'https://images.pexels.com/photos/1597116/pexels-photo-1597116.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  gaming: {
    bedroom: 'https://images.pexels.com/photos/776892/pexels-photo-776892.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    living_room: 'https://images.pexels.com/photos/2089698/pexels-photo-2089698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    study_room: 'https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
}

// Dynamic Budget Calculation Function (INR)
function calculateBudget(style: DesignStyle, roomSize: RoomSize) {
  const sizeMultiplier = roomSizes.find(s => s.id === roomSize)?.multiplier || 1.0

  // Base costs in INR for each style
  const baseCosts: Record<DesignStyle, { paint: number; furniture: number; lighting: number; decoration: number }> = {
    minimal: {
      paint: 5000,      // Quality matte finish paints
      furniture: 25000, // Basic functional furniture
      lighting: 8000,   // Simple LED fixtures
      decoration: 5000  // Minimal decorative items
    },
    luxury: {
      paint: 18000,      // Premium Italian paints
      furniture: 150000, // High-end branded furniture
      lighting: 45000,   // Designer crystal/gold fixtures
      decoration: 75000  // Premium art pieces, vases
    },
    modern: {
      paint: 10000,      // Premium textured paints
      furniture: 65000,  // Contemporary designs
      lighting: 25000,   // Smart WiFi enabled lights
      decoration: 20000  // Modern art & rugs
    },
    gaming: {
      paint: 8000,       // Dark theme paints
      furniture: 45000,  // Gaming desk, chair, setup
      lighting: 18000,   // RGB strips, smart lights
      decoration: 15000  // Gaming posters, accessories
    },
  }

  const base = baseCosts[style]
  return {
    paint: Math.round(base.paint * sizeMultiplier),
    furniture: Math.round(base.furniture * sizeMultiplier),
    lighting: Math.round(base.lighting * sizeMultiplier),
    decoration: Math.round(base.decoration * sizeMultiplier),
  }
}

// Floating Elements Component
function FloatingElements() {
  const elements = [
    { Icon: Sparkles, x: '10%', y: '20%', delay: 0, size: 20 },
    { Icon: Heart, x: '85%', y: '15%', delay: 1, size: 16 },
    { Icon: Sparkles, x: '70%', y: '70%', delay: 2, size: 18 },
    { Icon: Heart, x: '20%', y: '60%', delay: 0.5, size: 14 },
    { Icon: Sparkles, x: '90%', y: '50%', delay: 1.5, size: 12 },
    { Icon: Heart, x: '15%', y: '80%', delay: 2.5, size: 16 },
    { Icon: Sparkles, x: '50%', y: '10%', delay: 3, size: 22 },
    { Icon: Heart, x: '30%', y: '30%', delay: 0.8, size: 10 },
  ]

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-300/40"
          style={{ left: el.x, top: el.y }}
          animate={{ y: [0, -30, 0], rotate: [0, 10, -10, 0], scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, delay: el.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <el.Icon size={el.size} fill="currentColor" />
        </motion.div>
      ))}
      <motion.div
        className="absolute w-96 h-96 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #f9a8d4 0%, transparent 70%)', left: '-10%', top: '20%' }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-80 h-80 rounded-full opacity-15"
        style={{ background: 'radial-gradient(circle, #f472b6 0%, transparent 70%)', right: '-5%', bottom: '10%' }}
        animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
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
function RoomUpload({ onUpload }: { onUpload: (image: string, roomType: RoomType, roomSize: RoomSize) => void }) {
  const [selectedRoom, setSelectedRoom] = useState<RoomType>('bedroom')
  const [selectedSize, setSelectedSize] = useState<RoomSize>('medium')
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
          <p className="text-gray-500 text-lg">Select your room type, size, and upload an image</p>
        </motion.div>

        {/* Room Type Selection */}
        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <label className="block text-sm font-medium text-gray-600 mb-3 text-center">Select Room Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roomTypes.map((room) => {
              const Icon = room.icon
              return (
                <motion.button key={room.id} onClick={() => setSelectedRoom(room.id)} className={`style-card glass-card rounded-2xl p-4 flex items-center gap-4 ${selectedRoom === room.id ? 'selected' : ''}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
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

        {/* Room Size Selection */}
        <motion.div className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <label className="block text-sm font-medium text-gray-600 mb-3 text-center">
            <Maximize className="w-4 h-4 inline mr-1" />
            Select Room Size
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {roomSizes.map((size) => (
              <motion.button key={size.id} onClick={() => setSelectedSize(size.id)} className={`style-card glass-card rounded-2xl p-4 text-left ${selectedSize === size.id ? 'selected' : ''}`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-800">{size.label}</span>
                  {selectedSize === size.id && <Check className="w-5 h-5 text-pink-500" />}
                </div>
                <span className="text-gray-500 text-sm">{size.description}</span>
              </motion.button>
            ))}
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
                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="px-3 py-1.5 rounded-full glass-button text-sm font-medium text-gray-700">
                    {roomTypes.find(r => r.id === selectedRoom)?.label}
                  </span>
                  <span className="px-3 py-1.5 rounded-full glass-button text-sm font-medium text-gray-700">
                    {roomSizes.find(s => s.id === selectedSize)?.label}
                  </span>
                </div>
              </div>
              <div className="p-6 text-center">
                <motion.button onClick={() => onUpload(image, selectedRoom, selectedSize)} className="btn-primary text-lg px-10 py-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
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

  const handleGenerate = () => {
    setIsGenerating(true)
    setStage(0)
    setGenerated('')

    const interval = setInterval(() => {
      setStage(s => {
        if (s >= 3) { clearInterval(interval); return s }
        return s + 1
      })
    }, 1500)

    setTimeout(() => {
      // Get the style-matched transformation that preserves the room type layout
      const resultImage = transformedRooms[style][roomType]
      setIsGenerating(false)
      setGenerated(resultImage)
      onComplete(style, resultImage)
    }, 6000)
  }

  return (
    <div className="min-h-screen px-6 py-12 pt-24">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-3">AI Room <span className="gradient-text">Makeover</span></h2>
          <p className="text-gray-500 text-lg">Choose your design style - we'll preserve your room's layout</p>
        </motion.div>

        <motion.div className="mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {designStyles.map((s) => {
              const Icon = s.icon
              return (
                <motion.button key={s.id} onClick={() => !isGenerating && setStyle(s.id)} disabled={isGenerating} className={`style-card glass-card rounded-2xl p-5 text-left ${style === s.id ? 'selected' : ''} ${isGenerating ? 'opacity-60' : ''}`} whileHover={!isGenerating ? { scale: 1.02 } : undefined}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-md`}>
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <h4 className="font-semibold text-gray-800">{s.label}</h4>
                  <p className="text-gray-500 text-sm">{s.description}</p>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div key="loading" className="glass-card rounded-3xl p-12 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center shadow-2xl" animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Wand2 className="w-16 h-16 text-white" />
              </motion.div>
              <div className="max-w-md mx-auto space-y-4">
                {loadingStages.map((s, i) => (
                  <motion.div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${i <= stage ? 'bg-pink-50' : 'bg-gray-50 opacity-50'}`} animate={i === stage ? { x: [0, 5, 0] } : {}}>
                    <span className="text-2xl">{s.icon}</span>
                    <span className={`font-medium ${i <= stage ? 'text-pink-600' : 'text-gray-400'}`}>{s.text}</span>
                    {i < stage && <Check className="w-5 h-5 text-pink-500 ml-auto" />}
                  </motion.div>
                ))}
              </div>
              <div className="mt-8 w-full max-w-md mx-auto h-2 bg-pink-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-gradient-to-r from-pink-400 to-pink-500 rounded-full" initial={{ width: '0%' }} animate={{ width: `${((stage + 1) / 4) * 100}%` }} />
              </div>
            </motion.div>
          ) : generated ? (
            <motion.div key="results" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="grid md:grid-cols-2 gap-6">
                {[{ label: 'Before', img: image }, { label: `After - ${designStyles.find(s => s.id === style)?.label}`, img: generated }].map((item, i) => (
                  <motion.div key={i} className="glass-card rounded-3xl overflow-hidden" initial={{ opacity: 0, x: i === 0 ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} style={i === 1 ? { boxShadow: '0 20px 60px rgba(244, 114, 182, 0.2)' } : {}}>
                    <div className={`p-4 ${i === 0 ? 'bg-gray-50/50' : 'bg-gradient-to-r from-pink-50 to-pink-100/50'} border-b border-pink-100`}>
                      <span className={`inline-flex items-center gap-2 text-sm font-medium ${i === 0 ? 'text-gray-600' : 'text-pink-600'}`}>
                        {i === 1 && <Sparkles className="w-4 h-4" />}
                        {item.label}
                      </span>
                    </div>
                    <div className="p-3">
                      <img src={item.img} alt={item.label} className="w-full h-64 md:h-80 object-cover rounded-2xl" />
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div className="mt-8 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-card text-pink-600 font-medium">
                  <Sparkles className="w-5 h-5" /> Your dream room is ready!
                </span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="generate" className="glass-card rounded-3xl p-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <img src={image} alt="Preview" className="w-64 h-48 object-cover rounded-2xl mx-auto shadow-lg mb-8" />
              <motion.button onClick={handleGenerate} className="btn-primary inline-flex items-center gap-3 text-lg px-12 py-5" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Wand2 className="w-5 h-5" /> Generate AI Makeover <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Budget Estimator Component
function BudgetEstimator({ style, roomSize }: { style: DesignStyle; roomSize: RoomSize }) {
  const budget = calculateBudget(style, roomSize)
  const total = budget.paint + budget.furniture + budget.lighting + budget.decoration
  const sizeLabel = roomSizes.find(s => s.id === roomSize)?.label || 'Medium'

  return (
    <div className="min-h-screen px-6 py-12 pt-24">
      <div className="max-w-5xl mx-auto">
        <motion.div className="text-center mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-3">Budget <span className="gradient-text">Estimator</span></h2>
          <p className="text-gray-500 text-lg">Estimated costs for your {style} {sizeLabel.toLowerCase()} room makeover</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {budgetCategories.map((cat, i) => {
            const Icon = cat.icon
            const amount = budget[cat.id]
            const maxBudget = Math.max(...Object.values(calculateBudget('luxury', 'large')))
            return (
              <motion.div key={cat.id} className="glass-card rounded-3xl p-6 card-hover" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-md`}>
                    <Icon className="w-7 h-7 text-gray-700" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm">{cat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">₹{amount.toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div className={`h-full rounded-full bg-gradient-to-r ${cat.color}`} initial={{ width: 0 }} animate={{ width: `${(amount / maxBudget) * 100}%` }} transition={{ delay: 0.3 + i * 0.1 }} />
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
            <div className="flex items-center justify-center mb-4">
              <span className="text-5xl text-pink-500 mr-2">₹</span>
              <motion.p className="text-6xl md:text-7xl font-bold gradient-text" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ delay: 0.7, type: 'spring' }}>
                {total.toLocaleString('en-IN')}
              </motion.p>
            </div>
            <p className="text-gray-500 text-sm">Based on {sizeLabel} room size and {style} design style</p>
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
    // Open Amazon India search for the style
    const searchTerms = {
      minimal: 'minimalist furniture modern simple white',
      luxury: 'luxury furniture premium velvet gold',
      modern: 'modern furniture contemporary geometric',
      gaming: 'gaming furniture RGB led desk chair'
    }
    window.open(`https://www.amazon.in/s?k=${encodeURIComponent(searchTerms[style])}`, '_blank')
  }

  return (
    <div className="min-h-screen px-6 py-12 pt-24">
      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gray-800 mb-3">Smart Furniture <span className="gradient-text">Recommendations</span></h2>
          <p className="text-gray-500 text-lg">Curated products for your {style} style from Amazon India</p>
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
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 text-pink-600 font-semibold text-sm">₹{item.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-5">
                <h4 className="font-semibold text-gray-800 mb-1">{item.name}</h4>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                <motion.button onClick={() => handleViewDetails(item)} className="w-full py-2.5 rounded-xl bg-pink-50 text-pink-600 font-medium text-sm flex items-center justify-center gap-2 hover:bg-pink-100 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <ShoppingBag className="w-4 h-4" /> Buy on Amazon
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
              ₹{total.toLocaleString('en-IN')}
            </motion.p>
            <p className="text-white/80 text-sm mb-6">Get everything you need for your {style} room transformation</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button onClick={handleShopAll} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-pink-500 font-semibold hover:bg-pink-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <ShoppingBag className="w-5 h-5" /> Shop All on Amazon <ExternalLink className="w-4 h-4" />
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
  const [roomSize, setRoomSize] = useState<RoomSize>('medium')
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
    setRoomSize('medium')
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
          {step === 'upload' && <RoomUpload key="upload" onUpload={(img, type, size) => { setImage(img); setRoomType(type); setRoomSize(size); setStep('makeover') }} />}
          {step === 'makeover' && <RoomMakeover key="makeover" image={image} roomType={roomType} onComplete={(s, gen) => { setStyle(s); setGeneratedImage(gen) }} />}
          {step === 'budget' && <BudgetEstimator key="budget" style={style} roomSize={roomSize} />}
          {step === 'furniture' && <FurnitureRecommendations key="furniture" style={style} onRestart={handleRestart} />}
        </AnimatePresence>
      </main>

      <footer className="py-8 text-center text-gray-400 text-sm">
        <p>Made with love by RoomAI</p>
      </footer>
    </div>
  )
}
