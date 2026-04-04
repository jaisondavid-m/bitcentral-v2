import React from 'react';
import { Download } from 'lucide-react';
import { FaGoogle, FaApple } from 'react-icons/fa';

export default function PCDP() {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Title Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-3">PCDP App</h1>
          <p className="text-xl text-gray-600">Personalized Skill Development</p>
        </section>

        {/* Features */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-6 rounded-lg border">
              <h3 className="font-bold text-lg mb-2">📋 Track Attendance</h3>
              <p className="text-gray-700">Real-time attendance marking and monitoring</p>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-6">Download Now</h2>
          
          <div className="space-y-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.ps_student"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3 w-full bg-white text-blue-600 font-bold py-4 px-6 rounded-lg hover:bg-gray-100 transition"
            >
              <FaGoogle size={24} />
              <span>Download on Google Play</span>
            </a>

            <a
              href="https://apps.apple.com/in/app/pcdp-app/id6742381503"
              className="flex items-center justify-center space-x-3 w-full bg-gray-900 text-white font-bold py-4 px-6 rounded-lg hover:bg-black transition"
            >
              <FaApple size={24} />
              <span>Download on App Store</span>
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}