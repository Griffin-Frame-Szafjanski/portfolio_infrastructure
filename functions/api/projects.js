/**
 * Projects API Endpoint
 * GET /api/projects - Returns all projects
 * GET /api/projects?featured=true - Returns only featured projects
 * 
 * This serverless function runs on Cloudflare's edge network
 */

export async function onRequestGet(context) {
  try {
    const db = context.env.DB;
    
    // Parse query parameters
    const url = new URL(context.request.url);
    const featuredOnly = url.searchParams.get('featured') === 'true';
    
    if (!db) {
      // Fallback for local development without D1 configured
      const mockProjects = [
        {
          id: 1,
          title: "Portfolio Website",
          description: "A full-stack portfolio application built on Cloudflare infrastructure",
          long_description: "This project showcases modern serverless architecture using Cloudflare Workers, D1 database, and R2 storage.",
          tech_stack: "Cloudflare Workers, D1, R2, Pages",
          project_url: "https://your-portfolio.pages.dev",
          github_url: "https://github.com/yourusername/portfolio",
          demo_type: "live",
          is_featured: 1,
          display_order: 1
        },
        {
          id: 2,
          title: "Sample Project",
          description: "Another interesting project showcasing various skills",
          long_description: "Detailed description of the project's features and implementation.",
          tech_stack: "JavaScript, React, Node.js",
          project_url: null,
          github_url: "https://github.com/yourusername/sample-project",
          demo_type: "none",
          is_featured: 0,
          display_order: 2
        }
      ];
      
      const filteredProjects = featuredOnly 
        ? mockProjects.filter(p => p.is_featured === 1)
        : mockProjects;
      
      return new Response(JSON.stringify({
        success: true,
        data: filteredProjects,
        count: filteredProjects.length
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    // Build SQL query based on filters
    let query = 'SELECT * FROM projects';
    
    if (featuredOnly) {
      query += ' WHERE is_featured = 1';
    }
    
    query += ' ORDER BY display_order ASC, created_at DESC';

    // Execute query
    const result = await db.prepare(query).all();

    // Return the data
    return new Response(JSON.stringify({
      success: true,
      data: result.results || [],
      count: result.results?.length || 0
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('Projects API Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

// Handle individual project by ID
// GET /api/projects/[id]
export async function onRequest(context) {
  // Check if this is a path with ID (e.g., /api/projects/1)
  const url = new URL(context.request.url);
  const pathParts = url.pathname.split('/');
  const projectId = pathParts[pathParts.length - 1];
  
  // If it's just /api/projects, use the GET handler
  if (projectId === 'projects' || !projectId || isNaN(projectId)) {
    return onRequestGet(context);
  }
  
  // Fetch specific project
  try {
    const db = context.env.DB;
    
    if (!db) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Database not configured'
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
    
    const result = await db.prepare(
      'SELECT * FROM projects WHERE id = ?'
    ).bind(projectId).first();
    
    if (!result) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Project not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: result
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
    
  } catch (error) {
    console.error('Project Detail API Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

// Handle CORS preflight requests
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
