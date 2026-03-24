/**
 * Sayı formatlama ve binlik ayıraç işlemleri
 */

export const formatCurrency = (value) => {
    if (value === 0) return "-";
    return new Intl.NumberFormat('tr-TR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

export const parseCurrency = (str) => {
    if (!str) return 0;
    // Noktaları kaldır, virgülü noktaya çevir (eğer varsa)
    const cleanStr = str.toString().replace(/\./g, '').replace(/,/g, '.');
    return parseFloat(cleanStr) || 0;
};

export const formatInputNumber = (input) => {
    const value = parseCurrency(input.value);
    input.value = formatCurrency(value).replace("-", "0");
};

export const unformatInputNumber = (input) => {
    const value = parseCurrency(input.value);
    input.value = value === 0 ? "" : value.toString();
};
