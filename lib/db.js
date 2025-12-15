// Database connection using Neon serverless driver
import { neon } from '@neondatabase/serverless';

// Get connection from environment variable
// Make sure DATABASE_URL is set in your Vercel environment variables
const sql = neon(process.env.DATABASE_URL);

// Biography functions
export async function getBiography() {
  const result = await sql('SELECT * FROM biography LIMIT 1');
  return result[0] || null;
}

export async function updateBiography(data) {
  const {
    full_name,
    title,
    bio,
    email,
    phone,
    location,
    linkedin_url,
    github_url,
    resume_url,
    resume_pdf_url,
    profile_photo_url,
    photo_file_key,
    resume_file_key
  } = data;

  const result = await sql`
    UPDATE biography 
    SET 
      full_name = ${full_name},
      title = ${title},
      bio = ${bio},
      email = ${email},
      phone = ${phone},
      location = ${location},
      linkedin_url = ${linkedin_url},
      github_url = ${github_url},
      resume_url = ${resume_url},
      resume_pdf_url = ${resume_pdf_url},
      profile_photo_url = ${profile_photo_url},
      photo_file_key = ${photo_file_key},
      resume_file_key = ${resume_file_key},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
    RETURNING *
  `;
  
  return result[0];
}

// Projects functions
export async function getProjects() {
  const result = await sql('SELECT * FROM projects ORDER BY display_order ASC');
  return result;
}

export async function getProjectById(id) {
  const result = await sql('SELECT * FROM projects WHERE id = $1', [id]);
  return result[0] || null;
}

export async function createProject(data) {
  const {
    title,
    description,
    long_description,
    tech_stack,
    technologies,
    project_url,
    github_url,
    image_url,
    video_url,
    demo_type,
    display_order,
    featured
  } = data;

  const result = await sql`
    INSERT INTO projects (
      title, description, long_description, tech_stack, technologies,
      project_url, github_url, image_url, video_url, demo_type,
      display_order, featured
    ) VALUES (
      ${title}, ${description}, ${long_description}, ${tech_stack}, ${technologies},
      ${project_url}, ${github_url}, ${image_url}, ${video_url}, ${demo_type || 'none'},
      ${display_order || 0}, ${featured || false}
    )
    RETURNING *
  `;
  
  return result[0];
}

export async function updateProject(id, data) {
  const {
    title,
    description,
    long_description,
    tech_stack,
    technologies,
    project_url,
    github_url,
    image_url,
    video_url,
    demo_type,
    display_order,
    featured
  } = data;

  const result = await sql`
    UPDATE projects 
    SET 
      title = ${title},
      description = ${description},
      long_description = ${long_description},
      tech_stack = ${tech_stack},
      technologies = ${technologies},
      project_url = ${project_url},
      github_url = ${github_url},
      image_url = ${image_url},
      video_url = ${video_url},
      demo_type = ${demo_type},
      display_order = ${display_order},
      featured = ${featured},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  
  return result[0] || null;
}

export async function deleteProject(id) {
  await sql('DELETE FROM projects WHERE id = $1', [id]);
  return true;
}

// Contact Messages functions
export async function getMessages() {
  const result = await sql('SELECT * FROM messages ORDER BY created_at DESC');
  return result;
}

export async function getMessageById(id) {
  const result = await sql('SELECT * FROM messages WHERE id = $1', [id]);
  return result[0] || null;
}

export async function createMessage(data) {
  const { name, email, subject, message } = data;

  const result = await sql`
    INSERT INTO messages (name, email, subject, message, read)
    VALUES (${name}, ${email}, ${subject}, ${message}, false)
    RETURNING *
  `;
  
  return result[0];
}

export async function updateMessage(id, data) {
  const { read } = data;

  const result = await sql`
    UPDATE messages 
    SET 
      read = ${read},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  
  return result[0] || null;
}

export async function deleteMessage(id) {
  await sql('DELETE FROM messages WHERE id = $1', [id]);
  return true;
}

export async function getUnreadMessageCount() {
  const result = await sql('SELECT COUNT(*) as count FROM messages WHERE read = false');
  return parseInt(result[0].count);
}
