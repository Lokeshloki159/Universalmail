# UniversalMail Chrome Extension

A Chrome extension that brings Gmail-style productivity features to Outlook, Yahoo Mail, iCloud Mail, and other non-Gmail email clients.

## Features

- **Schedule Send** — Draft emails now, send them later at the perfect time
- **Email Templates** — Save reusable emails and insert them with one click
- **Open Tracking** — Know when your emails are opened with invisible tracking pixels
- **Snooze** — Temporarily hide emails and bring them back when you need them
- **Read Receipts** — Request read confirmations on sent emails
- **Multi-Provider** — Works on Outlook.com, Yahoo Mail, iCloud Mail, AOL, Zoho, and more

## Installation (Developer Mode)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **Load unpacked**
4. Select the `extension/` folder from this project
5. The UniversalMail icon will appear in your Chrome toolbar

## Usage

1. Open **Outlook.com**, **Yahoo Mail**, or **iCloud Mail** in Chrome
2. Click **New Message** or **Compose**
3. The UniversalMail toolbar appears next to the Send button with four actions:
   - **Schedule** — Pick a date/time to send the email
   - **Templates** — Insert a saved template
   - **Snooze** — Set a reminder for this email
   - **Track** — Enable open tracking
4. Click the **UniversalMail icon** in the Chrome toolbar to manage templates, view scheduled emails, see tracking analytics, and configure settings

## File Structure

```
extension/
  manifest.json          # Extension manifest (Manifest V3)
  background.js          # Service worker for alarms & notifications
  content-common.js      # Shared UI utilities (toolbar, modals, toasts)
  content-outlook.js     # Outlook.com integration
  content-yahoo.js       # Yahoo Mail integration
  content-icloud.js      # iCloud Mail integration
  content-styles.css     # Injected styles for toolbars and modals
  popup.html             # Popup dashboard HTML
  popup.js               # Popup dashboard logic
  icons/
    icon16.svg           # Extension icon (16px)
    icon32.svg           # Extension icon (32px)
    icon48.svg           # Extension icon (48px)
    icon128.svg          # Extension icon (128px)
```

## Architecture

- **Content Scripts** run inside each email provider's page, detecting compose windows and injecting toolbars
- **Background Service Worker** handles scheduled email alarms and notifications
- **Chrome Storage API** persists templates, scheduled emails, tracking events, and settings locally
- **Popup Dashboard** provides a React-free UI for managing all extension data

## Permissions

- `storage` — Save templates, scheduled emails, and settings
- `alarms` — Trigger scheduled sends and snooze reminders
- `notifications` — Show desktop notifications when emails are sent or unsnoozed
- `activeTab` — Detect which email provider is currently open
- `host_permissions` — Access Outlook, Yahoo, iCloud, AOL, Zoho, Proton, and Fastmail domains

## Development

To modify the extension:
1. Edit the relevant `.js` or `.css` file
2. Go to `chrome://extensions/`
3. Click the **refresh** icon on the UniversalMail card
4. Reload the email page to see changes

## License

MIT
