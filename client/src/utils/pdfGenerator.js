import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a professional PDF invoice
 * @param {Object} invoice - The invoice data object from database
 */
export const downloadInvoicePdf = (invoice) => {
  if (!invoice) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Color Palette Definitions
  const colors = {
    primary: [79, 70, 229],   // Indigo (#4F46E5)
    textDark: [15, 23, 42],   // Slate 900 (#0F172A)
    textMedium: [51, 65, 85], // Slate 700 (#334155)
    textLight: [100, 116, 139], // Slate 500 (#64748B)
    bgLight: [241, 245, 249],  // Slate 100 (#F1F5F9)
    border: [226, 232, 240],   // Slate 200 (#E2E8F0)
    emerald: [16, 185, 129],  // Emerald 500 (#10B981)
    amber: [245, 158, 11]     // Amber 500 (#F59E0B)
  };

  // --- 1. Header Section ---
  // VENDORBRIDGE Logo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text('VENDORBRIDGE', 20, 30);

  // INVOICE title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text('INVOICE', 145, 30);

  // Line under header
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.setLineWidth(0.5);
  doc.line(20, 36, 190, 36);

  // --- 2. Invoice Meta Info ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
  doc.text('INVOICE NO:', 20, 47);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text(invoice.invoiceNumber || invoice.id || '', 47, 47);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
  doc.text('DATE:', 85, 47);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text(invoice.createdDate || '', 98, 47);

  // Status Badge
  const status = invoice.status || 'Pending';
  const isPaid = status === 'Paid';
  const statusColor = isPaid ? colors.emerald : colors.amber;

  // Background rect for badge
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(152, 41, 38, 7, 1, 1, 'F');
  
  // Status text in white
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(status.toUpperCase(), 171, 46, { align: 'center' });

  // --- 3. Billing Info ---
  // Left Column - Vendor Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
  doc.text('FROM (VENDOR)', 20, 64);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text(invoice.vendorName || '', 20, 71);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(colors.textMedium[0], colors.textMedium[1], colors.textMedium[2]);
  doc.text(invoice.vendorEmail || '', 20, 77);

  // Right Column - Client Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
  doc.text('TO (CLIENT)', 110, 64);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text('VendorBridge ERP Inc.', 110, 71);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(colors.textMedium[0], colors.textMedium[1], colors.textMedium[2]);
  doc.text('Procurement & Billing Department', 110, 77);
  doc.text('billing@vendorbridge.com', 110, 83);

  // Separator line
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.line(20, 93, 190, 93);

  // --- 4. Line Items Table ---
  // Table Header Background
  doc.setFillColor(colors.bgLight[0], colors.bgLight[1], colors.bgLight[2]);
  doc.rect(20, 101, 170, 9, 'F');

  // Table Headers
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(colors.textMedium[0], colors.textMedium[1], colors.textMedium[2]);
  doc.text('DESCRIPTION / PROJECT', 25, 107);
  doc.text('REFERENCE PO', 115, 107);
  doc.text('AMOUNT', 160, 107);

  // Table Row Contents
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  
  // Wrap description if it is long
  const descText = invoice.rfqTitle || 'Services Rendered';
  const splitDesc = doc.splitTextToSize(descText, 85);
  doc.text(splitDesc, 25, 117);

  doc.setTextColor(colors.textMedium[0], colors.textMedium[1], colors.textMedium[2]);
  doc.text(invoice.poId || '', 115, 117);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(colors.textDark[0], colors.textDark[1], colors.textDark[2]);
  doc.text(`$${invoice.amount ? invoice.amount.toLocaleString() : '0.00'}`, 160, 117);

  // Table row bottom line (calculating height of description text block)
  const descHeight = splitDesc.length * 5;
  const rowBottomY = 117 + descHeight + 2;
  doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
  doc.line(20, rowBottomY, 190, rowBottomY);

  // --- 5. Total Section ---
  const totalY = rowBottomY + 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
  doc.text('TOTAL DUE:', 115, totalY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text(`$${invoice.amount ? invoice.amount.toLocaleString() : '0.00'}`, 160, totalY);

  // --- 6. Notes / Payment Terms Section ---
  const notesY = totalY + 20;
  if (invoice.notes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
    doc.text('NOTES & PAYMENT INSTRUCTIONS', 20, notesY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(colors.textMedium[0], colors.textMedium[1], colors.textMedium[2]);
    
    // Draw notes box border
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.setFillColor(255, 255, 255);
    
    const splitNotes = doc.splitTextToSize(invoice.notes, 160);
    const boxHeight = (splitNotes.length * 4.5) + 6;
    doc.roundedRect(20, notesY + 3, 170, boxHeight, 1, 1, 'S');

    doc.text(splitNotes, 25, notesY + 9);
  }

  // --- 7. Footer ---
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(colors.textLight[0], colors.textLight[1], colors.textLight[2]);
  doc.text('Thank you for your business!', 105, 275, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('For queries regarding this invoice, please reach out to billing@vendorbridge.com', 105, 280, { align: 'center' });

  // Save the PDF
  const filename = `Invoice_${invoice.invoiceNumber || invoice.id || 'INV'}.pdf`;
  doc.save(filename);
};
