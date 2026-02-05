import { supabase, testSupabaseConnection } from '../lib/supabase.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log('AUTH handler called:', req.method, req.url);
  console.log('Request body:', req.body);
  
  if (req.method === 'OPTIONS') {
    console.log('OPTIONS request received');
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { type, email, password, phone, user_metadata } = req.body || {};
    
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const adminEmails = [
      'alok.kharel.nepal@gmail.com',
      'sujanadhikari1111@gmail.com'
    ];
    
    try {
      // Test Supabase connection first
      const connectionOk = await testSupabaseConnection();
      if (!connectionOk) {
        console.log('Supabase connection test failed');
        return res.status(503).json({ 
          error: 'Service temporarily unavailable. Please try again later.',
          message: 'Database connection issue detected'
        });
      }

      if (type === 'signup') {
        // Check if admin email
        if (adminEmails.includes(email)) {
          console.log('Admin email attempted signup:', email);
          return res.status(400).json({ error: 'This email is reserved for admin login only.' });
        }
        
        console.log('Processing signup for:', email);
        
        // Create user in Supabase Auth with retry logic
        let signupResult;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            const signupOptions = user_metadata ? { data: user_metadata } : undefined;
            signupResult = await supabase.auth.signUp({ 
              email, 
              password, 
              options: signupOptions 
            });
            break;
          } catch (signupError) {
            retryCount++;
            console.log(`Signup attempt ${retryCount} failed:`, signupError.message);
            if (retryCount >= maxRetries) {
              throw signupError;
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }
        
        if (signupResult.error) {
          console.log('Signup error:', signupResult.error.message);
          throw signupResult.error;
        }
        
        console.log('Signup success:', signupResult.data);
        
        // If user was created successfully, store additional data in user_profile table
        if (signupResult.data.user) {
          try {
            // Wait a moment for the user to be fully created in auth.users table
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const { error: insertError } = await supabase
              .from('user_profiles')
              .insert([
                {
                  id: signupResult.data.user.id,
                  email: email,
                  password: password,
                  phone: phone || null,
                  full_name: user_metadata?.full_name || null
                }
              ]);
            
            if (insertError) {
              console.log('Error inserting to user_profiles table:', insertError.message);
              // Don't fail the signup, just log the error
            } else {
              console.log('Successfully inserted user data to user_profiles table');
            }
          } catch (insertErr) {
            console.log('Exception inserting to user_profiles table:', insertErr.message);
            // Don't fail the signup, just log the error
          }
        }
        
        return res.status(200).json({ 
          success: true, 
          user: signupResult.data.user, 
          session: signupResult.data.session 
        });
        
      } else if (type === 'login') {
        // Check if admin email
        if (adminEmails.includes(email)) {
          console.log('Admin email attempted user login:', email);
          return res.status(400).json({ error: 'Please use the admin login page for this email.' });
        }
        
        console.log('Processing login for:', email);
        
        // Login with retry logic
        let loginResult;
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            loginResult = await supabase.auth.signInWithPassword({ 
              email, 
              password 
            });
            break;
          } catch (loginError) {
            retryCount++;
            console.log(`Login attempt ${retryCount} failed:`, loginError.message);
            if (retryCount >= maxRetries) {
              throw loginError;
            }
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
          }
        }
        
        if (loginResult.error) {
          console.log('Login error:', loginResult.error.message);
          
          // Handle specific error types
          const errorMessage = loginResult.error?.message || '';
          if (errorMessage.includes('Email not confirmed') || errorMessage.includes('email not confirmed')) {
            return res.status(400).json({ 
              error: 'Email not confirmed. Please check your email for confirmation link.',
              message: 'Note: In production, users must confirm their email before logging in.'
            });
          } else if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('invalid login credentials')) {
            return res.status(401).json({ 
              error: 'Invalid email or password. Please check your credentials and try again.',
              message: 'If you recently registered, please check your email for confirmation.'
            });
          }
          
          throw loginResult.error;
        }
        
        console.log('Login success');
        return res.status(200).json({ 
          success: true, 
          user: loginResult.data.user, 
          session: loginResult.data.session 
        });
        
      } else {
        console.log('Invalid type:', type);
        return res.status(400).json({ error: 'Invalid request type. Use "signup" or "login".' });
      }
      
    } catch (err) {
      console.log('Catch error:', err.message);
      
      // Provide more specific error messages
      if (err.message.includes('fetch failed') || err.message.includes('timeout')) {
        return res.status(503).json({ 
          error: 'Service temporarily unavailable. Please check your internet connection and try again.',
          message: 'Network connection issue detected'
        });
      }
      
      return res.status(400).json({ error: err.message });
    }
  }

  console.log('Method not allowed:', req.method);
  return res.status(405).json({ error: 'Method not allowed' });
}