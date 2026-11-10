# Server Script: supplier_onboarding_status
# Script Type: API
# API Method: supplier_onboarding_status
# Allow Guest: Yes

uhid = frappe.form_dict.get("uhid")
s = frappe.db.get_value("Supplier", {"custom_uhid": uhid},
    ["name", "supplier_name", "custom_uhid_sent_on", "custom_verification_status"], as_dict=True) if uhid else None

if not s:
    frappe.response["message"] = {"status": "invalid"}
elif s.custom_verification_status not in ("Initiated", "Changes Required", None, ""):
    frappe.response["message"] = {"status": "completed"}
elif not s.custom_uhid_sent_on or frappe.utils.now_datetime() > frappe.utils.add_to_date(s.custom_uhid_sent_on, hours=24):
    frappe.response["message"] = {"status": "expired"}
else:
    frappe.response["message"] = {"status": "valid", "supplier_name": s.supplier_name}
