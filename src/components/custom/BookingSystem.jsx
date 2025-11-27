import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CreditCard,
  Calendar,
  MapPin,
  Users,
  Clock,
  Shield,
  CheckCircle,
  AlertCircle,
  Plane,
  Hotel,
  Car,
  Ticket
} from 'lucide-react';
import { toast } from 'sonner';
import paymentService from '@/services/PaymentService';

const BookingSystem = ({ tripData, onBookingComplete }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingStep, setBookingStep] = useState('review'); // review, payment, confirmation

  const bookingCategories = [
    {
      id: 'accommodation',
      title: 'Hotels & Stays',
      icon: <Hotel className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'transport',
      title: 'Transportation',
      icon: <Car className="w-5 h-5" />,
      color: 'bg-green-500'
    },
    {
      id: 'activities',
      title: 'Activities & Tours',
      icon: <Ticket className="w-5 h-5" />,
      color: 'bg-purple-500'
    },
    {
      id: 'flights',
      title: 'Flights',
      icon: <Plane className="w-5 h-5" />,
      color: 'bg-orange-500'
    }
  ];

  const mockBookingItems = [
    // Hotels - 3 options
    {
      id: 'hotel_1',
      category: 'accommodation',
      name: 'The Grand Heritage Hotel',
      description: '3 nights stay in Deluxe Room',
      price: 12000,
      originalPrice: 15000,
      savings: 3000,
      rating: 4.5,
      amenities: ['Free WiFi', 'Breakfast', 'Pool', 'Spa'],
      cancellation: 'Free cancellation till 24 hours',
      bookingUrl: 'https://easemytrip.com/hotels/booking/12345',
      priority: 'high'
    },
    {
      id: 'hotel_2',
      category: 'accommodation',
      name: 'Royal Palace Resort',
      description: '3 nights stay in Premium Suite',
      price: 18000,
      originalPrice: 22000,
      savings: 4000,
      rating: 4.8,
      amenities: ['Free WiFi', 'Breakfast', 'Pool', 'Spa', 'Gym', 'Butler Service'],
      cancellation: 'Free cancellation till 48 hours',
      bookingUrl: 'https://easemytrip.com/hotels/booking/12346',
      priority: 'medium'
    },
    {
      id: 'hotel_3',
      category: 'accommodation',
      name: 'Budget Inn Express',
      description: '3 nights stay in Standard Room',
      price: 6000,
      originalPrice: 7500,
      savings: 1500,
      rating: 4.0,
      amenities: ['Free WiFi', 'Breakfast', 'AC'],
      cancellation: 'Free cancellation till 12 hours',
      bookingUrl: 'https://easemytrip.com/hotels/booking/12347',
      priority: 'low'
    },
    // Transport - 3 options
    {
      id: 'transport_1',
      category: 'transport',
      name: 'Premium Airport Transfer + Sightseeing',
      description: 'Luxury AC Sedan for 3 days with driver',
      price: 8500,
      originalPrice: 10000,
      savings: 1500,
      rating: 4.3,
      features: ['AC Vehicle', 'English Speaking Driver', 'Fuel Included', 'Water Bottles'],
      cancellation: 'Free cancellation till 2 hours',
      bookingUrl: 'https://easemytrip.com/cabs/booking/67890',
      priority: 'high'
    },
    {
      id: 'transport_2',
      category: 'transport',
      name: 'SUV with Driver - Full Day',
      description: 'Spacious SUV for 3 days, perfect for groups',
      price: 12000,
      originalPrice: 14000,
      savings: 2000,
      rating: 4.5,
      features: ['AC SUV', 'Professional Driver', 'Fuel Included', 'Luggage Space'],
      cancellation: 'Free cancellation till 4 hours',
      bookingUrl: 'https://easemytrip.com/cabs/booking/67891',
      priority: 'medium'
    },
    {
      id: 'transport_3',
      category: 'transport',
      name: 'Budget Cab Service',
      description: 'Economy AC Hatchback for 3 days',
      price: 5500,
      originalPrice: 6500,
      savings: 1000,
      rating: 4.0,
      features: ['AC Vehicle', 'Driver', 'Fuel Included'],
      cancellation: 'Free cancellation till 1 hour',
      bookingUrl: 'https://easemytrip.com/cabs/booking/67892',
      priority: 'low'
    },
    // Activities - 3 options
    {
      id: 'activity_1',
      category: 'activities',
      name: 'Heritage Walking Tour + Cooking Class',
      description: 'Guided tour with authentic cooking experience',
      price: 3500,
      originalPrice: 4000,
      savings: 500,
      rating: 4.8,
      features: ['Expert Guide', 'All Materials', 'Certificate', 'Lunch'],
      cancellation: 'Free cancellation till 6 hours',
      bookingUrl: 'https://easemytrip.com/activities/booking/11111',
      priority: 'high'
    },
    {
      id: 'activity_2',
      category: 'activities',
      name: 'Adventure Sports Package',
      description: 'Paragliding, zip-lining, and rock climbing',
      price: 5500,
      originalPrice: 6500,
      savings: 1000,
      rating: 4.6,
      features: ['Safety Equipment', 'Trained Instructors', 'Photos & Videos', 'Snacks'],
      cancellation: 'Free cancellation till 12 hours',
      bookingUrl: 'https://easemytrip.com/activities/booking/11112',
      priority: 'medium'
    },
    {
      id: 'activity_3',
      category: 'activities',
      name: 'Cultural Evening Show',
      description: 'Traditional dance and music performance with dinner',
      price: 2500,
      originalPrice: 3000,
      savings: 500,
      rating: 4.4,
      features: ['Live Performance', 'Buffet Dinner', 'Cultural Experience', 'Souvenir'],
      cancellation: 'Free cancellation till 4 hours',
      bookingUrl: 'https://easemytrip.com/activities/booking/11113',
      priority: 'low'
    },
    // Flights - 3 options
    {
      id: 'flight_1',
      category: 'flights',
      name: 'IndiGo - Direct Flight',
      description: 'Non-stop flight, 2h 30m',
      price: 4500,
      originalPrice: 6000,
      savings: 1500,
      rating: 4.2,
      features: ['Cabin Baggage', 'Web Check-in', 'Seat Selection', 'Meals Available'],
      cancellation: 'Cancellation charges apply',
      bookingUrl: 'https://easemytrip.com/flights/booking/22221',
      priority: 'high'
    },
    {
      id: 'flight_2',
      category: 'flights',
      name: 'Air India - Premium Economy',
      description: 'Direct flight with extra legroom, 2h 15m',
      price: 7500,
      originalPrice: 9000,
      savings: 1500,
      rating: 4.5,
      features: ['Check-in Baggage', 'Priority Boarding', 'Complimentary Meals', 'Extra Legroom'],
      cancellation: 'Partial refund available',
      bookingUrl: 'https://easemytrip.com/flights/booking/22222',
      priority: 'medium'
    },
    {
      id: 'flight_3',
      category: 'flights',
      name: 'SpiceJet - Budget Option',
      description: '1 stop, 4h 45m',
      price: 3200,
      originalPrice: 4000,
      savings: 800,
      rating: 3.9,
      features: ['Cabin Baggage', 'Web Check-in', 'Affordable'],
      cancellation: 'Non-refundable',
      bookingUrl: 'https://easemytrip.com/flights/booking/22223',
      priority: 'low'
    }
  ];

  const handleItemToggle = (itemId) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getSelectedTotal = () => {
    return mockBookingItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.price, 0);
  };

  const getTotalSavings = () => {
    return mockBookingItems
      .filter(item => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.savings, 0);
  };

  const handleProceedToPayment = () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to book');
      return;
    }
    setBookingStep('payment');
  };

  const handleConfirmPayment = async () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    setIsProcessing(true);
    toast.loading('Processing payment...');

    try {
      // Use PaymentService for Razorpay
      if (paymentMethod === 'card' || paymentMethod === 'upi' || paymentMethod === 'netbanking' || paymentMethod === 'wallet') {
        // For demo purposes, we map all these to Razorpay since it supports all of them
        // In a real app, you might have specific flows

        const totalAmount = getSelectedTotal();

        // Prepare order data
        const orderData = {
          amount: totalAmount,
          currency: 'INR',
          description: `Booking for ${selectedItems.length} items`,
          bookingId: `EMT${Date.now()}`,
          customerInfo: {
            name: 'WanderMind User', // You might want to get this from user context
            email: 'user@wandermind.com',
            phone: '9999999999'
          }
        };

        await paymentService.processPayment(orderData, 'razorpay');
      } else {
        // Fallback for other methods if implemented
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Payment successful
      setBookingStep('confirmation');
      toast.dismiss();
      toast.success('Booking confirmed! Check your email for details.');

      if (onBookingComplete) {
        onBookingComplete({
          bookingId: `EMT${Date.now()}`,
          items: selectedItems,
          total: getSelectedTotal(),
          savings: getTotalSavings(),
          paymentMethod: paymentMethod
        });
      }

    } catch (error) {
      console.error('Payment Error:', error);
      toast.dismiss();
      toast.error(error.message || 'Payment failed. Please try again.');
      // Stay on payment step
    } finally {
      setIsProcessing(false);
    }
  };

  const BookingItem = ({ item }) => (
    <Card className={`cursor-pointer transition-all hover:shadow-lg ${selectedItems.includes(item.id) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
      }`} onClick={() => handleItemToggle(item.id)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1 rounded ${bookingCategories.find(cat => cat.id === item.category)?.color} text-white`}>
                {bookingCategories.find(cat => cat.id === item.category)?.icon}
              </div>
              <h3 className="font-semibold">{item.name}</h3>
              <Badge variant="secondary" className="text-xs">
                ⭐ {item.rating}
              </Badge>
            </div>

            <p className="text-sm text-gray-600 mb-2">{item.description}</p>

            <div className="flex flex-wrap gap-1 mb-3">
              {(item.amenities || item.features || []).slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-green-600">
              <Shield className="w-3 h-3" />
              {item.cancellation}
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-bold text-green-600">₹{item.price.toLocaleString()}</span>
              {selectedItems.includes(item.id) && (
                <CheckCircle className="w-5 h-5 text-blue-500" />
              )}
            </div>
            {item.savings > 0 && (
              <div className="text-xs">
                <span className="line-through text-gray-400">₹{item.originalPrice.toLocaleString()}</span>
                <span className="text-green-600 ml-1">Save ₹{item.savings.toLocaleString()}</span>
              </div>
            )}
            <Badge
              variant={item.priority === 'high' ? 'default' : 'secondary'}
              className="text-xs mt-1"
            >
              {item.priority === 'high' ? 'Recommended' : 'Optional'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (bookingStep === 'payment') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                {mockBookingItems
                  .filter(item => selectedItems.includes(item.id))
                  .map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-medium">₹{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-600">₹{getSelectedTotal().toLocaleString()}</span>
                </div>
                {getTotalSavings() > 0 && (
                  <div className="text-green-600 text-sm">
                    You save ₹{getTotalSavings().toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <h3 className="font-semibold mb-3">Select Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
                  { id: 'upi', name: 'UPI', icon: '📱' },
                  { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
                  { id: 'wallet', name: 'Digital Wallet', icon: '💰' }
                ].map(method => (
                  <div
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${paymentMethod === method.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-200'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                  >
                    <div className="text-3xl mb-2">{method.icon}</div>
                    <div className="text-sm font-medium">{method.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setBookingStep('review')}
                className="flex-1"
              >
                Back to Review
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={isProcessing || !paymentMethod}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Pay ₹{getSelectedTotal().toLocaleString()}
                  </>
                )}
              </Button>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg flex items-center gap-2 text-sm">
              <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-green-800 dark:text-green-200">
                Your payment is secured with 256-bit SSL encryption
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (bookingStep === 'confirmation') {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Your trip has been successfully booked. Confirmation details have been sent to your email.
          </p>

          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Booking ID:</span>
                <p>EMT{Date.now()}</p>
              </div>
              <div>
                <span className="font-medium">Total Amount:</span>
                <p className="text-green-600 font-bold">₹{getSelectedTotal().toLocaleString()}</p>
              </div>
              <div>
                <span className="font-medium">Items Booked:</span>
                <p>{selectedItems.length} items</p>
              </div>
              <div>
                <span className="font-medium">Total Savings:</span>
                <p className="text-green-600">₹{getTotalSavings().toLocaleString()}</p>
              </div>
            </div>
          </div>

          <Button onClick={() => {
            setBookingStep('review');
            setSelectedItems([]);
          }} className="w-full">
            Book More Items
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            One-Click Booking System
          </CardTitle>
          <p className="text-sm text-gray-600">
            Select items and book your entire trip with EaseMyTrip integration
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="accommodation">Hotels</TabsTrigger>
          <TabsTrigger value="transport">Transport</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="flights">Flights</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Show only 2 items from each category */}
          {bookingCategories.map(category => {
            const categoryItems = mockBookingItems
              .filter(item => item.category === category.id)
              .slice(0, 2); // Only show first 2 items

            return categoryItems.map(item => (
              <BookingItem key={item.id} item={item} />
            ));
          })}
        </TabsContent>

        {bookingCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            {mockBookingItems
              .filter(item => item.category === category.id)
              .map(item => (
                <BookingItem key={item.id} item={item} />
              ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Booking Summary */}
      {selectedItems.length > 0 && (
        <Card className="sticky bottom-4 bg-white dark:bg-gray-800 shadow-lg border-2 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Booking Summary</h3>
                <p className="text-sm text-gray-600">
                  {selectedItems.length} items selected
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  ₹{getSelectedTotal().toLocaleString()}
                </div>
                {getTotalSavings() > 0 && (
                  <div className="text-sm text-green-600">
                    You save ₹{getTotalSavings().toLocaleString()}
                  </div>
                )}
              </div>

              <Button
                onClick={handleProceedToPayment}
                disabled={isProcessing}
                size="lg"
                className="ml-4"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security & Guarantees */}
      <Card className="bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800">Secure Booking Guarantee</h4>
              <p className="text-sm text-green-700">
                256-bit SSL encryption • Instant confirmation • 24/7 support • Free cancellation on most bookings
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingSystem;