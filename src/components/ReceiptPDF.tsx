import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import path from "path";

export interface ReceiptPDFProps {
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  pan?: string;
  amount: number;
  date: string;
  orderId: string;
  paymentId: string;
  logoUrl?: string;
}

function numberToWordsINR(num: number): string {
  const a = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ",
    "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  if (num <= 0) return "Zero Rupees Only";

  const n = ("000000000" + num).slice(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return `${num} Rupees Only`;

  const getTwoDigit = (strVal: string) => {
    const val = Number(strVal);
    if (val < 20) return a[val];
    return b[Number(strVal[0])] + " " + a[Number(strVal[1])];
  };

  let str = "";
  str += Number(n[1]) !== 0 ? getTwoDigit(n[1]) + "Crore " : "";
  str += Number(n[2]) !== 0 ? getTwoDigit(n[2]) + "Lakh " : "";
  str += Number(n[3]) !== 0 ? getTwoDigit(n[3]) + "Thousand " : "";
  str += Number(n[4]) !== 0 ? a[Number(n[4])] + "Hundred " : "";
  str += Number(n[5]) !== 0 ? (str !== "" ? "and " : "") + getTwoDigit(n[5]) : "";

  return str.trim() + " Rupees Only";
}

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  borderContainer: {
    border: "2pt solid #0f172a",
    borderRadius: 4,
    padding: 24,
    height: "100%",
  },
  header: {
    borderBottom: "2pt solid #D9232D",
    paddingBottom: 12,
    marginBottom: 16,
    alignItems: "center",
    textAlign: "center",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
    objectFit: "contain",
  },
  organizationName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D9232D",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  organizationSubtitle: {
    fontSize: 9,
    color: "#475569",
    marginBottom: 6,
  },
  receiptTitleBadge: {
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: 6,
    marginTop: 6,
    borderRadius: 3,
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  ngoInfoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    border: "1pt solid #e2e8f0",
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  ngoInfoCol: {
    width: "48%",
  },
  infoLabelBold: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  infoText: {
    fontSize: 9,
    color: "#334155",
    marginBottom: 2,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#0f172a",
    borderBottom: "1pt solid #cbd5e1",
    paddingBottom: 4,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  table: {
    width: "100%",
    border: "1pt solid #cbd5e1",
    borderRadius: 4,
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid #e2e8f0",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottom: "1pt solid #e2e8f0",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f8fafc",
  },
  tableColLabel: {
    width: "35%",
    fontWeight: "bold",
    color: "#475569",
    fontSize: 9,
  },
  tableColValue: {
    width: "65%",
    color: "#0f172a",
    fontSize: 9,
  },
  amountBox: {
    backgroundColor: "#fef2f2",
    border: "1.5pt solid #fecaca",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    textAlign: "center",
  },
  amountLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#991b1b",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#D9232D",
    marginBottom: 4,
  },
  amountInWords: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#7f1d1d",
  },
  taxBadge: {
    backgroundColor: "#ecfdf5",
    border: "1pt solid #a7f3d0",
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
  },
  taxBadgeTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#047857",
    marginBottom: 4,
  },
  taxBadgeText: {
    fontSize: 8.5,
    color: "#065f46",
    lineHeight: 1.4,
  },
  footerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "auto",
    paddingTop: 16,
    borderTop: "1pt solid #e2e8f0",
  },
  signatoryBox: {
    textAlign: "center",
    width: "180pt",
  },
  stampBox: {
    border: "1pt dashed #94a3b8",
    height: "45pt",
    width: "120pt",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderRadius: 4,
    backgroundColor: "#f8fafc",
  },
  stampText: {
    fontSize: 8,
    color: "#64748b",
  },
  signLine: {
    borderTop: "1pt solid #0f172a",
    marginTop: 30,
    paddingTop: 4,
    textAlign: "center",
  },
  signText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0f172a",
  },
  signSubtext: {
    fontSize: 8,
    color: "#64748b",
  },
  disclaimer: {
    fontSize: 7.5,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 12,
  },
});

export const ReceiptPDF: React.FC<ReceiptPDFProps> = ({
  donorName,
  donorEmail,
  donorPhone = "N/A",
  pan = "N/A",
  amount,
  date,
  orderId,
  paymentId,
  logoUrl,
}) => {
  const formattedAmount = `Rs. ${amount.toLocaleString("en-IN")}`;
  const wordsAmount = numberToWordsINR(amount);

  const resolvedLogoUrl = logoUrl || (typeof window === "undefined" 
    ? path.join(process.cwd(), "public", "logo.png") 
    : "/logo.png");

  return (
    <Document title={`Donation_Receipt_${orderId}`} author="Mahanaim Miraj NGO">
      <Page size="A4" style={styles.page}>
        <View style={styles.borderContainer}>
          {/* HEADER */}
          <View style={styles.header}>
            {resolvedLogoUrl ? <Image style={styles.logo} src={resolvedLogoUrl} /> : null}
            <Text style={styles.organizationName}>Mahanaim Miraj NGO</Text>
            <Text style={styles.organizationSubtitle}>
              Registered Public Charitable Trust | Reg No: E-3481/Sangli
            </Text>
            <View style={styles.receiptTitleBadge}>
              <Text>OFFICIAL DONATION RECEIPT & 80G TAX CERTIFICATE</Text>
            </View>
          </View>

          {/* NGO REGISTRATION & CONTACT INFO */}
          <View style={styles.ngoInfoGrid}>
            <View style={styles.ngoInfoCol}>
              <Text style={styles.infoLabelBold}>Organization Details:</Text>
              <Text style={styles.infoText}>Address: Station Road, Miraj, Maharashtra - 416410</Text>
              <Text style={styles.infoText}>Email: contact@mahanaimmiraj.org</Text>
              <Text style={styles.infoText}>Website: www.mahanaimmiraj.org</Text>
            </View>
            <View style={styles.ngoInfoCol}>
              <Text style={styles.infoLabelBold}>Tax Registration Numbers:</Text>
              <Text style={styles.infoText}>80G Reg No: AAATM1234F20238</Text>
              <Text style={styles.infoText}>12A Reg No: AAATM1234FE20214</Text>
              <Text style={styles.infoText}>NGO PAN: AAATM1234F</Text>
            </View>
          </View>

          {/* DONOR & TRANSACTION DETAILS TABLE */}
          <Text style={styles.sectionHeading}>Donation & Donor Summary</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Receipt / Order ID:</Text>
              <Text style={styles.tableColValue}>{orderId}</Text>
            </View>
            <View style={styles.tableRowAlt}>
              <Text style={styles.tableColLabel}>Payment Reference ID:</Text>
              <Text style={styles.tableColValue}>{paymentId}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Date of Receipt:</Text>
              <Text style={styles.tableColValue}>{date}</Text>
            </View>
            <View style={styles.tableRowAlt}>
              <Text style={styles.tableColLabel}>Donor Full Name:</Text>
              <Text style={styles.tableColValue}>{donorName}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Donor Email Address:</Text>
              <Text style={styles.tableColValue}>{donorEmail}</Text>
            </View>
            <View style={styles.tableRowAlt}>
              <Text style={styles.tableColLabel}>Donor Contact Number:</Text>
              <Text style={styles.tableColValue}>{donorPhone}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableColLabel}>Donor PAN (Tax ID):</Text>
              <Text style={styles.tableColValue}>{pan}</Text>
            </View>
          </View>

          {/* DONATION AMOUNT BOX */}
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Total Amount Received</Text>
            <Text style={styles.amountValue}>{formattedAmount}</Text>
            <Text style={styles.amountInWords}>({wordsAmount})</Text>
          </View>

          {/* 80G TAX EXEMPTION DECLARATION */}
          <View style={styles.taxBadge}>
            <Text style={styles.taxBadgeTitle}>✓ Section 80G Tax Exemption Certificate</Text>
            <Text style={styles.taxBadgeText}>
              Certified that the sum of {formattedAmount} has been received as a voluntary contribution by Mahanaim Miraj NGO. Donations are eligible for 50% tax exemption benefit under Section 80G of the Income Tax Act, 1961 (Order No. ITBA/EXM/S/80G/2023-24/105432).
            </Text>
          </View>

          {/* SIGNATURE & FOOTER */}
          <View style={styles.footerSection}>
            <View style={styles.stampBox}>
              <Text style={styles.stampText}>[ Official Seal / Stamp ]</Text>
            </View>
            <View style={styles.signatoryBox}>
              <View style={styles.signLine}>
                <Text style={styles.signText}>Authorized Signatory</Text>
                <Text style={styles.signSubtext}>Mahanaim Miraj NGO</Text>
              </View>
            </View>
          </View>

          <Text style={styles.disclaimer}>
            This is a computer-generated official receipt. No physical signature is required.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptPDF;
