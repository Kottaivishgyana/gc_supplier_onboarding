## ERPNext Supplier Workflow Email Setup

This guide explains how to send **automatic emails to suppliers** when you change their onboarding status in ERPNext using a **Supplier Workflow** (Approve / Reject / Request Changes).

The emails are triggered when the `custom_verification_status` field on the `Supplier` doctype changes.

Statuses used:

- **Initiated** – when Supplier is first created
- **Pending for verification** – when supplier submits onboarding form from the external portal
- **Verified** – admin approves
- **Rejected** – admin rejects
- **Changes Required** – admin requests modifications

You will:

1. Map your **workflow actions** to these statuses.
2. Add a **Server Script** on `Supplier` that sends the email when status changes.
3. (Optional) See how to do the same thing using **Notification**.

---

## 1. Prerequisites

- You already created the custom field **`custom_verification_status`** on `Supplier` as described in `ERPNEXT_CUSTOM_FIELDS_SETUP.md`.
- Supplier has an **email field**: `email_id` (standard ERPNext field on Supplier).
- Outgoing Email is correctly configured in ERPNext (Email Domain + Email Account).

---

## 2. Configure Supplier Workflow States & Actions (Concrete Example)

If you have not already done so, create or update a **Workflow** for the `Supplier` doctype.

### 2.1 Workflow Header

In the Workflow form:

- **Document Type**: `Supplier`
- **Is Active**: ✅ (this deactivates other workflows on Supplier)
- **Don't Override Status**: leave unchecked (so list status follows workflow state)
- **Send Email Alert**: enable only if you *also* want ERPNext’s built‑in workflow emails (optional, separate from our custom script).

### 2.2 Define Workflow States (as per your configuration)

In the **States** child table, configure exactly like this:

- **Row 1**
  - **State**: `Initiated`
  - **Doc Status**: `0`
  - **Update Field / Update Value**: leave blank
  - **Only Allow Edit For**: `System Manager`

- **Row 2**
  - **State**: `Pending for verification`
  - **Doc Status**: `0`
  - **Only Allow Edit For**: `System Manager`

- **Row 3**
  - **State**: `Verified`
  - **Doc Status**: `0`
  - **Only Allow Edit For**: `System Manager`

- **Row 4**
  - **State**: `Rejected`
  - **Doc Status**: `0`
  - **Only Allow Edit For**: `System Manager`

- **Row 5**
  - **State**: `Changes Required`
  - **Doc Status**: `0`
  - **Only Allow Edit For**: `System Manager`

At the bottom of the Workflow form:

- **Workflow State Field**: `custom_verification_status`

> Because you set **Workflow State Field = `custom_verification_status`**, ERPNext will automatically write the current workflow state into this field on the Supplier document.  
> This means our email script can **directly read `doc.custom_verification_status`** without any extra mapping.

### 2.3 Transition Rules (Approve / Reject / Request Changes)

In the **Transitions** child table, configure the actions (buttons) and next states:

- **Row 1**
  - **State**: `Initiated`
  - **Action**: `Submit For Verification`
  - **Next State**: `Pending for verification`
  - **Allowed**: `System Manager`

- **Row 2**
  - **State**: `Pending for verification`
  - **Action**: `Approve`
  - **Next State**: `Verified`
  - **Allowed**: `System Manager`

- **Row 3**
  - **State**: `Pending for verification`
  - **Action**: `Request Changes`
  - **Next State**: `Changes Required`
  - **Allowed**: `System Manager`

- **Row 4**
  - **State**: `Changes Required`
  - **Action**: `Resubmit`
  - **Next State**: `Pending for verification`
  - **Allowed**: `System Manager`

- **Row 5**
  - **State**: `Verified`
  - **Action**: `Reject`
  - **Next State**: `Rejected`
  - **Allowed**: `System Manager`

With this configuration:

- Clicking **Submit For Verification** moves `Initiated → Pending for verification`.
- Clicking **Approve** moves `Pending for verification → Verified`.
- Clicking **Request Changes** moves `Pending for verification → Changes Required`.
- Clicking **Resubmit** moves `Changes Required → Pending for verification`.
- Clicking **Reject** (from Verified) moves `Verified → Rejected`.

Each time the state changes, `custom_verification_status` is updated to the same value as the state (because it is the workflow state field).

---

## 3. Server Script to Send Status Emails

We will create a **Document Event Server Script** on the `Supplier` doctype.

The script will:

1. Read the **old value** of `custom_verification_status` from the database.
2. Compare it with the **new value** (`doc.custom_verification_status`).
3. If changed, send an email to `doc.email_id` with a message that matches the new status.

### 3.1 Create Server Script

1. Go to **Settings → Server Script** (or search “Server Script”).
2. Click **New**.
3. Set:
   - **Script Type**: `Document Event`
   - **Reference Doctype**: `Supplier`
   - **Event**: `on_update` (or `after_save`)

4. Paste this Python code into the **Script** field:

```python
import frappe


def send_status_email(doc, status_label, extra_message=None):
    """Send a status update email to the supplier."""
    if not doc.email_id:
        return

    subject = f"Your Vendor Onboarding Status - {status_label}"

    # Base message
    message = f"""
    <p>Dear {doc.supplier_name},</p>
    <p>Your vendor onboarding status with Geri Care has been updated to:
       <b>{status_label}</b>.</p>
    """

    # Optional extra content
    if extra_message:
        message += f"<p>{extra_message}</p>"

    message += """
    <p>If you have any questions, please contact our procurement team.</p>
    <p>Best regards,<br>Geri Care Hospitals</p>
    """

    frappe.sendmail(
        recipients=[doc.email_id],
        subject=subject,
        message=message,
        now=True,
    )


old_status = frappe.db.get_value("Supplier", doc.name, "custom_verification_status")
new_status = doc.custom_verification_status

# Only act when the verification status actually changes
if old_status != new_status:
    if new_status == "Verified":
        # APPROVED
        extra = (
            "We are pleased to inform you that your vendor onboarding has been "
            "approved. You are now an approved supplier for Geri Care Hospitals."
        )
        send_status_email(doc, "Approved", extra)

    elif new_status == "Rejected":
        # REJECTED
        extra = (
            "We regret to inform you that your vendor onboarding request has been "
            "rejected. For any clarification, please reach out to our procurement team."
        )
        send_status_email(doc, "Rejected", extra)

    elif new_status == "Changes Required":
        # REQUEST CHANGES
        extra = (
            "We have reviewed your details and require some changes/clarifications "
            "before we can approve your onboarding. Please log into the onboarding "
            "portal or contact our procurement team to update the required details."
        )
        send_status_email(doc, "Changes Required", extra)
```

5. **Save** the Server Script.

---

## 4. How `custom_verification_status` and Workflow Work Together

In **your current setup**, you already configured:

- **Workflow State Field**: `custom_verification_status`

This means:

- When a user clicks any workflow action (Approve, Reject, Request Changes, etc.), ERPNext:
  - Updates the workflow state internally.
  - **Automatically writes that state into `custom_verification_status`** on the Supplier document.
- Our Server Script simply watches for changes in `custom_verification_status` (no manual edits, no extra mapping).

So you **do not need** to manually set `custom_verification_status` or write any `doc.workflow_state → doc.custom_verification_status` mapping code—the workflow engine already does this for you.

---

## 5. Example Email Messages (Plain Text Reference)

Below are plain-text versions of the messages used inside the HTML emails.

- **Approved (Verified)**

  - Subject: `Your Vendor Onboarding Status - Approved`
  - Body:
    - Dear \<Supplier Name\>,
    - Your vendor onboarding status with Geri Care has been updated to **Approved**.
    - We are pleased to inform you that your vendor onboarding has been approved. You are now an approved supplier for Geri Care Hospitals.
    - If you have any questions, please contact our procurement team.
    - Best regards,  
      Geri Care Hospitals

- **Rejected**

  - Subject: `Your Vendor Onboarding Status - Rejected`
  - Body:
    - Dear \<Supplier Name\>,
    - Your vendor onboarding status with Geri Care has been updated to **Rejected**.
    - We regret to inform you that your vendor onboarding request has been rejected. For any clarification, please reach out to our procurement team.
    - If you have any questions, please contact our procurement team.
    - Best regards,  
      Geri Care Hospitals

- **Changes Required**

  - Subject: `Your Vendor Onboarding Status - Changes Required`
  - Body:
    - Dear \<Supplier Name\>,
    - Your vendor onboarding status with Geri Care has been updated to **Changes Required**.
    - We have reviewed your details and require some changes/clarifications before we can approve your onboarding. Please log into the onboarding portal or contact our procurement team to update the required details.
    - If you have any questions, please contact our procurement team.
    - Best regards,  
      Geri Care Hospitals

You can freely adjust this wording to match your internal communication style.

---

## 6. Alternative: Using Notification (Email Alert) Instead of Server Script

If you prefer a **click configuration** approach without Python, you can use **Notification**:

1. Go to **Settings → Notification** (or search “Notification”).
2. Create one Notification per status:

- **Notification 1 – Approved**
  - **Document Type**: `Supplier`
  - **Enabled**: ✅
  - **Condition**: `doc.custom_verification_status == "Verified"`
  - **Recipients**: Email by document field → `email_id`
  - **Subject**: `Your Vendor Onboarding Status - Approved`
  - **Message**: Same content as the Approved email above (HTML or Jinja).

- **Notification 2 – Rejected**
  - **Condition**: `doc.custom_verification_status == "Rejected"`
  - Configure subject and message accordingly.

- **Notification 3 – Changes Required**
  - **Condition**: `doc.custom_verification_status == "Changes Required"`
  - Configure subject and message accordingly.

> Note: If you use Notifications, you **don’t need the Server Script for emails**, but you still need a way to ensure `custom_verification_status` is correctly set by the workflow (manually, or via a separate script).

---

## 7. Testing Checklist

1. **Create a test Supplier** with a valid `email_id`.
2. Ensure `custom_verification_status` starts at `Initiated`.
3. Move the Supplier through your workflow:
   - From `Pending for verification` → `Verified` (Approve).
   - From `Pending for verification` → `Rejected`.
   - From `Pending for verification` → `Changes Required`.
4. After each transition:
   - Confirm `custom_verification_status` updated correctly.
   - Check the **Email Queue** / email inbox of the supplier address.
5. Adjust email wording or subjects if needed.

Once everything is confirmed, your suppliers will automatically receive clear, consistent email updates every time you **Approve**, **Reject**, or **Request Changes** in the Supplier workflow.

