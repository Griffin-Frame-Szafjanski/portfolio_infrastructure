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
  const result = await db`SELECT * FROM projects ORDER BY featured DESC, display_order ASC`;
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
    project_url,
    github_url,
    image_url,
    featured
  } = data;

  const db = getDb();
  
  // Increment all existing projects' display_order by 1
  await db`UPDATE projects SET display_order = display_order + 1`;
  
  // Insert new project with display_order = 0 (highest priority)
  const result = await db`
    INSERT INTO projects (
      title, description, long_description,
      project_url, github_url, image_url, display_order, featured
    ) VALUES (
      ${title}, ${description}, ${long_description},
      ${project_url}, ${github_url}, ${image_url}, 0, ${featured || false}
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
  const { name, description } = data;
  const db = getDb();
  
  // Increment all existing categories' display_order by 1
  await db`UPDATE skill_categories SET display_order = display_order + 1`;
  
  // Insert new category with display_order = 0 (highest priority)
  const result = await db`
    INSERT INTO skill_categories (name, description, display_order, updated_at)
    VALUES (${name}, ${description || null}, 0, CURRENT_TIMESTAMP)
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
      SELECT s.*, sc.name as category_name, sc.display_order as category_display_order
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category_id = sc.id
      WHERE s.category_id = ${categoryId}
      ORDER BY s.display_order ASC, s.name
    `;
    return result;
  } else {
    const result = await db`
      SELECT s.*, sc.name as category_name, sc.display_order as category_display_order
      FROM skills s
      LEFT JOIN skill_categories sc ON s.category_id = sc.id
      ORDER BY 
        CASE WHEN sc.display_order IS NULL THEN 1 ELSE 0 END,
        sc.display_order ASC,
        s.display_order ASC,
        s.name
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
  const { name, category_id } = data;
  const db = getDb();
  
  // Increment display_order for skills in the same category
  if (category_id) {
    await db`
      UPDATE skills 
      SET display_order = display_order + 1 
      WHERE category_id = ${category_id}
    `;
  } else {
    // Increment uncategorized skills (where category_id IS NULL)
    await db`
      UPDATE skills 
      SET display_order = display_order + 1 
      WHERE category_id IS NULL
    `;
  }
  
  // Insert new skill with display_order = 0 (highest priority in its category)
  const result = await db`
    INSERT INTO skills (name, category_id, display_order, updated_at)
    VALUES (${name}, ${category_id || null}, 0, CURRENT_TIMESTAMP)
    RETURNING *
  `;
  return result[0];
}

export async function updateSkill(id, data) {
  const { name, category_id, display_order } = data;
  const db = getDb();
  const result = await db`
    UPDATE skills 
    SET 
      name = ${name},
      category_id = ${category_id || null},
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

// Project-Skills relationship functions
export async function getProjectSkills(projectId) {
  const db = getDb();
  const result = await db`
    SELECT s.id, s.name, s.category_id, sc.name as category_name
    FROM skills s
    JOIN project_skills ps ON s.id = ps.skill_id
    LEFT JOIN skill_categories sc ON s.category_id = sc.id
    WHERE ps.project_id = ${projectId}
    ORDER BY s.name
  `;
  return result;
}

export async function setProjectSkills(projectId, skillIds) {
  const db = getDb();
  
  // Delete existing project-skill relationships
  await db`DELETE FROM project_skills WHERE project_id = ${projectId}`;
  
  // Insert new relationships
  if (skillIds && skillIds.length > 0) {
    for (const skillId of skillIds) {
      await db`
        INSERT INTO project_skills (project_id, skill_id)
        VALUES (${projectId}, ${skillId})
      `;
    }
  }
  
  return true;
}

export async function getProjectsWithSkillCount() {
  const db = getDb();
  const result = await db`
    SELECT p.*, 
           COUNT(ps.skill_id) as skill_count
    FROM projects p
    LEFT JOIN project_skills ps ON p.id = ps.project_id
    GROUP BY p.id
    ORDER BY p.featured DESC, p.display_order ASC
  `;
  return result;
}

export async function getProjectsBySkills(skillIds) {
  const db = getDb();
  
  if (!skillIds || skillIds.length === 0) {
    return await getProjects();
  }
  
  // Get projects that have ALL the specified skills
  const result = await db`
    SELECT DISTINCT p.*
    FROM projects p
    JOIN project_skills ps ON p.id = ps.project_id
    WHERE ps.skill_id = ANY(${skillIds})
    GROUP BY p.id
    HAVING COUNT(DISTINCT ps.skill_id) = ${skillIds.length}
    ORDER BY p.featured DESC, p.display_order ASC
  `;
  
  return result;
}

export async function getSkillsWithProjectCount() {
  const db = getDb();
  const result = await db`
    SELECT s.*, 
           sc.name as category_name,
           COUNT(ps.project_id) as project_count
    FROM skills s
    LEFT JOIN skill_categories sc ON s.category_id = sc.id
    LEFT JOIN project_skills ps ON s.id = ps.skill_id
    GROUP BY s.id, sc.name
    ORDER BY s.display_order, s.name
  `;
  return result;
}

// Audit Logs functions
export async function getAuditLogs({ limit = 100, offset = 0, eventType = null, severity = null, username = null } = {}) {
  const db = getDb();
  
  try {
    // Build query with filters
    if (eventType && severity && username) {
      const result = await db`
        SELECT * FROM audit_logs
        WHERE event_type = ${eventType}
        AND severity = ${severity}
        AND username ILIKE ${`%${username}%`}
        ORDER BY timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return result;
    } else if (eventType && severity) {
      const result = await db`
        SELECT * FROM audit_logs
        WHERE event_type = ${eventType}
        AND severity = ${severity}
        ORDER BY timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return result;
    } else if (eventType && username) {
      const result = await db`
        SELECT * FROM audit_logs
        WHERE event_type = ${eventType}
        AND username ILIKE ${`%${username}%`}
        ORDER BY timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return result;
    } else if (severity && username) {
      const result = await db`
        SELECT * FROM audit_logs
        WHERE severity = ${severity}
        AND username ILIKE ${`%${username}%`}
        ORDER BY timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return result;
    } else if (eventType) {
      const result = await db`
        SELECT * FROM audit_logs
        WHERE event_type = ${eventType}
        ORDER BY timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return result;
    } else if (severity) {
      const result = await db`
        SELECT * FROM audit_logs
        WHERE severity = ${severity}
        ORDER BY timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return result;
    } else if (username) {
      const result = await db`
        SELECT * FROM audit_logs
        WHERE username ILIKE ${`%${username}%`}
        ORDER BY timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return result;
    } else {
      const result = await db`
        SELECT * FROM audit_logs
        ORDER BY timestamp DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
      return result;
    }
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
}

export async function getAuditLogCount({ eventType = null, severity = null, username = null } = {}) {
  const db = getDb();
  
  try {
    // Build count query with filters
    if (eventType && severity && username) {
      const result = await db`
        SELECT COUNT(*) as count FROM audit_logs
        WHERE event_type = ${eventType}
        AND severity = ${severity}
        AND username ILIKE ${`%${username}%`}
      `;
      return parseInt(result[0]?.count || 0);
    } else if (eventType && severity) {
      const result = await db`
        SELECT COUNT(*) as count FROM audit_logs
        WHERE event_type = ${eventType}
        AND severity = ${severity}
      `;
      return parseInt(result[0]?.count || 0);
    } else if (eventType && username) {
      const result = await db`
        SELECT COUNT(*) as count FROM audit_logs
        WHERE event_type = ${eventType}
        AND username ILIKE ${`%${username}%`}
      `;
      return parseInt(result[0]?.count || 0);
    } else if (severity && username) {
      const result = await db`
        SELECT COUNT(*) as count FROM audit_logs
        WHERE severity = ${severity}
        AND username ILIKE ${`%${username}%`}
      `;
      return parseInt(result[0]?.count || 0);
    } else if (eventType) {
      const result = await db`
        SELECT COUNT(*) as count FROM audit_logs
        WHERE event_type = ${eventType}
      `;
      return parseInt(result[0]?.count || 0);
    } else if (severity) {
      const result = await db`
        SELECT COUNT(*) as count FROM audit_logs
        WHERE severity = ${severity}
      `;
      return parseInt(result[0]?.count || 0);
    } else if (username) {
      const result = await db`
        SELECT COUNT(*) as count FROM audit_logs
        WHERE username ILIKE ${`%${username}%`}
      `;
      return parseInt(result[0]?.count || 0);
    } else {
      const result = await db`SELECT COUNT(*) as count FROM audit_logs`;
      return parseInt(result[0]?.count || 0);
    }
  } catch (error) {
    console.error('Error counting audit logs:', error);
    return 0;
  }
}

export async function createAuditLog(data) {
  const {
    event_type,
    severity = 'INFO',
    user_id,
    username,
    resource_type,
    resource_id,
    action,
    details,
    ip_address,
    user_agent,
    success = true,
    error_message
  } = data;
  
  const db = getDb();
  
  try {
    const result = await db`
      INSERT INTO audit_logs (
        event_type, severity, user_id, username,
        resource_type, resource_id, action, details,
        ip_address, user_agent, success, error_message
      ) VALUES (
        ${event_type}, ${severity}, ${user_id}, ${username},
        ${resource_type}, ${resource_id}, ${action}, ${details ? JSON.stringify(details) : null},
        ${ip_address}, ${user_agent}, ${success}, ${error_message}
      )
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error creating audit log:', error);
    return null;
  }
}
