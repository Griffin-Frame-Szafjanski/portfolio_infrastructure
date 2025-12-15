'use client'

import { useEffect, useState } from 'react';

export default function ContactSection() {
  const [bio, setBio] = useState(null);

  useEffect(() => {
    async function loadBiography() {
      try {
        const response = await fetch('/api/biography');
        const result = await response.json();
        
        if (result.success && result.data) {
          setBio(result.data);
        }
      } catch (err) {
        console.error('Error loading biography:', err);
      }
    }

    loadBiography();
  }, []);

  return (
    <section id="contact" className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900">Get In Touch</h2>
          <p className="text-lg text-gray-600">Feel free to reach out for collaborations or opportunities</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-md text-center border-2 border-gray-200 transition-all hover:border-primary hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-4 text-primary">Email</h3>
            <p className="text-gray-600">{bio?.email || 'Loading...'}</p>
          </div>
          <div className="bg-white p-12 rounded-2xl shadow-md text-center border-2 border-gray-200 transition-all hover:border-primary hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-4 text-primary">Location</h3>
            <p className="text-gray-600">{bio?.location || 'Loading...'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
