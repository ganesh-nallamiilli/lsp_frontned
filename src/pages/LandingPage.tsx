import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaTruck, FaBoxes, FaWarehouse, FaRoute } from 'react-icons/fa';

const LandingPage: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm fixed w-full z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="https://www.adya.ai/assets/Logo-6c607c84.png" 
                alt="Adya Logo" 
                className="w-8 h-8" 
              />
              <span className="ml-3 text-2xl font-bold text-blue-600">Adya</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced with logistics animation */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white pt-32 pb-20 relative overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10"></div>
        
        {/* Floating elements in background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute h-20 w-20 rounded-full bg-blue-400/10 -top-10 left-1/4 animate-float-slow"></div>
          <div className="absolute h-32 w-32 rounded-full bg-blue-300/10 top-1/3 right-1/4 animate-float-medium"></div>
          <div className="absolute h-16 w-16 rounded-full bg-blue-200/10 bottom-1/4 left-1/3 animate-float-fast"></div>
          <div className="absolute h-24 w-24 rounded-full bg-blue-500/10 -bottom-12 right-1/3 animate-float-slow"></div>
        </div>

        {/* Animated logistics icons */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute text-blue-200/5 text-[200px] -top-20 -left-20 animate-spin-slow">
            <FaBoxes />
          </div>
          <div className="absolute text-blue-200/5 text-[150px] top-1/2 -right-20 animate-spin-slower">
            <FaTruck />
          </div>
          <div className="absolute text-blue-200/5 text-[180px] -bottom-20 left-1/3 animate-spin-slowest">
            <FaWarehouse />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div data-aos="fade-up" className="relative z-10">
            <h1 className="text-6xl font-bold mb-6 leading-tight">
              Transform Your <br/>
              <span className="text-blue-200">Logistics</span> Journey
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl">
              Revolutionize your logistics operations with our comprehensive platform featuring ONDC integration, 
              real-time tracking, and smart wallet solutions.
            </p>
            <div className="flex space-x-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold 
                hover:bg-blue-50 transition-all transform hover:scale-105 hover:shadow-lg 
                flex items-center">
                <FaBoxes className="mr-2" />
                Get Started
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold 
                hover:bg-white/10 transition-all transform hover:scale-105">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.label} 
              className="bg-white rounded-xl shadow-lg p-6 transform hover:-translate-y-2 transition-all"
              data-aos="fade-up"
              data-aos-delay={index * 100}>
              <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16" data-aos="fade-up">
            How LogiConnect Works
          </h2>
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-200 transform -translate-y-1/2 hidden md:block"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {steps.map((step, index) => (
                <div key={step.title} 
                  className="relative"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}>
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center text-blue-600 text-2xl font-bold mb-4 mx-auto shadow-lg">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="py-24 bg-white relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0">
          <div className="absolute w-full h-full bg-gradient-to-b from-gray-50/50 to-white/50"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#f3f4f6,transparent)]"></div>
          <div className="grid grid-cols-8 gap-4 opacity-[0.03] absolute inset-0">
            {Array(64).fill(null).map((_, i) => (
              <div 
                key={i} 
                className="aspect-square bg-blue-600 rounded-lg animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" data-aos="fade-up">
              Powerful Features for Modern Logistics
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
              Everything you need to manage your logistics operations efficiently, from order tracking to franchise management.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integration Partners Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16" data-aos="fade-up">
            Trusted by Leading Logistics Partners
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <div key={partner.name} 
                className="bg-white p-8 rounded-xl shadow-sm flex items-center justify-center"
                data-aos="fade-up"
                data-aos-delay={index * 100}>
                <img src={partner.logo} alt={partner.name} className="h-12 opacity-70 hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" data-aos="fade-up">
              Why Choose LogiConnect?
            </h2>
            <p className="text-xl text-gray-600" data-aos="fade-up" data-aos-delay="100">
              Experience the advantages of our comprehensive logistics solution
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg" data-aos="fade-right">
              <h3 className="text-2xl font-bold mb-4">For Businesses</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Streamlined franchise management and operations
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Automated invoice generation and commission tracking
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Real-time analytics and performance metrics
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Integrated ONDC network access
                </li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg" data-aos="fade-left">
              <h3 className="text-2xl font-bold mb-4">For Customers</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Easy order tracking and status updates
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Convenient wallet recharge and payment options
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Hassle-free returns and refunds
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Transparent transaction history
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-b from-gray-100 to-gray-200 py-24 relative">
        <div 
          className="max-w-7xl mx-auto px-4 text-center"
          data-aos="fade-up"
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8">
            Join our platform and revolutionize your logistics operations
          </p>
          <Link
            to="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Sign Up Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">LogiConnect</h3>
              <p className="text-gray-400">
                Your complete logistics management solution
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Order Tracking</li>
                <li>Wallet Management</li>
                <li>Returns Processing</li>
                <li>Franchise Management</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Enhanced Feature Card Component
const FeatureCard: React.FC<{
  title: string;
  description: string;
  icon: string;
}> = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
      <div className="text-5xl mb-6 bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
};

// Features data
const features = [
  {
    title: "Franchise Management",
    description: "Create and manage multiple franchises with custom invoice generation. Track performance, manage commissions, and handle franchise-specific operations all in one place.",
    icon: "🏪"
  },
  {
    title: "Order Tracking System",
    description: "Real-time order tracking with detailed status updates, location tracking, and estimated delivery times. Keep your customers informed at every step.",
    icon: "📦"
  },
  {
    title: "Returns & RTO Management",
    description: "Streamlined process for handling returns and RTO (Return to Origin) cases. Automated workflows for quick resolution and status tracking.",
    icon: "↩️"
  },
  {
    title: "Smart Wallet System",
    description: "Secure digital wallet for instant payments and refunds. Recharge wallet, view transaction history, and manage funds with ease.",
    icon: "💳"
  },
  {
    title: "ONDC Integration",
    description: "Seamlessly connected with Open Network for Digital Commerce (ONDC) providers. Access multiple logistics partners and optimize delivery routes.",
    icon: "🔄"
  },
  {
    title: "Payment Flexibility",
    description: "Multiple payment options including wallet balance and live transactions. Secure payment gateway integration with real-time transaction status.",
    icon: "💰"
  },
  {
    title: "Transaction History",
    description: "Comprehensive transaction logs for orders and wallet activities. Detailed insights into payment history, refunds, and wallet recharges.",
    icon: "📊"
  },
  {
    title: "Custom Invoice Generation",
    description: "Franchise-specific invoice generation with customizable templates. Automated commission calculations and billing management.",
    icon: "📄"
  },
  {
    title: "Analytics Dashboard",
    description: "Powerful analytics tools to track performance metrics, delivery efficiency, and financial statistics. Make data-driven decisions.",
    icon: "📈"
  }
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "1M+", label: "Deliveries" },
  { value: "500+", label: "Franchises" },
  { value: "99.9%", label: "Success Rate" },
];

const steps = [
  {
    title: "Connect",
    description: "Link with ONDC network and logistics partners"
  },
  {
    title: "Manage",
    description: "Handle orders and track deliveries in real-time"
  },
  {
    title: "Process",
    description: "Automate returns and payment processing"
  },
  {
    title: "Grow",
    description: "Scale your business with detailed analytics"
  }
];

const partners = [
  // Add your logistics partners here
];

export default LandingPage;
