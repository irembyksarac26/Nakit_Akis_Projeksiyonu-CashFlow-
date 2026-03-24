/**
 * Ana uygulama denetleyicisi
 */
import { getDemoConfig, getEmptyConfig } from '../model/config.js';
import { calculateProjection } from '../model/hesapla.js';
import { saveScenario, deleteScenario, getScenario, getScenarioList, getLastScenarioName } from '../model/storage.js';
import { renderForm } from '../view/form.js';
import { renderTable } from '../view/tablo.js';
import { renderChart } from '../view/grafik.js';
import { renderCards } from '../view/kartlar.js';
import { showHelpModal } from '../view/help.js';
import { exportToCSV } from '../utils/export.js';

// Global state
window.currentConfig = null;
let currentResults = [];

const init = () => {
    // Son senaryoyu yükle veya demo yükle
    const lastScenario = getLastScenarioName();
    if (lastScenario) {
        const data = getScenario(lastScenario);
        window.currentConfig = data.config;
    } else {
        window.currentConfig = getDemoConfig();
    }

    updateScenarioDropdown();
    updateApp();
    setupGlobalEvents();
};

const updateApp = () => {
    currentResults = calculateProjection(window.currentConfig);
    renderForm(window.currentConfig, updateApp);
    renderTable(currentResults, window.currentConfig);
    renderChart(currentResults);
    renderCards(currentResults, window.currentConfig);
};

const updateScenarioDropdown = () => {
    const select = document.getElementById('scenarioSelect');
    const list = getScenarioList();
    select.innerHTML = '';
    
    // Eğer liste boşsa ve mevcut config demo ise, demo adını ekle
    if (list.length === 0) {
        const opt = document.createElement('option');
        opt.value = window.currentConfig.name;
        opt.textContent = window.currentConfig.name;
        select.appendChild(opt);
    }

    list.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.textContent = name;
        if (name === window.currentConfig.name) opt.selected = true;
        select.appendChild(opt);
    });
};

const showBanner = (text, type = 'success') => {
    const banner = document.getElementById('banner');
    banner.textContent = text;
    banner.className = `banner ${type}`;
    banner.classList.remove('hidden');
    setTimeout(() => banner.classList.add('hidden'), 3000);
};

const showModal = (title, text, onConfirm, hasInput = false) => {
    const overlay = document.getElementById('modalOverlay');
    const inputContainer = document.getElementById('modalInputContainer');
    const input = document.getElementById('modalInput');
    
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalText').textContent = text;
    
    if (hasInput) {
        inputContainer.classList.remove('hidden');
        input.value = '';
    } else {
        inputContainer.classList.add('hidden');
    }

    const confirmBtn = document.getElementById('modalConfirm');
    const cancelBtn = document.getElementById('modalCancel');

    const onConfirmClick = () => {
        const val = hasInput ? input.value : true;
        if (hasInput && !val) return;
        onConfirm(val);
        closeModal();
    };

    const onCancelClick = () => closeModal();

    const closeModal = () => {
        overlay.classList.add('hidden');
        confirmBtn.removeEventListener('click', onConfirmClick);
        cancelBtn.removeEventListener('click', onCancelClick);
    };

    confirmBtn.addEventListener('click', onConfirmClick);
    cancelBtn.addEventListener('click', onCancelClick);
    overlay.classList.remove('hidden');
};

const setupGlobalEvents = () => {
    document.getElementById('helpBtn').addEventListener('click', () => {
        showHelpModal(showModal);
    });

    // Sekmeler
    document.getElementById('tabInput').addEventListener('click', () => {
        document.getElementById('tabInput').classList.add('active');
        document.getElementById('tabResults').classList.remove('active');
        document.getElementById('inputSection').classList.remove('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
    });

    document.getElementById('tabResults').addEventListener('click', () => {
        document.getElementById('tabResults').classList.add('active');
        document.getElementById('tabInput').classList.remove('active');
        document.getElementById('resultsSection').classList.remove('hidden');
        document.getElementById('inputSection').classList.add('hidden');
        renderChart(currentResults); // Yeniden çiz (genişlik için)
    });

    // Senaryo işlemleri
    document.getElementById('saveBtn').addEventListener('click', () => {
        saveScenario(window.currentConfig.name, window.currentConfig);
        updateScenarioDropdown();
        showBanner('Senaryo kaydedildi.');
    });

    document.getElementById('saveAsBtn').addEventListener('click', () => {
        showModal('Farklı Kaydet', 'Yeni senaryo adını girin:', (name) => {
            window.currentConfig.name = name;
            saveScenario(name, window.currentConfig);
            updateScenarioDropdown();
            showBanner('Yeni senaryo oluşturuldu.');
        }, true);
    });

    document.getElementById('deleteBtn').addEventListener('click', () => {
        showModal('Senaryoyu Sil', `"${window.currentConfig.name}" senaryosunu silmek istediğinize emin misiniz?`, () => {
            deleteScenario(window.currentConfig.name);
            const list = getScenarioList();
            if (list.length > 0) {
                const data = getScenario(list[0]);
                window.currentConfig = data.config;
            } else {
                window.currentConfig = getDemoConfig();
            }
            updateScenarioDropdown();
            updateApp();
            showBanner('Senaryo silindi.', 'error');
        });
    });

    document.getElementById('scenarioSelect').addEventListener('change', (e) => {
        const name = e.target.value;
        const data = getScenario(name);
        if (data) {
            window.currentConfig = data.config;
            updateApp();
        }
    });

    // Export / Import
    document.getElementById('exportBtn').addEventListener('click', () => {
        const data = { ad: window.currentConfig.name, cfg: window.currentConfig };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `nakit_akisi_${window.currentConfig.name}.json`;
        link.click();
    });

    document.getElementById('importFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                if (data.cfg) {
                    window.currentConfig = data.cfg;
                    window.currentConfig.name = data.ad || "İçe Aktarılan";
                    updateApp();
                    updateScenarioDropdown();
                    showBanner('Senaryo başarıyla yüklendi.');
                }
            } catch (err) {
                showBanner('Dosya okuma hatası!', 'error');
            }
        };
        reader.readAsText(file);
    });

    // Alt butonlar
    document.getElementById('loadDemoBtn').addEventListener('click', () => {
        showModal('Demo Yükle', 'Mevcut veriler silinecek ve demo verileri yüklenecek. Onaylıyor musunuz?', () => {
            window.currentConfig = getDemoConfig();
            updateApp();
            showBanner('Demo verileri yüklendi.');
        });
    });

    document.getElementById('clearAllBtn').addEventListener('click', () => {
        showModal('Tüm Verileri Sil', 'Tüm giriş verileri temizlenecek. Onaylıyor musunuz?', () => {
            window.currentConfig = getEmptyConfig();
            updateApp();
            showBanner('Tüm veriler temizlendi.', 'error');
        });
    });

    document.getElementById('goToResultsBtn').addEventListener('click', () => {
        document.getElementById('tabResults').click();
    });

    document.getElementById('goToInputBtn').addEventListener('click', () => {
        document.getElementById('tabInput').click();
    });

    document.getElementById('exportExcelBtn').addEventListener('click', () => {
        exportToCSV(currentResults, window.currentConfig);
        showBanner('Excel dosyası indiriliyor...');
    });

    // Overlay tıklama ile modal kapatma
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target.id === 'modalOverlay') {
            document.getElementById('modalOverlay').classList.add('hidden');
        }
    });
};

// Başlat
init();
