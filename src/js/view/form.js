/**
 * Giriş formu: ekleme + düzenleme + silme
 */
import { formatCurrency, parseCurrency, formatInputNumber, unformatInputNumber } from '../utils/format.js';

export const renderForm = (config, onUpdate) => {
    // Temel Bilgiler
    document.getElementById('startBalance').value = formatCurrency(config.startBalance).replace("-", "0");
    document.getElementById('startYear').value = config.startYear;
    document.getElementById('startMonth').value = config.startMonth;
    document.getElementById('duration').value = config.duration;

    // Faiz Ayarları
    document.getElementById('interestRate').value = config.interestRate;
    document.getElementById('interestDrop').value = config.interestDrop;
    document.getElementById('minInterest').value = config.minInterest;
    document.getElementById('taxRate').value = config.taxRate;

    // Tabloları doldur
    renderTableRows('incomeTable', config.incomes, createIncomeRow, onUpdate);
    renderTableRows('expenseTable', config.expenses, createExpenseRow, onUpdate);
    renderTableRows('periodicTable', config.periodicExpenses, createPeriodicRow, onUpdate);
    renderTableRows('annualTable', config.annualExpenses, createAnnualRow, onUpdate);

    // Event listener'ları bağla (bir kez)
    setupEventListeners(onUpdate);
};

const renderTableRows = (tableId, items, rowCreator, onUpdate) => {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '';
    items.forEach(item => {
        const tr = rowCreator(item, onUpdate);
        tbody.appendChild(tr);
    });
};

const createIncomeRow = (item, onUpdate) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" value="${item.name}" data-prop="name"></td>
        <td><input type="text" value="${formatCurrency(item.amount).replace("-", "0")}" data-prop="amount" class="text-right format-number"></td>
        <td><input type="number" value="${item.increase}" data-prop="increase" class="text-right"></td>
        <td><input type="text" value="${item.months}" data-prop="months"></td>
        <td><button class="btn-delete-row">✕</button></td>
    `;
    setupRowEvents(tr, item, onUpdate, 'incomes');
    return tr;
};

const createExpenseRow = (item, onUpdate) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" value="${item.name}" data-prop="name"></td>
        <td><input type="text" value="${formatCurrency(item.amount).replace("-", "0")}" data-prop="amount" class="text-right format-number"></td>
        <td><input type="number" value="${item.increase}" data-prop="increase" class="text-right"></td>
        <td><button class="btn-delete-row">✕</button></td>
    `;
    setupRowEvents(tr, item, onUpdate, 'expenses');
    return tr;
};

const createPeriodicRow = (item, onUpdate) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" value="${item.name}" data-prop="name"></td>
        <td><input type="text" value="${formatCurrency(item.amount).replace("-", "0")}" data-prop="amount" class="text-right format-number"></td>
        <td><input type="number" value="${item.count}" data-prop="count" class="text-right"></td>
        <td><input type="number" value="${item.startMonth}" data-prop="startMonth" class="text-right"></td>
        <td><input type="number" value="${item.increase}" data-prop="increase" class="text-right"></td>
        <td><input type="checkbox" ${item.repeat ? 'checked' : ''} data-prop="repeat"></td>
        <td><button class="btn-delete-row">✕</button></td>
    `;
    setupRowEvents(tr, item, onUpdate, 'periodicExpenses');
    return tr;
};

const createAnnualRow = (item, onUpdate) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" value="${item.name}" data-prop="name"></td>
        <td><input type="text" value="${formatCurrency(item.amount).replace("-", "0")}" data-prop="amount" class="text-right format-number"></td>
        <td><input type="number" value="${item.month}" data-prop="month" class="text-right"></td>
        <td><input type="number" value="${item.increase}" data-prop="increase" class="text-right"></td>
        <td><button class="btn-delete-row">✕</button></td>
    `;
    setupRowEvents(tr, item, onUpdate, 'annualExpenses');
    return tr;
};

const setupRowEvents = (tr, item, onUpdate, collectionName) => {
    const inputs = tr.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            if (e.target.classList.contains('format-number')) {
                unformatInputNumber(e.target);
            }
        });
        input.addEventListener('blur', (e) => {
            if (e.target.classList.contains('format-number')) {
                formatInputNumber(e.target);
            }
            const prop = e.target.dataset.prop;
            let value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            if (prop === 'amount' || prop === 'count' || prop === 'startMonth' || prop === 'month' || prop === 'increase') {
                value = parseCurrency(value);
            }
            item[prop] = value;
            onUpdate();
        });
        input.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                item[e.target.dataset.prop] = e.target.checked;
                onUpdate();
            }
        });
    });

    tr.querySelector('.btn-delete-row').addEventListener('click', () => {
        const config = window.currentConfig;
        config[collectionName] = config[collectionName].filter(i => i.id !== item.id);
        tr.remove();
        onUpdate();
    });
};

let eventsSetup = false;
const setupEventListeners = (onUpdate) => {
    if (eventsSetup) return;
    eventsSetup = true;

    const basicInputs = ['startBalance', 'startYear', 'startMonth', 'duration', 'interestRate', 'interestDrop', 'minInterest', 'taxRate'];
    basicInputs.forEach(id => {
        const el = document.getElementById(id);
        el.addEventListener('focus', (e) => {
            if (e.target.classList.contains('format-number')) {
                unformatInputNumber(e.target);
            }
        });
        el.addEventListener('blur', (e) => {
            if (e.target.classList.contains('format-number')) {
                formatInputNumber(e.target);
            }
            window.currentConfig[id] = parseCurrency(e.target.value);
            onUpdate();
        });
        el.addEventListener('change', (e) => {
            if (e.target.tagName === 'SELECT') {
                window.currentConfig[id] = parseCurrency(e.target.value);
                onUpdate();
            }
        });
    });

    document.getElementById('addIncome').addEventListener('click', () => {
        const newItem = { id: Date.now(), name: "Yeni Gelir", amount: 0, increase: 0, months: "tum" };
        window.currentConfig.incomes.push(newItem);
        document.querySelector('#incomeTable tbody').appendChild(createIncomeRow(newItem, onUpdate));
        onUpdate();
    });

    document.getElementById('addExpense').addEventListener('click', () => {
        const newItem = { id: Date.now(), name: "Yeni Gider", amount: 0, increase: 0 };
        window.currentConfig.expenses.push(newItem);
        document.querySelector('#expenseTable tbody').appendChild(createExpenseRow(newItem, onUpdate));
        onUpdate();
    });

    document.getElementById('addPeriodic').addEventListener('click', () => {
        const newItem = { id: Date.now(), name: "Yeni Dönemsel", amount: 0, count: 1, startMonth: 1, increase: 0, repeat: false };
        window.currentConfig.periodicExpenses.push(newItem);
        document.querySelector('#periodicTable tbody').appendChild(createPeriodicRow(newItem, onUpdate));
        onUpdate();
    });

    document.getElementById('addAnnual').addEventListener('click', () => {
        const newItem = { id: Date.now(), name: "Yeni Yıllık", amount: 0, month: 1, increase: 0 };
        window.currentConfig.annualExpenses.push(newItem);
        document.querySelector('#annualTable tbody').appendChild(createAnnualRow(newItem, onUpdate));
        onUpdate();
    });
};
