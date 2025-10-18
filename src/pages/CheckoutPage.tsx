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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ChevronLeft, Gift, Info } from "lucide-react";
import { toast } from "sonner";
import { RazorpayModal } from "../components/RazorpayModal";

// Data for countries, states, and cities
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
    Manipur: ["Imphal", "Thoubal", "Bishnopur", "Churachandpur"],
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
  },
  UK: {
    England: ["London", "Manchester", "Birmingham", "Leeds", "Liverpool"],
    Scotland: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"],
    Wales: ["Cardiff", "Swansea", "Newport", "Wrexham"],
  },
  Canada: {
    Ontario: ["Toronto", "Ottawa", "Mississauga", "Hamilton", "London"],
    Quebec: ["Montreal", "Quebec City", "Laval", "Gatineau"],
    "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby"],
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
      "country",
    ];
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        toast.error(
          `Please fill in your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`,
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
      pricing: { subtotal, discount, shipping, total },
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
      pricing: { subtotal, discount, shipping, total },
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
    toast.success("Coupon 'SAVE10' applied successfully! (10% off)");
  };

  const subtotal = getTotalPrice();
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal - discount > 25 ? 0 : 5;
  const total = subtotal - discount + shipping;

  const currentStates = countryStateData[formData.country] || {};
  const currentCities = formData.state
    ? currentStates[formData.state] || []
    : [];
  const isCodAllowed = formData.country === "India";

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Gift className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <p className="text-gray-600 mb-6 text-lg">Your cart is empty</p>
          <Button
            onClick={() => navigateTo("home")}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-base rounded-md"
          >
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="mb-8">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium text-sm">Back to Cart</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Form */}
          <div className="order-2 lg:order-1">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handlePayment();
              }}
            >
              <div className="space-y-8">
                {/* Contact Information */}
                <Card className="bg-white rounded-lg shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="mobile">Mobile Number</Label>
                        <Input
                          id="mobile"
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) =>
                            handleInputChange("mobile", e.target.value)
                          }
                          placeholder="9876543210"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Delivery Address */}
                <Card className="bg-white rounded-lg shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Delivery Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="addressLine1">Address Line 1</Label>
                      <Input
                        id="addressLine1"
                        value={formData.addressLine1}
                        onChange={(e) =>
                          handleInputChange("addressLine1", e.target.value)
                        }
                        placeholder="House No., Street Name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="addressLine2">
                        Address Line 2 (Optional)
                      </Label>
                      <Input
                        id="addressLine2"
                        value={formData.addressLine2}
                        onChange={(e) =>
                          handleInputChange("addressLine2", e.target.value)
                        }
                        placeholder="Landmark, Area"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value) =>
                            handleInputChange("country", value)
                          }
                        >
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
                      <div>
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) =>
                            handleInputChange("zipCode", e.target.value)
                          }
                          placeholder="400001"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) =>
                            handleInputChange("state", value)
                          }
                          disabled={!formData.country}
                        >
                          <SelectTrigger>
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
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Select
                          value={formData.city}
                          onValueChange={(value) =>
                            handleInputChange("city", value)
                          }
                          disabled={!formData.state}
                        >
                          <SelectTrigger>
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
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="bg-white rounded-lg shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Method</CardTitle>
                    <p className="text-sm text-gray-500">
                      All transactions are secure and encrypted.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value) =>
                        setPaymentMethod(value as "razorpay" | "cod")
                      }
                      className="space-y-3"
                    >
                      <Label
                        htmlFor="razorpay"
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer ${paymentMethod === "razorpay" ? "bg-blue-50 border-blue-300" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <span className="font-medium">
                          Razorpay / UPI / Cards
                        </span>
                      </Label>
                      <Label
                        htmlFor="cod"
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 ${!isCodAllowed ? "opacity-60 bg-gray-50 cursor-not-allowed" : `cursor-pointer ${paymentMethod === "cod" ? "bg-blue-50 border-blue-300" : "border-gray-200 hover:border-gray-300"}`}`}
                      >
                        <RadioGroupItem
                          value="cod"
                          id="cod"
                          disabled={!isCodAllowed}
                        />
                        <div className="flex-1">
                          <span className="font-medium">
                            Cash on Delivery (COD)
                          </span>
                          {!isCodAllowed && (
                            <p className="text-xs text-gray-500 mt-1">
                              Only available for orders within India
                            </p>
                          )}
                        </div>
                      </Label>
                    </RadioGroup>
                  </CardContent>
                </Card>
                <Button
                  size="lg"
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg"
                >
                  {paymentMethod === "razorpay"
                    ? `Pay Now ₹${total.toFixed(2)}`
                    : "Place Order"}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold mb-4 border-b pb-4">
                Order Summary
              </h2>
              <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                {cart.map((item, index) => (
                  <div
                    key={`${item.id}-${item.size}-${index}`}
                    className="flex items-center gap-4"
                  >
                    <div className="relative">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-2">
                        {item.name}
                      </p>
                      {item.size && (
                        <p className="text-xs text-gray-500">
                          Weight: {item.size}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    disabled={couponApplied}
                  />
                  <Button
                    variant="outline"
                    onClick={applyCoupon}
                    disabled={couponApplied}
                    className="px-6 whitespace-nowrap"
                  >
                    Apply
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="font-medium">Discount (10%)</span>
                    <span className="font-medium">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <span>Shipping</span>
                    <Info className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
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
