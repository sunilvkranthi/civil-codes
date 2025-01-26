import React from 'react';
import { Mail, Heart } from 'lucide-react';

export function Footer() {
  const handleContributeClick = () => {
    const email = 'techvalut6@gmail.com';
    const subject = 'Civil Code PDF Contribution';
    const body = `Dear Civil Codes Team,

I would like to contribute a civil code PDF to your platform.

PDF Title:
Brief Description:
My Name (for credit):

Thank you for considering my contribution.

Best regards,`;

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <footer className="bg-white border-t mt-4 sticky bottom-0">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Contribute to Our Community
            </h3>
            <p className="text-gray-600">
              Help us grow our collection of civil codes. If you have valuable PDFs that are missing
              from our site, please contribute! We'll credit you in the listing description.
              You can mail us at techvalut6@gmail.com
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleContributeClick}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors"
            >
              <Mail className="h-5 w-5 mr-2" />
              Mail Us
            </button>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
          <p className="flex items-center justify-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> for the Civil Engineering Community
          </p>
        </div>
      </div>
    </footer>
  );
}