'use client'

import { useState } from 'react';

export default function PDFViewer({ pdfUrl, title = 'PDF Document', showHeader = false }) {
  if (!pdfUrl) {
    return (
      <div className="bg-gray-100 rounded-xl p-12 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-600">No PDF available</p>
        <p className="text-sm text-gray-500 mt-2">Upload a PDF in the admin panel</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg" style={{ padding: showHeader ? '1.5rem' : '0' }}>
      {showHeader && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <a 
            href={pdfUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open PDF
          </a>
        </div>
      )}

      {/* Simple iframe PDF viewer - works universally */}
      <div className="w-full" style={{ height: '100%', minHeight: '842px' }}>
        <iframe
          src={pdfUrl}
          className="w-full h-full border-0 rounded-lg"
          style={{ height: '100%', minHeight: '842px' }}
          title={title}
        />
      </div>
      
      {showHeader && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> If the PDF doesn't display, click "Open PDF" above to view it in a new tab.
          </p>
        </div>
      )}
    </div>
  );
}
