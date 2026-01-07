# ERPNext Bank Account Child Table Setup Guide

This guide explains how to create a custom child table in the Supplier doctype to display bank account details entered during vendor onboarding.

## Step 1: Create Child Table Doctype

1. Go to **Customize → Customize Form**
2. Click **+ New** to create a new doctype
3. Set the following:
   - **Name**: `Supplier Bank Account`
   - **Module**: `Buying` (or your custom module)
   - **Is Child Table**: ✅ Check this box
   - **Is Submittable**: ❌ Uncheck
   - **Track Changes**: ❌ Uncheck (optional)

## Step 2: Add Fields to Child Table

Add the following fields to the `Supplier Bank Account` child table:

| Field Label | Field Name | Field Type | Required | Description |
|------------|------------|------------|----------|-------------|
| Account Holder Name | `account_holder_name` | Data | ✅ Yes | Name of the account holder |
| Account Number | `account_number` | Data | ✅ Yes | Bank account number |
| IFSC Code | `ifsc_code` | Data | ✅ Yes | 11-character IFSC code |
| Bank Name | `bank_name` | Data | ✅ Yes | Name of the bank |
| Branch Name | `branch_name` | Data | ✅ Yes | Branch name/location |

### Field Configuration Details:

1. **account_holder_name**
   - Type: Data
   - Label: Account Holder Name
   - Required: Yes
   - Max Length: 140

2. **account_number**
   - Type: Data
   - Label: Account Number
   - Required: Yes
   - Max Length: 50

3. **ifsc_code**
   - Type: Data
   - Label: IFSC Code
   - Required: Yes
   - Max Length: 11
   - Uppercase: Yes (optional, for formatting)

4. **bank_name**
   - Type: Data
   - Label: Bank Name
   - Required: Yes
   - Max Length: 140

5. **branch_name**
   - Type: Data
   - Label: Branch Name
   - Required: Yes
   - Max Length: 140

## Step 3: Add Child Table to Supplier Doctype

1. Go to **Customize → Customize Form**
2. Select **Supplier** doctype
3. Go to **Fields** tab
4. Add a new field:
   - **Field Label**: `Bank Account Details`
   - **Field Name**: `custom_bank_account_details`
   - **Field Type**: `Table`
   - **Options**: `Supplier Bank Account`
   - **Section**: Create a new section called "Bank Account Details" or add to "Accounting" section
   - **Collapsible**: ✅ Yes (optional)

## Step 4: Set Field Permissions

1. Go to **Setup → Permissions**
2. Select **Supplier Bank Account** doctype
3. Set appropriate permissions for:
   - System Manager
   - Supplier (if needed for portal access)
   - Accounts User

## Step 5: API Field Names

When creating child table entries via API, use these field names:

```json
{
  "doctype": "Supplier Bank Account",
  "parenttype": "Supplier",
  "parentfield": "custom_bank_account_details",
  "parent": "SUPPLIER-NAME",
  "account_holder_name": "John Doe",
  "account_number": "1234567890",
  "ifsc_code": "SBIN0001234",
  "bank_name": "State Bank of India",
  "branch_name": "Main Branch"
}
```

## Step 6: Display in Supplier Form

After setup, the bank account details will appear in the Supplier form under the "Bank Account Details" section (or wherever you placed the field).

## Notes

- The child table allows multiple bank accounts per supplier
- Fields are stored directly in the Supplier document
- No separate Bank Account doctype record is created (unless you also want that)
- The child table data is part of the Supplier document, so it's included when fetching Supplier data

