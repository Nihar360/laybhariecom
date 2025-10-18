-200 disabled:bg-slate-50">
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
