'use client'

import { useEffect, useState } from 'react';

export default function Footer() {
  const [bio, setBio] = useState(null);
  const currentYear = new Date().getFullYear();

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
    <footer className="bg-gray-900 text-white py-8 text-center">
      <div className="max-w-7xl mx-auto px-6">
        <p className="opacity-80">
          &copy; {currentYear} {bio?.full_name || 'Your Name'}. Built with Next.js and Cloudflare Pages.
        </p>
      </div>
    </footer>
  );
}
