import { useState } from 'react';
import { useNavigation } from '../contexts/NavigationContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ChevronLeft, Truck, Shield, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { RazorpayModal } from '../components/RazorpayModal';

const countryStateData: Record<string, Record<string, string[]>> = {
  'India': {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Tirupati'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Tezpur'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg'],
    'Delhi': ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
    'Himachal Pradesh': ['Shimla', 'Dharamshala', 'Solan', 'Mandi', 'Kullu'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli', 'Belagavi'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kannur'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad'],
    'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur'],
    'Meghalaya': ['Shillong', 'Tura', 'Nongstoin', 'Jowai'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'],
    'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
    'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Meerut', 'Noida'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Nainital', 'Rishikesh'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol'],
  },
  'USA': {
    'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'],
    'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth'],
    'New York': ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
    'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'],
    'Illinois': ['Chicago', 'Springfield', 'Naperville', 'Peoria', 'Rockford'],
    'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Harrisburg', 'Allentown', 'Erie'],
    'Ohio': ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo', 'Akron'],
    'Georgia': ['Atlanta', 'Augusta', 'Columbus', 'Savannah', 'Athens'],
    'Michigan': ['Detroit', 'Grand Rapids', 'Warren', 'Ann Arbor', 'Lansing'],
    'Washington': ['Seattle', 'Spokane', 'Tacoma', 'Vancouver', 'Bellevue'],
  },
  'UK': {
    'England': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 'Newcastle'],
    'Scotland': ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee', 'Inverness'],
    'Wales': ['Cardiff', 'Swansea', 'Newport', 'Wrexham', 'Barry'],
    'Northern Ireland': ['Belfast', 'Derry', 'Lisburn', 'Newry', 'Armagh'],
  },
  'Canada': {
    'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton', 'London'],
    'Quebec': ['Montreal', 'Quebec City', 'Laval', 'Gatineau', 'Longueuil'],
    'British Columbia': ['Vancouver', 'Victoria', 'Surrey', 'Burnaby', 'Richmond'],
    'Alberta': ['Calgary', 'Edmonton', 'Red Deer', 'Lethbridge', 'Medicine Hat'],
  },
};

export function CheckoutPage() {
  const { goBack, navigateTo } = useNavigation();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      if (field === 'country') {
        newData.state = '';
        newData.city = '';
        if (value !== 'India' && paymentMethod === 'cod') {
          setPaymentMethod('razorpay');
        }
      }
      
      if (field === 'state') {
        newData.city = '';
      }
      
      return newData;
    });
  };

  const validateForm = () => {
    const required = ['fullName', 'mobile', 'email', 'addressLine1', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handlePayment = () => {
    if (!validateForm()) return;
    
    if (paymentMethod === 'razorpay') {
      setShowPaymentModal(true);
    } else {
      clearCart();
      toast.success('Order placed successfully via COD!');
      navigateTo('order-success');
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    clearCart();
    toast.success('Payment Successful!');
    navigateTo('order-success');
  };

  const applyCoupon = () => {
    if (!coupon.trim()) {
      toast.error('Please enter a valid coupon code.');
      return;
    }
    
    if (couponApplied) {
      toast.info('Coupon already applied!');
      return;
    }
    
    setCouponApplied(true);
    toast.success('Coupon applied successfully! (10% off)');
  };

  const subtotal = getTotalPrice();
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 25 ? 0 : 3;
  const total = subtotal - discount + shipping;

  const currentStates = countryStateData[formData.country] || {};
  const currentCities = formData.state ? currentStates[formData.state] || [] : [];
  const isCodAllowed = formData.country === 'India';

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Button onClick={() => navigateTo('home')}>Go Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-5">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-base font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold mb-10">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-3xl shadow-lg border-gray-200">
              <CardContent className="p-10">
                <h2 className="text-gray-500 font-semibold text-base mb-8 uppercase tracking-wide">
                  Delivery Information
                </h2>
                <div className="space-y-7">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName" className="text-base font-medium mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="John Doe"
                        className="h-12 text-base px-4"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mobile" className="text-base font-medium mb-2 block">
                        Mobile Number *
                      </Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange('mobile', e.target.value)}
                        placeholder="9876543210"
                        className="h-12 text-base px-4"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-base font-medium mb-2 block">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className="h-12 text-base px-4"
                    />
                  </div>

                  <div>
                    <Label htmlFor="addressLine1" className="text-base font-medium mb-2 block">
                      Address Line 1 *
                    </Label>
                    <Input
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                      placeholder="House No., Street Name"
                      className="h-12 text-base px-4"
                    />
                  </div>

                  <div>
                    <Label htmlFor="addressLine2" className="text-base font-medium mb-2 block">
                      Address Line 2
                    </Label>
                    <Input
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                      placeholder="Landmark, Area (Optional)"
                      className="h-12 text-base px-4"
                    />
                  </div>

                  <div>
                    <Label htmlFor="country" className="text-base font-medium mb-2 block">
                      Country *
                    </Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="India">India</SelectItem>
                        <SelectItem value="USA">United States</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="state" className="text-base font-medium mb-2 block">
                        State *
                      </Label>
                      <Select 
                        value={formData.state} 
                        onValueChange={(value) => handleInputChange('state', value)}
                        disabled={!formData.country}
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder={formData.country ? "Select State" : "Select Country first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(currentStates).map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="city" className="text-base font-medium mb-2 block">
                        City *
                      </Label>
                      <Select 
                        value={formData.city} 
                        onValueChange={(value) => handleInputChange('city', value)}
                        disabled={!formData.state}
                      >
                        <SelectTrigger className="h-12 text-base">
                          <SelectValue placeholder={formData.state ? "Select City" : "Select State first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {currentCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="zipCode" className="text-base font-medium mb-2 block">
                      Zip Code *
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="400001"
                      className="h-12 text-base px-4"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl shadow-lg border-gray-200">
              <CardContent className="p-10">
                <h2 className="text-gray-500 font-semibold text-base mb-8 uppercase tracking-wide">
                  Payment Method
                </h2>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(value) => setPaymentMethod(value as 'razorpay' | 'cod')}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer border border-transparent hover:border-blue-200">
                    <RadioGroupItem value="razorpay" id="razorpay" className="border-2 border-blue-500 text-blue-600 focus:ring-blue-500" />
                    <Label htmlFor="razorpay" className="text-base font-medium cursor-pointer flex-1">
                      Razorpay / UPI / Cards
                    </Label>
                  </div>
                  <div className={`flex items-center gap-4 p-4 rounded-xl transition-colors border ${
                    !isCodAllowed 
                      ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' 
                      : 'cursor-pointer hover:bg-blue-50 border-transparent hover:border-blue-200'
                  }`}>
                    <RadioGroupItem 
                      value="cod" 
                      id="cod" 
                      disabled={!isCodAllowed}
                      className="border-2 border-blue-500 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                    />
                    <div className="flex-1">
                      <Label 
                        htmlFor="cod" 
                        className={`text-base font-medium ${isCodAllowed ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      >
                        Cash on Delivery (COD)
                      </Label>
                      {!isCodAllowed && (
                        <p className="text-sm text-gray-500 mt-1">Only available for India</p>
                      )}
                    </div>
                  </div>
                </RadioGroup>

                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-8 h-14 text-lg rounded-xl transition-all shadow-md hover:shadow-lg"
                  onClick={handlePayment}
                >
                  {paymentMethod === 'razorpay' ? `Pay Now ₹${total.toFixed(2)}` : 'Place Order'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="rounded-3xl shadow-lg border-gray-200 sticky top-6">
              <CardContent className="p-10">
                <h2 className="text-gray-500 font-semibold text-base mb-8 uppercase tracking-wide">
                  Order Summary
                </h2>
                
                <div className="space-y-6">
                  <div className="max-h-72 overflow-y-auto space-y-4 pr-2">
                    {cart.map((item, index) => (
                      <div key={`${item.id}-${item.size}-${index}`} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="text-base font-semibold">{item.name}</p>
                          {item.size && (
                            <p className="text-sm text-gray-500 mt-1">Weight: {item.size}</p>
                          )}
                          <p className="text-sm text-gray-600 mt-1">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-base font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex gap-3">
                      <Input
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        disabled={couponApplied}
                        className="h-12 text-base flex-1"
                      />
                      <Button 
                        onClick={applyCoupon}
                        disabled={couponApplied}
                        className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium whitespace-nowrap"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600 font-medium">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-base text-green-600">
                        <span className="font-medium">Discount (10%)</span>
                        <span className="font-semibold">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600 font-medium">Shipping</span>
                      <span className="font-semibold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
                      <span>Total</span>
                      <span className="text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 space-y-4 text-sm">
                    <div className="flex items-center gap-3">
                      <Truck className="w-6 h-6 text-blue-600" />
                      <span className="text-gray-600">Free shipping on orders over $25</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-blue-600" />
                      <span className="text-gray-600">100% secure payment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <RefreshCw className="w-6 h-6 text-blue-600" />
                      <span className="text-gray-600">Easy returns within 7 days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RazorpayModal
        open={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        amount={total}
      />
    </div>
  );
}
