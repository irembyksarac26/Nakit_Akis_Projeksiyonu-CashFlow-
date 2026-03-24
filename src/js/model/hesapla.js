/**
 * Nakit akışı hesaplama motoru
 */

export const calculateProjection = (config) => {
    const results = [];
    let currentBalance = config.startBalance;
    let currentInterestRate = config.interestRate;
    
    const startYear = parseInt(config.startYear);
    const startMonth = parseInt(config.startMonth);
    const duration = parseInt(config.duration);

    for (let i = 0; i < duration; i++) {
        const monthIndex = (startMonth - 1 + i) % 12;
        const yearOffset = Math.floor((startMonth - 1 + i) / 12);
        const currentYear = startYear + yearOffset;
        const currentMonth = monthIndex + 1;

        // Faiz düşüşü (her 2 ayda bir)
        if (i > 0 && i % 2 === 0) {
            currentInterestRate = Math.max(config.minInterest, currentInterestRate - config.interestDrop);
        }

        const monthData = {
            index: i,
            year: currentYear,
            month: currentMonth,
            startBalance: currentBalance,
            interestRate: currentInterestRate,
            incomes: {},
            expenses: {},
            periodic: {},
            annual: {},
            totalIncome: 0,
            totalExpense: 0,
            interestIncome: 0,
            net: 0,
            endBalance: 0
        };

        // Gelirler
        config.incomes.forEach(income => {
            if (isMonthActive(income.months, currentMonth)) {
                const amount = calculateIncreasedAmount(income.amount, income.increase, yearOffset);
                monthData.incomes[income.id] = amount;
                monthData.totalIncome += amount;
            } else {
                monthData.incomes[income.id] = 0;
            }
        });

        // Giderler
        config.expenses.forEach(expense => {
            const amount = calculateIncreasedAmount(expense.amount, expense.increase, yearOffset);
            monthData.expenses[expense.id] = amount;
            monthData.totalExpense += amount;
        });

        // Dönemsel Giderler
        config.periodicExpenses.forEach(periodic => {
            const isActive = isPeriodicActive(periodic, currentMonth, currentYear, startYear, startMonth);
            if (isActive) {
                const amount = calculateIncreasedAmount(periodic.amount, periodic.increase, yearOffset);
                monthData.periodic[periodic.id] = amount;
                monthData.totalExpense += amount;
            } else {
                monthData.periodic[periodic.id] = 0;
            }
        });

        // Yıllık Giderler
        config.annualExpenses.forEach(annual => {
            if (parseInt(annual.month) === currentMonth) {
                const amount = calculateIncreasedAmount(annual.amount, annual.increase, yearOffset);
                monthData.annual[annual.id] = amount;
                monthData.totalExpense += amount;
            } else {
                monthData.annual[annual.id] = 0;
            }
        });

        // Faiz Geliri (Ay sonu bakiyesi üzerinden bir sonraki aya yansır gibi değil, 
        // genelde mevcut bakiye üzerinden o ayın faizi hesaplanır)
        // Basit faiz: (Bakiye * Oran / 100 / 12) * (1 - Stopaj / 100)
        const monthlyInterest = (currentBalance * (currentInterestRate / 100) / 12) * (1 - config.taxRate / 100);
        monthData.interestIncome = Math.max(0, monthlyInterest);
        monthData.totalIncome += monthData.interestIncome;

        monthData.net = monthData.totalIncome - monthData.totalExpense;
        monthData.endBalance = currentBalance + monthData.net;
        
        currentBalance = monthData.endBalance;
        results.push(monthData);
    }

    return results;
};

const calculateIncreasedAmount = (base, rate, years) => {
    return base * Math.pow(1 + rate / 100, years);
};

const isMonthActive = (months, currentMonth) => {
    if (months === "tum") return true;
    if (months.includes("-")) {
        const [start, end] = months.split("-").map(Number);
        if (start <= end) {
            return currentMonth >= start && currentMonth <= end;
        } else {
            // Örn: 10-5 (Ekim - Mayıs)
            return currentMonth >= start || currentMonth <= end;
        }
    }
    return false;
};

const isPeriodicActive = (periodic, currentMonth, currentYear, startYear, startMonth) => {
    const startM = parseInt(periodic.startMonth);
    const count = parseInt(periodic.count);
    
    if (periodic.repeat) {
        // Her yıl tekrar ediyorsa, her yılın startMonth'undan itibaren count kadar ay aktif
        if (currentMonth >= startM && currentMonth < startM + count) return true;
        if (startM + count > 12) {
            // Yıl aşımı varsa (Örn: 11. ayda başlar, 3 ay sürer -> 11, 12, 1)
            const overflow = (startM + count - 1) % 12;
            if (currentMonth <= overflow + 1 && currentMonth < startM) return true;
        }
        return false;
    } else {
        // Sadece bir kez (projeksiyonun başından itibaren ilk denk geldiği yerde)
        // Bu basitleştirilmiş bir mantıktır.
        // Gerçekte "hangi yılın hangi ayı" olduğu önemli.
        // Kullanıcı "başlangıç ayı" giriyor. Bu projeksiyonun hangi ayında başlayacağını belirler.
        // Şimdilik basitleştirelim: Her yılın o ayında başlasın ama repeat false ise sadece ilk yıl olsun.
        if (currentYear === startYear || (currentYear === startYear + 1 && startM + count > 12)) {
             // Aynı mantık ama sadece ilk periyot
             if (currentMonth >= startM && currentMonth < startM + count) return true;
             if (startM + count > 12 && currentMonth <= (startM + count - 1) % 12 + 1 && currentMonth < startM) return true;
        }
        return false;
    }
};
