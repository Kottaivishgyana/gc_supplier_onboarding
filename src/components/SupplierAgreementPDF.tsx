import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import type { OnboardingFormData } from '@/types/onboarding';

interface SupplierAgreementPDFProps {
  formData: OnboardingFormData;
  supplierId: string;
  docNumber?: string;
  geriCareImageBase64?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    color: '#000',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 15,
    width: '100%',
  },
  pageImageTopRight: {
    width: 120,
    height: 60,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottom: '2pt solid #000',
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  docInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    fontSize: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottom: '1pt solid #ccc',
  },
  table: {
    width: '100%',
    border: '1pt solid #000',
    marginBottom: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 28,
    width: '100%',
  },
  tableRowLast: {
    borderBottom: 'none',
  },
  tableCellSno: {
    width: 50,
    padding: 6,
    borderRight: '1pt solid #000',
    textAlign: 'center',
    flexShrink: 0,
    fontSize: 9,
  },
  tableCellField: {
    width: 200,
    padding: 6,
    borderRight: '1pt solid #000',
    fontSize: 9,
    flexShrink: 0,
  },
  tableCellContent: {
    flex: 1,
    padding: 6,
    fontSize: 9,
    minWidth: 0,
  },
  tableHeader: {
    backgroundColor: '#e8e8e8',
    borderBottom: '2pt solid #000',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
    border: '1pt solid #000',
  },
  commercialTable: {
    width: '100%',
    border: '1pt solid #000',
    marginTop: 10,
    marginBottom: 0,
  },
  tatTable: {
    width: '100%',
    marginTop: 12,
    marginBottom: 12,
    border: '1pt solid #000',
  },
  tatTableRow: {
    flexDirection: 'row',
    borderBottom: '1pt solid #000',
    minHeight: 32,
    width: '100%',
  },
  tatTableCellType: {
    width: 200,
    padding: 8,
    borderRight: '1pt solid #000',
    backgroundColor: '#f9f9f9',
    fontWeight: 'bold',
    flexShrink: 0,
    fontSize: 9,
  },
  tatTableCellContent: {
    flex: 1,
    padding: 8,
    minWidth: 0,
    fontSize: 9,
  },
  termsSection: {
    marginTop: 20,
    fontSize: 9,
    lineHeight: 1.5,
  },
  termsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 12,
    textDecoration: 'underline',
  },
  termsList: {
    marginBottom: 8,
    lineHeight: 1.4,
    textAlign: 'justify',
    flexDirection: 'row',
  },
  termsListNumber: {
    width: 20,
    marginRight: 5,
    fontWeight: 'bold',
  },
  termsListText: {
    flex: 1,
  },
  termsSubList: {
    marginLeft: 25,
    marginTop: 4,
    marginBottom: 4,
    flexDirection: 'row',
  },
  termsSubListLabel: {
    width: 15,
    marginRight: 5,
  },
  termsSubListText: {
    flex: 1,
  },
  termsUnorderedList: {
    marginBottom: 8,
    lineHeight: 1.4,
    textAlign: 'justify',
    flexDirection: 'row',
  },
  termsBullet: {
    width: 15,
    marginRight: 5,
    textAlign: 'center',
  },
  termsUnorderedText: {
    flex: 1,
  },
  termsText: {
    marginBottom: 8,
    lineHeight: 1.4,
    textAlign: 'justify',
  },
  signatureSection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTop: '1pt solid #000',
  },
  signatureBox: {
    width: '45%',
    marginTop: 50,
  },
  signatureLine: {
    borderTop: '1pt solid #000',
    marginTop: 40,
    paddingTop: 4,
  },
  label: {
    marginBottom: 6,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

// Helper component to render a page with the Geri Care image
function PageWithImage({ 
  children, 
  geriCareImageBase64 
}: { 
  children: React.ReactNode; 
  geriCareImageBase64?: string;
}) {
  return (
    <Page size="A4" style={styles.page}>
      {/* Geri Care Image - Top Right of Each Page */}
      {geriCareImageBase64 && (
        <View style={styles.imageContainer}>
          <Image
            style={styles.pageImageTopRight}
            src={geriCareImageBase64}
          />
        </View>
      )}
      {children}
    </Page>
  );
}

export function SupplierAgreementPDF({ 
  formData, 
  supplierId, 
  docNumber,
  geriCareImageBase64 
}: SupplierAgreementPDFProps) {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formatAddress = (address: string, city: string, state: string, pincode: string) => {
    return `${address}, ${city}, ${state} - ${pincode}`.trim();
  };

  const formatRole = (role: string) => {
    if (role === 'hod') return 'HOD';
    if (role === 'proprietor') return 'Proprietor';
    if (role === 'head') return 'Head';
    return role;
  };

  const formatDiscountBasis = (basis: string) => {
    if (basis === 'PTS') return 'On PTS';
    if (basis === 'PTR') return 'On PTR';
    if (basis === 'MRP') return 'On MRP';
    return basis;
  };

  return (
    <Document>
      {/* Page 1: Header and Basic Information */}
      <PageWithImage geriCareImageBase64={geriCareImageBase64}>
        <View style={styles.header}>
          <Text style={styles.title}>Supplier Agreement</Text>
        </View>

        <View style={styles.docInfo}>
          <Text>GC DOC NUM: {docNumber || supplierId}</Text>
          <Text>Date: {currentDate}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCellSno, styles.tableHeaderText]}>S.No</Text>
            <Text style={[styles.tableCellField, styles.tableHeaderText]}>Field</Text>
            <Text style={[styles.tableCellContent, styles.tableHeaderText]}>Content</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>1.</Text>
            <Text style={styles.tableCellField}>Supplier/Distributor Name (as per Registration and Invoice)</Text>
            <Text style={styles.tableCellContent}>{formData.basicInfo.company_name || '—'}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>2.</Text>
            <Text style={styles.tableCellField}>Supplier/Distributor Registered Address (as per Invoice)</Text>
            <Text style={styles.tableCellContent}>
              {formatAddress(
                formData.basicInfo.address,
                formData.basicInfo.city,
                formData.basicInfo.state,
                formData.basicInfo.pincode
              ) || '—'}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>3.</Text>
            <Text style={styles.tableCellField}>Supplier/Distributor Billing Address, if different from above (as per Invoice)</Text>
            <Text style={styles.tableCellContent}>
              {formData.basicInfo.billing_address_different
                ? formatAddress(
                    formData.basicInfo.billing_address,
                    formData.basicInfo.billing_city,
                    formData.basicInfo.billing_state,
                    formData.basicInfo.billing_pincode
                  ) || '—'
                : 'Same as above'}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>4.</Text>
            <Text style={styles.tableCellField}>Business Type</Text>
            <Text style={styles.tableCellContent}>{formData.basicInfo.business_type || '—'}</Text>
          </View>

          <View style={[styles.tableRow, styles.tableRowLast]}>
            <Text style={styles.tableCellSno}>5.</Text>
            <Text style={styles.tableCellField}>Supplier/Distributor Email ID</Text>
            <Text style={styles.tableCellContent}>{formData.basicInfo.email || '—'}</Text>
          </View>
        </View>

        {/* Contact of Supplier Table */}
        <View style={[styles.table, { marginTop: 15, marginBottom: 30 }]}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCellSno, styles.tableHeaderText]}>S.No</Text>
            <Text style={[styles.tableCellField, styles.tableHeaderText]}>Field</Text>
            <Text style={[styles.tableCellContent, styles.tableHeaderText]}>Content</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>1.</Text>
            <Text style={styles.tableCellField}>Contact of Supplier:</Text>
            <Text style={styles.tableCellContent}></Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>For Transaction: PO/ Billing Person:</Text>
            <Text style={styles.tableCellContent}></Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>Name:</Text>
            <Text style={styles.tableCellContent}>{formData.contactInformation.transaction_name || '—'}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>Contact:</Text>
            <Text style={styles.tableCellContent}>{formData.contactInformation.transaction_contact || '—'}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>Email id:</Text>
            <Text style={styles.tableCellContent}>{formData.contactInformation.transaction_email || '—'}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>For Escalation:</Text>
            <Text style={styles.tableCellContent}></Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>Name:</Text>
            <Text style={styles.tableCellContent}>{formData.contactInformation.escalation_name || '—'}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>HOD/Proprietor/Head: (Please tick)</Text>
            <Text style={styles.tableCellContent}>
              {formData.contactInformation.escalation_role ? `✓ ${formatRole(formData.contactInformation.escalation_role)}` : '—'}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>Contact:</Text>
            <Text style={styles.tableCellContent}>{formData.contactInformation.escalation_contact || '—'}</Text>
          </View>

          <View style={[styles.tableRow, styles.tableRowLast]}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>Email id:</Text>
            <Text style={styles.tableCellContent}>{formData.contactInformation.escalation_email || '—'}</Text>
          </View>
        </View>

        {/* Remaining Details Table */}
        <View style={[styles.table, { marginTop: 15, marginBottom: 0 }]}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCellSno, styles.tableHeaderText]}>S.No</Text>
            <Text style={[styles.tableCellField, styles.tableHeaderText]}>Field</Text>
            <Text style={[styles.tableCellContent, styles.tableHeaderText]}>Content</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>1.</Text>
            <Text style={styles.tableCellField}>Drug License No (Attach a soft copy)*</Text>
            <Text style={styles.tableCellContent}>
              {formData.drugLicense.drug_license_status === 'yes' ? formData.drugLicense.drug_license_number : 'N/A'}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>2.</Text>
            <Text style={styles.tableCellField}>GST No (Attach a soft copy)*</Text>
            <Text style={styles.tableCellContent}>
              {formData.gstInfo.gst_status === 'registered' ? formData.gstInfo.gst_number : 'Not Registered'}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>3.</Text>
            <Text style={styles.tableCellField}>PAN No (Attach a soft copy)</Text>
            <Text style={styles.tableCellContent}>{formData.panDetails.pan_number || '—'}</Text>
          </View>

          <View style={[styles.tableRow, styles.tableRowLast]}>
            <Text style={styles.tableCellSno}>4.</Text>
            <Text style={styles.tableCellField}>MSME (IF "Yes" Attach the copy)</Text>
            <Text style={styles.tableCellContent}>
              {formData.msmeStatus.msme_status === 'yes' ? formData.msmeStatus.msme_number : 'No'}
            </Text>
          </View>
        </View>

        {/* Bank Details Table */}
        <View style={[styles.table, { marginTop: 15 }]}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCellSno, styles.tableHeaderText]}>S.No</Text>
            <Text style={[styles.tableCellField, styles.tableHeaderText]}>Field</Text>
            <Text style={[styles.tableCellContent, styles.tableHeaderText]}>Content</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>11.</Text>
            <Text style={styles.tableCellField}>Bank Details</Text>
            <Text style={styles.tableCellContent}></Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>a.</Text>
            <Text style={styles.tableCellField}>Bank Name</Text>
            <Text style={styles.tableCellContent}>{formData.bankAccount.bank_name || '—'}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>b.</Text>
            <Text style={styles.tableCellField}>Bank A/c No.</Text>
            <Text style={styles.tableCellContent}>{formData.bankAccount.account_number || '—'}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>c.</Text>
            <Text style={styles.tableCellField}>Bank Branch Name</Text>
            <Text style={styles.tableCellContent}>{formData.bankAccount.branch_name || '—'}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>d.</Text>
            <Text style={styles.tableCellField}>Bank Branch Address</Text>
            <Text style={styles.tableCellContent}>{formData.bankAccount.branch_name || '—'}</Text>
          </View>

          <View style={[styles.tableRow, styles.tableRowLast]}>
            <Text style={styles.tableCellSno}>e.</Text>
            <Text style={styles.tableCellField}>Bank IFSC Code</Text>
            <Text style={styles.tableCellContent}>{formData.bankAccount.ifsc_code || '—'}</Text>
          </View>
        </View>
      </PageWithImage>

      {/* Page 3: Commercial Details */}
      <PageWithImage geriCareImageBase64={geriCareImageBase64}>
        <Text style={styles.sectionTitle}>COMMERCIAL DETAILS:</Text>

        <View style={styles.commercialTable}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCellSno, styles.tableHeaderText]}>S.No</Text>
            <Text style={[styles.tableCellField, styles.tableHeaderText]}>Field</Text>
            <Text style={[styles.tableCellContent, styles.tableHeaderText]}>Content</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>1.</Text>
            <Text style={styles.tableCellField}>Credit Days from Delivery date</Text>
            <Text style={styles.tableCellContent}>{formData.commercialDetails.credit_days || '45'} days</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>Delivery</Text>
            <Text style={styles.tableCellContent}>{formData.commercialDetails.delivery || 'At our works at your cost'}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>2.</Text>
            <Text style={styles.tableCellField}>Discount %</Text>
            <Text style={styles.tableCellContent}>
              {formData.commercialDetails.discount_basis ? formatDiscountBasis(formData.commercialDetails.discount_basis) : '—'}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>On PTS /On PTR/ On MRP (tick any)</Text>
            <Text style={styles.tableCellContent}>
              {formData.commercialDetails.discount_basis ? `✓ ${formatDiscountBasis(formData.commercialDetails.discount_basis)}` : '—'}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>3.</Text>
            <Text style={styles.tableCellField}>Invoice Discount %</Text>
            <Text style={styles.tableCellContent}>
              {formData.commercialDetails.invoice_discount_percentage ? `${formData.commercialDetails.invoice_discount_percentage}%` : '—'}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>On Invoice / Off Invoice (tick any) - %</Text>
            <Text style={styles.tableCellContent}>
              {formData.commercialDetails.invoice_discount_type ? `✓ ${formData.commercialDetails.invoice_discount_type}` : '—'}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>4.</Text>
            <Text style={styles.tableCellField}>Manufacturer's Authorized distributor (Yes/No)</Text>
            <Text style={styles.tableCellContent}>{formData.commercialDetails.is_authorized_distributor || '—'}</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>If YES Attach List of manufacturers who authorized yourself and a sample invoice copy of each.</Text>
            <Text style={styles.tableCellContent}>
              {formData.commercialDetails.is_authorized_distributor === 'Yes' && formData.commercialDetails.authorized_distributors
                ? formData.commercialDetails.authorized_distributors.map((d) => d.manufacturer_name).join(', ')
                : '—'}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}>5.</Text>
            <Text style={styles.tableCellField}>Return Policy</Text>
            <Text style={styles.tableCellContent}></Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>Non moving – CN value</Text>
            <Text style={styles.tableCellContent}>{formData.commercialDetails.return_non_moving || '100'}%</Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>Short expiry (less than 90 days) – CN value</Text>
            <Text style={styles.tableCellContent}>
              {formData.commercialDetails.return_short_expiry_percentage ? `${formData.commercialDetails.return_short_expiry_percentage}%` : '—'}
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>Damage – Replacement/100% CN</Text>
            <Text style={styles.tableCellContent}>{formData.commercialDetails.return_damage_type || '—'}</Text>
          </View>

          <View style={[styles.tableRow, styles.tableRowLast]}>
            <Text style={styles.tableCellSno}></Text>
            <Text style={styles.tableCellField}>Expired – CN value</Text>
            <Text style={styles.tableCellContent}>
              {formData.commercialDetails.return_expired_percentage ? `${formData.commercialDetails.return_expired_percentage}%` : '—'}
            </Text>
          </View>
        </View>
      </PageWithImage>

      {/* Page 4: Terms and Conditions, TAT, and Signatures */}
      <PageWithImage geriCareImageBase64={geriCareImageBase64}>
        <View style={styles.termsSection}>
          <Text style={styles.termsTitle}>Terms and Conditions:</Text>
          
          <View style={styles.termsList}>
            <Text style={styles.termsListNumber}>1.</Text>
            <Text style={styles.termsListText}>
              Supplier/Distributor has to confirm of any change in PTR%, Margin% or Net Rate to Geri care group of hospitals before raising of invoice through e-mail.
            </Text>
          </View>

          <View style={styles.termsList}>
            <Text style={styles.termsListNumber}>2.</Text>
            <Text style={styles.termsListText}>
              Geri care Hospitals are authorized to debit the vendor if Cash Discount / Margin is not provided as per the agreement.
            </Text>
          </View>

          <View style={styles.termsList}>
            <Text style={styles.termsListNumber}>3.</Text>
            <Text style={styles.termsListText}>
              By signing this registration form, supplier/Distributor hereby agree to abide by the terms and conditions and the same shall be applicable for all the transactions between the Vendor and Geri Care group of hospitals. All purchases shall be subject to issuance of a separate PO (Hard copy, Mail).
            </Text>
          </View>

          <View style={styles.termsList}>
            <Text style={styles.termsListNumber}>4.</Text>
            <Text style={styles.termsListText}>
              All goods invoice must accompany list of goods and quantities, delivery challan, quality/ technical specifications (whenever called for), GST, MRP, Batch No, manufacturing and expiry date etc.,
            </Text>
          </View>

          <View style={styles.termsList}>
            <Text style={styles.termsListNumber}>5.</Text>
            <Text style={styles.termsListText}>
              For Rate contract items, the distributor/supplier should supply at manufacturer's agreed purchase rate/margin, if failed, then any difference in purchase price/Margin by the manufacturer agreed to Geri Care group of hospitals should be compensated with 100% Credit note.
            </Text>
          </View>

          <View style={styles.termsList}>
            <Text style={styles.termsListNumber}>6.</Text>
            <Text style={styles.termsListText}>
              Vendor's having online ordering facilities needs to share the credentials.
            </Text>
          </View>

          <View style={styles.termsList}>
            <Text style={styles.termsListNumber}>7.</Text>
            <Text style={styles.termsListText}>
              Returnable stocks –
            </Text>
          </View>

          <View style={styles.termsSubList}>
            <Text style={styles.termsSubListLabel}>a)</Text>
            <Text style={styles.termsSubListText}>
              For Non-moving items, credit note to be issued within a week time.
            </Text>
          </View>

          <View style={styles.termsSubList}>
            <Text style={styles.termsSubListLabel}>b)</Text>
            <Text style={styles.termsSubListText}>
              For Short expiry items, credit note to be issued within 45 days.
            </Text>
          </View>

          <View style={styles.termsSubList}>
            <Text style={styles.termsSubListLabel}>c)</Text>
            <Text style={styles.termsSubListText}>
              Any goods that are damaged, contaminated areas liable to be replaced within the 3 days' time or returned at the cost of distributor/supplier and Geri Care group of hospitals shall not be held liable for any costs arising therefrom.
            </Text>
          </View>

          <View style={styles.termsList}>
            <Text style={styles.termsListNumber}>8.</Text>
            <Text style={styles.termsListText}>
              If any offers are available in PO nearby quantity, the same must be communicated via mail and confirmation on this regard will be ensured at our end.
            </Text>
          </View>

          <View style={styles.termsList}>
            <Text style={styles.termsListNumber}>9.</Text>
            <Text style={styles.termsListText}>
              Any unethical activities being done for the promotion of the product being dealt is strictly prohibited. Any seasonal gift items are also to be done with prior intimation and approval by the centralized purchase department team and any such gift distribution even approved also to be routed through the centralized purchase department. Any such unauthorized activities if noticed leads to stoppage of due payments and termination of future business.
            </Text>
          </View>

          <Text style={styles.termsTitle}>PO and Delivery Terms:</Text>

          <View style={styles.termsUnorderedList}>
            <Text style={styles.termsBullet}>•</Text>
            <Text style={styles.termsUnorderedText}>
              Every invoice needs to contain PO number.
            </Text>
          </View>

          <View style={styles.termsUnorderedList}>
            <Text style={styles.termsBullet}>•</Text>
            <Text style={styles.termsUnorderedText}>
              Product receiving cut-off time is on and before 7.30 pm on every working day. (For emergency products the above-mentioned slot is not applicable)
            </Text>
          </View>

          <View style={styles.termsUnorderedList}>
            <Text style={styles.termsBullet}>•</Text>
            <Text style={styles.termsUnorderedText}>
              CSV/Excel file along with the PDF file copy of Invoice need to be shared through mail at the time of dispatch/delivery which is mandatory.
            </Text>
          </View>

          <View style={styles.termsUnorderedList}>
            <Text style={styles.termsBullet}>•</Text>
            <Text style={styles.termsUnorderedText}>
              Goods must be delivered as per the below mentioned TAT. Any delay in delivery or non- availability of PO items need to be communicated immediately via mail, failing are liable to be cancelled at the sole discretion of Geri Care group of Hospitals. Cancelled orders will eventually be communicated via mail from our end.
            </Text>
          </View>

          <Text style={styles.termsTitle}>TAT for Delivery:</Text>

          <View style={styles.tatTable}>
            <View style={[styles.tatTableRow, styles.tableHeader]}>
              <Text style={[styles.tatTableCellType, styles.tableHeaderText]}>Product Type</Text>
              <Text style={[styles.tatTableCellContent, styles.tableHeaderText]}>Delivery Timeline</Text>
            </View>
            <View style={styles.tatTableRow}>
              <Text style={styles.tatTableCellType}>For Emergency products</Text>
              <Text style={styles.tatTableCellContent}>Delivery needs to be done immediately within 2hrs</Text>
            </View>
            <View style={[styles.tatTableRow, styles.tableRowLast]}>
              <Text style={styles.tatTableCellType}>Non – Emergency products</Text>
              <Text style={styles.tatTableCellContent}>80% of the products need to be delivered within 24hrs. Balance items to be delivered within 36hrs from the date of order.</Text>
            </View>
          </View>

          <Text style={styles.termsText}>
            Please accord your acknowledgement and acceptance of this agreement by signing this agreement with your stamp.
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.label}>For Geri Care</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.label}>Authorized Signatory</Text>
            </View>
          </View>

          <View style={styles.signatureBox}>
            <Text style={styles.label}>Acknowledged and agreed for</Text>
            <View style={styles.signatureLine}>
              <Text style={styles.label}>Authorized Signatory</Text>
            </View>
          </View>
        </View>
      </PageWithImage>
    </Document>
  );
}
