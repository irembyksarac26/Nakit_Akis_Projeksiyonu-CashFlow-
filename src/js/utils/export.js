/**
 * Excel export (Tab-separated CSV with UTF-8 BOM for Excel compatibility)
 */
export const exportToCSV = (results, config) => {
    // UTF-8 BOM for Turkish characters in Excel
    let csv = "\uFEFF";
    
    // 1. Summary Section (Header)
    csv += `NAKİT AKIŞI PROJEKSİYON RAPORU\n`;
    csv += `Senaryo Adı:\t${config.name}\n`;
    csv += `Rapor Tarihi:\t${new Date().toLocaleString('tr-TR')}\n`;
    csv += `Başlangıç Bakiyesi:\t${config.startBalance}\n`;
    csv += `Başlangıç Tarihi:\t${config.startYear} / ${config.startMonth}\n`;
    csv += `Projeksiyon Süresi:\t${config.duration} Ay\n`;
    csv += `\n`;

    // 2. Table Header
    csv += "Ay\tYıl\tBaşlangıç Bakiyesi\tFaiz Oranı (%)\tFaiz Geliri (₺)\t";
    
    config.incomes.forEach(i => csv += `Gelir: ${i.name}\t`);
    config.expenses.forEach(e => csv += `Gider: ${e.name}\t`);
    config.periodicExpenses.forEach(p => csv += `Dönemsel: ${p.name}\t`);
    config.annualExpenses.forEach(a => csv += `Yıllık: ${a.name}\t`);
    
    csv += "Toplam Gelir\tToplam Gider\tNet Akış\tBakiye\n";

    // 3. Data Rows
    results.forEach(row => {
        // Ay ve Yıl
        csv += `${row.month}\t${row.year}\t`;
        
        // Başlangıç ve Faiz (Sayı formatında, Excel için virgül ondalık ayırıcı kullanılabilir ama nokta daha standarttır, 
        // ancak Türk Excel'i için virgül gerekebilir. En güvenlisi raw sayı göndermek.)
        csv += `${row.startBalance.toFixed(2)}\t`;
        csv += `${row.interestRate.toFixed(2)}\t`;
        csv += `${row.interestIncome.toFixed(2)}\t`;
        
        // Dinamik Sütunlar
        config.incomes.forEach(i => {
            const val = row.incomes[i.id] || 0;
            csv += `${val.toFixed(2)}\t`;
        });
        config.expenses.forEach(e => {
            const val = row.expenses[e.id] || 0;
            csv += `${val.toFixed(2)}\t`;
        });
        config.periodicExpenses.forEach(p => {
            const val = row.periodic[p.id] || 0;
            csv += `${val.toFixed(2)}\t`;
        });
        config.annualExpenses.forEach(a => {
            const val = row.annual[a.id] || 0;
            csv += `${val.toFixed(2)}\t`;
        });

        // Özet Sütunlar
        csv += `${row.totalIncome.toFixed(2)}\t`;
        csv += `${row.totalExpense.toFixed(2)}\t`;
        csv += `${row.net.toFixed(2)}\t`;
        csv += `${row.endBalance.toFixed(2)}\n`;
    });

    // 4. Download Trigger
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `nakit_akisi_detayli_${config.name.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
