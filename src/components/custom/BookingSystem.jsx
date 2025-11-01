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
      id: 'transport_1',
      category: 'transport',
      name: 'Airport Transfer + Local Sightseeing',
      description: 'AC Cab for 3 days with driver',
      price: 8500,
      originalPrice: 10000,
      savings: 1500,
      rating: 4.3,
      features: ['AC Vehicle', 'English Speaking Driver', 'Fuel Included'],
      cancellation: 'Free cancellation till 2 hours',
      bookingUrl: 'https://easemytrip.com/cabs/booking/67890',
      priority: 'high'
    },
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
      priority: 'medium'
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

  const handleOneClickBooking = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to book');
      return;
    }

    setIsProcessing(true);
    setBookingStep('payment');

    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate payment processing
      setBookingStep('confirmation');
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Booking confirmed! Check your email for details.');
      
      if (onBookingComplete) {
        onBookingComplete({
          bookingId: `EMT${Date.now()}`,
          items: selectedItems,
          total: getSelectedTotal(),
          savings: getTotalSavings()
        });
      }

    } catch (error) {
      toast.error('Booking failed. Please try again.');
      setBookingStep('review');
    } finally {
      setIsProcessing(false);
    }
  };

  const BookingItem = ({ item }) => (
    <Card className={`cursor-pointer transition-all hover:shadow-lg ${
      selectedItems.includes(item.id) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
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

          <Button onClick={() => setBookingStep('review')} className="w-full">
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
          {mockBookingItems.map(item => (
            <BookingItem key={item.id} item={item} />
          ))}
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
                onClick={handleOneClickBooking}
                disabled={isProcessing}
                size="lg"
                className="ml-4"
              >
                {isProcessing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Book Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
              { id: 'upi', name: 'UPI', icon: '📱' },
              { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
              { id: 'wallet', name: 'Digital Wallet', icon: '💰' }
            ].map(method => (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                  paymentMethod === method.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100' 
                    : 'hover:border-gray-300 dark:hover:border-gray-600 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <div className="text-2xl mb-1">{method.icon}</div>
                <div className="text-sm font-medium">{method.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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