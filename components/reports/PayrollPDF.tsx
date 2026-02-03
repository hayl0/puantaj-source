import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Font.register({
//   family: 'Roboto',
//   src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
// });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#E5E7EB',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    padding: 8,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#E5E7EB',
    padding: 8,
  },
  tableCellHeader: {
    margin: 'auto',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  tableCell: {
    margin: 'auto',
    fontSize: 10,
    color: '#4B5563',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 10,
  },
});

interface PayrollData {
  id: string;
  month: string;
  amount: number;
  status: string;
  employee: {
    name: string;
    position: string;
    department: string;
  };
}

interface PayrollPDFProps {
  data: PayrollData[];
  month: string;
}

export const PayrollPDF = ({ data, month }: PayrollPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Maaş Bordrosu Özeti</Text>
        <Text style={styles.subtitle}>
          Dönem: {month} • Oluşturulma Tarihi: {format(new Date(), 'dd.MM.yyyy HH:mm')}
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Personel</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Departman / Pozisyon</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Tutar</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Durum</Text>
          </View>
        </View>

        {data.map((item) => (
          <View style={styles.tableRow} key={item.id}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.employee.name}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.employee.department} / {item.employee.position}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.amount)}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                {item.status === 'paid' ? 'Ödendi' : 'Bekliyor'}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text>Puantaj Pro Sistem Raporu</Text>
      </View>
    </Page>
  </Document>
);
