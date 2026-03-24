/**
 * SVG Grafik çizme
 */
import { formatCurrency } from '../utils/format.js';

export const renderChart = (results) => {
    const container = document.getElementById('chartContainer');
    const width = container.clientWidth;
    const height = 300;
    const padding = 40;

    if (results.length === 0) return;

    const balances = results.map(r => r.endBalance);
    const maxBalance = Math.max(...balances, 0);
    const minBalance = Math.min(...balances, 0);
    const range = maxBalance - minBalance || 1;

    const getX = (i) => padding + (i / (results.length - 1)) * (width - 2 * padding);
    const getY = (val) => height - padding - ((val - minBalance) / range) * (height - 2 * padding);

    let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    // Sıfır çizgisi
    const zeroY = getY(0);
    svg += `<line x1="${padding}" y1="${zeroY}" x2="${width - padding}" y2="${zeroY}" stroke="red" stroke-dasharray="4" stroke-width="1" />`;

    // Çizgi
    let path = `M ${getX(0)} ${getY(results[0].endBalance)}`;
    for (let i = 1; i < results.length; i++) {
        path += ` L ${getX(i)} ${getY(results[i].endBalance)}`;
    }
    svg += `<path d="${path}" fill="none" stroke="#0d7a4a" stroke-width="2" />`;

    // Noktalar
    results.forEach((row, i) => {
        const x = getX(i);
        const y = getY(row.endBalance);
        const isNegative = row.endBalance < 0;
        svg += `<circle cx="${x}" cy="${y}" r="3" fill="${isNegative ? 'red' : '#0d7a4a'}" />`;
    });

    svg += `</svg>`;
    container.innerHTML = svg;

    // En yüksek / En düşük bakiye kartları
    const maxIdx = balances.indexOf(maxBalance);
    const minIdx = balances.indexOf(minBalance);
    
    const legend = document.getElementById('chartLegend');
    legend.innerHTML = `
        <div class="flex-row gap-12">
            <div class="card" style="border-left: 4px solid #0d7a4a">
                <label class="label">EN YÜKSEK BAKİYE</label>
                <span class="value">${formatCurrency(maxBalance)} ₺</span>
                <small>${results[maxIdx].year} / ${results[maxIdx].month}</small>
            </div>
            <div class="card" style="border-left: 4px solid red">
                <label class="label">EN DÜŞÜK BAKİYE</label>
                <span class="value">${formatCurrency(minBalance)} ₺</span>
                <small>${results[minIdx].year} / ${results[minIdx].month}</small>
            </div>
        </div>
    `;
};
