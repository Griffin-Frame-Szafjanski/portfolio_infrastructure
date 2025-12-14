import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For local development, return mock data
    // When deployed to Cloudflare Pages, the functions/api/projects.js will take precedence
    return NextResponse.json({
      success: true,
      data: [
        {
          id: 1,
          title: "Portfolio Website",
          description: "A modern portfolio website built with Next.js and deployed on Cloudflare Pages.",
          tech_stack: "Next.js, React, Cloudflare Pages, D1",
          project_url: "https://example.com",
          github_url: "https://github.com/yourusername/portfolio",
          demo_type: "live",
          display_order: 1
        },
        {
          id: 2,
          title: "E-commerce Platform",
          description: "Full-stack e-commerce solution with payment integration and admin dashboard.",
          tech_stack: "Node.js, Express, PostgreSQL, Stripe",
          project_url: "https://example.com",
          github_url: "https://github.com/yourusername/ecommerce",
          demo_type: "video",
          display_order: 2
        },
        {
          id: 3,
          title: "Task Management App",
          description: "Collaborative task management application with real-time updates.",
          tech_stack: "React, Firebase, Material-UI",
          project_url: null,
          github_url: "https://github.com/yourusername/task-manager",
          demo_type: "none",
          display_order: 3
        }
      ]
    });
  } catch (error) {
    console.error('Projects API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );
  }
}
