# Vendor Onboarding - Integration & Security Architecture

## Overview

Vendor onboarding frontend (Vite + React + TypeScript) integrated with ERPNext (Frappe) as backend and SurePass as KYC verification provider.

---

## Architecture

```
Browser (React App)
    |
    |-- HTTPS -->  ERPNext (Frappe Backend)
                      |
                      |-- Server Scripts -->  SurePass KYC API
                      |
                      |-- Supplier Doctype (data storage)
```

- Browser NEVER calls SurePass directly
- All KYC verification routed through ERPNext server scripts
- SurePass auth token stored in ERPNext `site_config.json` (server-side only)
- Frontend only receives filtered/minimal response data

---

## URL & Identification

- Onboarding link format: `https://domain.com/?uhid=<UHID_VALUE>`
- `uhid` = `custom_uhid` field on Supplier doctype (opaque ID)
- Frontend resolves UHID to Supplier name via ERPNext API filter
- Supplier document name (e.g., `SUP-00001`) never exposed in URL or browser

---

## ERPNext Server Scripts (API Type)

### 1. PAN Verification

| Field | Value |
|-------|-------|
| Script Name | `verify_pan` |
| API Method | `verify_pan` |
| Type | API |
| SurePass Endpoint | `/api/v1/pan/pan-comprehensive` |

**Input:** `{ pan_number }` (from browser)
**Server does:** Calls SurePass with full payload including `get_address: true`
**Returns to browser:** `{ full_name, dob, status, category }` only
**Hidden from browser:** masked_aadhaar, address, email, phone, aadhaar_linked, gender

### 2. GST Verification

| Field | Value |
|-------|-------|
| Script Name | `verify_gst` |
| API Method | `verify_gst` |
| Type | API |
| SurePass Endpoint | `/api/v1/corporate/gstin` |

**Input:** `{ gstin }` (from browser)
**Returns to browser:** `{ gstin, business_name, legal_name, gstin_status }` only
**Hidden from browser:** Full GST profile, registration details, filing status

### 3. Bank Account Verification

| Field | Value |
|-------|-------|
| Script Name | `verify_bank_account` |
| API Method | `verify_bank_account` |
| Type | API |
| SurePass Endpoint | `/api/v1/bank-verification/` |

**Input:** `{ account_number, ifsc_code }` (from browser)
**Returns to browser:** `{ account_holder_name, bank_name, branch_name, micr, account_exists }` only
**Hidden from browser:** Full IFSC details, internal bank codes, raw verification metadata

### 4. MSME/Udyam Verification

| Field | Value |
|-------|-------|
| Script Name | `verify_msme` |
| API Method | `verify_msme` |
| Type | API |
| SurePass Endpoint | `/api/v1/corporate/udyog-aadhaar` |

**Input:** `{ uan }` (from browser)
**Returns to browser:** `{ name_of_enterprise, major_activity, date_of_commencement, organization_type, address, enterprise_type_list }` only
**Hidden from browser:** Raw SurePass response, internal IDs, additional enterprise metadata

---

## Frontend API Calls (after migration)

| Action | Old (direct SurePass) | New (via ERPNext) |
|--------|----------------------|-------------------|
| PAN verify | `POST surepass.app/api/v1/pan/...` | `POST erpnext/api/method/verify_pan` |
| GST verify | `POST surepass.app/api/v1/corporate/gstin` | `POST erpnext/api/method/verify_gst` |
| Bank verify | `POST surepass.app/api/v1/bank-verification/` | `POST erpnext/api/method/verify_bank_account` |
| MSME verify | `POST surepass.app/api/v1/corporate/udyog-aadhaar` | `POST erpnext/api/method/verify_msme` |

---

## ERPNext Site Config

Add to `sites/<your-site>/site_config.json`:

```json
{
    "surepass_base_url": "https://kyc-api.surepass.app",
    "surepass_auth_token": "<YOUR_SUREPASS_JWT_TOKEN>"
}
```

---

## Security Measures Implemented

### Console Protection
- All `console.log` statements logging sensitive data (PAN, bank, MSME, GST, supplier details) removed
- Only non-sensitive logs remain (e.g., PDF generation success)

### localStorage Encryption
- Form cache encrypted with AES-256-GCM (Web Crypto API)
- Encryption key stored in `sessionStorage` (destroyed when tab closes)
- Utility: `src/utils/crypto.ts` (`encryptData`, `decryptData`)
- Backward compatible: reads old unencrypted cache, re-encrypts on next save

### Network Tab Protection
- SurePass API calls moved to ERPNext server scripts (server-side)
- SurePass auth token never sent from browser
- Browser only receives filtered response (minimal fields)
- ERPNext API key/secret: plan to move to cookie-based auth or server-side session

### URL Protection
- Supplier identified by `custom_uhid` (opaque ID) instead of Supplier document name
- URL param: `?uhid=<value>` instead of `?supplier=<name>`
- Supplier name resolved server-side via ERPNext API filter

### Form Access Control
- Verified suppliers (`custom_verification_status === 'Verified'`): shows "Already Submitted" page
- Pending suppliers: form loads normally (can edit and resubmit)
- Invalid/expired UHID: shows "Link Expired" page
- No UHID in URL: shows "Invalid Link" page

---

## Environment Variables

### Frontend (.env) - After Migration

```env
VITE_ERPNEXT_API_URL=https://your-erpnext-site.com/
VITE_ERPNEXT_API_KEY=<api_key>
VITE_ERPNEXT_API_SECRET=<api_secret>
VITE_LOGIN_URL=https://your-login-page.com/login
```

### Removed from Frontend (moved to ERPNext site_config.json)

```
VITE_SUREPASS_AUTH_TOKEN  --> surepass_auth_token (site_config.json)
VITE_SUREPASS_BASE_URL    --> surepass_base_url (site_config.json)
```

---

## Data Flow Summary

```
1. User opens link: ?uhid=ABC123
2. Frontend calls ERPNext: GET /api/resource/Supplier?filters=[["custom_uhid","=","ABC123"]]
3. ERPNext returns supplier name (internal, not shown to user)
4. Frontend loads supplier data + form

5. User enters PAN/GST/Bank/MSME for verification:
   Frontend --> POST /api/method/verify_pan { pan_number }
            --> ERPNext server script
            --> SurePass API (server-side, hidden)
            --> Filtered response back to frontend
            --> UI shows: name, DOB, status only

6. User submits form:
   Frontend --> PUT /api/resource/Supplier/<name> { all form data }
   Frontend --> POST /api/resource/Address { address data }
```

---

## File Structure (key files)

```
src/
  services/
    surepassApi.ts      --> Will be updated to call ERPNext methods instead
    erpnextApi.ts       --> ERPNext API calls (supplier CRUD, UHID lookup)
  stores/
    onboardingStore.ts  --> Zustand store (encrypted cache, UHID resolution)
  utils/
    crypto.ts           --> AES-256-GCM encryption for localStorage
  pages/
    onboarding/
      index.tsx         --> Main page (link expired, invalid link, form, thank you routing)
      ThankYouPage.tsx  --> Already submitted / fresh submission screens
```

---

## Migration Checklist

- [x] Remove sensitive console.log statements
- [x] Add localStorage encryption (AES-256-GCM)
- [x] Switch URL param from `supplier` to `uhid` (custom_uhid lookup)
- [x] Add "Already Submitted" page for verified suppliers
- [x] Add "Link Expired" page for invalid/expired UHID
- [ ] Create ERPNext server scripts (verify_pan, verify_gst, verify_bank_account, verify_msme)
- [ ] Add SurePass credentials to ERPNext site_config.json
- [x] Update frontend surepassApi.ts to call ERPNext methods
- [ ] Remove VITE_SUREPASS_* env vars from frontend .env
- [ ] Test all 4 verification flows end-to-end
- [ ] Move VITE_ERPNEXT_API_SECRET to cookie-based auth (future)
