# Supplier Verification Workflow Setup Guide

This guide provides step-by-step instructions for setting up the Supplier Verification Workflow in ERPNext.

## ⚠️ IMPORTANT: State Names Must Match Exactly

The state names in the workflow **MUST** match exactly with the options in your `custom_verification_status` Select field:
- ✅ `Initiated`
- ✅ `Pending for verification` (NOT "Pending")
- ✅ `Verified` (NOT "Approved")
- ✅ `Rejected`
- ✅ `Changes Required`

## Overview

The workflow manages the supplier onboarding verification process with the following states:
- **Initiated** - Supplier created, waiting for form submission
- **Pending for verification** - Form submitted, waiting for admin review
- **Verified** - Approved by admin
- **Rejected** - Rejected by admin
- **Changes Required** - Admin requests changes, supplier can resubmit

## Step-by-Step Setup

### Step 1: Create Workflow States

1. Go to **Settings → Workflow State → New**
2. Create each state one by one:

   **State 1: Initiated**
   - State Name: `Initiated`
   - Doc Status: `0` (Saved/Draft)
   - Click **Save**

   **State 2: Pending for verification**
   - State Name: `Pending for verification` ⚠️ **Must match exactly - includes "for verification"**
   - Doc Status: `0` (Saved/Draft)
   - Click **Save**

   **State 3: Verified**
   - State Name: `Verified` ⚠️ **NOT "Approved" - must be "Verified"**
   - Doc Status: `0` (Saved/Draft) or `1` (Submitted) - your choice
   - Click **Save**

   **State 4: Rejected**
   - State Name: `Rejected`
   - Doc Status: `0` (Saved/Draft) or `2` (Cancelled) - your choice
   - Click **Save**

   **State 5: Changes Required**
   - State Name: `Changes Required`
   - Doc Status: `0` (Saved/Draft)
   - Click **Save**

### Step 2: Create the Workflow

1. Go to **Settings → Workflow → New**

2. **Fill in Basic Information:**
   ```
   Workflow Name: Supplier Verification Workflow
   Document Type: Supplier
   Is Active: ✅ (Checked)
   Don't Override Status: ✅ (Checked - optional)
   Send Email Alert: ✅ (Checked - recommended)
   Workflow State Field: custom_verification_status
   ```

3. **Add States (States Table):**

   Click **Add Row** for each state:

   | No. | State | Doc Status | Update Field | Update Value | Only Allow Edit For |
   |-----|-------|------------|--------------|--------------|---------------------|
   | 1 | Initiated | 0 | (leave empty) | (leave empty) | System Manager |
   | 2 | Pending for verification | 0 | (leave empty) | (leave empty) | System Manager |
   | 3 | Verified | 0 | (leave empty) | (leave empty) | System Manager |
   | 4 | Rejected | 0 | (leave empty) | (leave empty) | System Manager |
   | 5 | Changes Required | 0 | (leave empty) | (leave empty) | System Manager |

   **Critical Notes:**
   - State names must match EXACTLY: "Pending for verification" (not "Pending")
   - State names must match EXACTLY: "Verified" (not "Approved")
   - "Update Field" and "Update Value" should be left empty
   - "Only Allow Edit For" controls who can edit the document in that state

   **Important:** 
   - The "State" values must match EXACTLY the options in your `custom_verification_status` Select field
   - "Only Allow Edit For" controls who can edit the document in that state
   - You can add multiple roles separated by commas, e.g., "System Manager, Purchase Manager"

4. **Add Transitions (Transitions Table):**

   Click **Add Row** for each transition:

   | No. | State | Action | Next State | Allowed |
   |-----|-------|--------|------------|---------|
   | 1 | Initiated | Submit for Verification | Pending for verification | System Manager |
   | 2 | Pending for verification | Approve | Verified | System Manager |
   | 3 | Pending for verification | Reject | Rejected | System Manager |
   | 4 | Pending for verification | Request Changes | Changes Required | System Manager |
   | 5 | Changes Required | Resubmit | Pending for verification | System Manager |

   **Field Explanations:**
   - **State**: Current state (must match state names exactly)
   - **Action**: Button label that appears in ERPNext UI
   - **Next State**: State to transition to when action is clicked
   - **Allowed**: Roles that can see and click this action button

   **Note:** Transition #1 (Initiated → Pending for verification) is optional since your API automatically sets this. But it's useful for manual transitions.

   **Note:** 
   - "State" = Current state
   - "Action" = Button label that appears in ERPNext
   - "Next State" = State after clicking the action
   - "Allowed" = Roles that can perform this action

5. **Click Save**

### Step 3: Verify Workflow is Active

1. Go to any Supplier document
2. You should see workflow action buttons at the top
3. The current state should be displayed
4. Only allowed actions will be visible based on user role

## Workflow Flow Diagram

```
[Initiated]
    ↓ (API automatically sets this when form submitted)
[Pending for verification]
    ↓
    ├─→ [Verified] (Admin clicks "Approve")
    ├─→ [Rejected] (Admin clicks "Reject")
    └─→ [Changes Required] (Admin clicks "Request Changes")
            ↓ (Supplier fixes issues)
        [Pending for verification] (Admin clicks "Resubmit")
```

## Customizing Roles

You can customize which roles can perform actions:

### Example: Purchase Manager can approve

In the **Transitions** table, change:
- **Allowed** for "Approve" action: `System Manager, Purchase Manager`

### Example: Only System Manager can reject

In the **Transitions** table:
- **Allowed** for "Reject" action: `System Manager`

## Email Notifications Setup

### Option 1: Using Workflow Email Alerts

1. Go to **Settings → Workflow → Supplier Verification Workflow**
2. Check **Send Email Alert**
3. ERPNext will automatically send emails when state changes

### Option 2: Using Notifications (More Control)

1. Go to **Settings → Notification → New**

2. **Create Notification for "Changes Required":**
   ```
   Document Type: Supplier
   Event: Value Change
   Condition: doc.custom_verification_status == "Changes Required"
   Recipients: Email by Document Field → email_id
   Subject: Changes Required in Your Onboarding Application
   Message: [Your custom message]
   ```

3. **Create Notification for "Verified":**
   ```
   Document Type: Supplier
   Event: Value Change
   Condition: doc.custom_verification_status == "Verified"
   Recipients: Email by Document Field → email_id
   Subject: Your Onboarding Application Has Been Verified
   Message: [Your custom message]
   ```

4. **Create Notification for "Rejected":**
   ```
   Document Type: Supplier
   Event: Value Change
   Condition: doc.custom_verification_status == "Rejected"
   Recipients: Email by Document Field → email_id
   Subject: Onboarding Application Status Update
   Message: [Your custom message]
   ```

## Testing the Workflow

1. **Create a test supplier:**
   - Status should be "Initiated"
   - Only "Submit for Verification" button visible (if transition exists)

2. **Simulate form submission:**
   - Use your API to update status to "Pending for verification"
   - Or manually change status in ERPNext

3. **Test admin actions:**
   - As System Manager, open the supplier
   - You should see: "Approve", "Reject", "Request Changes" buttons
   - Click each and verify state changes

4. **Test resubmission:**
   - Change status to "Changes Required"
   - Click "Resubmit" button
   - Status should change back to "Pending for verification"

## Quick Reference: Exact Values to Use

### States Table (Copy these exactly):
```
No. 1:
State: Initiated
Doc Status: 0
Update Field: (leave empty)
Update Value: (leave empty)
Only Allow Edit For: System Manager

No. 2:
State: Pending for verification
Doc Status: 0
Update Field: (leave empty)
Update Value: (leave empty)
Only Allow Edit For: System Manager

No. 3:
State: Verified
Doc Status: 0
Update Field: (leave empty)
Update Value: (leave empty)
Only Allow Edit For: System Manager

No. 4:
State: Rejected
Doc Status: 0
Update Field: (leave empty)
Update Value: (leave empty)
Only Allow Edit For: System Manager

No. 5:
State: Changes Required
Doc Status: 0
Update Field: (leave empty)
Update Value: (leave empty)
Only Allow Edit For: System Manager
```

### Transitions Table (Copy these exactly):
```
No. 1:
State: Initiated
Action: Submit for Verification
Next State: Pending for verification
Allowed: System Manager

No. 2:
State: Pending for verification
Action: Approve
Next State: Verified
Allowed: System Manager

No. 3:
State: Pending for verification
Action: Reject
Next State: Rejected
Allowed: System Manager

No. 4:
State: Pending for verification
Action: Request Changes
Next State: Changes Required
Allowed: System Manager

No. 5:
State: Changes Required
Action: Resubmit
Next State: Pending for verification
Allowed: System Manager
```

## Troubleshooting

### Workflow buttons not appearing
- ✅ Check if workflow **Is Active** is checked
- ✅ Verify user has **System Manager** role (or role specified in "Allowed")
- ✅ Check if current state has transitions defined
- ✅ Clear browser cache and refresh
- ✅ Verify workflow is saved correctly

### Status not updating
- ✅ Verify `custom_verification_status` field exists in Supplier doctype
- ✅ Check field name matches exactly: `custom_verification_status` (case-sensitive)
- ✅ Ensure field is not read-only
- ✅ Check user has write permissions
- ✅ Verify state names match exactly with Select field options

### Common Mistakes
- ❌ Using "Pending" instead of "Pending for verification"
- ❌ Using "Approved" instead of "Verified"
- ❌ Wrong field name in "Workflow State Field"
- ❌ Workflow not marked as "Is Active"
- ❌ State names don't match Select field options exactly

### Email not sending
- Verify email settings in ERPNext
- Check notification conditions
- Verify supplier email is valid
- Check email queue in **Email Queue** doctype

## Important Notes

1. **State names must match exactly** the Select field options (case-sensitive)
2. **Workflow State Field** must be `custom_verification_status`
3. The API automatically sets status to "Pending for verification" - no manual transition needed
4. Only users with specified roles can perform workflow actions
5. Workflow actions appear as buttons in the Supplier document header

## API Integration

Your React app's API already handles:
- Setting status to "Pending for verification" on form submission
- The workflow handles all other state transitions via ERPNext UI

No additional API changes needed for the workflow to function.

