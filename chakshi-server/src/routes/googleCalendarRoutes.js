import express from 'express';
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Debug: Check if environment variables are loaded
console.log('\n🔍 Google Calendar Environment Check:');
console.log('✓ CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? '✓ Present' : '✗ MISSING');
console.log('✓ CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? '✓ Present' : '✗ MISSING');
console.log('✓ REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI || '✗ MISSING');
console.log('');

// Validate environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
  console.error('❌ ERROR: Google Calendar credentials not found in .env file!');
  console.error('Please add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI to your .env file');
}

// OAuth2 Client Configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI  // This MUST be set
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Generate auth URL
router.get('/auth/google', (req, res) => {
  try {
    // Verify credentials exist
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
      return res.status(500).json({ 
        success: false, 
        error: 'Google Calendar credentials not configured',
        message: 'Please check your .env file'
      });
    }

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ],
      prompt: 'consent',
      include_granted_scopes: true
    });
    
    console.log('✅ Generated Auth URL:', authUrl);
    console.log('📍 Redirect URI:', process.env.GOOGLE_REDIRECT_URI);
    
    res.json({ 
      success: true, 
      url: authUrl,
      debug: {
        clientId: process.env.GOOGLE_CLIENT_ID ? 'Present' : 'Missing',
        redirectUri: process.env.GOOGLE_REDIRECT_URI || 'Missing'
      }
    });
  } catch (error) {
    console.error('❌ Auth URL Generation Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: 'Failed to generate authorization URL'
    });
  }
});

// OAuth callback handler
router.get('/auth/google/callback', async (req, res) => {
  const { code, error } = req.query;
  
  console.log('🔄 OAuth Callback received');
  console.log('Code present:', !!code);
  console.log('Error:', error || 'None');
  
  if (error) {
    console.error('❌ OAuth Error:', error);
    return res.status(400).send(`
      <html>
        <head><title>Authorization Error</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #ef4444;">❌ Authorization Error</h1>
          <p style="color: #6b7280;">${error}</p>
          <button onclick="window.close()" style="padding: 10px 20px; cursor: pointer;">Close</button>
        </body>
      </html>
    `);
  }
  
  if (!code) {
    console.error('❌ No authorization code received');
    return res.status(400).send(`
      <html>
        <head><title>Missing Code</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #ef4444;">❌ Error</h1>
          <p>No authorization code received</p>
          <button onclick="window.close()" style="padding: 10px 20px; cursor: pointer;">Close</button>
        </body>
      </html>
    `);
  }
  
  try {
    console.log('🔑 Exchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    
    console.log('✅ Tokens received successfully');
    console.log('Access Token:', tokens.access_token ? '✓ Present' : '✗ Missing');
    console.log('Refresh Token:', tokens.refresh_token ? '✓ Present' : '✗ Missing');
    console.log('Expires in:', tokens.expiry_date ? new Date(tokens.expiry_date).toLocaleString() : 'Unknown');
    
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Authentication Successful</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container { 
              text-align: center; 
              padding: 40px; 
              background: white; 
              border-radius: 16px; 
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              max-width: 400px;
              animation: slideIn 0.5s ease-out;
            }
            @keyframes slideIn {
              from { transform: translateY(-50px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            .success-icon { 
              color: #10b981; 
              font-size: 64px; 
              margin-bottom: 20px;
              animation: scaleIn 0.5s ease-out 0.2s backwards;
            }
            @keyframes scaleIn {
              from { transform: scale(0); }
              to { transform: scale(1); }
            }
            h2 { 
              color: #1f2839; 
              margin-bottom: 10px; 
              font-size: 24px;
            }
            p { 
              color: #6b7280; 
              margin-bottom: 20px; 
              font-size: 14px;
            }
            .countdown {
              color: #b69d74;
              font-size: 12px;
              margin-top: 15px;
            }
            .btn {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              cursor: pointer;
              transition: transform 0.2s;
            }
            .btn:hover {
              transform: scale(1.05);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✓</div>
            <h2>Connected Successfully!</h2>
            <p>Your Google Calendar is now synced with Chakshi Legal Platform.</p>
            <button class="btn" onclick="window.close()">Close Window</button>
            <div class="countdown">Closing automatically in <span id="timer">3</span>s...</div>
            <script>
              // Send tokens to parent window
              if (window.opener) {
                window.opener.postMessage({ 
                  type: 'GOOGLE_CALENDAR_AUTH_SUCCESS', 
                  tokens: ${JSON.stringify(tokens)} 
                }, '*');
              }
              
              // Countdown timer
              let seconds = 3;
              const timerElement = document.getElementById('timer');
              const countdown = setInterval(() => {
                seconds--;
                timerElement.textContent = seconds;
                if (seconds <= 0) {
                  clearInterval(countdown);
                  window.close();
                }
              }, 1000);
            </script>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error('❌ Token Exchange Error:', error);
    res.status(500).send(`
      <html>
        <head><title>Authentication Failed</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: #ef4444;">❌ Authentication Failed</h1>
          <p style="color: #6b7280; margin: 20px 0;">${error.message}</p>
          <pre style="background: #f5f5f5; padding: 15px; text-align: left; overflow: auto;">
${JSON.stringify(error, null, 2)}
          </pre>
          <button onclick="window.close()" style="padding: 10px 20px; cursor: pointer; margin-top: 20px;">
            Close Window
          </button>
        </body>
      </html>
    `);
  }
});

// Get calendars
router.get('/calendars', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No authorization token provided' });
    }

    const accessToken = authHeader.split(' ')[1];
    oauth2Client.setCredentials({ access_token: accessToken });

    const response = await calendar.calendarList.list();
    
    console.log('✅ Fetched', response.data.items?.length || 0, 'calendars');
    res.json({ success: true, calendars: response.data.items });
  } catch (error) {
    console.error('❌ Error fetching calendars:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch calendars', 
      error: error.message 
    });
  }
});

// Get events
router.get('/events', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No authorization token provided' });
    }

    const accessToken = authHeader.split(' ')[1];
    oauth2Client.setCredentials({ access_token: accessToken });

    const { calendarId = 'primary', timeMin, timeMax, maxResults = 100 } = req.query;

    const response = await calendar.events.list({
      calendarId,
      timeMin: timeMin || new Date().toISOString(),
      timeMax: timeMax,
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: parseInt(maxResults)
    });

    console.log('✅ Fetched', response.data.items?.length || 0, 'events');
    res.json({ success: true, events: response.data.items });
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch events', 
      error: error.message 
    });
  }
});

// Create event
router.post('/events', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No authorization token provided' });
    }

    const accessToken = authHeader.split(' ')[1];
    oauth2Client.setCredentials({ access_token: accessToken });

    const { 
      summary, 
      description, 
      location,
      startDateTime, 
      endDateTime, 
      attendees = [],
      timeZone = 'Asia/Kolkata'
    } = req.body;

    const event = {
      summary,
      description: description || '',
      location: location || '',
      start: { dateTime: startDateTime, timeZone },
      end: { dateTime: endDateTime, timeZone },
      attendees: attendees.map(email => ({ email })),
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 10 },
        ],
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      sendUpdates: 'all'
    });

    console.log('✅ Event created:', response.data.id);
    res.json({ success: true, event: response.data });
  } catch (error) {
    console.error('❌ Error creating event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create event', 
      error: error.message 
    });
  }
});

// Update event
router.put('/events/:eventId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No authorization token provided' });
    }

    const accessToken = authHeader.split(' ')[1];
    oauth2Client.setCredentials({ access_token: accessToken });

    const { eventId } = req.params;
    const { summary, description, startDateTime, endDateTime, location } = req.body;

    const event = {
      summary,
      description,
      location,
      start: { dateTime: startDateTime, timeZone: 'Asia/Kolkata' },
      end: { dateTime: endDateTime, timeZone: 'Asia/Kolkata' }
    };

    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId,
      resource: event
    });

    console.log('✅ Event updated:', eventId);
    res.json({ success: true, event: response.data });
  } catch (error) {
    console.error('❌ Error updating event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update event', 
      error: error.message 
    });
  }
});

// Delete event
router.delete('/events/:eventId', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'No authorization token provided' });
    }

    const accessToken = authHeader.split(' ')[1];
    oauth2Client.setCredentials({ access_token: accessToken });

    const { eventId } = req.params;

    await calendar.events.delete({
      calendarId: 'primary',
      eventId
    });

    console.log('✅ Event deleted:', eventId);
    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting event:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete event', 
      error: error.message 
    });
  }
});

export default router;
