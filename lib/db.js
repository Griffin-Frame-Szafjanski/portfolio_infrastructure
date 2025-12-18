// Database connection using Neon serverless driver
import { neon } from '@neondatabase/serverless';

// Lazy-load database connection to avoid build-time errors
let sql = null;

function getDb() {
  if (!sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    sql = neon(process.env.DATABASE_URL);
  }
  return sql;
}

// Biography functions
export async function getBiography() {
  try {
    const db = getDb();
    const result = await db`SELECT * FROM biography LIMIT 1`;
    return result[0] || null;
  } catch (error) {
    console.error('Database error in getBiography:', error);
    throw new Error(`Failed to get biography: ${error.message}`);
  }
}

export async function updateBiography(data) {
  try {
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

    console.log('Updating biography with data:', data);

    const db = getDb();
    const result = await db`
      UPDATE biography 
      SET 
        full_name = ${full_name || null},
        title = ${title || null},
        bio = ${bio || null},
        email = ${email || null},
        phone = ${phone || null},
        location = ${location || null},
        linkedin_url = ${linkedin_url || null},
        github_url = ${github_url || null},
        resume_url = ${resume_url || null},
        resume_pdf_url = ${resume_pdf_url || null},
        profile_photo_url = ${profile_photo_url || null},
        photo_file_key = ${photo_file_key || null},
        resume_file_key = ${resume_file_key || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *
    `;
    
    console.log('Update result:', result[0]);
    return result[0];
  } catch (error) {
    console.error('Error updating biography:', error);
    throw new Error(`Failed to update biography: ${error.message}`);
  }
}

// Projects functions
export async function getProjects() {
  const db = getDb();
  const result = await db`SELECT * FROM projects ORDER BY display_order ASC`;
  return result;
}

export async function getProjectById(id) {
  const db = getDb();
  const result = await db`SELECT * FROM projects WHERE id = ${id}`;
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
    display_order,
    featured
  } = data;

  const db = getDb();
  const result = await db`
    INSERT INTO projects (
      title, description, long_description, tech_stack, technologies,
      project_url, github_url, image_url, display_order, featured
    ) VALUES (
      ${title}, ${description}, ${long_description}, ${tech_stack}, ${technologies},
      ${project_url}, ${github_url}, ${image_url}, ${display_order || 0}, ${featured || false}
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
    display_order,
    featured
  } = data;

  const db = getDb();
  const result = await db`
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
      display_order = ${display_order},
      featured = ${featured},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  
  return result[0] || null;
}

export async function deleteProject(id) {
  const db = getDb();
  await db`DELETE FROM projects WHERE id = ${id}`;
  return true;
}

// Contact Messages functions
export async function getMessages() {
  const db = getDb();
  const result = await db`SELECT * FROM messages ORDER BY created_at DESC`;
  return result;
}

export async function getMessageById(id) {
  const db = getDb();
  const result = await db`SELECT * FROM messages WHERE id = ${id}`;
  return result[0] || null;
}

export async function createMessage(data) {
  const { name, email, subject, message } = data;

  const db = getDb();
  const result = await db`
    INSERT INTO messages (name, email, subject, message, read)
    VALUES (${name}, ${email}, ${subject}, ${message}, false)
    RETURNING *
  `;
  
  return result[0];
}

export async function updateMessage(id, data) {
  const { read } = data;

  const db = getDb();
  const result = await db`
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
  const db = getDb();
  await db`DELETE FROM messages WHERE id = ${id}`;
  return true;
}

export async function getUnreadMessageCount() {
  const db = getDb();
  const result = await db`SELECT COUNT(*) as count FROM messages WHERE read = false`;
  return parseInt(result[0].count);
}

// Skill Categories functions
export async function getSkillCategories() {
  const db = getDb();
  const result = await db`SELECT * FROM skill_categories ORDER BY display_order, name`;
  return result;
}

export async function getSkillCategoryById(id) {
  const db = getDb();
  const result = await db`SELECT * FROM skill_categories WHERE id = ${id}`;
  return result[0] || null;
}

export async function createSkillCategory(data) {
  const { name, description, display_order } = data;
  const db = getDb();
  const result = await db`
    INSERT INTO skill_categories (name, description, display_order, updated_at)
    VALUES (${name}, ${description || null}, ${display_order || 0}, CURRENT_TIMESTAMP)
    RETURNING *
  `;
  return result[0];
}

export async function updateSkillCategory(id, data) {
  const { name, description, display_order } = data;
  const db = getDb();
  const result = await db`
    UPDATE skill_categories 
    SET 
      name = ${name},
      description = ${description || null},
      display_order = ${display_order || 0},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}

export async function deleteSkillCategory(id) {
  const db = getDb();
  await db`DELETE FROM skill_categories WHERE id = ${id}`;
  return true;
}

// Skills functions
export async function getSkills(categoryId = null) {
  const db = getDb();
  if (categoryId) {
    const result = await db`
      SELECT s.*, sc.name as category_name
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category_id = sc.id
      WHERE s.category_id = ${categoryId}
      ORDER BY s.display_order, s.name
    `;
    return result;
  } else {
    const result = await db`
      SELECT s.*, sc.name as category_name
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category_id = sc.id
      ORDER BY s.display_order, s.name
    `;
    return result;
  }
}

export async function getSkillById(id) {
  const db = getDb();
  const result = await db`
    SELECT s.*, sc.name as category_name
    FROM skills s
    LEFT JOIN skill_categories sc ON s.category_id = sc.id
    WHERE s.id = ${id}
  `;
  return result[0] || null;
}

export async function createSkill(data) {
  const { name, category_id, description, display_order } = data;
  const db = getDb();
  const result = await db`
    INSERT INTO skills (name, category_id, description, display_order, updated_at)
    VALUES (${name}, ${category_id || null}, ${description || null}, ${display_order || 0}, CURRENT_TIMESTAMP)
    RETURNING *
  `;
  return result[0];
}

export async function updateSkill(id, data) {
  const { name, category_id, description, display_order } = data;
  const db = getDb();
  const result = await db`
    UPDATE skills 
    SET 
      name = ${name},
      category_id = ${category_id || null},
      description = ${description || null},
      display_order = ${display_order || 0},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0] || null;
}

export async function deleteSkill(id) {
  const db = getDb();
  await db`DELETE FROM skills WHERE id = ${id}`;
  return true;
}

export async function getSkillWithProjects(id) {
  const db = getDb();
  
  // Get skill details
  const skillResult = await db`
    SELECT s.*, sc.name as category_name
    FROM skills s
    LEFT JOIN skill_categories sc ON s.category_id = sc.id
    WHERE s.id = ${id}
  `;
  
  if (!skillResult[0]) {
    return null;
  }
  
  const skill = skillResult[0];
  
  // Get related projects
  const projectsResult = await db`
    SELECT p.id, p.title, p.description, p.image_url
    FROM projects p
    JOIN project_skills ps ON p.id = ps.project_id
    WHERE ps.skill_id = ${id}
    ORDER BY p.display_order, p.title
  `;
  
  skill.projects = projectsResult;
  return skill;
}
