import { Button } from '../components/ui/button';
import { useNavigation } from '../contexts/NavigationContext';
import { CheckCircle, Package, Truck } from 'lucide-react';

export function OrderSuccessPage() {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <CheckCircle className="w-24 h-24 text-green-500" />
            <div className="absolute inset-0 animate-ping opacity-25">
              <CheckCircle className="w-24 h-24 text-green-500" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been received and is being processed.
          You will receive an email confirmation shortly.
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Order Confirmed</p>
                <p className="text-sm text-gray-600">We've received your order</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Shipping Soon</p>
                <p className="text-sm text-gray-600">Expected delivery in 3-5 days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full bg-black hover:bg-gray-800"
            onClick={() => navigateTo('home')}
          >
            Continue Shopping
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => navigateTo('home')}
          >
            View Order Details
          </Button>
        </div>
      </div>
    </div>
  );
}
