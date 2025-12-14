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
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {currentYear} {bio?.full_name || 'Your Name'}. Built with Cloudflare infrastructure.
        </p>
      </div>
    </footer>
  );
}
