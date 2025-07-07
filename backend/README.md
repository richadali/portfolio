# Portfolio Backend Server

A production-ready Node.js backend server for handling contact form submissions with Zoho email integration.

## Features

- ✅ **Zoho Email Integration** - Professional email sending via SMTP
- ✅ **Security** - Helmet, CORS, rate limiting, input validation
- ✅ **Validation** - Comprehensive input sanitization and validation
- ✅ **Auto-Response** - Professional auto-response emails to senders
- ✅ **Error Handling** - Robust error handling and logging
- ✅ **Rate Limiting** - Prevents spam (5 requests per 15 minutes per IP)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your credentials:

```bash
cp .env.example .env
```

Update `.env` with your Zoho credentials:

```env
ZOHO_EMAIL=contact@richadali.dev
ZOHO_PASSWORD=your_zoho_app_password
```

### 3. Get Zoho App Password

1. **Go to [Zoho Account Security](https://accounts.zoho.in/home#security)**
2. **Navigate to "App Passwords"**
3. **Generate New Password:**
   - App Name: "Portfolio Contact Form"
   - Select: "Mail"
   - Click "Generate"
4. **Copy the generated password** and paste it in your `.env` file

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

### 5. Test the Server

```bash
# Check if server is running
curl http://localhost:3001/api/health

# Test contact form (replace with actual data)
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message"
  }'
```

## API Endpoints

### GET /api/health

Health check endpoint

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /api/contact

Submit contact form

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Hello",
  "message": "This is my message"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Message sent successfully! Auto-response sent to sender."
}
```

## Validation Rules

- **Name**: 2-100 characters, required
- **Email**: Valid email format, required
- **Subject**: 5-200 characters, required
- **Message**: 10-2000 characters, required

## Rate Limiting

- **5 requests per 15 minutes** per IP address
- Returns 429 status with error message when exceeded

## Production Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-domain.com
ZOHO_EMAIL=contact@richadali.dev
ZOHO_PASSWORD=your_zoho_app_password
```

### Recommended Hosting Platforms

- **Railway** - Easy Node.js deployment
- **Heroku** - Classic PaaS platform
- **DigitalOcean App Platform** - Simple container deployment
- **AWS EC2** - Full control over server

### Production Start

```bash
npm start
```

## Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin request security
- **Rate Limiting** - Spam protection
- **Input Validation** - XSS prevention
- **Input Sanitization** - HTML entity encoding

## Email Templates

The server sends two types of emails:

1. **Notification Email** (to you)

   - Professional HTML template
   - Contains all form data
   - Reply-to header set to sender's email

2. **Auto-Response Email** (to sender)
   - Branded confirmation email
   - Professional appearance
   - Contact information included

## Troubleshooting

### Common Issues

**"Authentication failed" Error:**

- Verify Zoho app password is correct
- Ensure 2FA is enabled on your Zoho account
- Check if the email address matches your Zoho account

**CORS Errors:**

- Update `FRONTEND_URL` in `.env`
- Ensure frontend URL matches exactly (no trailing slash)

**Rate Limit Exceeded:**

- Wait 15 minutes or restart server in development
- In production, this protects against spam

## Development

### File Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── .env.example       # Environment template
├── .env               # Your environment (ignored by git)
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

### Adding New Features

1. **New Routes**: Add to `server.js` with proper validation
2. **Email Templates**: Update HTML in the email options
3. **Validation**: Add new rules to `contactValidation` array
4. **Security**: Test with security tools before deployment

## License

ISC - Free for personal and commercial use
