# EmailJS Setup Guide for WanderMind

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to https://dashboard.emailjs.com/sign-up
2. Sign up with your email (yashig406@gmail.com)
3. Verify your email

### Step 2: Add Email Service
1. Click "Add New Service"
2. Select "Gmail"
3. Click "Connect Account"
4. Sign in with: yashig406@gmail.com
5. Use App Password: rvmfblluygpdmoko
6. Service ID will be generated (e.g., `service_abc123`)
7. Copy this Service ID

### Step 3: Create Email Template
1. Click "Email Templates" → "Create New Template"
2. Template Name: "Trip Invitation"
3. Use this template content:

```
Subject: Trip Invitation: {{trip_destination}}

Hi {{to_name}},

{{from_name}} has invited you to collaborate on an exciting trip!

📍 Destination: {{trip_destination}}
📅 Duration: {{trip_duration}}

{{message}}

Click here to view and join the trip:
{{trip_link}}

Happy travels!
The WanderMind Team

---
This email was sent from WanderMind - AI-Powered Travel Planning
```

4. Template ID will be generated (e.g., `template_xyz789`)
5. Copy this Template ID
6. Click "Save"

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. Find "Public Key" section
3. Copy your Public Key (e.g., `abc123XYZ`)

### Step 5: Update .env File
Open your `.env` file and update these lines:

```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abc123XYZ
```

Replace with your actual IDs from EmailJS dashboard.

### Step 6: Restart Development Server
```bash
npm run dev
```

## Testing

1. Go to your trip page
2. Click on "Group" tab
3. Click "Add Member"
4. Enter:
   - Name: Test User
   - Email: your-test-email@gmail.com
5. Click "Send Invite"
6. Check the email inbox!

## Troubleshooting

### Email not sending?
- Check if all 3 IDs are correctly copied in .env
- Make sure .env file is saved
- Restart the dev server
- Check browser console for errors

### "Demo mode" message?
- EmailJS credentials not loaded
- Check .env file has VITE_ prefix
- Restart dev server

### Gmail blocking?
- Make sure you're using App Password, not regular password
- Enable "Less secure app access" in Gmail settings
- Check Gmail's "Sent" folder

## Email Template Variables

These variables are automatically filled:
- `{{to_name}}` - Recipient's name
- `{{to_email}}` - Recipient's email
- `{{from_name}}` - Sender's name
- `{{trip_destination}}` - Trip destination
- `{{trip_duration}}` - Trip duration
- `{{trip_link}}` - Link to view trip
- `{{message}}` - Custom message

## Free Tier Limits

EmailJS Free Plan:
- 200 emails per month
- Perfect for testing and small groups
- Upgrade to paid plan for more emails

## Support

If you need help:
- EmailJS Docs: https://www.emailjs.com/docs/
- EmailJS Support: support@emailjs.com
