import { RequestHandler } from "express";
import { Plant, PlantsResponse, PlantResponse, PlantFilters } from "@shared/api";

// In-memory plant data store (in production, this would be a database)
let plants: Plant[] = [
  // Exotic Vegetables (10 items)
  {
    id: "caribbean-red-habanero",
    name: "Caribbean Red Habanero Pepper",
    description: "Extremely hot chili pepper with fruity flavor. Perfect for hot sauce makers and spice enthusiasts. Heat level: 100,000-350,000 Scoville units.",
    price: 899,
    originalPrice: 1199,
    category: "outdoor",
    images: [
      "https://images.pexels.com/photos/4590486/pexels-photo-4590486.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 25,
    features: ["Extremely hot", "Fruity flavor", "Perfect for sauces"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Medium",
    petFriendly: false,
    lowMaintenance: false,
    rating: 4.8,
    reviewCount: 156,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "red-okra-scarlet",
    name: "Okra Bhindi Scarlet Red (Red Okra)",
    description: "Stunning red variety of okra with vibrant scarlet pods. Not only beautiful but delicious. Rich in vitamins and antioxidants.",
    price: 549,
    originalPrice: 699,
    category: "outdoor",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 30,
    features: ["Vibrant red color", "Rich in vitamins", "Ornamental value"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.6,
    reviewCount: 89,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "gold-current-cherry-tomato",
    name: "Gold Current Cherry Tomato",
    description: "Tiny golden tomatoes with intense sweet flavor. Perfect for salads and garnishing. Prolific producer with grape-like clusters.",
    price: 449,
    originalPrice: 599,
    category: "outdoor",
    images: [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 40,
    features: ["Tiny golden fruits", "Intense sweetness", "High yield"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.7,
    reviewCount: 203,
    featured: false,
    trending: true,
    new: false
  },
  {
    id: "imported-brussel-sprouts",
    name: "Imported Brussel Sprouts",
    description: "Premium European variety of Brussels sprouts. Cold-hardy and produces sweet, nutty sprouts perfect for roasting.",
    price: 699,
    originalPrice: 899,
    category: "outdoor",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 20,
    features: ["European variety", "Cold hardy", "Sweet nutty flavor"],
    careLevel: "Medium",
    sunlight: "Medium",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.5,
    reviewCount: 134,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "tomato-yellow-pear",
    name: "Tomato S Yellow Pear",
    description: "Unique pear-shaped yellow tomatoes with mild, sweet flavor. Perfect for snacking and salads. Heirloom variety.",
    price: 399,
    originalPrice: 549,
    category: "outdoor",
    images: [
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 35,
    features: ["Pear shaped", "Mild sweet flavor", "Heirloom variety"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.6,
    reviewCount: 167,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "asparagus-mary",
    name: "Asparagus Mary",
    description: "Premium variety of asparagus with thick, tender spears. Perennial vegetable that produces for many years. Rich in nutrients.",
    price: 799,
    originalPrice: 999,
    category: "outdoor",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 15,
    features: ["Thick tender spears", "Perennial crop", "Nutrient rich"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.8,
    reviewCount: 98,
    featured: true,
    trending: false,
    new: false
  },
  {
    id: "purple-cauliflower-sicilia",
    name: "Cauliflower Di Sicilia Violetto (Purple Cauliflower)",
    description: "Stunning purple cauliflower from Sicily. Rich in anthocyanins and antioxidants. Beautiful addition to any garden or plate.",
    price: 649,
    originalPrice: 849,
    category: "outdoor",
    images: [
      "https://images.pexels.com/photos/7456541/pexels-photo-7456541.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 18,
    features: ["Purple color", "Rich in antioxidants", "Sicilian variety"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.7,
    reviewCount: 145,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "black-carrot-wonder",
    name: "Carrot Black Wonder (Black Carrot)",
    description: "Unique black-purple carrots with sweet flavor. High in anthocyanins and antioxidants. Perfect for gourmet cooking.",
    price: 549,
    originalPrice: 699,
    category: "outdoor",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 25,
    features: ["Black-purple color", "High antioxidants", "Sweet flavor"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.6,
    reviewCount: 112,
    featured: false,
    trending: true,
    new: false
  },
  {
    id: "purple-climbing-beans",
    name: "Climbing Beans Violette (Purple Beans)",
    description: "Beautiful purple climbing beans with excellent flavor. Stunning in the garden and delicious on the plate. Vigorous climber.",
    price: 449,
    originalPrice: 599,
    category: "outdoor",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 30,
    features: ["Purple color", "Climbing variety", "Excellent flavor"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.5,
    reviewCount: 89,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "rainbow-multicolor-corn",
    name: "Rainbow Corn (Multicolor Corn)",
    description: "Spectacular multicolored corn with kernels in rainbow hues. Perfect for decoration and grinding. Native American heirloom variety.",
    price: 699,
    originalPrice: 899,
    category: "outdoor",
    images: [
      "https://images.pexels.com/photos/12118914/pexels-photo-12118914.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 22,
    features: ["Rainbow colors", "Heirloom variety", "Decorative"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.8,
    reviewCount: 234,
    featured: true,
    trending: true,
    new: true
  },

  // Exotic Flowers (10 items)
  {
    id: "lotus-sacred",
    name: "Lotus",
    description: "Sacred lotus with magnificent pink blooms. Symbol of purity and enlightenment. Perfect for water gardens and ponds.",
    price: 1299,
    originalPrice: 1599,
    category: "flowering",
    images: [
      "https://images.pexels.com/photos/1179859/pexels-photo-1179859.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 12,
    features: ["Sacred flower", "Water garden", "Symbol of purity"],
    careLevel: "Hard",
    sunlight: "High",
    watering: "High",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.9,
    reviewCount: 89,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "zinnia-double-scarlet",
    name: "Zinnia Double Scarlet Mixed (Imported Hybrid)",
    description: "Premium imported hybrid zinnias with full double blooms in vibrant scarlet tones. Long-lasting cut flowers.",
    price: 349,
    originalPrice: 449,
    category: "flowering",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 45,
    features: ["Double blooms", "Imported hybrid", "Cut flowers"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.7,
    reviewCount: 156,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "pansy-viola-mixed-f1",
    name: "Pansy Viola Mixed F1",
    description: "Premium F1 hybrid pansies with face-like flowers in mixed colors. Cool weather champions with excellent garden performance.",
    price: 299,
    originalPrice: 399,
    category: "flowering",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 60,
    features: ["F1 hybrid", "Face-like flowers", "Cool weather"],
    careLevel: "Easy",
    sunlight: "Medium",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.6,
    reviewCount: 234,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "portulaca-rainbow-mixed",
    name: "Portulaca Rainbow Mixed (Imported Multicolor)",
    description: "Stunning imported portulaca with rainbow-colored blooms. Drought-tolerant succulent flowers perfect for hot, sunny areas.",
    price: 249,
    originalPrice: 349,
    category: "flowering",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 50,
    features: ["Rainbow colors", "Drought tolerant", "Succulent flowers"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.5,
    reviewCount: 178,
    featured: false,
    trending: true,
    new: false
  },
  {
    id: "dahlia-mixed-hybrid",
    name: "Dahlia Mixed (Hybrid Mix)",
    description: "Premium hybrid dahlia mix with large, colorful blooms. Perfect for cutting gardens and late summer color.",
    price: 799,
    originalPrice: 999,
    category: "flowering",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 25,
    features: ["Large blooms", "Hybrid variety", "Cut flowers"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.8,
    reviewCount: 123,
    featured: true,
    trending: false,
    new: false
  },
  {
    id: "marigold-basanti-big-bloom",
    name: "Marigold Basanti Big Bloom Mixed (Exotic Hybrid Variety)",
    description: "Exotic hybrid marigold with exceptionally large blooms. Vibrant colors and strong fragrance. Excellent pest deterrent.",
    price: 199,
    originalPrice: 299,
    category: "flowering",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 70,
    features: ["Big blooms", "Exotic hybrid", "Pest deterrent"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.6,
    reviewCount: 289,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "vinca-rosea-mixed-hybrid",
    name: "Vinca Rosea Mixed Hybrid",
    description: "Heat-tolerant hybrid vinca with continuous blooms. Perfect for hot, humid climates. Mixed colors including white, pink, and purple.",
    price: 229,
    originalPrice: 329,
    category: "flowering",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 55,
    features: ["Heat tolerant", "Continuous blooms", "Mixed colors"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: false,
    lowMaintenance: true,
    rating: 4.5,
    reviewCount: 145,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "verbena-mixed",
    name: "Verbena Mixed",
    description: "Fragrant verbena flowers in mixed colors. Perfect for borders, containers, and attracting butterflies. Long blooming period.",
    price: 279,
    originalPrice: 379,
    category: "flowering",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 40,
    features: ["Fragrant", "Butterfly magnet", "Long blooming"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.6,
    reviewCount: 167,
    featured: false,
    trending: true,
    new: false
  },
  {
    id: "petunia-grandiflora-mixed",
    name: "Petunia Grandiflora Mixed",
    description: "Large-flowered petunia variety with trumpet-shaped blooms. Perfect for hanging baskets and containers. Vigorous grower.",
    price: 319,
    originalPrice: 419,
    category: "flowering",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 48,
    features: ["Large flowers", "Trumpet shaped", "Hanging baskets"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.7,
    reviewCount: 198,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "carnation-giant-chabaud",
    name: "Carnation Giant Chabaud Mixed",
    description: "Premium giant carnations with ruffled, fragrant blooms. Excellent cut flowers with long stems. Classic cottage garden favorite.",
    price: 549,
    originalPrice: 699,
    category: "flowering",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 32,
    features: ["Giant blooms", "Fragrant", "Cut flowers"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.8,
    reviewCount: 112,
    featured: true,
    trending: false,
    new: false
  },

  // Indoor Rare Plants (12 items)
  {
    id: "monstera-deliciosa-swiss",
    name: "Monstera Deliciosa (Swiss Cheese Plant)",
    description: "The iconic Swiss cheese plant with stunning fenestrated leaves. A must-have for any plant collector. Air-purifying qualities.",
    price: 1299,
    originalPrice: 1599,
    category: "indoor",
    images: [
      "https://images.pexels.com/photos/7013116/pexels-photo-7013116.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 18,
    features: ["Fenestrated leaves", "Air purifying", "Instagram famous"],
    careLevel: "Easy",
    sunlight: "Medium",
    watering: "Medium",
    petFriendly: false,
    lowMaintenance: true,
    rating: 4.9,
    reviewCount: 456,
    featured: true,
    trending: true,
    new: false
  },
  {
    id: "philodendron-birkin",
    name: "Philodendron Birkin",
    description: "Rare variegated philodendron with striking white pinstripe patterns. Self-heading variety that maintains compact growth.",
    price: 1899,
    originalPrice: 2399,
    category: "indoor",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 12,
    features: ["White pinstripes", "Self-heading", "Rare variety"],
    careLevel: "Medium",
    sunlight: "Medium",
    watering: "Medium",
    petFriendly: false,
    lowMaintenance: false,
    rating: 4.8,
    reviewCount: 89,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "calathea-orbifolia",
    name: "Calathea Orbifolia",
    description: "Stunning prayer plant with large, round leaves featuring silver stripes. Known for its dramatic leaf movement throughout the day.",
    price: 1499,
    originalPrice: 1899,
    category: "indoor",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 15,
    features: ["Large round leaves", "Silver stripes", "Prayer plant"],
    careLevel: "Hard",
    sunlight: "Low",
    watering: "High",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.7,
    reviewCount: 134,
    featured: false,
    trending: true,
    new: false
  },
  {
    id: "anthurium-crystallinum",
    name: "Anthurium Crystallinum",
    description: "Velvety heart-shaped leaves with prominent white veins. One of the most sought-after anthuriums. Stunning foliage plant.",
    price: 2299,
    originalPrice: 2899,
    category: "indoor",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 8,
    features: ["Velvety leaves", "White veins", "Highly sought after"],
    careLevel: "Hard",
    sunlight: "Low",
    watering: "High",
    petFriendly: false,
    lowMaintenance: false,
    rating: 4.9,
    reviewCount: 67,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "fiddle-leaf-fig-lyrata",
    name: "Fiddle Leaf Fig (Ficus Lyrata)",
    description: "The Instagram darling with large, violin-shaped leaves. Perfect statement plant for modern homes and offices.",
    price: 1799,
    originalPrice: 2199,
    category: "indoor",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 20,
    features: ["Violin-shaped leaves", "Statement plant", "Instagram famous"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Medium",
    petFriendly: false,
    lowMaintenance: false,
    rating: 4.6,
    reviewCount: 345,
    featured: true,
    trending: false,
    new: false
  },
  {
    id: "aglaonema-red-siam",
    name: "Aglaonema Red Siam",
    description: "Vibrant red and green foliage plant. Low-light tolerant and perfect for offices. Easy-care houseplant with striking colors.",
    price: 899,
    originalPrice: 1199,
    category: "indoor",
    images: [
      "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 25,
    features: ["Red and green", "Low light tolerant", "Office plant"],
    careLevel: "Easy",
    sunlight: "Low",
    watering: "Medium",
    petFriendly: false,
    lowMaintenance: true,
    rating: 4.7,
    reviewCount: 178,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "stromanthe-triostar",
    name: "Stromanthe Triostar",
    description: "Stunning tricolor foliage with green, white, and pink markings. Purple undersides add dramatic contrast. Prayer plant family.",
    price: 1299,
    originalPrice: 1699,
    category: "indoor",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 14,
    features: ["Tricolor foliage", "Purple undersides", "Prayer plant"],
    careLevel: "Hard",
    sunlight: "Medium",
    watering: "High",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.8,
    reviewCount: 98,
    featured: true,
    trending: true,
    new: false
  },
  {
    id: "alocasia-polly-african-mask",
    name: "Alocasia Polly (African Mask Plant)",
    description: "Dramatic arrowhead leaves with white veins. Also known as African Mask Plant. Perfect for creating tropical vibes indoors.",
    price: 1199,
    originalPrice: 1499,
    category: "indoor",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 16,
    features: ["Arrowhead leaves", "White veins", "Tropical vibes"],
    careLevel: "Medium",
    sunlight: "Medium",
    watering: "High",
    petFriendly: false,
    lowMaintenance: false,
    rating: 4.6,
    reviewCount: 156,
    featured: false,
    trending: true,
    new: false
  },
  {
    id: "snake-plant-whale-fin",
    name: "Snake Plant Whale Fin (Sansevieria Masoniana)",
    description: "Rare whale fin variety with large, paddle-shaped leaves. Extremely low maintenance and air purifying. Perfect statement piece.",
    price: 1599,
    originalPrice: 1999,
    category: "indoor",
    images: [
      "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 10,
    features: ["Whale fin shape", "Low maintenance", "Air purifying"],
    careLevel: "Easy",
    sunlight: "Low",
    watering: "Low",
    petFriendly: false,
    lowMaintenance: true,
    rating: 4.9,
    reviewCount: 123,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "zz-plant-raven-black",
    name: "ZZ Plant Raven Black",
    description: "Dramatic black variety of the popular ZZ plant. New growth emerges green and darkens to almost black. Ultra low maintenance.",
    price: 1399,
    originalPrice: 1799,
    category: "indoor",
    images: [
      "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 12,
    features: ["Black foliage", "Ultra low maintenance", "Dramatic"],
    careLevel: "Easy",
    sunlight: "Low",
    watering: "Low",
    petFriendly: false,
    lowMaintenance: true,
    rating: 4.8,
    reviewCount: 89,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "peace-lily-domino-variegated",
    name: "Peace Lily Domino (Variegated)",
    description: "Rare variegated peace lily with white and green striped leaves. Beautiful white flowers and excellent air purifier.",
    price: 1099,
    originalPrice: 1399,
    category: "indoor",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 18,
    features: ["Variegated leaves", "White flowers", "Air purifier"],
    careLevel: "Easy",
    sunlight: "Low",
    watering: "Medium",
    petFriendly: false,
    lowMaintenance: true,
    rating: 4.7,
    reviewCount: 145,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "rubber-plant-ruby-variegated",
    name: "Rubber Plant Ruby (Ficus Elastica Variegata)",
    description: "Stunning variegated rubber plant with pink, white, and green leaves. Red stems add extra visual interest. Rare variety.",
    price: 1799,
    originalPrice: 2299,
    category: "indoor",
    images: [
      "https://images.unsplash.com/photo-1572688484438-313a6e50c333?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1463154545680-d59320fd685d?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 9,
    features: ["Pink variegation", "Red stems", "Rare variety"],
    careLevel: "Medium",
    sunlight: "Medium",
    watering: "Medium",
    petFriendly: false,
    lowMaintenance: false,
    rating: 4.8,
    reviewCount: 67,
    featured: true,
    trending: true,
    new: true
  },

  // Succulents & Cacti (12 items)
  {
    id: "lithops-living-stones",
    name: "Lithops (Living Stones)",
    description: "Fascinating succulents that perfectly mimic stones. Masters of camouflage from South Africa. Unique flowering pattern.",
    price: 899,
    originalPrice: 1199,
    category: "succulents",
    images: [
      "https://images.pexels.com/photos/17923149/pexels-photo-17923149.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 20,
    features: ["Stone mimicry", "South African", "Unique flowering"],
    careLevel: "Hard",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.7,
    reviewCount: 156,
    featured: true,
    trending: true,
    new: false
  },
  {
    id: "haworthia-cooperi",
    name: "Haworthia Cooperi",
    description: "Translucent succulent with windowed leaves. Perfect for bright indirect light. Easy-care collector's favorite.",
    price: 649,
    originalPrice: 849,
    category: "succulents",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 35,
    features: ["Translucent leaves", "Windowed", "Easy care"],
    careLevel: "Easy",
    sunlight: "Medium",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.8,
    reviewCount: 234,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "echeveria-perle-von-nurnberg",
    name: "Echeveria 'Perle von Nurnberg'",
    description: "Stunning rosette succulent with purple and pink tones. Perfect for containers and succulent arrangements.",
    price: 549,
    originalPrice: 699,
    category: "succulents",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 40,
    features: ["Purple-pink tones", "Rosette form", "Container plant"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.6,
    reviewCount: 189,
    featured: false,
    trending: true,
    new: false
  },
  {
    id: "aloe-variegata-tiger",
    name: "Aloe Variegata (Tiger Aloe)",
    description: "Striking aloe with white striped patterns resembling tiger markings. Compact size perfect for windowsills.",
    price: 699,
    originalPrice: 899,
    category: "succulents",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 28,
    features: ["Tiger stripes", "Compact size", "Windowsill plant"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: false,
    lowMaintenance: true,
    rating: 4.7,
    reviewCount: 145,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "graptopetalum-paraguayense",
    name: "Graptopetalum Paraguayense (Ghost Plant)",
    description: "Ethereal succulent with silvery-gray rosettes. Easy to propagate and perfect for beginners. Trailing habit.",
    price: 399,
    originalPrice: 549,
    category: "succulents",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 45,
    features: ["Silvery-gray", "Easy propagation", "Trailing habit"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.5,
    reviewCount: 267,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "crassula-ovata-hobbit",
    name: "Crassula Ovata 'Hobbit' (Rare Jade)",
    description: "Rare variety of jade plant with tubular, finger-like leaves. Compact growth and unique appearance.",
    price: 799,
    originalPrice: 999,
    category: "succulents",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 22,
    features: ["Tubular leaves", "Rare variety", "Compact growth"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.8,
    reviewCount: 123,
    featured: true,
    trending: false,
    new: false
  },
  {
    id: "euphorbia-lactea-white-ghost",
    name: "Euphorbia Lactea 'White Ghost'",
    description: "Stunning white variegated euphorbia. Also known as Dragon Bones. Architectural form and striking appearance.",
    price: 1299,
    originalPrice: 1599,
    category: "succulents",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 15,
    features: ["White variegation", "Architectural form", "Dragon Bones"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Low",
    petFriendly: false,
    lowMaintenance: true,
    rating: 4.7,
    reviewCount: 89,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "pachyphytum-oviferum",
    name: "Pachyphytum Oviferum (Moonstone Plant)",
    description: "Plump succulent with powdery blue-gray leaves. Resembles moonstones. Perfect for rock gardens and containers.",
    price: 549,
    originalPrice: 699,
    category: "succulents",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 32,
    features: ["Moonstone appearance", "Powdery leaves", "Rock gardens"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.6,
    reviewCount: 156,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "astrophytum-asterias",
    name: "Astrophytum Asterias (Sand Dollar Cactus)",
    description: "Rare star-shaped cactus resembling a sand dollar. Slow-growing collector's item. Beautiful yellow flowers.",
    price: 1499,
    originalPrice: 1899,
    category: "succulents",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 8,
    features: ["Star shaped", "Sand dollar form", "Yellow flowers"],
    careLevel: "Hard",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.9,
    reviewCount: 67,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "kalanchoe-thyrsiflora",
    name: "Kalanchoe Thyrsiflora (Paddle Plant)",
    description: "Stunning succulent with large, flat paddle-shaped leaves. Edges turn red in bright light. Architectural beauty.",
    price: 749,
    originalPrice: 949,
    category: "succulents",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 25,
    features: ["Paddle shaped", "Red edges", "Architectural"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: false,
    lowMaintenance: true,
    rating: 4.7,
    reviewCount: 134,
    featured: false,
    trending: true,
    new: false
  },
  {
    id: "sedum-burrito",
    name: "Sedum Burrito (Burro's Tail)",
    description: "Trailing succulent with thick, bead-like leaves. Perfect for hanging baskets. Easy to propagate from fallen leaves.",
    price: 449,
    originalPrice: 599,
    category: "succulents",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 38,
    features: ["Trailing habit", "Bead-like leaves", "Hanging baskets"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.6,
    reviewCount: 198,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "opuntia-microdasys",
    name: "Opuntia Microdasys (Bunny Ear Cactus)",
    description: "Adorable cactus with flat, oval pads resembling bunny ears. Covered in golden glochids. Perfect for cactus gardens.",
    price: 599,
    originalPrice: 799,
    category: "succulents",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 30,
    features: ["Bunny ear shape", "Golden glochids", "Cactus garden"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: false,
    lowMaintenance: true,
    rating: 4.5,
    reviewCount: 167,
    featured: false,
    trending: false,
    new: false
  },

  // Bonsai Plants (14 items)
  {
    id: "ficus-retusa-bonsai",
    name: "Ficus Retusa Bonsai",
    description: "Classic beginner bonsai with small leaves and aerial roots. Very forgiving and adaptable to indoor conditions.",
    price: 1899,
    originalPrice: 2399,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1621963342665-f26eade1fa0c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 12,
    features: ["Beginner friendly", "Aerial roots", "Indoor suitable"],
    careLevel: "Medium",
    sunlight: "Medium",
    watering: "Medium",
    petFriendly: false,
    lowMaintenance: false,
    rating: 4.8,
    reviewCount: 145,
    featured: true,
    trending: false,
    new: false
  },
  {
    id: "fukien-tea-bonsai",
    name: "Fukien Tea Bonsai",
    description: "Elegant bonsai with small white flowers and tiny leaves. Perfect for intermediate bonsai enthusiasts.",
    price: 2299,
    originalPrice: 2899,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1621963342665-f26eade1fa0c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 8,
    features: ["White flowers", "Tiny leaves", "Intermediate level"],
    careLevel: "Hard",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.7,
    reviewCount: 89,
    featured: false,
    trending: true,
    new: false
  },
  {
    id: "chinese-elm-bonsai",
    name: "Chinese Elm Bonsai",
    description: "Hardy bonsai with small serrated leaves. Excellent for beginners and develops beautiful branching patterns.",
    price: 1699,
    originalPrice: 2199,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1621963342665-f26eade1fa0c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 15,
    features: ["Hardy variety", "Serrated leaves", "Beautiful branching"],
    careLevel: "Easy",
    sunlight: "Medium",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.6,
    reviewCount: 167,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "adenium-obesum-bonsai",
    name: "Adenium Obesum (Desert Rose Bonsai)",
    description: "Succulent bonsai with stunning pink flowers and swollen trunk. Perfect for dry conditions and bright light.",
    price: 2599,
    originalPrice: 3199,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 6,
    features: ["Pink flowers", "Swollen trunk", "Succulent bonsai"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Low",
    petFriendly: false,
    lowMaintenance: true,
    rating: 4.9,
    reviewCount: 78,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "bougainvillea-bonsai",
    name: "Bougainvillea Bonsai",
    description: "Vibrant flowering bonsai with colorful bracts. Excellent for creating stunning display pieces.",
    price: 1999,
    originalPrice: 2499,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 10,
    features: ["Colorful bracts", "Flowering bonsai", "Display piece"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.7,
    reviewCount: 123,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "juniper-bonsai",
    name: "Juniper Bonsai",
    description: "Traditional outdoor bonsai with needle-like foliage. Hardy and perfect for outdoor cultivation.",
    price: 1799,
    originalPrice: 2299,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1621963342665-f26eade1fa0c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 14,
    features: ["Needle foliage", "Outdoor bonsai", "Traditional"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.6,
    reviewCount: 145,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "jade-plant-bonsai",
    name: "Jade Plant Bonsai",
    description: "Succulent bonsai perfect for beginners. Thick trunk and fleshy leaves. Very low maintenance and forgiving.",
    price: 1299,
    originalPrice: 1699,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 18,
    features: ["Succulent bonsai", "Thick trunk", "Low maintenance"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.8,
    reviewCount: 198,
    featured: true,
    trending: false,
    new: false
  },
  {
    id: "schefflera-bonsai",
    name: "Schefflera Bonsai (Umbrella Tree)",
    description: "Indoor bonsai with distinctive umbrella-shaped leaves. Fast-growing and easy to train.",
    price: 1599,
    originalPrice: 1999,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1621963342665-f26eade1fa0c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 16,
    features: ["Umbrella leaves", "Fast growing", "Easy to train"],
    careLevel: "Easy",
    sunlight: "Medium",
    watering: "Medium",
    petFriendly: false,
    lowMaintenance: true,
    rating: 4.5,
    reviewCount: 134,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "banyan-tree-bonsai",
    name: "Banyan Tree Bonsai",
    description: "Majestic bonsai with aerial roots and broad canopy. Creates miniature landscapes. Symbol of strength and longevity.",
    price: 2899,
    originalPrice: 3599,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1621963342665-f26eade1fa0c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 5,
    features: ["Aerial roots", "Broad canopy", "Symbol of strength"],
    careLevel: "Hard",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.9,
    reviewCount: 67,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "boxwood-bonsai",
    name: "Boxwood Bonsai",
    description: "Dense, small-leaved bonsai perfect for formal styles. Slow-growing and develops beautiful fine branching.",
    price: 1999,
    originalPrice: 2499,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1621963342665-f26eade1fa0c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 11,
    features: ["Dense foliage", "Formal styles", "Fine branching"],
    careLevel: "Medium",
    sunlight: "Medium",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.6,
    reviewCount: 98,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "maple-bonsai-acer",
    name: "Maple Bonsai (Acer Palmatum)",
    description: "Stunning Japanese maple bonsai with beautiful fall colors. Delicate leaves and elegant branching patterns.",
    price: 3299,
    originalPrice: 3999,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1621963342665-f26eade1fa0c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 4,
    features: ["Fall colors", "Delicate leaves", "Elegant branching"],
    careLevel: "Hard",
    sunlight: "Medium",
    watering: "High",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.9,
    reviewCount: 45,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "podocarpus-bonsai",
    name: "Podocarpus Bonsai (Buddhist Pine)",
    description: "Elegant bonsai with needle-like leaves. Also known as Buddhist Pine. Excellent for formal upright styles.",
    price: 2199,
    originalPrice: 2799,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1621963342665-f26eade1fa0c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 9,
    features: ["Needle leaves", "Buddhist Pine", "Formal upright"],
    careLevel: "Medium",
    sunlight: "Medium",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.7,
    reviewCount: 89,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "carmona-bonsai",
    name: "Carmona Bonsai",
    description: "Tropical bonsai with small white flowers and tiny leaves. Perfect for indoor cultivation. Also known as Fukien Tea.",
    price: 1899,
    originalPrice: 2399,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1621963342665-f26eade1fa0c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 13,
    features: ["White flowers", "Tropical bonsai", "Indoor suitable"],
    careLevel: "Hard",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.6,
    reviewCount: 112,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "olive-bonsai",
    name: "Olive Bonsai",
    description: "Mediterranean bonsai with silvery leaves and gnarled trunk. Develops beautiful character with age.",
    price: 2799,
    originalPrice: 3399,
    category: "bonsai",
    images: [
      "https://images.unsplash.com/photo-1621963342665-f26eade1fa0c?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 7,
    features: ["Silvery leaves", "Gnarled trunk", "Mediterranean"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.8,
    reviewCount: 78,
    featured: true,
    trending: false,
    new: false
  },

  // Herbs & Medicinal Plants (14 items)
  {
    id: "stevia-sweet-leaf",
    name: "Stevia Plant (Sweet Leaf)",
    description: "Natural sweetener plant with leaves 300 times sweeter than sugar. Zero calories and perfect for diabetics.",
    price: 549,
    originalPrice: 699,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 35,
    features: ["Natural sweetener", "Zero calories", "300x sweeter"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.8,
    reviewCount: 234,
    featured: true,
    trending: true,
    new: false
  },
  {
    id: "lemon-balm",
    name: "Lemon Balm",
    description: "Aromatic herb with citrusy scent. Used for teas, aromatherapy, and culinary purposes. Natural stress reliever.",
    price: 299,
    originalPrice: 399,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 50,
    features: ["Citrusy scent", "Stress reliever", "Tea herb"],
    careLevel: "Easy",
    sunlight: "Medium",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.6,
    reviewCount: 189,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "oregano-greek",
    name: "Oregano Greek",
    description: "Authentic Greek oregano with intense flavor. Essential for Mediterranean cooking. High in antioxidants.",
    price: 349,
    originalPrice: 449,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 45,
    features: ["Intense flavor", "Mediterranean cooking", "High antioxidants"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.7,
    reviewCount: 156,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "thyme-german-winter",
    name: "Thyme (German Winter)",
    description: "Hardy winter thyme variety with strong flavor. Perfect for year-round harvesting. Excellent for cooking and teas.",
    price: 279,
    originalPrice: 379,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 40,
    features: ["Winter hardy", "Strong flavor", "Year-round harvest"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.6,
    reviewCount: 134,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "rosemary-tuscan-blue",
    name: "Rosemary Tuscan Blue",
    description: "Upright rosemary variety with blue flowers. Excellent for cooking, aromatherapy, and garden borders.",
    price: 399,
    originalPrice: 549,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 38,
    features: ["Blue flowers", "Upright variety", "Aromatherapy"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.7,
    reviewCount: 167,
    featured: false,
    trending: true,
    new: false
  },
  {
    id: "lavender-vera-true",
    name: "Lavender Vera (True Lavender)",
    description: "Authentic English lavender with the finest fragrance. Perfect for aromatherapy, crafts, and relaxation.",
    price: 649,
    originalPrice: 849,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 30,
    features: ["True lavender", "Finest fragrance", "Relaxation"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.8,
    reviewCount: 234,
    featured: true,
    trending: true,
    new: false
  },
  {
    id: "chamomile-german",
    name: "Chamomile German",
    description: "Gentle herb with apple-scented flowers. Perfect for calming teas and natural remedies. Annual variety.",
    price: 249,
    originalPrice: 349,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1502790671504-542ad42d5189?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1586944179862-1459ba2e2558?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 55,
    features: ["Apple scented", "Calming teas", "Natural remedy"],
    careLevel: "Easy",
    sunlight: "Medium",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.5,
    reviewCount: 198,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "holy-basil-tulsi-variegated",
    name: "Holy Basil (Tulsi Rama Variegated)",
    description: "Sacred Ayurvedic herb with variegated leaves. Adaptogenic properties and spiritual significance. Stress relief.",
    price: 699,
    originalPrice: 899,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 25,
    features: ["Sacred herb", "Adaptogenic", "Stress relief"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.9,
    reviewCount: 145,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "sage-purple",
    name: "Sage Purple",
    description: "Beautiful purple-leaved sage with culinary and medicinal uses. Attracts pollinators and adds color to gardens.",
    price: 429,
    originalPrice: 579,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 32,
    features: ["Purple leaves", "Culinary use", "Attracts pollinators"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.6,
    reviewCount: 123,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "marjoram-sweet",
    name: "Marjoram Sweet",
    description: "Delicate herb with sweet, pine-like flavor. Perfect for Mediterranean dishes and herbal teas. Milder than oregano.",
    price: 319,
    originalPrice: 419,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 42,
    features: ["Sweet flavor", "Mediterranean dishes", "Milder than oregano"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: true,
    rating: 4.5,
    reviewCount: 89,
    featured: false,
    trending: false,
    new: false
  },
  {
    id: "gotu-kola-brahmi",
    name: "Gotu Kola (Brahmi Mandukaparni)",
    description: "Ayurvedic brain tonic herb. Enhances memory and cognitive function. Used in traditional medicine for centuries.",
    price: 799,
    originalPrice: 999,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 20,
    features: ["Brain tonic", "Memory enhancer", "Ayurvedic herb"],
    careLevel: "Medium",
    sunlight: "Medium",
    watering: "High",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.8,
    reviewCount: 167,
    featured: true,
    trending: true,
    new: false
  },
  {
    id: "ashwagandha-indian-ginseng",
    name: "Ashwagandha (Indian Ginseng)",
    description: "Powerful adaptogenic herb for stress management and vitality. Also known as Winter Cherry. Ayurvedic superfood.",
    price: 1099,
    originalPrice: 1399,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 15,
    features: ["Adaptogenic", "Stress management", "Ayurvedic superfood"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Low",
    petFriendly: false,
    lowMaintenance: false,
    rating: 4.9,
    reviewCount: 234,
    featured: true,
    trending: true,
    new: true
  },
  {
    id: "curry-leaf-hybrid",
    name: "Curry Leaf Plant (Murraya Koenigii Hybrid)",
    description: "Essential South Indian cooking herb. Hybrid variety with improved growth and flavor. Fresh leaves for authentic curries.",
    price: 849,
    originalPrice: 1099,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 18,
    features: ["South Indian cooking", "Hybrid variety", "Authentic flavor"],
    careLevel: "Medium",
    sunlight: "High",
    watering: "Medium",
    petFriendly: true,
    lowMaintenance: false,
    rating: 4.7,
    reviewCount: 198,
    featured: false,
    trending: true,
    new: false
  },
  {
    id: "aloe-vera-variegated",
    name: "Aloe Vera Variegated",
    description: "Variegated variety of medicinal aloe with white striped leaves. Healing gel for burns and skin care. Ornamental value.",
    price: 649,
    originalPrice: 849,
    category: "herbs",
    images: [
      "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1516192518150-0d8fee5425e3?w=800&h=800&fit=crop"
    ],
    inStock: true,
    stockQuantity: 28,
    features: ["Variegated leaves", "Healing gel", "Ornamental"],
    careLevel: "Easy",
    sunlight: "High",
    watering: "Low",
    petFriendly: false,
    lowMaintenance: true,
    rating: 4.8,
    reviewCount: 267,
    featured: true,
    trending: false,
    new: false
  }
];

// Get all plants
export const getAllPlants: RequestHandler = (req, res) => {
  const filters = req.query as Partial<PlantFilters>;
  let filteredPlants = [...plants];

  // Apply filters
  if (filters.category) {
    filteredPlants = filteredPlants.filter(plant => plant.category === filters.category);
  }

  if (filters.minPrice) {
    filteredPlants = filteredPlants.filter(plant => plant.price >= Number(filters.minPrice));
  }

  if (filters.maxPrice) {
    filteredPlants = filteredPlants.filter(plant => plant.price <= Number(filters.maxPrice));
  }

  if (filters.careLevel) {
    filteredPlants = filteredPlants.filter(plant => plant.careLevel === filters.careLevel);
  }

  if (filters.sunlight) {
    filteredPlants = filteredPlants.filter(plant => plant.sunlight === filters.sunlight);
  }

  if (filters.watering) {
    filteredPlants = filteredPlants.filter(plant => plant.watering === filters.watering);
  }

  if (filters.petFriendly !== undefined) {
    filteredPlants = filteredPlants.filter(plant => plant.petFriendly === (filters.petFriendly === 'true'));
  }

  if (filters.lowMaintenance !== undefined) {
    filteredPlants = filteredPlants.filter(plant => plant.lowMaintenance === (filters.lowMaintenance === 'true'));
  }

  if (filters.featured !== undefined) {
    filteredPlants = filteredPlants.filter(plant => plant.featured === (filters.featured === 'true'));
  }

  if (filters.trending !== undefined) {
    filteredPlants = filteredPlants.filter(plant => plant.trending === (filters.trending === 'true'));
  }

  if (filters.new !== undefined) {
    filteredPlants = filteredPlants.filter(plant => plant.new === (filters.new === 'true'));
  }

  if (filters.inStock !== undefined) {
    filteredPlants = filteredPlants.filter(plant => plant.inStock === (filters.inStock === 'true'));
  }

  // Apply search
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredPlants = filteredPlants.filter(plant => 
      plant.name.toLowerCase().includes(searchTerm) ||
      plant.description.toLowerCase().includes(searchTerm) ||
      plant.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-asc':
        filteredPlants.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredPlants.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filteredPlants.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filteredPlants.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filteredPlants.sort((a, b) => Number(b.new) - Number(a.new));
        break;
    }
  }

  // Apply pagination
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPlants = filteredPlants.slice(startIndex, endIndex);

  const response: PlantsResponse = {
    plants: paginatedPlants,
    total: filteredPlants.length,
    page,
    limit,
    totalPages: Math.ceil(filteredPlants.length / limit)
  };

  res.json(response);
};

// Get single plant
export const getPlantById: RequestHandler = (req, res) => {
  const { id } = req.params;
  const plant = plants.find(p => p.id === id);

  if (!plant) {
    return res.status(404).json({ error: 'Plant not found' });
  }

  const response: PlantResponse = { plant };
  res.json(response);
};

// Get featured plants
export const getFeaturedPlants: RequestHandler = (req, res) => {
  const featuredPlants = plants.filter(plant => plant.featured).slice(0, 9);
  const response: PlantsResponse = {
    plants: featuredPlants,
    total: featuredPlants.length,
    page: 1,
    limit: 9,
    totalPages: 1
  };
  res.json(response);
};

// Get trending plants
export const getTrendingPlants: RequestHandler = (req, res) => {
  const trendingPlants = plants.filter(plant => plant.trending).slice(0, 8);
  const response: PlantsResponse = {
    plants: trendingPlants,
    total: trendingPlants.length,
    page: 1,
    limit: 8,
    totalPages: 1
  };
  res.json(response);
};

// Get plants by category
export const getPlantsByCategory: RequestHandler = (req, res) => {
  const { category } = req.params;
  const categoryPlants = plants.filter(plant => plant.category === category);

  const response: PlantsResponse = {
    plants: categoryPlants,
    total: categoryPlants.length,
    page: 1,
    limit: categoryPlants.length,
    totalPages: 1
  };
  res.json(response);
};

// Add new plant (Admin only)
export const createPlant: RequestHandler = (req, res) => {
  try {
    const newPlant: Plant = {
      id: `plant-${Date.now()}`,
      ...req.body,
      rating: 0,
      reviewCount: 0
    };

    plants.unshift(newPlant);
    res.status(201).json({ plant: newPlant });
  } catch (error) {
    console.error('Error adding plant:', error);
    res.status(500).json({ error: 'Failed to add plant' });
  }
};

// Update plant (Admin only)
export const updatePlant: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const plantIndex = plants.findIndex(p => p.id === id);

    if (plantIndex === -1) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    plants[plantIndex] = { ...plants[plantIndex], ...req.body };
    res.json({ plant: plants[plantIndex] });
  } catch (error) {
    console.error('Error updating plant:', error);
    res.status(500).json({ error: 'Failed to update plant' });
  }
};

// Delete plant (Admin only)
export const deletePlant: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const plantIndex = plants.findIndex(p => p.id === id);

    if (plantIndex === -1) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    plants.splice(plantIndex, 1);
    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    console.error('Error deleting plant:', error);
    res.status(500).json({ error: 'Failed to delete plant' });
  }
};
