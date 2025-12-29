# Vendor Onboarding Portal

A React-based supplier onboarding form that integrates with Frappe ERPNext for vendor KYC and bank account collection.

## Overview

This portal is designed to streamline the vendor onboarding process for Frappe ERPNext. The workflow is:

1. **Admin creates Supplier** in ERPNext with basic info (supplier_name, gstin, email_id)
2. **Admin sends onboarding link** to vendor via email
3. **Vendor completes the form** with additional details (address, PAN, bank account, MSME)
4. **Data is submitted** back to ERPNext via REST API

## Features

- Multi-step onboarding wizard
- Pre-fills existing supplier data from ERPNext
- Validates Indian PAN and GSTIN formats
- Creates/updates Address and Bank Account doctypes
- Mobile responsive design
- Real-time form validation

## Tech Stack

- React 18 + TypeScript
- Vite
- Zustand (state management)
- Tailwind CSS
- shadcn/ui components

---

## Frappe ERPNext Integration Setup

### Prerequisites

1. ERPNext v13+ or v14+
2. API access enabled on your ERPNext site
3. CORS configured for your frontend domain

### Step 1: Enable API Access in ERPNext

1. Go to **Settings > API Access**
2. Click **Generate Keys** for the user who will manage suppliers
3. Note down the **API Key** and **API Secret**

### Step 2: Configure CORS

Add your frontend domain to the allowed origins. In your site's `site_config.json`:

```json
{
  "allow_cors": "*"
}
```

Or for production, specify exact domains:

```json
{
  "allow_cors": "https://gc-supplier-onboarding-git-main-kottai-samy-ks-projects.vercel.app"
}
```

After updating, run:

```bash
bench restart
```

### Step 3: Create Custom Fields (Optional - for MSME)

The Supplier doctype doesn't have MSME fields by default. To store MSME data:

1. Go to **Customize Form > Supplier**
2. Add the following custom fields:

| Field Label | Field Name | Field Type |
|-------------|------------|------------|
| MSME Registered | is_msme_registered | Check |
| Udyam Number | udyam_number | Data |

3. Click **Update**

### Step 4: Create a Server Script for Email Notification

To automatically send onboarding emails when a supplier is created:

1. Go to **Server Script > New**
2. Configure:

```
Script Type: DocType Event
DocType: Supplier
Event: After Insert
```

3. Add the script (copy exactly as shown - no imports needed in Server Scripts):

```python
if doc.email_id:
    onboarding_url = "https://gc-supplier-onboarding-git-main-kottai-samy-ks-projects.vercel.app/?supplier=" + frappe.utils.quote(doc.name)
    
    subject = "Complete Your Vendor Onboarding - Geri Care"
    
    message = """
    <p>Dear {supplier_name},</p>
    
    <p>Welcome to Geri Care! You have been registered as a supplier in our system.</p>
    
    <p>Please complete your onboarding by providing additional details through the link below:</p>
    
    <p><a href="{url}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Complete Onboarding</a></p>
    
    <p>This link is unique to your account. Please do not share it with others.</p>
    
    <p>If you have any questions, please contact our procurement team.</p>
    
    <p>Best regards,<br>Geri Care Hospital</p>
    """.format(supplier_name=doc.supplier_name, url=onboarding_url)
    
    frappe.sendmail(
        recipients=[doc.email_id],
        subject=subject,
        message=message,
        now=True
    )
```

> **Important**: In Frappe Server Scripts, `frappe` and `doc` are automatically available. Do NOT add `import frappe` or define functions.

### Step 5: Configure Notification (Alternative to Server Script)

You can also use the Notification doctype:

1. Go to **Notification > New**
2. Configure:
   - **Name**: Supplier Onboarding Email
   - **DocType**: Supplier
   - **Event**: New
   - **Condition**: `doc.email_id`
   - **Recipients**: `doc.email_id`
   - **Subject**: Complete Your Vendor Onboarding - Geri Care
   - **Message**:

```html
<p>Dear {{ doc.supplier_name }},</p>

<p>Welcome! Please complete your vendor onboarding:</p>

<p><a href="https://gc-supplier-onboarding-git-main-kottai-samy-ks-projects.vercel.app/?supplier={{ doc.name | urlencode }}">
Complete Onboarding Form</a></p>

<p>Best regards,<br>Geri Care Hospital</p>
```

---

## Frontend Configuration

### Step 1: Clone and Install

```bash
cd vendor-onboarding
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your ERPNext credentials:

```env
VITE_ERPNEXT_API_URL=https://your-site.frappe.cloud
VITE_ERPNEXT_API_KEY=your_api_key
VITE_ERPNEXT_API_SECRET=your_api_secret
```

### Step 3: Run Development Server

```bash
npm run dev
```

### Step 4: Test with a Supplier

Open the form with a supplier parameter:

```
http://localhost:5173/?supplier=ABC%20Supplier%20Pvt%20Ltd
```

---

## API Field Mapping

### Supplier Doctype

| Form Field | ERPNext Field | Notes |
|------------|---------------|-------|
| Supplier Name | `supplier_name` | Also used as document name |
| Email | `email_id` | Primary contact email |
| Phone | `mobile_no` | Contact number |
| PAN Number | `pan` | 10-character PAN |
| GSTIN | `gstin` | 15-character GST number |
| GST Status | `gst_category` | Registered Regular / Unregistered |

### Address Doctype

| Form Field | ERPNext Field |
|------------|---------------|
| Address | `address_line1` |
| City | `city` |
| State | `state` |
| PIN Code | `pincode` |

The address is linked to the supplier via the `links` child table.

### Bank Account Doctype

| Form Field | ERPNext Field |
|------------|---------------|
| Account Name | `account_name` |
| Account Number | `bank_account_no` |
| IFSC Code | `branch_code` |
| Bank Name | `bank` (links to Bank doctype) |

---

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `VITE_ERPNEXT_API_URL`
   - `VITE_ERPNEXT_API_KEY`
   - `VITE_ERPNEXT_API_SECRET`
3. Deploy

### Manual Build

```bash
npm run build
```

The `dist/` folder can be deployed to any static hosting.

---

## Security Considerations

1. **API Keys**: Never expose API keys in client-side code for production. Consider:
   - Using a backend proxy
   - Implementing OAuth2 with limited scope
   - Using Frappe's guest access with specific permissions

2. **CORS**: In production, restrict CORS to only your frontend domain

3. **Rate Limiting**: Configure rate limiting in ERPNext for API endpoints

4. **Token Expiry**: Consider implementing token refresh mechanisms

---

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Check `site_config.json` has correct `allow_cors` setting
2. Run `bench restart`
3. Clear browser cache

### API Authentication Errors

1. Verify API key and secret are correct
2. Ensure the user has permissions for Supplier, Address, Bank Account doctypes
3. Check if API access is enabled for the user

### Supplier Not Found

1. Verify the supplier name in the URL matches exactly
2. Check URL encoding (spaces should be `%20`)

---

## License

MIT
