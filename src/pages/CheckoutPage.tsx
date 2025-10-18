import { useState } from "react";
import { useNavigation } from "../contexts/NavigationContext";
import { useCart } from "../contexts/CartContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ChevronLeft, Truck, Shield, RefreshCw, Gift } from "lucide-react";
import { toast } from "sonner";
import { RazorpayModal } from "../components/RazorpayModal";

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
  const { goBack, navigateTo } = useNavigation();
  const { cart, getTotalPrice, clearCart } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">(
    "razorpay",
  );
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      if (field === "country") {
        newData.state = "";
        newData.city = "";
        if (value !== "India" && paymentMethod === "cod") {
          setPaymentMethod("razorpay");
        }
      }

      if (field === "state") {
        newData.city = "";
      }

      return newData;
    });
  };

  const validateForm = () => {
    const required = [
      "fullName",
      "mobile",
      "email",
      "addressLine1",
      "city",
      "state",
      "zipCode",
    ];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(
          `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
        );
        return false;
      }
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handlePayment = () => {
    if (!validateForm()) return;

    const orderData = {
      items: cart,
      address: formData,
      pricing: {
        subtotal,
        discount,
        shipping,
        total,
      },
      paymentMethod,
      orderDate: new Date().toISOString(),
    };

    if (paymentMethod === "razorpay") {
      setShowPaymentModal(true);
    } else {
      clearCart();
      toast.success("Order placed successfully via COD!");
      navigateTo("order-success", orderData);
    }
  };

  const handlePaymentSuccess = () => {
    const orderData = {
      items: cart,
      address: formData,
      pricing: {
        subtotal,
        discount,
        shipping,
        total,
      },
      paymentMethod,
      orderDate: new Date().toISOString(),
    };

    setShowPaymentModal(false);
    clearCart();
    toast.success("Payment Successful!");
    navigateTo("order-success", orderData);
  };

  const applyCoupon = () => {
    if (!coupon.trim()) {
      toast.error("Please enter a valid coupon code.");
      return;
    }

    if (couponApplied) {
      toast.info("Coupon already applied!");
      return;
    }

    setCouponApplied(true);
    toast.success("Coupon applied successfully! (10% off)");
  };

  const subtotal = getTotalPrice();
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 25 ? 0 : 3;
  const total = subtotal - discount + shipping;

  const currentStates = countryStateData[formData.country] || {};
  const currentCities = formData.state
    ? currentStates[formData.state] || []
    : [];
  const isCodAllowed = formData.country === "India";

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Gift className="w-16 h-16 text-slate-300 mx-auto mb-6" />
          <p className="text-slate-500 mb-6 text-lg">Your cart is empty</p>
          <Button
            onClick={() => navigateTo("home")}
            className="bg-black hover:bg-slate-900 px-8 py-6 text-base rounded-full"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-100/50">
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Back</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-2">Checkout</h1>
          <p className="text-slate-500">
            Complete your order in a few simple steps
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-8 py-6 border-b border-slate-100">
                <h2 className="text-slate-900 font-semibold text-sm uppercase tracking-wider">
                  📍 Delivery Address
                </h2>
              </div>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="fullName"
                        className="text-slate-700 font-medium text-sm"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        placeholder="John Doe"
                        className="h-11 text-base px-4 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-lg transition-colors duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="mobile"
                        className="text-slate-700 font-medium text-sm"
                      >
                        Mobile Number
                      </Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) =>
                          handleInputChange("mobile", e.target.value)
                        }
                        placeholder="9876543210"
                        className="h-11 text-base px-4 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-lg transition-colors duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-slate-700 font-medium text-sm"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="john@example.com"
                      className="h-11 text-base px-4 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-lg transition-colors duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="addressLine1"
                      className="text-slate-700 font-medium text-sm"
                    >
                      Address Line 1
                    </Label>
                    <Input
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) =>
                        handleInputChange("addressLine1", e.target.value)
                      }
                      placeholder="House No., Street Name"
                      className="h-11 text-base px-4 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-lg transition-colors duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="addressLine2"
                      className="text-slate-700 font-medium text-sm"
                    >
                      Address Line 2 (Optional)
                    </Label>
                    <Input
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) =>
                        handleInputChange("addressLine2", e.target.value)
                      }
                      placeholder="Landmark, Area"
                      className="h-11 text-base px-4 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-lg transition-colors duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="country"
                      className="text-slate-700 font-medium text-sm"
                    >
                      Country
                    </Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        handleInputChange("country", value)
                      }
                    >
                      <SelectTrigger className="h-11 text-base border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-lg transition-colors duration-200">
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
                    <div className="space-y-2">
                      <Label
                        htmlFor="state"
                        className="text-slate-700 font-medium text-sm"
                      >
                        State
                      </Label>
                      <Select
                        value={formData.state}
                        onValueChange={(value) =>
                          handleInputChange("state", value)
                        }
                        disabled={!formData.country}
                      >
                        <SelectTrigger className="h-11 text-base border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-lg transition-colors duration-200 disabled:bg-slate-50">
                          <SelectValue
                            placeholder={
                              formData.country
                                ? "Select State"
                                : "Select Country first"
                            }
                          />
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
                    <div className="space-y-2">
                      <Label
                        htmlFor="city"
                        className="text-slate-700 font-medium text-sm"
                      >
                        City
                      </Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) =>
                          handleInputChange("city", value)
                        }
                        disabled={!formData.state}
                      >
                        <SelectTrigger className="h-11 text-base border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-lg transition-colors duration-200 disabled:bg-slate-50">
                          <SelectValue
                            placeholder={
                              formData.state
                                ? "Select City"
                                : "Select State first"
                            }
                          />
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="zipCode"
                      className="text-slate-700 font-medium text-sm"
                    >
                      Zip Code
                    </Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      placeholder="400001"
                      className="h-11 text-base px-4 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-lg transition-colors duration-200"
                    />
                  </div>
                </div>
              </CardContent>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-8 py-6 border-b border-slate-100">
                <h2 className="text-slate-900 font-semibold text-sm uppercase tracking-wider">
                  💳 Payment Method
                </h2>
              </div>
              <CardContent className="p-8">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value as "razorpay" | "cod")
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer group">
                    <RadioGroupItem
                      value="razorpay"
                      id="razorpay"
                      className="border-2 border-slate-300 text-blue-600 group-hover:border-blue-500 transition-colors"
                    />
                    <Label
                      htmlFor="razorpay"
                      className="text-base font-medium cursor-pointer flex-1 text-slate-900"
                    >
                      Razorpay / UPI / Cards
                    </Label>
                  </div>
                  <div
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 ${
                      !isCodAllowed
                        ? "opacity-50 cursor-not-allowed bg-slate-50 border-slate-200"
                        : "cursor-pointer border-slate-200 hover:border-blue-300 hover:bg-blue-50/50"
                    }`}
                  >
                    <RadioGroupItem
                      value="cod"
                      id="cod"
                      disabled={!isCodAllowed}
                      className="border-2 border-slate-300 text-blue-600 disabled:opacity-50"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor="cod"
                        className={`text-base font-medium ${isCodAllowed ? "cursor-pointer text-slate-900" : "cursor-not-allowed text-slate-500"}`}
                      >
                        Cash on Delivery (COD)
                      </Label>
                      {!isCodAllowed && (
                        <p className="text-xs text-slate-500 mt-1">
                          Only available for India
                        </p>
                      )}
                    </div>
                  </div>
                </RadioGroup>

                <div className="flex justify-center">
                  <Button
                    size="lg"
                    className="bg-black hover:bg-gray-900 text-white font-semibold mt-12 h-16 text-lg rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] px-20 border border-gray-800"
                    onClick={handlePayment}
                  >
                    {paymentMethod === "razorpay"
                      ? `Pay Now ₹${total.toFixed(2)}`
                      : "Place Order"}
                  </Button>
                </div>
              </CardContent>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm sticky top-6 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 px-8 py-6 border-b border-slate-100">
                <h2 className="text-slate-900 font-semibold text-sm uppercase tracking-wider">
                  📦 Order Summary
                </h2>
              </div>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="max-h-72 overflow-y-auto space-y-4 pr-2">
                    {cart.map((item, index) => (
                      <div
                        key={`${item.id}-${item.size}-${index}`}
                        className="flex gap-3 pb-4 border-b border-slate-100 last:border-0"
                      >
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 line-clamp-2">
                            {item.name}
                          </p>
                          {item.size && (
                            <p className="text-xs text-slate-500 mt-1">
                              Weight: {item.size}
                            </p>
                          )}
                          <p className="text-xs text-slate-600 mt-1">
                            ${item.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 flex-shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        disabled={couponApplied}
                        className="h-10 text-sm flex-1 border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-50 rounded-lg transition-colors"
                      />
                      <Button
                        onClick={applyCoupon}
                        disabled={couponApplied}
                        className="h-12 px-8 bg-black hover:bg-gray-800 text-white font-medium text-base whitespace-nowrap rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-semibold text-slate-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span className="font-medium">Discount (10%)</span>
                        <span className="font-semibold">
                          -${discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Shipping</span>
                      <span className="font-semibold text-slate-900">
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-4 mt-4 bg-gradient-to-r from-blue-50 to-transparent p-3 rounded-lg">
                      <span className="text-slate-900">Total</span>
                      <span className="text-blue-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 space-y-3 text-xs">
                    <div className="flex items-start gap-3 p-3 bg-blue-50/60 hover:bg-blue-50 rounded-lg transition-colors duration-200 cursor-default">
                      <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">
                        Free shipping on orders over $25
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-emerald-50/60 hover:bg-emerald-50 rounded-lg transition-colors duration-200 cursor-default">
                      <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">
                        100% secure & encrypted payment
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-amber-50/60 hover:bg-amber-50 rounded-lg transition-colors duration-200 cursor-default">
                      <RefreshCw className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-600">
                        Hassle-free returns within 7 days
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
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
