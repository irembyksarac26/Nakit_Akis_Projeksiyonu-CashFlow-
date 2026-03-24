/**
 * Demo verileri ve boş şablon
 */

export const getDemoConfig = () => ({
    name: "Baz Senaryo",
    startBalance: 1000000,
    startYear: 2026,
    startMonth: 3,
    duration: 40,
    interestRate: 37,
    interestDrop: 1.5,
    minInterest: 15,
    taxRate: 20,
    incomes: [
        { id: 1, name: "Ali Maaş", amount: 45000, increase: 25, months: "tum" },
        { id: 2, name: "Ayşe Maaş", amount: 35000, increase: 25, months: "tum" },
        { id: 3, name: "Kira Geliri", amount: 15000, increase: 20, months: "tum" },
        { id: 4, name: "Ek Gelir", amount: 5000, increase: 20, months: "10-5" }
    ],
    expenses: [
        { id: 1, name: "Mutfak", amount: 30000, increase: 35 },
        { id: 2, name: "Aile Harcama", amount: 25000, increase: 35 },
        { id: 3, name: "Aidat", amount: 2750, increase: 30 },
        { id: 4, name: "Yakıt", amount: 3000, increase: 30 },
        { id: 5, name: "Kredi Kartı", amount: 20000, increase: 35 },
        { id: 6, name: "Kira", amount: 12000, increase: 30 }
    ],
    periodicExpenses: [
        { id: 1, name: "Okul Ücreti", amount: 95000, count: 5, startMonth: 9, increase: 30, repeat: true },
        { id: 2, name: "Yurt Güz", amount: 50000, count: 6, startMonth: 9, increase: 20, repeat: true },
        { id: 3, name: "Yurt Bahar", amount: 55000, count: 4, startMonth: 3, increase: 20, repeat: true }
    ],
    annualExpenses: [
        { id: 1, name: "MTV", amount: 15000, month: 1, increase: 30 },
        { id: 2, name: "Araba Sigorta", amount: 20000, month: 1, increase: 30 },
        { id: 3, name: "Araba Bakım", amount: 15000, month: 7, increase: 25 },
        { id: 4, name: "Gelir Vergisi", amount: 25000, month: 3, increase: 25 }
    ]
});

export const getEmptyConfig = () => {
    const now = new Date();
    return {
        name: "Yeni Senaryo",
        startBalance: 0,
        startYear: now.getFullYear(),
        startMonth: now.getMonth() + 1,
        duration: 12,
        interestRate: 0,
        interestDrop: 0,
        minInterest: 0,
        taxRate: 0,
        incomes: [],
        expenses: [],
        periodicExpenses: [],
        annualExpenses: []
    };
};
