# Vendor Onboarding — PRD: Tabs & Fields (Design Reference)

Use this document for design handoff. Every tab and every field is listed so no field is missed in UI/UX.

---

## Flow Overview

| Step | Tab Title        | Description           |
|------|------------------|-----------------------|
| 1    | Basic Info       | Company details       |
| 2    | Contact Information | Contact details    |
| 3    | PAN Details      | Tax verification      |
| 4    | GST Info         | GST registration      |
| 5    | Bank Account     | Payment details       |
| 6    | MSME Status      | Enterprise category   |
| 7    | Drug License     | License information   |
| 8    | Commercial Details | Commercial terms    |
| 9    | Review & Submit  | Final review + submit  |

---

## Tab 1: Basic Information

**Page title:** Basic Information  
**Subtitle:** Please fill in your company details accurately. This information will be used for verification purposes.

### Fields (in order)

| # | Field label | Type | Required | Placeholder / hint | Notes |
|---|-------------|------|----------|--------------------|-------|
| 1 | Supplier Name | Text input | Yes | "Enter supplier name" | Can be read-only if pre-filled from ERPNext; show helper: "This field is pre-filled and cannot be edited" |
| 2 | Email Address | Email input | Yes | "Enter official email address" | Can be read-only if pre-filled; same helper as above |
| 3 | Phone Number | Tel input | Yes | "Enter contact number" | |
| 4 | Business Type | Select (dropdown) | Yes | "Select Business Type" | Options: **Supplier**, **Other** |
| 5 | Registered Address | Textarea | Yes | "Enter street address" | Multi-line |
| 6 | City | Text input | Yes | "Enter city" | |
| 7 | State | Select (dropdown) | Yes | "Select State" | All Indian states (see INDIAN_STATES in code) |
| 8 | PIN Code | Text input, numeric, 6 digits | Yes | "Enter 6-digit PIN code" | Max 6 digits; validate against selected state; show error if mismatch |
| 9 | Billing address is different from registered address | Checkbox | No | — | Label: "Billing address is different from registered address" |

### Conditional section: Billing Address

**Visible when:** Checkbox above is checked.

**Section heading:** Billing Address

| # | Field label | Type | Required | Placeholder / hint |
|---|-------------|------|----------|--------------------|
| 10 | Billing Address | Textarea | Yes (if section visible) | "Enter billing street address" |
| 11 | City | Text input | Yes | "Enter city" |
| 12 | State | Select | Yes | "Select State" | Same state list |
| 13 | PIN Code | Text input, 6 digits | Yes | "Enter 6-digit PIN code" | Validate against billing state |

---

## Tab 2: Contact Information

**Page title:** Contact of Supplier  
**Subtitle:** Please provide contact details for transaction and escalation purposes.

### Section 1: For Transaction

**Subheading:** For Transaction  
**Helper text:** PO/ Billing Person

| # | Field label | Type | Required | Placeholder |
|---|-------------|------|----------|-------------|
| 1 | Name | Text input | Yes | "Enter name" |
| 2 | Contact | Tel input, 10 digits | Yes | "Enter contact number" |
| 3 | Email id | Email input | Yes | "Enter email address" |

### Section 2: For additional communication (1st)

**Subheading:** For additional communication

| # | Field label | Type | Required | Placeholder / options |
|---|-------------|------|----------|------------------------|
| 4 | Name | Text input | Yes | "Enter name" |
| 5 | HOD/Proprietor/Head | Radio group | Yes | Options: **HOD**, **Proprietor**, **Head** |
| 6 | Contact | Tel input, 10 digits | Yes | "Enter contact number" |
| 7 | Email id | Email input | Yes | "Enter email address" |

### Section 3: For additional communication (2nd)

**Subheading:** For additional communication (same as above, second block)

| # | Field label | Type | Required | Placeholder / options |
|---|-------------|------|----------|------------------------|
| 8 | Name | Text input | Yes | "Enter name" |
| 9 | HOD/Proprietor/Head | Radio group | Yes | **HOD**, **Proprietor**, **Head** |
| 10 | Contact | Tel input, 10 digits | Yes | "Enter contact number" |
| 11 | Email id | Email input | Yes | "Enter email address" |

### Section 4: Optional third contact

**Visible when:** User has clicked "Add Additional Communication Contact (Optional)" (or any of the optional contact fields has value).

**Subheading:** For additional communication (Optional)  
**Action:** Button to remove this block (X).

| # | Field label | Type | Required | Placeholder / options |
|---|-------------|------|----------|------------------------|
| 12 | Name | Text input | No | "Enter name" |
| 13 | HOD/Proprietor/Head | Radio group | No | **HOD**, **Proprietor**, **Head** |
| 14 | Contact | Tel input, 10 digits | No | "Enter contact number" |
| 15 | Email id | Email input | No | "Enter email address" |

**CTA (when section 4 is hidden):** Button — "Add Additional Communication Contact (Optional)"

---

## Tab 3: PAN Details

**Page title:** PAN Details  
**Subtitle:** Enter your Permanent Account Number (PAN) for tax verification.

| # | Field label | Type | Required | Placeholder / hint | Notes |
|---|-------------|------|----------|--------------------|-------|
| 1 | PAN Number (Company) or PAN Number (Individual) | Text input, uppercase, 10 chars | Yes | "ABCDE1234F" | Label depends on Basic Info business type (Company vs Individual). Hint: "Format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)" |
| 2 | [Button] Verify PAN | Button | — | — | Triggers API verification; shows loading then success/error |
| 3 | Full Name (from PAN) | Text input, read-only | — | — | Shown and auto-filled after successful verification |
| 4 | Date of Birth (from PAN) | Date input, read-only | — | — | Shown and auto-filled after successful verification |
| 5 | Verification status message | Alert/inline message | — | — | States: Verifying… / Success / Error |
| 6 | Upload PAN Document | File upload | Yes | — | Accept: PDF, JPG, JPEG, PNG. Hint: "Upload PDF, JPG, or PNG file (Max 5MB)". Show selected file name + size; option to remove file |

---

## Tab 4: GST Information

**Page title:** GST Information  
**Subtitle:** Provide your GST registration details for invoice verification.

| # | Field label | Type | Required | Placeholder / options | Notes |
|---|-------------|------|----------|------------------------|-------|
| 1 | GST Registration Status | Radio group | Yes | **Registered**, **Not Registered** | |
| 2 | GSTIN | Text input, uppercase, 15 chars | Yes (if Registered) | "22AAAAA0000A1Z5" | Visible only if status = Registered. Hint: "15-character GST Identification Number" |
| 3 | [Button] Verify GST | Button | — | — | Visible only if Registered; triggers verification |
| 4 | Verification status message | Alert/inline | — | — | Verifying… / Success / Error |
| 5 | GST Verification Details (card) | Read-only card | — | — | Visible on success; fields: Business Name, Legal Name, Date of Registration, Taxpayer Type, GSTIN Status, Constitution of Business, Address (all optional from API) |
| 6 | Upload GST Certificate | File upload | Yes (if Registered) | — | Accept: PDF, JPG, JPEG, PNG. Hint: "Upload PDF, JPG, or PNG file (Max 5MB)" |

---

## Tab 5: Bank Account

**Page title:** Bank Account Details  
**Subtitle:** Provide your bank account information for payment processing.

| # | Field label | Type | Required | Placeholder / hint | Notes |
|---|-------------|------|----------|--------------------|-------|
| 1 | Account Holder Name | Text input | Yes | "Enter account holder name" |
| 2 | Account Number | Text input | Yes | "Enter bank account number" |
| 3 | Confirm Account Number | Text input | Yes | "Re-enter bank account number" | Must match Account Number |
| 4 | IFSC Code | Text input, uppercase, 11 chars | Yes | "SBIN0001234" | Hint: "11-character IFSC code (e.g., SBIN0001234)" |
| 5 | [Button] Verify Bank Account | Button | — | — | Uses account number + IFSC; can auto-fill Bank Name, Branch, MICR |
| 6 | Verification status message | Alert/inline | — | — | Verifying… / Success / Error |
| 7 | Bank Name | Text input | Yes | "Enter bank name" |
| 8 | Branch Name | Text input | Yes | "Enter branch name" |

*(MICR is optional, can be auto-filled from verification; no dedicated input in current UI.)*

---

## Tab 6: MSME Status

**Page title:** MSME Status  
**Subtitle:** If your business is registered under MSME, please provide the details. This information helps in faster payment processing.

| # | Field label | Type | Required | Placeholder / options | Notes |
|---|-------------|------|----------|------------------------|-------|
| 1 | Are you MSME registered? | Radio group | Yes | **Yes**, **No** | |
| 2 | Udyam Registration Number | Text input, uppercase | Yes (if Yes) | "UDYAM-XX-00-0000000" | Visible only if Yes. Hint: "Format: UDYAM-XX-00-0000000" |
| 3 | [Button] Verify MSME | Button | — | — | Visible only if Yes |
| 4 | Verification status message | Alert/inline | — | — | Verifying… / Success / Error |
| 5 | Upload MSME / Udyam Certificate | File upload | No | — | Visible only if Yes. Accept: PDF, JPG, JPEG, PNG. Hint: "Upload PDF, JPG, or PNG file (Max 5MB)" |

---

## Tab 7: Drug License

**Page title:** Drug License Information  
**Subtitle:** Please let us know if you have a valid Drug License. If yes, provide the license details for additional verification.

| # | Field label | Type | Required | Placeholder / hint | Notes |
|---|-------------|------|----------|--------------------|-------|
| 1 | Do you have a valid Drug License? | Radio group | Yes | **Yes**, **No** | If No, clear number and document |
| 2 | Drug License Number | Text input | Yes (if Yes) | "Enter drug license number" | Visible only if Yes. Hint: "Enter your valid drug license number for verification purposes." |
| 3 | Upload Drug License Document | File upload | No | — | Visible only if Yes. Accept: PDF, JPG, JPEG, PNG. Hint: "Upload PDF, JPG, or PNG file (Max 5MB)" |

---

## Tab 8: Commercial Details

**Page title:** Commercial Details  
**Subtitle:** Please provide commercial terms and policies for your business.

### General terms (read-only)

| # | Field label | Type | Required | Value / hint |
|---|-------------|------|----------|--------------|
| 1 | Credit Days from Delivery date | Text input, read-only | — | Default "45". Helper: "This field can't be modified. Please contact Geri Care for any modifications." |
| 2 | Delivery | Text input, read-only | — | Default "At our works at your cost". Helper: "This field is pre-filled and cannot be edited" |

### Discount %

| # | Field label | Type | Required | Options / hint |
|---|-------------|------|----------|----------------|
| 3 | Discount % | Radio group | Yes | Helper: "On PTS/On PTR/On MRP (tick any)". Options: **On PTS**, **On PTR**, **On MRP** |
| 4 | Invoice Discount % | Radio group | Yes | **On Invoice**, **Off Invoice** |
| 5 | Discount Percentage | Number input (0–100, 2 decimals) | Yes (if 4 is selected) | "Enter percentage (0-100)". Shown when On/Off Invoice is selected |

### Authorized distributor

| # | Field label | Type | Required | Notes |
|---|-------------|------|----------|-------|
| 6 | Manufacturer's Authorized distributor | Radio group | Yes | **Yes**, **No** |
| 7 | Authorized list (when Yes) | Repeating block | Yes (if Yes) | Label: "Attach List of manufacturers who authorized yourself and a sample invoice copy of each" |

**Per manufacturer row (repeatable, min 1 when Yes):**

- Manufacturer Name — text input, placeholder "Enter manufacturer name"
- Upload Document — file (PDF, JPG, JPEG, PNG, max 5MB)
- Remove row button (disabled when only one row)

**CTA:** "Add Manufacturer" (adds another row).

### Return Policy (section heading)

| # | Field label | Type | Required | Notes |
|---|-------------|------|----------|-------|
| 8 | a. Non moving | Text input, read-only | — | Display: "{value}% CN" (default value 100). Helper: "CN value: 100%" |
| 9 | b. Short expiry (less than 90 days) | Number input (0–100, 2 decimals) | Yes | Placeholder: "Enter percentage (0-100)". Helper: "CN value: ____%" |
| 10 | c. Damage | Radio group | Yes | **Replacement**, **100% CN** |
| 11 | d. Expired | Number input (0–100, 2 decimals) | Yes | Placeholder: "Enter percentage (0-100)". Helper: "CN value: ____%" |

---

## Tab 9: Review & Submit

**Page title:** Review & Submit  
**Subtitle:** Please review all the information before submitting your onboarding application.

### Structure

- One **card/section per previous step** (Basic Information, Contact Information, PAN Details, GST Information, Bank Account, MSME Status, Drug License, Commercial Details).
- Each section has:
  - **Title** (with icon)
  - **Edit** button (link style) — navigates to that step number
  - **Key-value grid** of all entered data for that step

### Fields to show per section

**Basic Information:** Supplier Name, Email, Phone, Business Type, Address, City, State, PIN Code; if billing different: Billing Address, Billing City, Billing State, Billing PIN Code.

**Contact Information:** For Transaction: Name, Contact, Email. For Additional Communication (1): Name, HOD/Proprietor/Head, Contact, Email. For Additional Communication (2): same four. Optional third contact: same four if present.

**PAN Details:** PAN Number, Full Name (as per PAN), Date of Birth; PAN verification status badge (success / error / pending).

**GST Information:** GST Status; if Registered: GSTIN + GST verification status badge.

**Bank Account:** Account Holder, Account Number (masked, e.g. ••••1234), IFSC, Bank Name, Branch; bank verification status badge.

**MSME Status:** MSME Registered (Yes/No); if Yes: Udyam Number + MSME verification status badge.

**Drug License:** Drug License Number; if document uploaded: document name.

**Commercial Details:** Credit Days, Delivery, Discount Basis (On PTS/PTR/MRP), Invoice Discount Type, Invoice Discount %, Authorized Distributor (Yes/No); if Yes: list of manufacturers with document names. Return Policy: Non moving %, Short expiry %, Damage (Replacement/100% CN), Expired %.

### Terms and conditions

- **Checkbox:** "Terms and Conditions" (required to submit).
- **Content:** Numbered list of 8 terms (full text in `ReviewSubmitStep.tsx`).
- **Submit** button (primary CTA).

---

## Global / Shared

- **Stepper:** 9 steps; show step number, title, and optional short description.
- **Navigation:** Previous / Next (and on last step, Submit).
- **Validation:** Per-step validation on Next; required fields and format rules as in tables above.
- **File uploads:** Accepted types PDF, JPG, JPEG, PNG; max size 5MB unless noted.
- **Read-only fields:** Often with muted background and helper text that they cannot be edited.

---

## Indian States (for State dropdowns)

Use the full list from `INDIAN_STATES` in `src/types/onboarding.ts` (e.g. Andaman and Nicobar Islands, Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chandigarh, Chhattisgarh, Dadra and Nagar Haveli, Daman and Diu, Delhi, Goa, Gujarat, Haryana, Himachal Pradesh, Jammu and Kashmir, Jharkhand, Karnataka, Kerala, Ladakh, Lakshadweep, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Puducherry, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttar Pradesh, Uttarakhand, West Bengal).

---

*Document generated from codebase for design handoff. Field order and grouping match the implementation.*
