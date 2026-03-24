/**
 * Yardım ve Kullanıcı Senaryosu Görünümü
 */
export const showHelpModal = (showModal) => {
    const title = "Nakit Akışı Projeksiyonu - Nasıl Kullanılır?";
    const helpContent = [
        "Bu uygulama, ailenizin finansal geleceğini 40 aylık bir projeksiyonla planlamanıza yardımcı olur.",
        "",
        "💡 TEMEL KULLANIM ADIMLARI:",
        "1. Başlangıç Ayarlarını Yapın: Mevcut nakit varlığınızı (Başlangıç Bakiyesi) ve projeksiyonun başlayacağı tarihi girin.",
        "2. Faiz Beklentilerinizi Girin: Mevcut faiz oranını ve zamanla beklediğiniz düşüşü (veya artışı) ayarlayın.",
        "3. Gelirlerinizi Ekleyin: Maaş, kira geliri gibi düzenli girişleri ekleyin. Artış oranlarını (örn: Ocak ayı zammı) belirleyebilirsiniz.",
        "4. Giderlerinizi Planlayın: Kira, mutfak gibi sabit giderlerin yanı sıra; okul taksiti (Dönemsel) veya kasko (Yıllık) gibi özel giderleri ekleyin.",
        "",
        "🎯 ÖRNEK SENARYO:",
        "- 1.000.000 ₺ birikiminiz var.",
        "- Aylık 50.000 ₺ maaş alıyorsunuz (Her yıl %30 artış bekliyorsunuz).",
        "- Aylık 30.000 ₺ sabit gideriniz var.",
        "- Eylül ayında 20.000 ₺ okul taksiti başlıyor ve 10 ay sürecek.",
        "- Faiz oranları %45'ten başlayıp her 2 ayda bir 2 puan düşecek.",
        "",
        "📊 SONUÇLARI ANALİZ EDİN:",
        "'Sonuçlar' sekmesine geçerek paranızın ne zaman bittiğini (Kritik Ay), faiz gelirlerinizin giderlerinizi ne kadar karşıladığını grafik ve tablo üzerinden takip edebilirsiniz."
    ].join('\n');

    showModal(title, helpContent, () => {}, false);
};
