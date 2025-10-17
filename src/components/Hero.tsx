import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';
import { useEffect, useState } from 'react';

const carouselSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1758745464235-ccb8c1253074?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjA2MzcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Fresh Spices 2025',
    title: 'Authentic Flavors from India',
    description: 'Discover premium quality spices, masalas, and blends sourced directly from farmers.',
    offer: 'Up to 30% Off',
    stats: [
      { value: '100+', label: 'Spice Varieties' },
      { value: '100%', label: 'Natural & Pure' },
      { value: '25,000+', label: 'Happy Families' }
    ]
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZXMlMjBtYXJrZXQlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjA2Mzc4Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Premium Quality',
    title: 'Farm to Table Freshness',
    description: 'Our spices are sourced directly from organic farms and delivered fresh to your kitchen.',
    offer: 'Free Shipping on $25+',
    stats: [
      { value: 'Direct', label: 'From Farmers' },
      { value: 'Organic', label: 'Certified' },
      { value: 'Fresh', label: 'Daily Batches' }
    ]
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1618513965492-badaf6cbdfed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYXNhbGElMjBjb29raW5nfGVufDF8fHx8MTc2MDYzNzg2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Best Seller',
    title: 'Signature Masala Blends',
    description: 'Expertly crafted spice blends that bring authentic Indian flavors to your home cooking.',
    offer: 'Buy 2 Get 1 Free',
    stats: [
      { value: '15+', label: 'Masala Blends' },
      { value: '4.9★', label: 'Customer Rating' },
      { value: '10K+', label: 'Reviews' }
    ]
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1698556735172-1b5b3cd9d2ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMHNwaWNlJTIwb3JnYW5pY3xlbnwxfHx8fDE3NjA2Mzc4Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Organic Collection',
    title: 'Pure Turmeric & Wellness',
    description: 'Premium organic turmeric and wellness spices with high curcumin content for health benefits.',
    offer: '20% Off Wellness Range',
    stats: [
      { value: 'USDA', label: 'Organic Certified' },
      { value: 'Lab', label: 'Tested Pure' },
      { value: 'Health', label: 'Benefits' }
    ]
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1558013637-a125529cc856?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGljZSUyMHNob3AlMjBkaXNwbGF5fGVufDF8fHx8MTc2MDYzNzg2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badge: 'Special Offer',
    title: 'Complete Spice Collection',
    description: 'Everything you need to stock your kitchen with authentic flavors. Curated gift sets available.',
    offer: 'Gift Sets from $29.99',
    stats: [
      { value: '50+', label: 'Products' },
      { value: 'Gift', label: 'Ready Sets' },
      { value: 'Custom', label: 'Bundles' }
    ]
  }
];

export function Hero() {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    // Auto-play functionality
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Change slide every 5 seconds

    // Update current slide
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {carouselSlides.map((slide) => (
              <CarouselItem key={slide.id}>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <div className="inline-block px-4 py-2 bg-black text-white text-sm rounded-full">
                      {slide.badge}
                    </div>
                    <h2 className="text-5xl lg:text-6xl">
                      {slide.title}
                    </h2>
                    <p className="text-xl text-gray-600">
                      {slide.description}
                    </p>
                    <div className="flex gap-4">
                      <Button size="lg" className="bg-black hover:bg-gray-800">
                        Shop Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                      <Button size="lg" variant="outline">
                        Learn More
                      </Button>
                    </div>
                    <div className="flex gap-8 pt-4">
                      {slide.stats.map((stat, index) => (
                        <div key={index}>
                          <p className="text-3xl">{stat.value}</p>
                          <p className="text-gray-600">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <ImageWithFallback
                      src={slide.image}
                      alt={slide.title}
                      className="rounded-lg shadow-2xl w-full h-[500px] object-cover"
                    />
                    <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg hidden lg:block">
                      <p className="text-sm text-gray-600">Special Offer</p>
                      <p className="text-2xl">{slide.offer}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex -left-12" />
          <CarouselNext className="hidden lg:flex -right-12" />
          
          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  current === index ? 'w-8 bg-black' : 'w-2 bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </div>
  );
}
