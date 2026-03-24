/**
 * Özet kartları gösterme
 */
import { formatCurrency } from '../utils/format.js';

export const renderCards = (results, config) => {
    const container = document.getElementById('summaryCards');
    if (results.length === 0) return;

    const startBalance = config.startBalance;
    const endBalance = results[results.length - 1].endBalance;
    const greenMonths = results.filter(r => r.endBalance >= 0).length;
    const criticalMonth = results.find(r => r.endBalance < 0);

    const totalIncome = results.reduce((acc, r) => acc + r.totalIncome, 0);
    const totalExpense = results.reduce((acc, r) => acc + r.totalExpense, 0);

    container.innerHTML = `
        <div class="card summary-card">
            <label class="label">BAŞLANGIÇ BAKİYE</label>
            <span class="value">${formatCurrency(startBalance)} ₺</span>
        </div>
        <div class="card summary-card">
            <label class="label">TOPLAM GELİR (+FAİZ)</label>
            <span class="value" style="color: var(--income)">${formatCurrency(totalIncome)} ₺</span>
        </div>
        <div class="card summary-card">
            <label class="label">TOPLAM GİDER</label>
            <span class="value" style="color: var(--expense)">${formatCurrency(totalExpense)} ₺</span>
        </div>
        <div class="card summary-card">
            <label class="label">BİTİŞ BAKİYE</label>
            <span class="value" style="color: ${endBalance < 0 ? 'red' : 'var(--primary)'}">${formatCurrency(endBalance)} ₺</span>
        </div>
        <div class="card summary-card">
            <label class="label">YEŞİL AY SAYISI</label>
            <span class="value">${greenMonths} / ${results.length}</span>
        </div>
        <div class="card summary-card">
            <label class="label">KRİTİK AY</label>
            <span class="value" style="color: ${criticalMonth ? 'red' : 'var(--primary)'}">${criticalMonth ? criticalMonth.year + '/' + criticalMonth.month : 'Yok'}</span>
        </div>
    `;
};
