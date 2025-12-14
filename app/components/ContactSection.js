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
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Feel free to reach out for collaborations or opportunities</p>
        </div>
        <div className="contact-grid">
          <div className="contact-card">
            <h3>Email</h3>
            <p>{bio?.email || 'Loading...'}</p>
          </div>
          <div className="contact-card">
            <h3>Location</h3>
            <p>{bio?.location || 'Loading...'}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
