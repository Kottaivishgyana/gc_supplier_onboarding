# Vendor Onboarding — Fields PRD (Short)

## Tab 1: Basic Information
- Supplier Name (text, required, can be read-only)
- Email Address (email, required, can be read-only)
- Phone Number (tel, required)
- Business Type (select: Supplier/Other, required)
- Registered Address (textarea, required)
- City (text, required)
- State (select, required, all Indian states)
- PIN Code (6 digits, required, validate against state)
- Checkbox: "Billing address is different from registered address"

**If billing different:**
- Billing Address (textarea, required)
- Billing City (text, required)
- Billing State (select, required)
- Billing PIN Code (6 digits, required)

---

## Tab 2: Contact Information

**Section 1: For Transaction**
- Name (text, required)
- Contact (tel, 10 digits, required)
- Email id (email, required)

**Section 2: Additional Communication (1st)**
- Name (text, required)
- HOD/Proprietor/Head (radio: HOD/Proprietor/Head, required)
- Contact (tel, 10 digits, required)
- Email id (email, required)

**Section 3: Additional Communication (2nd)**
- Name (text, required)
- HOD/Proprietor/Head (radio, required)
- Contact (tel, 10 digits, required)
- Email id (email, required)

**Section 4: Optional (3rd contact)**
- Name (text, optional)
- HOD/Proprietor/Head (radio, optional)
- Contact (tel, optional)
- Email id (email, optional)
- Button: "Add Additional Communication Contact (Optional)"

---

## Tab 3: PAN Details
- PAN Number (text, uppercase, 10 chars, required) — label changes: Company/Individual based on business type
- Button: Verify PAN
- Full Name (read-only, auto-filled after verify)
- Date of Birth (read-only, auto-filled after verify)
- Verification status (alert: Verifying/Success/Error)
- Upload PAN Document (file: PDF/JPG/PNG, max 5MB, required)

---

## Tab 4: GST Information
- GST Registration Status (radio: Registered/Not Registered, required)

**If Registered:**
- GSTIN (text, uppercase, 15 chars, required)
- Button: Verify GST
- Verification status (alert)
- GST Verification Details card (read-only, shows: Business Name, Legal Name, Date of Registration, Taxpayer Type, GSTIN Status, Constitution, Address)
- Upload GST Certificate (file: PDF/JPG/PNG, max 5MB, required)

---

## Tab 5: Bank Account
- Account Holder Name (text, required)
- Account Number (text, required)
- Confirm Account Number (text, required, must match)
- IFSC Code (text, uppercase, 11 chars, required)
- Button: Verify Bank Account
- Verification status (alert)
- Bank Name (text, required)
- Branch Name (text, required)

---

## Tab 6: MSME Status
- Are you MSME registered? (radio: Yes/No, required)

**If Yes:**
- Udyam Registration Number (text, uppercase, required)
- Button: Verify MSME
- Verification status (alert)
- Upload MSME/Udyam Certificate (file: PDF/JPG/PNG, max 5MB, optional)

---

## Tab 7: Drug License
- Do you have a valid Drug License? (radio: Yes/No, required)

**If Yes:**
- Drug License Number (text, required)
- Upload Drug License Document (file: PDF/JPG/PNG, max 5MB, optional)

---

## Tab 8: Commercial Details

**Read-only:**
- Credit Days from Delivery date (default: 45)
- Delivery (default: "At our works at your cost")

**Discount:**
- Discount % (radio: On PTS/On PTR/On MRP, required)
- Invoice Discount % (radio: On Invoice/Off Invoice, required)
- Discount Percentage (number, 0-100, 2 decimals, required if invoice type selected)

**Authorized Distributor:**
- Manufacturer's Authorized distributor (radio: Yes/No, required)

**If Yes:**
- Repeating block: Manufacturer Name (text) + Upload Document (file: PDF/JPG/PNG, max 5MB)
- Button: "Add Manufacturer" (min 1 row required)

**Return Policy:**
- a. Non moving (read-only, shows: "100% CN")
- b. Short expiry (number, 0-100, 2 decimals, required)
- c. Damage (radio: Replacement/100% CN, required)
- d. Expired (number, 0-100, 2 decimals, required)

---

## Tab 9: Review & Submit

**Sections (one per previous tab):**
- Basic Information (all fields)
- Contact Information (all 3-4 sections)
- PAN Details (with verification status badge)
- GST Information (with verification status badge)
- Bank Account (account masked as ••••1234, with verification status badge)
- MSME Status (with verification status badge)
- Drug License
- Commercial Details (all fields including manufacturer list)

**Terms & Conditions:**
- Checkbox (required to submit)
- 8 numbered terms (full text in code)
- Submit button

---

## Global Notes
- **File uploads:** PDF, JPG, JPEG, PNG; max 5MB
- **State dropdown:** All Indian states (36 states/UTs)
- **Validation:** Per-step on Next button
- **Read-only fields:** Muted background + helper text
- **Verification badges:** Success (green), Error (red), Pending (yellow)
