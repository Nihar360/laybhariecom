export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  badge?: string;
  category: string;
  description?: string;
  features?: string[];
  sizes?: string[];
  inStock?: boolean;
  stockCount?: number;
}

export const allProducts: Product[] = [
  {
    id: 1,
    name: 'Premium Garam Masala',
    price: 12.99,
    originalPrice: 16.99,
    image: 'https://images.unsplash.com/photo-1618513965492-badaf6cbdfed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJhbSUyMG1hc2FsYSUyMHBvd2RlcnxlbnwxfHx8fDE3NjA2MzcwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1618513965492-badaf6cbdfed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJhbSUyMG1hc2FsYSUyMHBvd2RlcnxlbnwxfHx8fDE3NjA2MzcwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758745464235-ccb8c1253074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJyeSUyMHNwaWNlcyUyMGluZGlhbnxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    rating: 4.9,
    reviews: 487,
    badge: 'Best Seller',
    category: 'Masala Blends',
    description: 'Our signature garam masala blend combines the finest whole spices, roasted and ground to perfection. A warming blend of cardamom, cinnamon, cloves, and cumin that adds depth to any dish.',
    features: [
      '100% Natural ingredients',
      'Freshly ground spices',
      'No artificial colors or preservatives',
      'Rich aromatic flavor',
      'Perfect for curries and biryanis',
      'Resealable airtight packaging'
    ],
    sizes: ['50g', '100g', '250g', '500g'],
    inStock: true,
    stockCount: 245
  },
  {
    id: 2,
    name: 'Organic Turmeric Powder',
    price: 8.99,
    originalPrice: 11.99,
    image: 'https://images.unsplash.com/photo-1698556735172-1b5b3cd9d2ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMHBvd2RlciUyMHNwaWNlfGVufDF8fHx8MTc2MDYwMDMzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1698556735172-1b5b3cd9d2ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMHBvd2RlciUyMHNwaWNlfGVufDF8fHx8MTc2MDYwMDMzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758745464235-ccb8c1253074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    rating: 4.8,
    reviews: 652,
    badge: 'Organic',
    category: 'Single Spices',
    description: 'Premium quality organic turmeric powder sourced from certified organic farms. Known for its vibrant color and health benefits, perfect for golden milk and curries.',
    features: [
      'USDA Organic certified',
      'High curcumin content',
      'Anti-inflammatory properties',
      'Bright golden color',
      'No additives or fillers',
      'Lab tested for purity'
    ],
    sizes: ['100g', '250g', '500g', '1kg'],
    inStock: true,
    stockCount: 523
  },
  {
    id: 3,
    name: 'Kashmiri Red Chili Powder',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1700308234510-85bf5f51e135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBjaGlsaSUyMHBvd2RlcnxlbnwxfHx8fDE3NjA2MDAzMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1700308234510-85bf5f51e135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjBjaGlsaSUyMHBvd2RlcnxlbnwxfHx8fDE3NjA2MDAzMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758745464235-ccb8c1253074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    rating: 4.7,
    reviews: 394,
    category: 'Single Spices',
    description: 'Authentic Kashmiri red chili powder known for its vibrant red color and mild heat. Adds beautiful color to dishes without overpowering spiciness.',
    features: [
      'Bright red color',
      'Mild heat level',
      'Pure Kashmiri variety',
      'No artificial coloring',
      'Perfect for tandoori dishes',
      'Stone ground'
    ],
    sizes: ['50g', '100g', '250g', '500g'],
    inStock: true,
    stockCount: 412
  },
  {
    id: 4,
    name: 'Biryani Masala Blend',
    price: 11.99,
    originalPrice: 14.99,
    image: 'https://images.unsplash.com/photo-1735233024815-7986206a18a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwbWFzYWxhJTIwc3BpY2V8ZW58MXx8fHwxNjA2MzcwNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1735233024815-7986206a18a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ5YW5pJTIwbWFzYWxhJTIwc3BpY2V8ZW58MXx8fHwxNjA2MzcwNDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJyeSUyMHNwaWNlcyUyMGluZGlhbnxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    rating: 4.9,
    reviews: 728,
    badge: 'Chef\'s Choice',
    category: 'Masala Blends',
    description: 'Authentic biryani masala crafted with 15+ premium spices. This aromatic blend brings restaurant-quality flavor to your homemade biryani.',
    features: [
      'Traditional recipe',
      'Aromatic spice blend',
      'Perfect for chicken, mutton, or vegetable biryani',
      'Pre-roasted spices',
      'Chef-tested formula',
      'No MSG'
    ],
    sizes: ['50g', '100g', '250g'],
    inStock: true,
    stockCount: 198
  },
  {
    id: 5,
    name: 'Whole Black Peppercorns',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1649952052743-5e8f37c348c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHBlcHBlciUyMHNwaWNlfGVufDF8fHx8MTc2MDUyNjIyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1649952052743-5e8f37c348c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHBlcHBlciUyMHNwaWNlfGVufDF8fHx8MTc2MDUyNjIyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1558013637-a125529cc856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZSUyMGphcnMlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MDYzNzA0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    rating: 4.6,
    reviews: 341,
    category: 'Single Spices',
    description: 'Premium quality whole black peppercorns with bold, pungent flavor. Freshly sourced and perfect for grinding as needed to maintain maximum flavor.',
    features: [
      'Whole peppercorns',
      'Bold, pungent flavor',
      'Perfect for grinding fresh',
      'High oil content',
      'Long shelf life',
      'Multipurpose use'
    ],
    sizes: ['100g', '250g', '500g'],
    inStock: true,
    stockCount: 367
  },
  {
    id: 6,
    name: 'Coriander Seeds',
    price: 5.99,
    originalPrice: 7.99,
    image: 'https://images.unsplash.com/photo-1608797178894-bf7c596932da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JpYW5kZXIlMjBzZWVkcyUyMHNwaWNlfGVufDF8fHx8MTc2MDYzNzA0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1608797178894-bf7c596932da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3JpYW5kZXIlMjBzZWVkcyUyMHNwaWNlfGVufDF8fHx8MTc2MDYzNzA0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758745464235-ccb8c1253074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    rating: 4.5,
    reviews: 289,
    category: 'Single Spices',
    description: 'High-quality coriander seeds with a sweet, citrusy flavor. Essential for Indian cooking and great for dry roasting and grinding.',
    features: [
      'Whole seeds',
      'Sweet citrus flavor',
      'Freshly harvested',
      'Perfect for roasting',
      'Rich in antioxidants',
      'Versatile spice'
    ],
    sizes: ['100g', '250g', '500g', '1kg'],
    inStock: true,
    stockCount: 445
  },
  {
    id: 7,
    name: 'Cumin Seeds (Jeera)',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1609324160773-7f3cfacc27ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdW1pbiUyMHNlZWRzJTIwc3BpY2V8ZW58MXx8fHwxNzYwNjM3MDQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1609324160773-7f3cfacc27ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdW1pbiUyMHNlZWRzJTIwc3BpY2V8ZW58MXx8fHwxNzYwNjM3MDQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1558013637-a125529cc856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZSUyMGphcnMlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MDYzNzA0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    rating: 4.7,
    reviews: 512,
    category: 'Single Spices',
    description: 'Premium cumin seeds with a warm, earthy flavor. A staple in Indian cuisine, perfect for tempering and adding depth to curries.',
    features: [
      'Whole cumin seeds',
      'Warm earthy flavor',
      'Perfect for tempering',
      'High quality seeds',
      'Rich aroma',
      'Essential pantry staple'
    ],
    sizes: ['100g', '250g', '500g'],
    inStock: true,
    stockCount: 534
  },
  {
    id: 8,
    name: 'Green Cardamom Pods',
    price: 14.99,
    originalPrice: 18.99,
    image: 'https://images.unsplash.com/photo-1642255486425-19e152474aa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkYW1vbSUyMHNwaWNlfGVufDF8fHx8MTc2MDU0NjM3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1642255486425-19e152474aa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkYW1vbSUyMHNwaWNlfGVufDF8fHx8MTc2MDU0NjM3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758745464235-ccb8c1253074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    rating: 4.9,
    reviews: 423,
    badge: 'Premium',
    category: 'Whole Spices',
    description: 'Premium green cardamom pods with intense aroma and sweet flavor. Perfect for biryanis, desserts, and chai. The queen of spices.',
    features: [
      'Grade A quality pods',
      'Intense aromatic flavor',
      'Perfect for sweet and savory dishes',
      'Fresh and plump pods',
      'Great for chai',
      'Premium quality'
    ],
    sizes: ['25g', '50g', '100g', '250g'],
    inStock: true,
    stockCount: 156
  },
  {
    id: 9,
    name: 'Cinnamon Sticks',
    price: 8.49,
    image: 'https://images.unsplash.com/photo-1622798337764-259682f03741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5uYW1vbiUyMHN0aWNrcyUyMHNwaWNlfGVufDF8fHx8MTc2MDU3MTcwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1622798337764-259682f03741?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5uYW1vbiUyMHN0aWNrcyUyMHNwaWNlfGVufDF8fHx8MTc2MDU3MTcwMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1558013637-a125529cc856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZSUyMGphcnMlMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc2MDYzNzA0Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    rating: 4.6,
    reviews: 298,
    category: 'Whole Spices',
    description: 'Premium Ceylon cinnamon sticks with sweet, delicate flavor. Perfect for rice dishes, desserts, and hot beverages.',
    features: [
      'True Ceylon cinnamon',
      'Sweet delicate flavor',
      'Long quills',
      'Perfect for cooking and beverages',
      'Natural and pure',
      'No additives'
    ],
    sizes: ['50g', '100g', '250g'],
    inStock: true,
    stockCount: 287
  },
  {
    id: 10,
    name: 'Curry Leaves (Dried)',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJyeSUyMHNwaWNlcyUyMGluZGlhbnxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJyeSUyMHNwaWNlcyUyMGluZGlhbnxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1758745464235-ccb8c1253074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    rating: 4.4,
    reviews: 176,
    category: 'Herbs & Aromatics',
    description: 'Aromatic dried curry leaves perfect for tempering. Essential for South Indian cooking, adding authentic flavor to curries and dals.',
    features: [
      'Freshly dried leaves',
      'Strong aromatic flavor',
      'Perfect for tempering',
      'Long shelf life',
      'Authentic South Indian flavor',
      'No stems'
    ],
    sizes: ['25g', '50g', '100g'],
    inStock: true,
    stockCount: 312
  },
  {
    id: 11,
    name: 'Tandoori Masala Mix',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1758745464235-ccb8c1253074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1758745464235-ccb8c1253074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJyeSUyMHNwaWNlcyUyMGluZGlhbnxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    rating: 4.7,
    reviews: 389,
    category: 'Masala Blends',
    description: 'Authentic tandoori masala blend for that classic smoky, spicy flavor. Perfect for marinating chicken, paneer, and vegetables.',
    features: [
      'Restaurant-style flavor',
      'Perfect for grilling',
      'Rich red color',
      'Balanced spice level',
      'Ready-to-use blend',
      'No artificial colors'
    ],
    sizes: ['50g', '100g', '250g'],
    inStock: true,
    stockCount: 267
  },
  {
    id: 12,
    name: 'Chat Masala',
    price: 6.49,
    originalPrice: 8.49,
    image: 'https://images.unsplash.com/photo-1618513965492-badaf6cbdfed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJhbSUyMG1hc2FsYSUyMHBvd2RlcnxlbnwxfHx8fDE3NjA2MzcwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    images: [
      'https://images.unsplash.com/photo-1618513965492-badaf6cbdfed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJhbSUyMG1hc2FsYSUyMHBvd2RlcnxlbnwxfHx8fDE3NjA2MzcwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    ],
    rating: 4.5,
    reviews: 234,
    category: 'Masala Blends',
    description: 'Tangy and savory chat masala perfect for street food, salads, and fruits. A burst of flavor in every sprinkle.',
    features: [
      'Tangy and savory',
      'Perfect for snacks',
      'Contains black salt',
      'Versatile seasoning',
      'Authentic street food flavor',
      'No preservatives'
    ],
    sizes: ['50g', '100g', '250g'],
    inStock: true,
    stockCount: 398
  }
];

export const categories = [
  {
    name: 'Masala Blends',
    image: 'https://images.unsplash.com/photo-1618513965492-badaf6cbdfed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYXJhbSUyMG1hc2FsYSUyMHBvd2RlcnxlbnwxfHx8fDE3NjA2MzcwMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    count: '25+ items'
  },
  {
    name: 'Single Spices',
    image: 'https://images.unsplash.com/photo-1698556735172-1b5b3cd9d2ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMHBvd2RlciUyMHNwaWNlfGVufDF8fHx8MTc2MDYwMDMzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    count: '40+ items'
  },
  {
    name: 'Whole Spices',
    image: 'https://images.unsplash.com/photo-1642255486425-19e152474aa7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkYW1vbSUyMHNwaWNlfGVufDF8fHx8MTc2MDU0NjM3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    count: '30+ items'
  },
  {
    name: 'Herbs & Aromatics',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJyeSUyMHNwaWNlcyUyMGluZGlhbnxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    count: '15+ items'
  }
];
