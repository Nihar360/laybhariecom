import { Button } from './ui/button';
import { Input } from './ui/input';
import { Mail } from 'lucide-react';

export function Newsletter() {
  return (
    <section className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl mb-4">Join Our Spice Community</h2>
          <p className="text-gray-300 mb-8">
            Get authentic recipes, spice tips, and exclusive deals on premium masalas delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white text-black flex-1"
            />
            <Button className="bg-white text-black hover:bg-gray-200">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </div>
    </section>
  );
}
