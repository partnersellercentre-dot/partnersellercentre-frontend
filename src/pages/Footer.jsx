import React from "react";

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="w-full p-6">
        {/* Top Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-green-500">
            partner seller centre
          </h2>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-start sm:text-left">
          {/* Services */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Services</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">About</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <a href="#">Refund Policy</a>
              </li>
              <li>
                <a href="#">Privacy Policy</a>
              </li>
              <li>
                <a href="#">Help</a>
              </li>
              <li>
                <a href="#">Sitemap</a>
              </li>
            </ul>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">
              Dropshipping Partners
            </h3>
            <div className="flex flex-wrap justify-start gap-3 sm:justify-start">
              <img src="/dropshipping.png" alt="Payment method" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Payment</h3>
            <div className="flex flex-wrap justify-start gap-3 sm:justify-start">
              <img
                src="/50d1c8a7-9005-42ef-ad39-535ba26647ab.png"
                alt="Payment method"
              />
            </div>
          </div>
        </div>

        {/* Social Section */}
        <div className="mt-10 text-start">
          <h3 className="font-semibold text-gray-800 mb-3">Social</h3>
          <div className="flex justify-start gap-4">
            <img src="/36d4a14e-dcf8-4adf-a8e4-fa3242d8be8c.png" alt="Social" />
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 text-start sm:text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} - All rights reserved by
          partnersellercenter.shop
        </div>
      </div>
    </footer>
  );
}

export default Footer;
