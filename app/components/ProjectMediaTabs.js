'use client'

import { useState } from 'react';
import { getYouTubeVideoId, isYouTubeUrl, getYouTubeEmbedUrl } from '@/lib/youtube';
import PDFViewer from './PDFViewer';

export default function ProjectMediaTabs({ videoUrl, pdfUrl, projectTitle }) {
  const hasVideo = videoUrl && isYouTubeUrl(videoUrl);
  const hasPDF = pdfUrl;
  
  // Don't render if no media
  if (!hasVideo && !hasPDF) {
    return null;
  }

  // Default to PDF if available, otherwise video
  const [activeTab, setActiveTab] = useState(hasPDF ? 'pdf' : 'video');

  return (
    <div className="media-tabs-container">
      {/* Tab Headers - only show if both media types exist */}
      {hasVideo && hasPDF && (
        <div className="tab-headers">
          <button
            className={`tab-button ${activeTab === 'pdf' ? 'active' : ''}`}
            onClick={() => setActiveTab('pdf')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            PDF Documentation
          </button>
          <button
            className={`tab-button ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
            Video Demo
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'pdf' && hasPDF && (
          <div className="pdf-container">
            <PDFViewer pdfUrl={pdfUrl} />
          </div>
        )}

        {activeTab === 'video' && hasVideo && (
          <div className="video-container">
            <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md">
              <iframe
                width="100%"
                height="100%"
                src={getYouTubeEmbedUrl(getYouTubeVideoId(videoUrl))}
                title={projectTitle}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .media-tabs-container {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        }

        .tab-headers {
          display: flex;
          background: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          font-size: 1rem;
          font-weight: 500;
          color: #6b7280;
          background: transparent;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-button:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .tab-button.active {
          color: var(--color-primary, #3b82f6);
          background: white;
          border-bottom-color: var(--color-primary, #3b82f6);
        }

        .tab-button svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        .tab-content {
          padding: 0;
        }

        .pdf-container {
          min-height: 600px;
          max-height: 800px;
        }

        .video-container {
          padding: 2rem;
          background: white;
        }

        .aspect-video {
          aspect-ratio: 16 / 9;
          width: 100%;
        }

        @media (max-width: 768px) {
          .tab-button {
            padding: 0.75rem 1rem;
            font-size: 0.875rem;
          }

          .tab-button svg {
            width: 1rem;
            height: 1rem;
          }

          .pdf-container {
            min-height: 400px;
          }

          .video-container {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
