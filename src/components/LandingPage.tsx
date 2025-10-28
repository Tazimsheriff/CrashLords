import { useState } from 'react';
import { Shield, ChevronRight, ChevronLeft, Mail, AlertTriangle, TrendingUp, Lock, Search, Brain, Users } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 0,
      title: 'Phishing Detection System',
      subtitle: 'AI-Powered Email Security',
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <div className="bg-blue-600 p-8 rounded-full shadow-2xl">
            <Shield className="w-24 h-24 text-white" />
          </div>
          <h1 className="text-6xl font-bold text-gray-800 text-center">
            Phishing Detection System
          </h1>
          <p className="text-2xl text-gray-600 text-center max-w-2xl">
            Protecting organizations from cyber threats through intelligent email analysis
          </p>
        </div>
      )
    },
    {
      id: 1,
      title: 'The Problem',
      subtitle: 'Rising Threat of Phishing Attacks',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-5xl font-bold text-gray-800">The Problem</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Phishing attacks are increasing at an alarming rate, targeting individuals and organizations worldwide.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-red-50 p-4 rounded-lg border border-red-200">
                <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">3.4 Billion</h3>
                  <p className="text-gray-600">Phishing emails sent daily</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-orange-50 p-4 rounded-lg border border-orange-200">
                <TrendingUp className="w-8 h-8 text-orange-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">$17,700</h3>
                  <p className="text-gray-600">Average cost per phishing incident</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <Users className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg text-gray-800">90%</h3>
                  <p className="text-gray-600">Of data breaches start with phishing</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-br from-red-100 to-orange-100 p-8 rounded-2xl shadow-xl">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <Mail className="w-12 h-12 text-red-600 mb-3" />
                  <h4 className="font-bold text-lg mb-2">Credential Theft</h4>
                  <p className="text-gray-600">Attackers steal usernames and passwords</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <Lock className="w-12 h-12 text-orange-600 mb-3" />
                  <h4 className="font-bold text-lg mb-2">Financial Loss</h4>
                  <p className="text-gray-600">Organizations lose millions annually</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <AlertTriangle className="w-12 h-12 text-yellow-600 mb-3" />
                  <h4 className="font-bold text-lg mb-2">Data Breaches</h4>
                  <p className="text-gray-600">Sensitive information compromised</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Our Solution',
      subtitle: 'AI-Powered Detection',
      content: (
        <div className="flex flex-col justify-center h-full space-y-8">
          <h2 className="text-5xl font-bold text-gray-800 text-center">Our Solution</h2>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            An intelligent, AI-based system that analyzes emails in real-time to detect and prevent phishing attempts before they cause harm.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-3">AI Analysis</h3>
              <p className="text-gray-600 text-center">
                Advanced algorithms analyze message content, sender behavior, and patterns
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-3">Link Verification</h3>
              <p className="text-gray-600 text-center">
                Examines URLs for mismatches, suspicious domains, and malicious redirects
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 text-center mb-3">Real-Time Protection</h3>
              <p className="text-gray-600 text-center">
                Instant threat detection with comprehensive risk scoring and alerts
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'How It Works',
      subtitle: 'Three-Step Process',
      content: (
        <div className="flex flex-col justify-center h-full space-y-8">
          <h2 className="text-5xl font-bold text-gray-800 text-center mb-8">How It Works</h2>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Submit Message</h3>
                <p className="text-gray-600 text-lg">
                  Paste suspicious email content, sender information, and subject line into the scanner
                </p>
              </div>
            </div>
            <div className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">AI Analysis</h3>
                <p className="text-gray-600 text-lg">
                  System analyzes content patterns, sender reputation, URLs, and applies detection rules
                </p>
              </div>
            </div>
            <div className="flex items-start gap-6 bg-white p-6 rounded-xl shadow-lg">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Get Results</h3>
                <p className="text-gray-600 text-lg">
                  Receive comprehensive risk score, detailed threat analysis, and actionable recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: 'Key Features',
      subtitle: 'Comprehensive Protection',
      content: (
        <div className="h-full flex flex-col justify-center">
          <h2 className="text-5xl font-bold text-gray-800 text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <Brain className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Content Analysis</h3>
              <p className="text-gray-600">
                Detects urgent language, suspicious formatting, and common phishing patterns
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <Search className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Link Authentication</h3>
              <p className="text-gray-600">
                Verifies URL authenticity, checks for mismatches, and identifies malicious domains
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sender Reputation</h3>
              <p className="text-gray-600">
                Tracks sender history and builds trust scores over time
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Risk Scoring</h3>
              <p className="text-gray-600">
                Calculates comprehensive risk scores from 0-100 with detailed breakdown
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <Shield className="w-12 h-12 text-red-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Custom Detection Rules</h3>
              <p className="text-gray-600">
                Pre-configured rules for common threats with severity classifications
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <Mail className="w-12 h-12 text-teal-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Scan History</h3>
              <p className="text-gray-600">
                Complete audit trail of all analyzed messages with detailed reports
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: 'Benefits',
      subtitle: 'Why Choose Us',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-gray-800">Benefits</h2>
            <p className="text-xl text-gray-600">
              Comprehensive protection that saves time, money, and reputation
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Enhanced Security</h3>
                  <p className="text-gray-600">Prevent data breaches and credential theft</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Cost Savings</h3>
                  <p className="text-gray-600">Reduce financial losses from successful attacks</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">AI-Powered</h3>
                  <p className="text-gray-600">Continuously learning and adapting to new threats</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Lock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">User Privacy</h3>
                  <p className="text-gray-600">Secure data handling with complete transparency</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl shadow-2xl text-white max-w-md">
              <div className="text-center space-y-6">
                <Shield className="w-20 h-20 mx-auto" />
                <h3 className="text-3xl font-bold">Protect Your Organization</h3>
                <p className="text-lg opacity-90">
                  Join thousands of users leveraging AI to stay safe from phishing attacks
                </p>
                <div className="pt-4">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                    <p className="text-4xl font-bold">99.8%</p>
                    <p className="text-sm opacity-90">Detection Accuracy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: 'Get Started',
      subtitle: 'Begin Your Protection',
      content: (
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          <div className="bg-blue-600 p-8 rounded-full shadow-2xl">
            <Shield className="w-24 h-24 text-white" />
          </div>
          <h2 className="text-5xl font-bold text-gray-800 text-center">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 text-center max-w-2xl">
            Sign up now and start protecting your organization from phishing attacks with our AI-powered detection system
          </p>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl py-4 px-12 rounded-full shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Get Started Now
          </button>
          <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">Free</p>
              <p className="text-gray-600 text-sm">to start</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">Real-time</p>
              <p className="text-gray-600 text-sm">protection</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">24/7</p>
              <p className="text-gray-600 text-sm">monitoring</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-md px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">Phishing Detection System</span>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Get Started
          </button>
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto h-full">
            <div className="bg-white rounded-2xl shadow-2xl h-full p-12 relative overflow-hidden">
              <div className="absolute top-4 right-4 text-sm text-gray-400">
                {currentSlide + 1} / {slides.length}
              </div>

              <div className="h-full">
                {slides[currentSlide].content}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={prevSlide}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </button>

            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentSlide === slides.length - 1}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
