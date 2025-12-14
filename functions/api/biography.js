/**
 * Biography API Endpoint
 * GET /api/biography - Returns biography information
 * 
 * This serverless function runs on Cloudflare's edge network
 * and fetches data from D1 database
 */

export async function onRequestGet(context) {
  try {
    // Access D1 database from environment bindings
    // Note: This will work once we configure D1 in wrangler.toml
    const db = context.env.DB;
    
    if (!db) {
      // Fallback for local development without D1 configured
      return new Response(JSON.stringify({
        success: true,
        data: {
          full_name: "Your Name",
          title: "Full-Stack Developer",
          bio: "Passionate developer with experience in building scalable web applications.",
          email: "your.email@example.com",
          phone: "+1234567890",
          linkedin_url: "https://linkedin.com/in/yourprofile",
          github_url: "https://github.com/yourusername",
          location: "City, Country"
        }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*', // CORS - allows frontend to access API
        }
      });
    }

    // Query the biography table
    const result = await db.prepare(
      'SELECT * FROM biography LIMIT 1'
    ).first();

    // Return the data as JSON
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
    // Error handling
    console.error('Biography API Error:', error);
    
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
