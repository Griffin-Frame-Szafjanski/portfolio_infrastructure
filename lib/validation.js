/**
 * Input Validation Schemas
 * Validates user input to prevent malicious data and ensure data integrity
 */

/**
 * Validation result object
 * @typedef {Object} ValidationResult
 * @property {boolean} valid - Whether validation passed
 * @property {string[]} errors - Array of validation error messages
 * @property {Object} data - Validated and sanitized data (if valid)
 */

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * URL validation regex (http/https)
 */
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {ValidationResult}
 */
export function validateEmail(email) {
  const errors = [];
  
  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else if (email.length > 254) {
    errors.push('Email is too long (max 254 characters)');
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push('Invalid email format');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? email.trim().toLowerCase() : null,
  };
}

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @param {boolean} required - Whether URL is required
 * @returns {ValidationResult}
 */
export function validateUrl(url, required = false) {
  const errors = [];
  
  if (!url || typeof url !== 'string') {
    if (required) {
      errors.push('URL is required');
    }
    return {
      valid: !required,
      errors,
      data: null,
    };
  }
  
  if (url.length > 2048) {
    errors.push('URL is too long (max 2048 characters)');
  } else if (!URL_REGEX.test(url)) {
    errors.push('Invalid URL format (must start with http:// or https://)');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? url.trim() : null,
  };
}

/**
 * Validate contact form data
 * @param {Object} data - Contact form data
 * @returns {ValidationResult}
 */
export function validateContactForm(data) {
  const errors = [];
  const validated = {};
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required');
  } else if (data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (data.name.length > 100) {
    errors.push('Name is too long (max 100 characters)');
  } else {
    validated.name = data.name.trim();
  }
  
  // Email validation
  const emailResult = validateEmail(data.email);
  if (!emailResult.valid) {
    errors.push(...emailResult.errors);
  } else {
    validated.email = emailResult.data;
  }
  
  // Subject validation
  if (!data.subject || typeof data.subject !== 'string') {
    errors.push('Subject is required');
  } else if (data.subject.trim().length < 3) {
    errors.push('Subject must be at least 3 characters');
  } else if (data.subject.length > 200) {
    errors.push('Subject is too long (max 200 characters)');
  } else {
    validated.subject = data.subject.trim();
  }
  
  // Message validation
  if (!data.message || typeof data.message !== 'string') {
    errors.push('Message is required');
  } else if (data.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  } else if (data.message.length > 5000) {
    errors.push('Message is too long (max 5000 characters)');
  } else {
    validated.message = data.message.trim();
  }
  
  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? validated : null,
  };
}

/**
 * Validate biography data
 * @param {Object} data - Biography data
 * @returns {ValidationResult}
 */
export function validateBiography(data) {
  const errors = [];
  const validated = {};
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Name is required');
  } else if (data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (data.name.length > 100) {
    errors.push('Name is too long (max 100 characters)');
  } else {
    validated.name = data.name.trim();
  }
  
  // Title validation
  if (!data.title || typeof data.title !== 'string') {
    errors.push('Title is required');
  } else if (data.title.trim().length < 2) {
    errors.push('Title must be at least 2 characters');
  } else if (data.title.length > 200) {
    errors.push('Title is too long (max 200 characters)');
  } else {
    validated.title = data.title.trim();
  }
  
  // Bio validation
  if (!data.bio || typeof data.bio !== 'string') {
    errors.push('Bio is required');
  } else if (data.bio.trim().length < 10) {
    errors.push('Bio must be at least 10 characters');
  } else if (data.bio.length > 5000) {
    errors.push('Bio is too long (max 5000 characters)');
  } else {
    validated.bio = data.bio.trim();
  }
  
  // Optional fields
  if (data.photo_url) {
    const urlResult = validateUrl(data.photo_url, false);
    if (!urlResult.valid) {
      errors.push('Photo URL: ' + urlResult.errors.join(', '));
    } else {
      validated.photo_url = urlResult.data;
    }
  }
  
  if (data.resume_url) {
    const urlResult = validateUrl(data.resume_url, false);
    if (!urlResult.valid) {
      errors.push('Resume URL: ' + urlResult.errors.join(', '));
    } else {
      validated.resume_url = urlResult.data;
    }
  }
  
  if (data.location && typeof data.location === 'string') {
    if (data.location.length > 200) {
      errors.push('Location is too long (max 200 characters)');
    } else {
      validated.location = data.location.trim();
    }
  }
  
  if (data.email) {
    const emailResult = validateEmail(data.email);
    if (!emailResult.valid) {
      errors.push('Email: ' + emailResult.errors.join(', '));
    } else {
      validated.email = emailResult.data;
    }
  }
  
  // Social links validation (optional)
  const socialFields = ['github_url', 'linkedin_url', 'twitter_url', 'website_url'];
  for (const field of socialFields) {
    if (data[field]) {
      const urlResult = validateUrl(data[field], false);
      if (!urlResult.valid) {
        errors.push(`${field}: ${urlResult.errors.join(', ')}`);
      } else {
        validated[field] = urlResult.data;
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? validated : null,
  };
}

/**
 * Validate project data
 * @param {Object} data - Project data
 * @returns {ValidationResult}
 */
export function validateProject(data) {
  const errors = [];
  const validated = {};
  
  // Title validation
  if (!data.title || typeof data.title !== 'string') {
    errors.push('Title is required');
  } else if (data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters');
  } else if (data.title.length > 200) {
    errors.push('Title is too long (max 200 characters)');
  } else {
    validated.title = data.title.trim();
  }
  
  // Description validation
  if (!data.description || typeof data.description !== 'string') {
    errors.push('Description is required');
  } else if (data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters');
  } else if (data.description.length > 5000) {
    errors.push('Description is too long (max 5000 characters)');
  } else {
    validated.description = data.description.trim();
  }
  
  // Optional short description
  if (data.short_description && typeof data.short_description === 'string') {
    if (data.short_description.length > 500) {
      errors.push('Short description is too long (max 500 characters)');
    } else {
      validated.short_description = data.short_description.trim();
    }
  }
  
  // Optional URLs
  if (data.project_url) {
    const urlResult = validateUrl(data.project_url, false);
    if (!urlResult.valid) {
      errors.push('Project URL: ' + urlResult.errors.join(', '));
    } else {
      validated.project_url = urlResult.data;
    }
  }
  
  if (data.github_url) {
    const urlResult = validateUrl(data.github_url, false);
    if (!urlResult.valid) {
      errors.push('GitHub URL: ' + urlResult.errors.join(', '));
    } else {
      validated.github_url = urlResult.data;
    }
  }
  
  // Featured flag
  if (typeof data.featured !== 'undefined') {
    validated.featured = Boolean(data.featured);
  }
  
  // Display order
  if (data.display_order !== undefined) {
    const order = parseInt(data.display_order, 10);
    if (isNaN(order) || order < 0) {
      errors.push('Display order must be a non-negative number');
    } else {
      validated.display_order = order;
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? validated : null,
  };
}

/**
 * Validate skill data
 * @param {Object} data - Skill data
 * @returns {ValidationResult}
 */
export function validateSkill(data) {
  const errors = [];
  const validated = {};
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Skill name is required');
  } else if (data.name.trim().length < 1) {
    errors.push('Skill name must be at least 1 character');
  } else if (data.name.length > 100) {
    errors.push('Skill name is too long (max 100 characters)');
  } else {
    validated.name = data.name.trim();
  }
  
  // Category ID validation
  if (data.category_id !== undefined) {
    const categoryId = parseInt(data.category_id, 10);
    if (isNaN(categoryId) || categoryId < 1) {
      errors.push('Invalid category ID');
    } else {
      validated.category_id = categoryId;
    }
  }
  
  // Proficiency validation
  if (data.proficiency !== undefined) {
    const proficiency = parseInt(data.proficiency, 10);
    if (isNaN(proficiency) || proficiency < 0 || proficiency > 100) {
      errors.push('Proficiency must be between 0 and 100');
    } else {
      validated.proficiency = proficiency;
    }
  }
  
  // Display order
  if (data.display_order !== undefined) {
    const order = parseInt(data.display_order, 10);
    if (isNaN(order) || order < 0) {
      errors.push('Display order must be a non-negative number');
    } else {
      validated.display_order = order;
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? validated : null,
  };
}

/**
 * Validate skill category data
 * @param {Object} data - Category data
 * @returns {ValidationResult}
 */
export function validateSkillCategory(data) {
  const errors = [];
  const validated = {};
  
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    errors.push('Category name is required');
  } else if (data.name.trim().length < 2) {
    errors.push('Category name must be at least 2 characters');
  } else if (data.name.length > 100) {
    errors.push('Category name is too long (max 100 characters)');
  } else {
    validated.name = data.name.trim();
  }
  
  // Optional description
  if (data.description && typeof data.description === 'string') {
    if (data.description.length > 500) {
      errors.push('Description is too long (max 500 characters)');
    } else {
      validated.description = data.description.trim();
    }
  }
  
  // Display order
  if (data.display_order !== undefined) {
    const order = parseInt(data.display_order, 10);
    if (isNaN(order) || order < 0) {
      errors.push('Display order must be a non-negative number');
    } else {
      validated.display_order = order;
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? validated : null,
  };
}

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {ValidationResult}
 */
export function validateFileUpload(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = [],
    allowedExtensions = [],
  } = options;
  
  const errors = [];
  
  if (!file) {
    errors.push('File is required');
    return { valid: false, errors, data: null };
  }
  
  // Size validation
  if (file.size > maxSize) {
    errors.push(`File size exceeds maximum of ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  // MIME type validation
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  // Extension validation
  if (allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      errors.push(`File extension .${extension} is not allowed. Allowed: ${allowedExtensions.join(', ')}`);
    }
  }
  
  // Filename validation (prevent path traversal)
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    errors.push('Invalid filename - contains illegal characters');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? file : null,
  };
}
