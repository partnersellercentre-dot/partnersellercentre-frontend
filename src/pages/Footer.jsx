import React from "react";

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="w-full p-6">
        {/* Top Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-green-500">
            Partner Seller Centre
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
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                (num) => (
                  <img
                    key={num}
                    src={`/payments/${num}(2).png`}
                    alt={`Payment method ${num}`}
                    className="w-18 h-12 cursor-pointer"
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* Social Section */}
        <div className="mt-10 text-start">
          <h3 className="font-semibold text-gray-800 mb-3">Social</h3>
          <div className="grid grid-cols-10 gap-4">
            {[
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20,
            ].map((num) => (
              <img
                key={num}
                src={`/social-media/${num}.png`}
                alt={`Social ${num}`}
                className="w-12 h-20 rounded cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 text-start sm:text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} - All rights reserved by
          partnersellercentre.shop
        </div>
      </div>
    </footer>
  );
}

export default Footer;
