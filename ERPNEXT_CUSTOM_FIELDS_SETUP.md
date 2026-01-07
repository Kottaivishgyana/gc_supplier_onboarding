# ERPNext Custom Fields Setup Guide

This guide explains how to add custom fields to the Supplier doctype in ERPNext to store contact information and commercial details.

## Overview

This guide covers two main sections:

1. **Contact Information** - Contact details for transaction and escalation
2. **Commercial Details** - Commercial terms, discounts, and return policies

### Transaction Contact Fields
- `custom_transaction_contact_name` - Name of the PO/Billing Person
- `custom_transaction_contact` - Contact number for transaction
- `custom_transaction_email` - Email ID for transaction

### Escalation Contact Fields
- `custom_escalation_contact_name` - Name of escalation contact
- `custom_escalation_role` - Role of escalation contact (HOD, Proprietor, or Head)
- `custom_escalation_contact` - Contact number for escalation
- `custom_escalation_email` - Email ID for escalation

### Commercial Details Fields
- `custom_credit_days` - Credit Days from Delivery date (default: "45")
- `custom_delivery` - Delivery terms (default: "At our works at your cost")
- `custom_discount_basis` - Discount basis (PTS, PTR, or MRP)
- `custom_invoice_discount_type` - Invoice discount type (On Invoice or Off Invoice)
- `custom_invoice_discount_percentage` - Invoice discount percentage
- `custom_is_authorized_distributor` - Is Manufacturer's Authorized distributor (Yes/No)
- `custom_authorized_distributors` - Child Table field for storing multiple manufacturer entries with documents
- `custom_return_non_moving` - Return policy for non-moving items (default: "100")
- `custom_return_short_expiry_percentage` - Return percentage for short expiry items
- `custom_return_damage_type` - Return policy for damaged items (Replacement or 100% CN)
- `custom_return_expired_percentage` - Return percentage for expired items

### Verification Status Field
- `custom_verification_status` - Verification status of the supplier onboarding process
  - Options: "Initiated", "Pending for verification", "Verified", "Rejected", "Changes Required"
  - Default: "Initiated" (set when supplier is created)
  - Updated to "Pending for verification" when user submits onboarding form
  - Updated by admin: "Verified", "Rejected", or "Changes Required"

## Steps to Add Custom Fields in ERPNext

### Step 0: Create Child Table Doctype for Authorized Distributors

Before adding the custom field to Supplier, you need to create a Child Table doctype:

1. **Create New DocType**
   - Go to: **Customize → DocType → New**
   - Or search for "DocType" in the search bar

2. **DocType Settings**
   - **Name:** `Authorized Distributor`
   - **Module:** Select your custom app or "Custom"
   - **Is Child Table:** ✅ Check this checkbox (IMPORTANT)
   - Click **Save**

3. **Add Fields to Child Table**
   - Click **Add Row** in the Fields section
   - Add the following fields:

   **Field 1: Manufacturer Name**
   - **Field Name:** `manufacturer_name`
   - **Label:** `Manufacturer Name`
   - **Field Type:** `Data`
   - **Required:** ✅ Yes

   **Field 2: Document**
   - **Field Name:** `document`
   - **Label:** `Document`
   - **Field Type:** `Attach`
   - **Required:** ✅ Yes

4. **Save the DocType**
   - Click **Save** and then **Submit**

### Method 1: Using Customize Form (Recommended)

1. **Navigate to Customize Form**
   - Go to: **Customize → Customize Form**
   - Or search for "Customize Form" in the search bar

2. **Select Supplier Doctype**
   - In the "DocType" field, select **"Supplier"**
   - Click **"Add Custom Field"** button

3. **Add Each Custom Field**

   For each field, follow these steps:

   a. **Transaction Contact Name**
      - Field Name: `custom_transaction_contact_name`
      - Label: `Transaction Contact Name`
      - Field Type: `Data`
      - Options: Leave empty
      - Click **"Add"**

   b. **Transaction Contact**
      - Field Name: `custom_transaction_contact`
      - Label: `Transaction Contact`
      - Field Type: `Data`
      - Options: Leave empty
      - Click **"Add"**

   c. **Transaction Email**
      - Field Name: `custom_transaction_email`
      - Label: `Transaction Email`
      - Field Type: `Data`
      - Options: Leave empty
      - Click **"Add"**

   d. **Escalation Contact Name**
      - Field Name: `custom_escalation_contact_name`
      - Label: `Escalation Contact Name`
      - Field Type: `Data`
      - Options: Leave empty
      - Click **"Add"**

   e. **Escalation Role**
      - Field Name: `custom_escalation_role`
      - Label: `Escalation Role`
      - Field Type: `Select` (recommended) or `Data`
      - Options: 
        - If using Select: `HOD\nProprietor\nHead` (each option on a new line)
        - If using Data: Leave empty (will store as text: "hod", "proprietor", or "head")
      - Click **"Add"**

   f. **Escalation Contact**
      - Field Name: `custom_escalation_contact`
      - Label: `Escalation Contact`
      - Field Type: `Data`
      - Options: Leave empty
      - Click **"Add"**

   g. **Escalation Email**
      - Field Name: `custom_escalation_email`
      - Label: `Escalation Email`
      - Field Type: `Data`
      - Options: Leave empty
      - Click **"Add"**

   **Note:** If you don't see an "Insert After" field in the UI, that's normal. You can add all fields first, then drag and drop them to reorder in the form layout.

   **h. Verification Status (IMPORTANT - Add this first, after supplier_name)**
      - Field Name: `custom_verification_status`
      - Label: `Verification Status`
      - Field Type: `Select`
      - Options: 
        ```
        Initiated
        Pending for verification
        Verified
        Rejected
        Changes Required
        ```
        (Each option on a new line)
      - Default: `Initiated`
      - Insert After: `supplier_name` (This places it right after the supplier name field)
      - Click **"Add"**

4. **Organize Fields into Sections**

   After adding all contact fields, organize them:

   - Click **"Add Section"** to create a new section
   - Section Label: `Contact Information`
   - You can add subsections:
     - Click **"Add Section"** within Contact Information → Label: `For Transaction`
     - Click **"Add Section"** within Contact Information → Label: `For Escalation`
   - **Drag and drop** the contact custom fields into their respective subsections:
     - Transaction fields (Name, Contact, Email) → "For Transaction" subsection
     - Escalation fields (Name, Role, Contact, Email) → "For Escalation" subsection
   
   **Tip:** In ERPNext Customize Form, you can reorder fields by dragging them in the form layout view. The "Insert After" option is mainly used in programmatic/JSON methods.

5. **Add Commercial Details Tab and Fields**

   Now add the Commercial Details section:

   a. **Create Commercial Details Tab**
      - Click **"Add Section"** again
      - Section Label: `Commercial Details`
      - This will create a new tab/section in the Supplier form

   b. **Add Commercial Details Fields**

      For each commercial field, click **"Add Custom Field"**:

      **Credit Days**
      - Field Name: `custom_credit_days`
      - Label: `Credit Days from Delivery date`
      - Field Type: `Data`
      - Default: `45`
      - Options: Leave empty
      - Click **"Add"**

      **Delivery**
      - Field Name: `custom_delivery`
      - Label: `Delivery`
      - Field Type: `Data`
      - Default: `At our works at your cost`
      - Options: Leave empty
      - Click **"Add"**

      **Discount Basis**
      - Field Name: `custom_discount_basis`
      - Label: `Discount %`
      - Field Type: `Select`
      - Options: `PTS\nPTR\nMRP` (each option on a new line)
      - Click **"Add"**

      **Invoice Discount Type**
      - Field Name: `custom_invoice_discount_type`
      - Label: `Invoice Discount Type`
      - Field Type: `Select`
      - Options: `On Invoice\nOff Invoice` (each option on a new line)
      - Click **"Add"**

      **Invoice Discount Percentage**
      - Field Name: `custom_invoice_discount_percentage`
      - Label: `Invoice Discount %`
      - Field Type: `Float` (or `Data` if Float is not available)
      - Options: Leave empty
      - Click **"Add"**

      **Is Authorized Distributor**
      - Field Name: `custom_is_authorized_distributor`
      - Label: `Manufacturer's Authorized distributor`
      - Field Type: `Select`
      - Options: `Yes\nNo` (each option on a new line)
      - Click **"Add"**

      **Return Non Moving**
      - Field Name: `custom_return_non_moving`
      - Label: `Return Policy - Non moving`
      - Field Type: `Data`
      - Default: `100`
      - Options: Leave empty
      - Click **"Add"**

      **Return Short Expiry Percentage**
      - Field Name: `custom_return_short_expiry_percentage`
      - Label: `Return Policy - Short expiry (less than 90 days) %`
      - Field Type: `Float` (or `Data` if Float is not available)
      - Options: Leave empty
      - Click **"Add"**

      **Return Damage Type**
      - Field Name: `custom_return_damage_type`
      - Label: `Return Policy - Damage`
      - Field Type: `Select`
      - Options: `Replacement\n100% CN` (each option on a new line)
      - Click **"Add"**

      **Return Expired Percentage**
      - Field Name: `custom_return_expired_percentage`
      - Label: `Return Policy - Expired %`
      - Field Type: `Float` (or `Data` if Float is not available)
      - Options: Leave empty
      - Click **"Add"**

   d. **Add Document Attachment Fields**

      For each document field, click **"Add Custom Field"**:

      **PAN Document**
      - Field Name: `custom_pan_document`
      - Label: `PAN Document`
      - Field Type: `Attach` or `Attach Image`
      - Options: Leave empty
      - Click **"Add"**

      **GST Document**
      - Field Name: `custom_gst_document`
      - Label: `GST Certificate`
      - Field Type: `Attach` or `Attach Image`
      - Options: Leave empty
      - Click **"Add"**

      **Bank Document**
      - Field Name: `custom_bank_document`
      - Label: `Bank Statement/Cancelled Cheque`
      - Field Type: `Attach` or `Attach Image`
      - Options: Leave empty
      - Click **"Add"**

      **Drug License Document**
      - Field Name: `custom_drug_license_document`
      - Label: `Drug License Document`
      - Field Type: `Attach` or `Attach Image`
      - Options: Leave empty
      - Click **"Add"**

   e. **Organize Commercial Details Fields**
      
      After adding all fields, organize them:
      
      - **Drag and drop** all commercial fields into the "Commercial Details" section
      - Reorder fields by dragging them to the desired position
      - The recommended order is:
        1. Credit Days from Delivery date
        2. Delivery
        3. Discount %
        4. Invoice Discount Type
        5. Invoice Discount %
        6. Manufacturer's Authorized distributor
        7. Return Policy - Non moving
        8. Return Policy - Short expiry (less than 90 days) %
        9. Return Policy - Damage
        10. Return Policy - Expired %
      
      - You can create subsections within Commercial Details if needed:
        - Click **"Add Section"** → Label: `Discount Information` (for discount fields)
        - Click **"Add Section"** → Label: `Return Policy` (for return policy fields)

6. **Save Customization**
   - Click **"Save"** button
   - ERPNext will ask you to commit the changes
   - Click **"Update"** to apply the changes

### Method 2: Using Custom Field JSON (Advanced)

If you prefer to add fields programmatically or via JSON, you can use the following JSON structure:

**Contact Information Fields:**
```json
{
  "doctype": "Custom Field",
  "dt": "Supplier",
  "fields": [
    {
      "fieldname": "custom_transaction_contact_name",
      "label": "Transaction Contact Name",
      "fieldtype": "Data",
      "insert_after": "supplier_name"
    },
    {
      "fieldname": "custom_transaction_contact",
      "label": "Transaction Contact",
      "fieldtype": "Data",
      "insert_after": "custom_transaction_contact_name"
    },
    {
      "fieldname": "custom_transaction_email",
      "label": "Transaction Email",
      "fieldtype": "Data",
      "insert_after": "custom_transaction_contact"
    },
    {
      "fieldname": "custom_escalation_contact_name",
      "label": "Escalation Contact Name",
      "fieldtype": "Data",
      "insert_after": "custom_transaction_email"
    },
    {
      "fieldname": "custom_escalation_role",
      "label": "Escalation Role",
      "fieldtype": "Select",
      "options": "HOD\nProprietor\nHead",
      "insert_after": "custom_escalation_contact_name"
    },
    {
      "fieldname": "custom_escalation_contact",
      "label": "Escalation Contact",
      "fieldtype": "Data",
      "insert_after": "custom_escalation_role"
    },
    {
      "fieldname": "custom_escalation_email",
      "label": "Escalation Email",
      "fieldtype": "Data",
      "insert_after": "custom_escalation_contact"
    }
  ]
}
```

**Commercial Details Fields:**
```json
{
  "doctype": "Custom Field",
  "dt": "Supplier",
  "fields": [
    {
      "fieldname": "custom_credit_days",
      "label": "Credit Days from Delivery date",
      "fieldtype": "Data",
      "default": "45",
      "insert_after": "custom_escalation_email"
    },
    {
      "fieldname": "custom_delivery",
      "label": "Delivery",
      "fieldtype": "Data",
      "default": "At our works at your cost",
      "insert_after": "custom_credit_days"
    },
    {
      "fieldname": "custom_discount_basis",
      "label": "Discount %",
      "fieldtype": "Select",
      "options": "PTS\nPTR\nMRP",
      "insert_after": "custom_delivery"
    },
    {
      "fieldname": "custom_invoice_discount_type",
      "label": "Invoice Discount Type",
      "fieldtype": "Select",
      "options": "On Invoice\nOff Invoice",
      "insert_after": "custom_discount_basis"
    },
    {
      "fieldname": "custom_invoice_discount_percentage",
      "label": "Invoice Discount %",
      "fieldtype": "Float",
      "insert_after": "custom_invoice_discount_type"
    },
    {
      "fieldname": "custom_is_authorized_distributor",
      "label": "Manufacturer's Authorized distributor",
      "fieldtype": "Select",
      "options": "Yes\nNo",
      "insert_after": "custom_invoice_discount_percentage"
    },
    {
      "fieldname": "custom_authorized_distributors",
      "label": "Authorized Distributors",
      "fieldtype": "Table",
      "options": "Authorized Distributor",
      "description": "List of manufacturers who authorized this distributor with sample invoice copies",
      "insert_after": "custom_is_authorized_distributor"
    },
    {
      "fieldname": "custom_return_non_moving",
      "label": "Return Policy - Non moving",
      "fieldtype": "Data",
      "default": "100",
      "insert_after": "custom_authorized_distributors"
    },
    {
      "fieldname": "custom_return_short_expiry_percentage",
      "label": "Return Policy - Short expiry (less than 90 days) %",
      "fieldtype": "Float",
      "insert_after": "custom_return_non_moving"
    },
    {
      "fieldname": "custom_return_damage_type",
      "label": "Return Policy - Damage",
      "fieldtype": "Select",
      "options": "Replacement\n100% CN",
      "insert_after": "custom_return_short_expiry_percentage"
    },
    {
      "fieldname": "custom_return_expired_percentage",
      "label": "Return Policy - Expired %",
      "fieldtype": "Float",
      "insert_after": "custom_return_damage_type"
    },
    {
      "fieldname": "custom_verification_status",
      "label": "Verification Status",
      "fieldtype": "Select",
      "options": "Initiated\nPending for verification\nVerified\nRejected\nChanges Required",
      "default": "Initiated",
      "read_only": 0,
      "insert_after": "supplier_name"
    },
    {
      "fieldname": "custom_pan_document",
      "label": "PAN Document",
      "fieldtype": "Attach",
      "insert_after": "custom_return_expired_percentage"
    },
    {
      "fieldname": "custom_gst_document",
      "label": "GST Certificate",
      "fieldtype": "Attach",
      "insert_after": "custom_pan_document"
    },
    {
      "fieldname": "custom_bank_document",
      "label": "Bank Statement/Cancelled Cheque",
      "fieldtype": "Attach",
      "insert_after": "custom_gst_document"
    },
    {
      "fieldname": "custom_drug_license_document",
      "label": "Drug License Document",
      "fieldtype": "Attach",
      "insert_after": "custom_bank_document"
    }
  ]
}
```

### Method 3: Using Frappe Framework (Developer Method)

If you have developer access, you can create a custom app and add these fields via Python:

```python
import frappe

def after_migrate():
    # Add custom fields to Supplier doctype
    custom_fields = [
        # Contact Information Fields
        {
            "fieldname": "custom_transaction_contact_name",
            "label": "Transaction Contact Name",
            "fieldtype": "Data",
            "insert_after": "supplier_name",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_transaction_contact",
            "label": "Transaction Contact",
            "fieldtype": "Data",
            "insert_after": "custom_transaction_contact_name",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_transaction_email",
            "label": "Transaction Email",
            "fieldtype": "Data",
            "insert_after": "custom_transaction_contact",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_escalation_contact_name",
            "label": "Escalation Contact Name",
            "fieldtype": "Data",
            "insert_after": "custom_transaction_email",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_escalation_role",
            "label": "Escalation Role",
            "fieldtype": "Select",
            "options": "HOD\nProprietor\nHead",
            "insert_after": "custom_escalation_contact_name",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_escalation_contact",
            "label": "Escalation Contact",
            "fieldtype": "Data",
            "insert_after": "custom_escalation_role",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_escalation_email",
            "label": "Escalation Email",
            "fieldtype": "Data",
            "insert_after": "custom_escalation_contact",
            "doctype": "Supplier"
        },
        # Commercial Details Fields
        {
            "fieldname": "custom_credit_days",
            "label": "Credit Days from Delivery date",
            "fieldtype": "Data",
            "default": "45",
            "insert_after": "custom_escalation_email",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_delivery",
            "label": "Delivery",
            "fieldtype": "Data",
            "default": "At our works at your cost",
            "insert_after": "custom_credit_days",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_discount_basis",
            "label": "Discount %",
            "fieldtype": "Select",
            "options": "PTS\nPTR\nMRP",
            "insert_after": "custom_delivery",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_invoice_discount_type",
            "label": "Invoice Discount Type",
            "fieldtype": "Select",
            "options": "On Invoice\nOff Invoice",
            "insert_after": "custom_discount_basis",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_invoice_discount_percentage",
            "label": "Invoice Discount %",
            "fieldtype": "Float",
            "insert_after": "custom_invoice_discount_type",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_is_authorized_distributor",
            "label": "Manufacturer's Authorized distributor",
            "fieldtype": "Select",
            "options": "Yes\nNo",
            "insert_after": "custom_invoice_discount_percentage",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_authorized_distributors",
            "label": "Authorized Distributors",
            "fieldtype": "Table",
            "options": "Authorized Distributor",
            "description": "List of manufacturers who authorized this distributor with sample invoice copies",
            "insert_after": "custom_is_authorized_distributor",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_return_non_moving",
            "label": "Return Policy - Non moving",
            "fieldtype": "Data",
            "default": "100",
            "insert_after": "custom_authorized_distributors",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_return_short_expiry_percentage",
            "label": "Return Policy - Short expiry (less than 90 days) %",
            "fieldtype": "Float",
            "insert_after": "custom_return_non_moving",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_return_damage_type",
            "label": "Return Policy - Damage",
            "fieldtype": "Select",
            "options": "Replacement\n100% CN",
            "insert_after": "custom_return_short_expiry_percentage",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_return_expired_percentage",
            "label": "Return Policy - Expired %",
            "fieldtype": "Float",
            "insert_after": "custom_return_damage_type",
            "doctype": "Supplier"
        },
        {
            "fieldname": "custom_verification_status",
            "label": "Verification Status",
            "fieldtype": "Select",
            "options": "Initiated\nPending for verification\nVerified\nRejected\nChanges Required",
            "default": "Initiated",
            "read_only": 0,
            "insert_after": "supplier_name",
            "doctype": "Supplier"
        }
    ]
    
    for field in custom_fields:
        if not frappe.db.exists("Custom Field", {"dt": "Supplier", "fieldname": field["fieldname"]}):
            custom_field = frappe.get_doc({
                "doctype": "Custom Field",
                **field
            })
            custom_field.insert()
            frappe.db.commit()
```

## Verification

After adding the custom fields:

1. **Check Supplier Form**
   - Navigate to any Supplier document
   - Verify that the new fields appear in the form
   - The Contact Information fields should be visible in the "Contact Information" section
   - The Commercial Details fields should be visible in the "Commercial Details" tab/section

2. **Test API Integration**
   - Submit onboarding data from the frontend
   - Check the Supplier document in ERPNext
   - Verify that the contact information fields are populated correctly
   - Verify that the commercial details fields are populated correctly

3. **Check Field Permissions**
   - Go to **Supplier → Permissions**
   - Ensure the custom fields have appropriate read/write permissions for the API user

## Important Notes

- All custom field names in ERPNext must start with `custom_` prefix
- Field names are case-sensitive
- After adding custom fields, you may need to refresh your browser or clear cache
- If you're using API authentication, ensure the API user has permissions to read/write these custom fields
- The escalation role field (`custom_escalation_role`) will store one of: `"hod"`, `"proprietor"`, or `"head"` (lowercase)
- Commercial details fields:
  - `custom_discount_basis` will store: `"pts"`, `"ptr"`, or `"mrp"` (lowercase)
  - `custom_invoice_discount_type` will store: `"on_invoice"` or `"off_invoice"` (lowercase with underscore)
  - `custom_is_authorized_distributor` will store: `"yes"` or `"no"` (lowercase)
  - `custom_return_damage_type` will store: `"replacement"` or `"100_cn"` (lowercase with underscore)
  - Percentage fields should be stored as numbers (Float type) or strings

## Troubleshooting

### Fields Not Appearing
- Clear browser cache
- Refresh the page
- Check if fields were saved correctly in Customize Form
- Verify field names match exactly (case-sensitive)

### API Errors
- Check API user permissions
- Verify field names in the API payload match the custom field names
- Check ERPNext logs for detailed error messages

### Data Not Saving
- Verify field permissions for the API user
- Check if fields are marked as "Read Only" in Customize Form
- Ensure the Supplier doctype is not in "Read Only" mode

## Support

If you encounter issues:
1. Check ERPNext documentation: https://docs.erpnext.com
2. Review API logs in ERPNext
3. Verify field names match between frontend and backend

