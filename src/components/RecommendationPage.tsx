import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  Clock, 
  Users, 
  Navigation2, 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  ArrowUpRight, 
  X,
  Compass,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  Award
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  crowdLevel: 'Low' | 'Moderate' | 'High';
  popularity: 'Trending' | 'Popular' | 'Hidden Gem';
  distance: number; // in km
  travelTime: number; // in minutes
  category: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export function RecommendationPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ city: string; country: string } | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [showCustomLocationModal, setShowCustomLocationModal] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Parallax effect for background
  const backgroundX = useTransform(mouseX, [0, window.innerWidth], [-20, 20]);
  const backgroundY = useTransform(mouseY, [0, window.innerHeight], [-20, 20]);

  useEffect(() => {
    // Track mouse movement for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Simulate fetching user location
    setTimeout(() => {
      setUserLocation({
        city: 'San Francisco',
        country: 'USA'
      });
    }, 1000);
    
    // Simulate loading places data
    setTimeout(() => {
      const mockPlaces: Place[] = [
        {
          id: '1',
          name: 'Golden Gate Bridge',
          description: 'Iconic suspension bridge with stunning views of the bay and city skyline.',
          image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          rating: 4.8,
          reviews: 12453,
          crowdLevel: 'High',
          popularity: 'Trending',
          distance: 3.2,
          travelTime: 15,
          category: 'Landmark',
          coordinates: { lat: 37.8199, lng: -122.4783 }
        },
        {
          id: '2',
          name: 'Alcatraz Island',
          description: 'Historic federal prison on an island with guided tours and bay views.',
          image: 'https://images.unsplash.com/photo-1541943869728-4bd4f450c8f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          rating: 4.7,
          reviews: 8932,
          crowdLevel: 'Moderate',
          popularity: 'Popular',
          distance: 5.8,
          travelTime: 45,
          category: 'Historic Site',
          coordinates: { lat: 37.8270, lng: -122.4230 }
        },
        {
          id: '3',
          name: 'Fisherman\'s Wharf',
          description: 'Bustling waterfront area with seafood restaurants, shops, and sea lion sightings.',
          image: 'https://images.unsplash.com/photo-1569931727733-63f6f8a0e47b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          rating: 4.5,
          reviews: 10287,
          crowdLevel: 'High',
          popularity: 'Trending',
          distance: 4.1,
          travelTime: 20,
          category: 'Entertainment',
          coordinates: { lat: 37.8080, lng: -122.4177 }
        },
        {
          id: '4',
          name: 'Twin Peaks',
          description: 'Iconic hills offering panoramic views of the city and bay area.',
          image: 'https://images.unsplash.com/photo-1521464302861-ce943915d1c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          rating: 4.6,
          reviews: 5621,
          crowdLevel: 'Low',
          popularity: 'Hidden Gem',
          distance: 6.3,
          travelTime: 25,
          category: 'Nature',
          coordinates: { lat: 37.7544, lng: -122.4477 }
        },
        {
          id: '5',
          name: 'Palace of Fine Arts',
          description: 'Monumental structure with a classical European-inspired dome and colonnades.',
          image: 'https://images.unsplash.com/photo-1549346155-7b5c55586122?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          rating: 4.7,
          reviews: 7845,
          crowdLevel: 'Moderate',
          popularity: 'Popular',
          distance: 3.9,
          travelTime: 18,
          category: 'Architecture',
          coordinates: { lat: 37.8029, lng: -122.4484 }
        },
        {
          id: '6',
          name: 'Muir Woods',
          description: 'Ancient coastal redwood forest with hiking trails and towering trees.',
          image: 'https://images.unsplash.com/photo-1547531455-c20b677ded4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          rating: 4.9,
          reviews: 6234,
          crowdLevel: 'Moderate',
          popularity: 'Hidden Gem',
          distance: 16.8,
          travelTime: 45,
          category: 'Nature',
          coordinates: { lat: 37.8912, lng: -122.5719 }
        }
      ];
      
      setPlaces(mockPlaces);
      setFilteredPlaces(mockPlaces);
      setIsLoading(false);
    }, 2000);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    // Apply sorting when sortBy changes
    if (places.length > 0) {
      let sorted = [...places];
      
      switch (sortBy) {
        case 'crowd':
          sorted = sorted.sort((a, b) => {
            const crowdOrder = { 'Low': 0, 'Moderate': 1, 'High': 2 };
            return crowdOrder[a.crowdLevel] - crowdOrder[b.crowdLevel];
          });
          break;
        case 'popularity':
          sorted = sorted.sort((a, b) => {
            const popularityOrder = { 'Trending': 0, 'Popular': 1, 'Hidden Gem': 2 };
            return popularityOrder[a.popularity] - popularityOrder[b.popularity];
          });
          break;
        case 'nearest':
          sorted = sorted.sort((a, b) => a.distance - b.distance);
          break;
        case 'fastest':
          sorted = sorted.sort((a, b) => a.travelTime - b.travelTime);
          break;
        default:
          break;
      }
      
      setFilteredPlaces(sorted);
    }
  }, [sortBy, places]);

  const handleSortChange = (option: string) => {
    setSortBy(option);
    setShowSortDropdown(false);
  };

  const handleCustomLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomLocation(value);
    
    if (value.length > 2) {
      // Simulate location suggestions
      const suggestions = [
        `${value} Park, San Francisco`,
        `${value} Street, Oakland`,
        `${value} Avenue, San Jose`,
        `${value} Plaza, Palo Alto`
      ];
      setLocationSuggestions(suggestions);
    } else {
      setLocationSuggestions([]);
    }
  };

  const handleLocationSelect = (location: string) => {
    setCustomLocation(location);
    setLocationSuggestions([]);
    
    // Simulate loading with new location
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowCustomLocationModal(false);
      
      // Update user location display
      const [place, city] = location.split(', ');
      setUserLocation({
        city: city,
        country: 'USA'
      });
    }, 1500);
  };

  const handleCardClick = (placeId: string) => {
    // Navigate to place details page
    navigate(`/place/${placeId}`);
  };

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-600/80 text-white';
      case 'Moderate': return 'bg-yellow-400/80 text-white';
      case 'High': return 'bg-red-500/80 text-white';
      default: return 'bg-blue-500/50 text-white';
    }
  };

  const getPopularityIcon = (popularity: string) => {
    switch (popularity) {
      case 'Trending': return <TrendingUp className="w-4 h-4" />;
      case 'Popular': return <ThumbsUp className="w-4 h-4" />;
      case 'Hidden Gem': return <Sparkles className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 overflow-hidden relative">
      {/* Animated background elements */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{ x: backgroundX, y: backgroundY }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full filter blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/30 rounded-full filter blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
      </motion.div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center">
          <Compass className="w-8 h-8 text-blue-400 mr-2" />
          <h1 className="text-2xl font-bold text-white">GeoGuide AI</h1>
        </div>
        <button
          onClick={() => navigate('/map')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
        >
          Explore Map
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-12 pb-8 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="relative inline-block">
              Top Places Near You
              <motion.span 
                className="absolute -inset-1 rounded-lg opacity-50 blur-xl"
                animate={{ 
                  background: [
                    "linear-gradient(90deg, rgba(59,130,246,0.5) 0%, rgba(147,51,234,0.5) 100%)",
                    "linear-gradient(180deg, rgba(59,130,246,0.5) 0%, rgba(147,51,234,0.5) 100%)",
                    "linear-gradient(270deg, rgba(59,130,246,0.5) 0%, rgba(147,51,234,0.5) 100%)",
                    "linear-gradient(0deg, rgba(59,130,246,0.5) 0%, rgba(147,51,234,0.5) 100%)",
                    "linear-gradient(90deg, rgba(59,130,246,0.5) 0%, rgba(147,51,234,0.5) 100%)"
                  ]
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {isLoading ? (
              <span className="inline-flex items-center">
                <span>Discovering amazing places</span>
                <motion.span 
                  className="inline-flex ml-2"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ...
                </motion.span>
              </span>
            ) : (
              <span>
                Discover the best experiences in{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 font-semibold">
                  {userLocation?.city}, {userLocation?.country}
                </span>
              </span>
            )}
          </motion.p>
        </motion.div>

        {/* Filter and Custom Location Controls */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCustomLocationModal(true)}
              className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-medium flex items-center space-x-2 hover:bg-white/20 transition-all duration-300"
            >
              <MapPin className="w-5 h-5 text-blue-400" />
              <span>Custom Location</span>
            </motion.button>
          </div>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-medium flex items-center space-x-2 hover:bg-white/20 transition-all duration-300"
            >
              <SlidersHorizontal className="w-5 h-5 text-purple-400" />
              <span>Sort By: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSortDropdown ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden z-50 shadow-xl"
                >
                  <div className="py-1">
                    {[
                      { id: 'crowd', label: 'Least Crowded', icon: Users },
                      { id: 'popularity', label: 'Most Popular', icon: TrendingUp },
                      { id: 'nearest', label: 'Nearest First', icon: Navigation2 },
                      { id: 'fastest', label: 'Quickest Travel', icon: Clock }
                    ].map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        onClick={() => handleSortChange(option.id)}
                        className={`w-full px-4 py-2 text-left flex items-center space-x-2 ${
                          sortBy === option.id ? 'bg-white/10 text-blue-400' : 'text-white'
                        }`}
                      >
                        <option.icon className="w-4 h-4" />
                        <span>{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Place Cards */}
        <div ref={containerRef} className="relative">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden h-96 animate-pulse"
                >
                  <div className="h-48 bg-white/10" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-white/10 rounded-md w-3/4" />
                    <div className="h-4 bg-white/10 rounded-md w-full" />
                    <div className="h-4 bg-white/10 rounded-md w-2/3" />
                    <div className="flex space-x-2">
                      <div className="h-8 bg-white/10 rounded-full w-20" />
                      <div className="h-8 bg-white/10 rounded-full w-20" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <AnimatePresence>
                {filteredPlaces.map((place, index) => (
                  <motion.div
                    key={place.id}
                    layoutId={`place-${place.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1 }
                    }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ 
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    className="relative group"
                    onMouseEnter={() => setActiveCardIndex(index)}
                    onMouseLeave={() => setActiveCardIndex(null)}
                  >
                    <motion.div 
                      className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-70 blur-md transition-opacity duration-300"
                      animate={{ 
                        opacity: activeCardIndex === index ? 0.7 : 0
                      }}
                    />
                    <motion.div
                      className="relative bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden h-full"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={place.image} 
                          alt={place.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                        
                        <div className="absolute top-4 left-4 flex space-x-2">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getCrowdLevelColor(place.crowdLevel)}`}>
                            <Users className="w-3 h-3" />
                            <span>{place.crowdLevel}</span>
                          </div>
                          <div className="px-3 py-1 bg-purple-500/50 rounded-full text-xs font-medium text-white flex items-center space-x-1">
                            {getPopularityIcon(place.popularity)}
                            <span>{place.popularity}</span>
                          </div>
                        </div>
                        
                        <div className="absolute bottom-4 right-4">
                          <div className="flex items-center space-x-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                            <Star className="w-3 h-3 text-yellow-400" fill="#facc15" />
                            <span className="text-white text-xs font-medium">{place.rating}</span>
                            <span className="text-white/60 text-xs">({place.reviews.toLocaleString()})</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                          {place.name}
                        </h3>
                        <p className="text-white/70 text-sm mb-4 line-clamp-2">{place.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1 text-white/80 text-sm">
                              <Navigation2 className="w-4 h-4 text-blue-400" />
                              <span>{place.distance} km</span>
                            </div>
                            <div className="flex items-center space-x-1 text-white/80 text-sm">
                              <Clock className="w-4 h-4 text-purple-400" />
                              <span>{place.travelTime} min</span>
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleCardClick(place.id)}
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          >
                            <ArrowUpRight className="w-5 h-5 text-white" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Custom Location Modal */}
      <AnimatePresence>
        {showCustomLocationModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
              onClick={() => setShowCustomLocationModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-md bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden z-[1100] shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">Set Custom Location</h2>
                  </div>
                  <button
                    onClick={() => setShowCustomLocationModal(false)}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="relative mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      value={customLocation}
                      onChange={handleCustomLocationChange}
                      placeholder="Enter a location..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-5 py-4 pl-12 text-white placeholder-white/50 focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    />
                  </div>

                  <AnimatePresence>
                    {locationSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden shadow-lg z-10"
                      >
                        {locationSuggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            className="w-full px-4 py-3 text-left hover:bg-white/10 transition-all duration-200 border-b border-white/10 last:border-none"
                            onClick={() => handleLocationSelect(suggestion)}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <p className="font-medium text-white">{suggestion}</p>
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCustomLocationModal(false)}
                    className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white font-medium transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (customLocation) {
                        handleLocationSelect(customLocation);
                      }
                    }}
                    disabled={!customLocation}
                    className={`flex-1 py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                      customLocation ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500' : 'bg-white/10 cursor-not-allowed'
                    }`}
                  >
                    <span>Search</span>
                    <Search className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer with subtle gradient */}
      <footer className="relative z-10 mt-12 py-6 bg-gradient-to-t from-black/40 to-transparent">
        <div className="container mx-auto px-6 text-center">
          <p className="text-white/50 text-sm">© 2025 GeoGuide AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}