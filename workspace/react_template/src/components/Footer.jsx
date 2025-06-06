import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About AnimateAI</h3>
            <p className="text-sm">
              AnimateAI converts your static images to animated videos using cutting-edge AI technology.
              Our platform leverages multiple AI services to provide the best results.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="text-sm space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Status</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Processing Credits</h3>
            <div className="text-sm">
              <p>Free tier usage information:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>AI services using free tiers</li>
                <li>Priority given to open-source models</li>
                <li>Processing times vary based on service availability</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} AnimateAI. This is a demo project.</p>
          <div className="mt-2">
            <a href="#" className="hover:text-white transition-colors mr-4">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;