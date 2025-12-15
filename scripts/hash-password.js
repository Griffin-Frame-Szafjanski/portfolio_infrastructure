#!/usr/bin/env node
/**
 * Password Hashing Utility
 * 
 * Usage: node scripts/hash-password.js [password]
 * 
 * If no password is provided, you'll be prompted to enter one.
 * The hashed password should be stored in the ADMIN_PASSWORD environment variable.
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

async function hashPassword(password) {
  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}

async function main() {
  const password = process.argv[2];

  if (password) {
    // Password provided as command line argument
    const hash = await hashPassword(password);
    console.log('\n✅ Password hashed successfully!\n');
    console.log('Add this to your environment variables:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`ADMIN_PASSWORD=${hash}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  Important:');
    console.log('1. Add this to .env.local for local development');
    console.log('2. Add this to Vercel environment variables for production');
    console.log('3. Keep this hash secure and never commit it to Git!\n');
  } else {
    // Prompt for password (more secure - doesn't show in shell history)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    rl.question('Enter password to hash: ', async (input) => {
      if (!input) {
        console.log('❌ Password cannot be empty');
        rl.close();
        return;
      }

      const hash = await hashPassword(input);
      console.log('\n✅ Password hashed successfully!\n');
      console.log('Add this to your environment variables:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`ADMIN_PASSWORD=${hash}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      console.log('⚠️  Important:');
      console.log('1. Add this to .env.local for local development');
      console.log('2. Add this to Vercel environment variables for production');
      console.log('3. Keep this hash secure and never commit it to Git!\n');
      
      rl.close();
    });
  }
}

main().catch(console.error);
