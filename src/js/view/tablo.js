/**
 * Aylık nakit akışı tablosu
 */
import { formatCurrency } from '../utils/format.js';

export const renderTable = (results, config) => {
    const table = document.getElementById('resultsTable');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');

    // Başlıkları oluştur
    let headHtml = `
        <tr>
            <th>Ay</th>
            <th class="col-net">Başlangıç</th>
            <th class="col-income">Faiz %</th>
            <th class="col-income">Faiz ₺</th>
    `;
    config.incomes.forEach(income => {
        headHtml += `<th class="col-income">${income.name}</th>`;
    });
    headHtml += `<th class="col-total-income">Top. Gelir</th>`;
    config.expenses.forEach(expense => {
        headHtml += `<th class="col-expense">${expense.name}</th>`;
    });
    config.periodicExpenses.forEach(periodic => {
        headHtml += `<th class="col-periodic">${periodic.name}</th>`;
    });
    config.annualExpenses.forEach(annual => {
        headHtml += `<th class="col-annual">${annual.name}</th>`;
    });

    headHtml += `
            <th class="col-total-expense">Top. Gider</th>
            <th class="col-net">Net</th>
            <th class="col-net">Bakiye</th>
        </tr>
    `;
    thead.innerHTML = headHtml;

    // Verileri oluştur
    let bodyHtml = '';
    results.forEach((row, i) => {
        const isYearStart = row.month === 1 && i > 0;
        const isNegative = row.endBalance < 0;
        
        bodyHtml += `<tr class="${isYearStart ? 'year-divider' : ''} ${isNegative ? 'negative-row' : ''}">`;
        bodyHtml += `<td>${row.year} / ${getMonthName(row.month)}</td>`;
        bodyHtml += `<td class="col-net">${formatCurrency(row.startBalance)}</td>`;
        bodyHtml += `<td class="col-income">${row.interestRate.toFixed(1)}%</td>`;
        bodyHtml += `<td>${formatCurrency(row.interestIncome)}</td>`;

        config.incomes.forEach(income => {
            const val = row.incomes[income.id] || 0;
            bodyHtml += `<td class="${val === 0 ? 'val-zero' : ''}">${formatCurrency(val)}</td>`;
        });
        bodyHtml += `<td class="col-total-income">${formatCurrency(row.totalIncome)}</td>`;
        config.expenses.forEach(expense => {
            const val = row.expenses[expense.id] || 0;
            bodyHtml += `<td class="${val === 0 ? 'val-zero' : ''}">${formatCurrency(val)}</td>`;
        });
        config.periodicExpenses.forEach(periodic => {
            const val = row.periodic[periodic.id] || 0;
            bodyHtml += `<td class="${val > 0 ? 'bg-periodic' : (val === 0 ? 'val-zero' : '')}">${formatCurrency(val)}</td>`;
        });
        config.annualExpenses.forEach(annual => {
            const val = row.annual[annual.id] || 0;
            bodyHtml += `<td class="${val > 0 ? 'bg-annual' : (val === 0 ? 'val-zero' : '')}">${formatCurrency(val)}</td>`;
        });

        bodyHtml += `<td class="col-total-expense">${formatCurrency(row.totalExpense)}</td>`;
        bodyHtml += `<td class="col-net">${formatCurrency(row.net)}</td>`;
        bodyHtml += `<td class="col-net">${formatCurrency(row.endBalance)}</td>`;
        bodyHtml += `</tr>`;
    });
    tbody.innerHTML = bodyHtml;
};

const getMonthName = (month) => {
    const months = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    return months[month - 1];
};
