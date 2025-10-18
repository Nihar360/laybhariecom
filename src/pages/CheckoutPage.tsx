import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigation } from '../contexts/NavigationContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { MapPin, Info } from 'lucide-react';
import { toast } from 'sonner';
import { RazorpayModal } from '../components/RazorpayModal';

const countryStateData: Record<string, Record<string, string[]>> = {
  India: {
    "Andhra Pradesh": [
      "Visakhapatnam",
      "Vijayawada",
      "Guntur",
      "Nellore",
      "Tirupati",
    ],
    "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang"],
    Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Tezpur"],
    Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
    Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
    Delhi: [
      "New Delhi",
      "North Delhi",
      "South Delhi",
      "East Delhi",
      "West Delhi",
    ],
    Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
    Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
    Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
    "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu"],
    Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
    Karnataka: ["Bengaluru", "Mysuru", "Mangaluru", "Hubli", "Belagavi"],
    Kerala: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kannur"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Aurangabad"],
    Manipur: ["Imphal", "Thoubal", "Bishnupur", "Churachandpur"],
    Meghalaya: ["Shillong", "Tura", "Nongstoin", "Jowai"],
    Mizoram: ["Aizawl", "Lunglei", "Champhai", "Serchhip"],
    Nagaland: ["Kohima", "Dimapur", "Mokokchung", "Tuensang"],
    Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
    Punjab: ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
    Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner"],
    Sikkim: ["Gangtok", "Namchi", "Gyalshing", "Mangan"],
    "Tamil Nadu": [
      "Chennai",
      "Coimbatore",
      "Madurai",
      "Tiruchirappalli",
      "Salem",
    ],
    Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
    Tripura: ["Agartala", "Udaipur", "Dharmanagar", "Kailashahar"],
    "Uttar Pradesh": [
      "Lucknow",
      "Kanpur",
      "Agra",
      "Varanasi",
      "Meerut",
      "Noida",
    ],
    Uttarakhand: ["Dehradun", "Haridwar", "Roorkee", "Nainital", "Rishikesh"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri", "Asansol"],
  },
  USA: {
    California: [
      "Los Angeles",
      "San Francisco",
      "San Diego",
      "Sacramento",
      "San Jose",
    ],
    Texas: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
    "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
    Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
    Illinois: ["Chicago", "Springfield", "Naperville", "Peoria", "Rockford"],
    Pennsylvania: [
      "Philadelphia",
      "Pittsburgh",
      "Harrisburg",
      "Allentown",
      "Erie",
    ],
    Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
    Georgia: ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens"],
    Michigan: ["Detroit", "Grand Rapids", "Warren", "Ann Arbor", "Lansing"],
    Washington: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
  },
  UK: {
    England: [
      "London",
      "Manchester",
      "Birmingham",
      "Leeds",
      "Liverpool",
      "Newcastle",
    ],
    Scotland: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
    Wales: ["Cardiff", "Swansea", "Newport", "Wrexham", "Barry"],
    "Northern Ireland": ["Belfast", "Derry", "Lisburn", "Newry", "Armagh"],
  },
  Canada: {
    Ontario: ["Toronto", "Ottawa", "Mississauga", "Hamilton", "London"],
    Quebec: ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil"],
    "British Columbia": [
      "Vancouver",
      "Victoria",
      "Surrey",
      "Burnaby",
      "Richmond",
    ],
    Alberta: ["Calgary", "Edmonton", "Red Deer", "Lethbridge", "Medicine Hat"],
  },
};

export function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { navigateTo } = useNavigation();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const [formData, setFormData] = useState({
    contact: '',
    emailOffers: false,
    country: 'India',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
    phone: '',
    saveInfo: false,
    paymentMethod: 'razorpay',
    billingAddress: 'same',
    discountCode: '',
  });

  const [couponApplied, setCouponApplied] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      if (field === 'country') {
        newData.state = '';
        newData.city = '';
        if (value !== 'India' && newData.paymentMethod === 'cod') {
          newData.paymentMethod = 'razorpay';
        }
      }

      if (field === 'state') {
        newData.city = '';
      }

      return newData;
    });
  };

  const subtotal = getTotalPrice();
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 25 ? 0 : 3;
  const taxRate = 0.18;
  const taxAmount = (subtotal - discount) * taxRate;
  const total = subtotal - discount + shipping + taxAmount;

  const validateForm = () => {
    if (!formData.contact || !formData.firstName || !formData.lastName || 
        !formData.address || !formData.city || !formData.state || !formData.pinCode || !formData.phone) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contact.includes('@') && !emailRegex.test(formData.contact)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const orderData = {
      items: cart,
      address: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        contact: formData.contact,
        addressLine1: formData.address,
        addressLine2: formData.apartment,
        city: formData.city,
        state: formData.state,
        zipCode: formData.pinCode,
        country: formData.country,
        phone: formData.phone,
      },
      pricing: {
        subtotal,
        discount,
        shipping,
        tax: taxAmount,
        total,
      },
      paymentMethod: formData.paymentMethod,
      orderDate: new Date().toISOString(),
    };

    if (formData.paymentMethod === 'razorpay') {
      setShowPaymentModal(true);
    } else {
      clearCart();
      toast.success('Order placed successfully via COD!');
      navigateTo('order-success', orderData);
    }
  };

  const handlePaymentSuccess = () => {
    const orderData = {
      items: cart,
      address: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        contact: formData.contact,
        addressLine1: formData.address,
        addressLine2: formData.apartment,
        city: formData.city,
        state: formData.state,
        zipCode: formData.pinCode,
        country: formData.country,
        phone: formData.phone,
      },
      pricing: {
        subtotal,
        discount,
        shipping,
        tax: taxAmount,
        total,
      },
      paymentMethod: formData.paymentMethod,
      orderDate: new Date().toISOString(),
    };

    setShowPaymentModal(false);
    clearCart();
    toast.success('Payment Successful!');
    navigateTo('order-success', orderData);
  };

  const handleApplyDiscount = () => {
    if (!formData.discountCode.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    if (couponApplied) {
      toast.info('Discount already applied!');
      return;
    }

    setCouponApplied(true);
    toast.success('Discount applied successfully! (10% off)');
  };

  const currentStates = countryStateData[formData.country] || {};
  const currentCities = formData.state ? currentStates[formData.state] || [] : [];
  const isCodAllowed = formData.country === 'India';

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Your cart is empty</h2>
          <Button onClick={() => navigateTo('home')}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold">SPICE HOUSE</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg order-2 lg:order-1">
              <form onSubmit={handlePayNow}>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium">Contact</h2>
                  </div>
                  <Input
                    type="text"
                    placeholder="Email or mobile phone number"
                    value={formData.contact}
                    onChange={(e) => handleInputChange('contact', e.target.value)}
                    className="mb-3"
                  />
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emailOffers"
                      checked={formData.emailOffers}
                      onCheckedChange={(checked: boolean) => handleInputChange('emailOffers', checked)}
                    />
                    <label htmlFor="emailOffers" className="text-sm cursor-pointer">
                      Email me with news and offers
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-4">Delivery</h2>
                  
                  <div className="mb-3">
                    <Label className="text-sm text-gray-600 mb-1 block">Country/Region</Label>
                    <Select value={formData.country} onValueChange={(value: string) => handleInputChange('country', value)}>
                      <SelectTrigger>
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

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Input
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                    />
                    <Input
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                    />
                  </div>

                  <div className="mb-3 relative">
                    <Input
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>

                  <Input
                    placeholder="Apartment, suite, etc. (optional)"
                    value={formData.apartment}
                    onChange={(e) => handleInputChange('apartment', e.target.value)}
                    className="mb-3"
                  />

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="space-y-2">
                      <Select 
                        value={formData.state} 
                        onValueChange={(value: string) => handleInputChange('state', value)}
                        disabled={!formData.country}
                      >
                        <SelectTrigger>
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
                      <Select 
                        value={formData.city} 
                        onValueChange={(value: string) => handleInputChange('city', value)}
                        disabled={!formData.state}
                      >
                        <SelectTrigger>
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
                    <Input
                      placeholder="PIN code"
                      value={formData.pinCode}
                      onChange={(e) => handleInputChange('pinCode', e.target.value)}
                    />
                  </div>

                  <div className="mb-3 relative">
                    <Input
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                    <Info className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveInfo"
                      checked={formData.saveInfo}
                      onCheckedChange={(checked: boolean) => handleInputChange('saveInfo', checked)}
                    />
                    <label htmlFor="saveInfo" className="text-sm cursor-pointer">
                      Save this information for next time
                    </label>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-2">Shipping method</h2>
                  <p className="text-sm text-gray-600 mb-3">
                    {shipping === 0 ? 'Free Shipping on orders over $25' : `Shipping: $${shipping.toFixed(2)}`}
                  </p>
                  <div className="bg-gray-100 p-4 rounded text-sm text-gray-500">
                    {formData.address && formData.city && formData.state 
                      ? `Shipping to: ${formData.address}, ${formData.city}, ${formData.state}`
                      : 'Enter your shipping address to view available shipping methods.'}
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-2">Payment</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    All transactions are secure and encrypted.
                  </p>

                  <RadioGroup value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <div className="border rounded-lg overflow-hidden mb-3">
                      <div className="flex items-center space-x-2 p-4 border-b bg-blue-50">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <label htmlFor="razorpay" className="flex-1 cursor-pointer">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Razorpay Secure (UPI, Cards, Int'l Cards, Wallets)</span>
                            <div className="flex gap-1 items-center">
                              <span className="text-xs px-2 py-0.5 bg-white border rounded">UPI</span>
                              <span className="w-6 h-4 bg-blue-700 rounded"></span>
                              <span className="w-6 h-4 bg-red-600 rounded"></span>
                              <span className="text-xs">+17</span>
                            </div>
                          </div>
                        </label>
                      </div>
                      
                      {formData.paymentMethod === 'razorpay' && (
                        <div className="p-4 bg-gray-50">
                          <div className="flex justify-center mb-3">
                            <div className="border-2 border-gray-300 rounded p-4 w-32 h-20 flex items-center justify-center relative">
                              <svg className="w-16 h-16 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="2"/>
                                <path d="M3 10h18" strokeWidth="2"/>
                              </svg>
                              <svg className="w-8 h-8 text-gray-400 absolute" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 15l-4-4m0 0l4-4m-4 4h13" strokeWidth="2" strokeLinecap="round"/>
                              </svg>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 text-center">
                            After clicking "Pay now", you will be redirected to Razorpay Secure (UPI, Cards, Int'l Cards, Wallets) to complete your purchase securely.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className={`flex items-center space-x-2 p-4 border rounded-lg ${!isCodAllowed ? 'opacity-50 bg-gray-50' : ''}`}>
                      <RadioGroupItem value="cod" id="cod" disabled={!isCodAllowed} />
                      <div className="flex-1">
                        <label htmlFor="cod" className={`text-sm ${isCodAllowed ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                          Cash on Delivery (COD)
                        </label>
                        {!isCodAllowed && (
                          <p className="text-xs text-gray-500 mt-1">
                            Only available for India
                          </p>
                        )}
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-medium mb-4">Billing address</h2>
                  <RadioGroup value={formData.billingAddress} onValueChange={(value) => handleInputChange('billingAddress', value)}>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg mb-2 bg-blue-50">
                      <RadioGroupItem value="same" id="same" />
                      <label htmlFor="same" className="text-sm cursor-pointer">
                        Same as shipping address
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="different" id="different" />
                      <label htmlFor="different" className="text-sm cursor-pointer">
                        Use a different billing address
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg">
                  Pay now
                </Button>

                <div className="mt-6 flex flex-wrap gap-3 justify-center text-xs text-blue-600">
                  <a href="#" className="hover:underline">Refund policy</a>
                  <a href="#" className="hover:underline">Shipping</a>
                  <a href="#" className="hover:underline">Privacy policy</a>
                  <a href="#" className="hover:underline">Terms of service</a>
                  <a href="#" className="hover:underline">Contact</a>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg order-1 lg:order-2">
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={`${item.id}-${item.size}-${index}`} className="flex gap-4">
                    <div className="relative">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm">{item.name}</h3>
                      {item.size && (
                        <p className="text-xs text-gray-500">{item.size}</p>
                      )}
                    </div>
                    <div className="text-sm">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Discount code"
                      value={formData.discountCode}
                      onChange={(e) => handleInputChange('discountCode', e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleApplyDiscount}
                      disabled={couponApplied}
                      className="px-6"
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount (10%)</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <span>Shipping</span>
                      <Info className="w-3 h-3 text-gray-400" />
                    </div>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (18%)</span>
                    <span>₹{taxAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">INR</div>
                      <div className="text-xl font-semibold">₹{total.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <RazorpayModal
          open={showPaymentModal}
          amount={total}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </>
  );
}
