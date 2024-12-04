import React from 'react';
import { CreditCard } from 'lucide-react';
import { config } from '../config/env';

const Wallet: React.FC = () => {
  const amounts = [
    { value: 100, label: '₹100' },
    { value: 500, label: '₹500' },
    { value: 1000, label: '₹1000' },
    { value: 2000, label: '₹2000' },
  ];

  const handlePayment = async (amount: number) => {
    const options = {
      key: config.razorpayKeyId, // Add your Razorpay key ID in .env
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Wallet Recharge',
      handler: function (response: any) {
        // Handle successful payment
        console.log('Payment ID: ', response.razorpay_payment_id);
        // Add your API call here to update the wallet balance
      },
      prefill: {
        name: 'User Name', // You can get this from user context/state
        email: 'user@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#4F46E5', // Indigo color to match your UI
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  return (
    <div className="max-w-md mx-auto space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Add Money to Wallet</h1>
        <p className="text-gray-600 mb-6">Choose an amount to add to your wallet</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {amounts.map((amount) => (
          <button
            key={amount.value}
            onClick={() => handlePayment(amount.value)}
            className="flex items-center justify-center p-4 bg-white border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
          >
            <span className="text-xl font-semibold text-indigo-600">{amount.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => handlePayment(1000)}
        className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mt-6"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        Pay Now
      </button>
    </div>
  );
};

export default Wallet;