// ========================================
// VERSÃO ADAPTADA PARA LOCALSTORAGE
// Para uso no GitHub Pages sem backend
// ========================================

console.log('🚀 Print Calc v2.5 - Loading...');
console.log('ℹ️ Available commands: debugPrintCalc(), resetPrintCalc(), testCalculation()');

// ========================================
// LocalStorage Database Handler
// ========================================
const LocalDB = {
    // Initialize database
    init() {
        if (!localStorage.getItem('print_calc_db')) {
            localStorage.setItem('print_calc_db', JSON.stringify({
                printers: [],
                filaments: [],
                calculations: [],
                customization: null
            }));
        }
    },

    // Get all data
    getDB() {
        return JSON.parse(localStorage.getItem('print_calc_db') || '{}');
    },

    // Save all data
    saveDB(db) {
        localStorage.setItem('print_calc_db', JSON.stringify(db));
    },

    // Get table data
    getTable(tableName) {
        const db = this.getDB();
        return db[tableName] || [];
    },

    // Save table data
    saveTable(tableName, data) {
        const db = this.getDB();
        db[tableName] = data;
        this.saveDB(db);
    },

    // Add item to table
    addItem(tableName, item) {
        const data = this.getTable(tableName);
        item.id = this.generateId();
        item.created_at = Date.now();
        item.updated_at = Date.now();
        data.push(item);
        this.saveTable(tableName, data);
        return item;
    },

    // Update item in table
    updateItem(tableName, id, updates) {
        const data = this.getTable(tableName);
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates, updated_at: Date.now() };
            this.saveTable(tableName, data);
            return data[index];
        }
        return null;
    },

    // Delete item from table
    deleteItem(tableName, id) {
        const data = this.getTable(tableName);
        const filtered = data.filter(item => item.id !== id);
        this.saveTable(tableName, filtered);
        return true;
    },

    // Get single item
    getItem(tableName, id) {
        const data = this.getTable(tableName);
        return data.find(item => item.id === id);
    },

    // Generate unique ID
    generateId() {
        return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Clear all data
    clearAll() {
        localStorage.setItem('print_calc_db', JSON.stringify({
            printers: [],
            filaments: [],
            calculations: [],
            customization: null
        }));
    }
};

// Initialize database on load
LocalDB.init();

// ========================================
// Global State & Configuration
// ========================================
const APP_STATE = {
    currentPage: 'calculator',
    darkMode: false,
    filaments: [],
    printers: [],
    calculations: [],
    customization: null,
    currentCalculation: null,
    sidebarCollapsed: false
};

// ========================================
// Debug & Utility Functions
// ========================================
// Debug function - accessible via console
window.debugPrintCalc = function() {
    console.log('========================================');
    console.log('🔧 PRINT CALC DEBUG INFO');
    console.log('========================================');
    const db = LocalDB.getDB();
    console.log('💾 LocalStorage DB:', db);
    console.log('🖨️ Printers (' + (db.printers?.length || 0) + '):', db.printers);
    console.log('🎨 Filaments (' + (db.filaments?.length || 0) + '):', db.filaments);
    console.log('📊 Calculations (' + (db.calculations?.length || 0) + '):', db.calculations);
    console.log('🎭 Customization:', db.customization);
    console.log('📦 APP_STATE:', APP_STATE);
    console.log('========================================');
    console.log('✅ Debug info displayed above');
    return 'Debug completed! Check the logs above ⬆️';
};

// Reset function - accessible via console
window.resetPrintCalc = function() {
    if (confirm('⚠️ Isso irá apagar TODOS os dados (impressoras, filamentos, histórico). Deseja continuar?')) {
        LocalDB.clearAll();
        localStorage.removeItem('theme');
        localStorage.removeItem('sidebarCollapsed');
        console.log('✅ Dados resetados com sucesso!');
        console.log('🔄 Recarregando página...');
        location.reload();
    }
};

// Test calculation function
window.testCalculation = function() {
    console.log('🧪 Testing calculation function...');
    console.log('Form element:', document.getElementById('calculatorForm'));
    console.log('Calculate button:', document.getElementById('calculateBtn'));
    console.log('Result card:', document.getElementById('resultCard'));
    
    const printers = LocalDB.getTable('printers');
    const filaments = LocalDB.getTable('filaments');
    
    if (printers.length === 0) {
        console.error('❌ No printers registered! Go to Config > Printers and add one.');
        return '❌ No printers found';
    }
    
    if (filaments.length === 0) {
        console.error('❌ No filaments registered! Go to Config > Filaments and add one.');
        return '❌ No filaments found';
    }
    
    console.log('✅ Found ' + printers.length + ' printer(s) and ' + filaments.length + ' filament(s)');
    console.log('Try filling the form and clicking Calculate now.');
    return '✅ Ready to calculate!';
};

console.log('✅ Debug functions registered: debugPrintCalc(), resetPrintCalc(), testCalculation()');

// ========================================
// Initialization
// ========================================
document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
});

async function initializeApp() {
    console.log('🚀 Initializing Print Calc...');
    
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        APP_STATE.darkMode = true;
    }

    // Load saved sidebar state
    const sidebarState = localStorage.getItem('sidebarCollapsed');
    if (sidebarState === 'true') {
        document.getElementById('sidebar').classList.add('collapsed');
        APP_STATE.sidebarCollapsed = true;
    }

    // Setup event listeners
    setupNavigation();
    setupThemeToggle();
    setupMenuToggle();
    setupSidebarCollapse();
    setupConfigTabs();
    setupCalculatorForm();
    setupFilamentForm();
    setupPrinterForm();
    setupCustomizationForm();
    setupHistoryHandlers();

    // Load initial data
    await loadCustomization();
    await loadPrinters();
    await loadFilaments();
    await loadCalculations();
    
    renderDashboard();
    
    // Set initial page to Calculator
    showPage('calculator');
    
    // Final initialization check
    console.log('✅ App initialized successfully!');
    console.log('📊 Stats:', {
        printers: APP_STATE.printers.length,
        filaments: APP_STATE.filaments.length,
        calculations: APP_STATE.calculations.length,
        hasCustomization: !!APP_STATE.customization
    });
    console.log('💡 Tip: Run debugPrintCalc() in console to see all data');
}

// ========================================
// Navigation
// ========================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sidebar = document.getElementById('sidebar');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768 && sidebar) {
                sidebar.classList.remove('active');
            }
        });
    });
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const selectedPage = document.getElementById(`${pageId}Page`);
    if (selectedPage) {
        selectedPage.classList.add('active');
        APP_STATE.currentPage = pageId;
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
    
    // Update mobile page title
    const mobileTitle = document.getElementById('mobilePageTitle');
    if (mobileTitle) {
        const pageTitles = {
            'calculator': 'Calculadora',
            'dashboard': 'Histórico',
            'config': 'Configurações'
        };
        mobileTitle.textContent = pageTitles[pageId] || 'Print Calc';
    }
    
    // Refresh data if needed
    if (pageId === 'dashboard') {
        renderDashboard();
    }
}

// ========================================
// Theme Toggle
// ========================================
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            APP_STATE.darkMode = !APP_STATE.darkMode;
            localStorage.setItem('theme', APP_STATE.darkMode ? 'dark' : 'light');
        });
    }
}

// ========================================
// Menu Toggle (Mobile)
// ========================================
function setupMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.getElementById('sidebar');
    
    // Desktop menu toggle
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Mobile menu toggle
    if (mobileMenuToggle && sidebar) {
        mobileMenuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !menuToggle?.contains(e.target) &&
            !mobileMenuToggle?.contains(e.target) &&
            sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
}

// ========================================
// Sidebar Collapse
// ========================================
function setupSidebarCollapse() {
    const collapseBtn = document.getElementById('sidebarCollapseBtn');
    const sidebar = document.getElementById('sidebar');
    
    if (collapseBtn && sidebar) {
        collapseBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            APP_STATE.sidebarCollapsed = !APP_STATE.sidebarCollapsed;
            localStorage.setItem('sidebarCollapsed', APP_STATE.sidebarCollapsed);
        });
    }
}

// ========================================
// Config Tabs
// ========================================
function setupConfigTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            
            // Update active button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });
}

// ========================================
// Customization Functions
// ========================================
async function loadCustomization() {
    try {
        const db = LocalDB.getDB();
        APP_STATE.customization = db.customization;
        applyCustomization();
    } catch (error) {
        console.error('Error loading customization:', error);
    }
}

function applyCustomization() {
    if (!APP_STATE.customization) return;
    
    const { app_name, gradient1_color, gradient2_color, button_color, logo_url } = APP_STATE.customization;
    
    // Update app name
    if (app_name) {
        document.querySelectorAll('.app-name').forEach(el => {
            el.textContent = app_name;
        });
        document.title = app_name;
        
        // Update print header
        const printAppName = document.getElementById('printAppName');
        if (printAppName) printAppName.textContent = app_name;
    }
    
    // Update gradient colors
    if (gradient1_color) {
        document.documentElement.style.setProperty('--primary-color', gradient1_color);
    }
    if (gradient2_color) {
        document.documentElement.style.setProperty('--secondary-color', gradient2_color);
    }
    
    // Update button color (usado em botões, links, valor final)
    if (button_color) {
        document.documentElement.style.setProperty('--success-color', button_color);
        // Usar também nos botões primários
        const style = document.createElement('style');
        style.id = 'custom-button-style';
        style.textContent = `
            .btn-primary {
                background: ${button_color} !important;
                border-color: ${button_color} !important;
            }
            .btn-primary:hover {
                opacity: 0.9;
            }
            .result-value-final {
                color: ${button_color} !important;
            }
        `;
        // Remove estilo anterior se existir
        const oldStyle = document.getElementById('custom-button-style');
        if (oldStyle) oldStyle.remove();
        document.head.appendChild(style);
    }
    
    // Update preview gradient
    const colorPreview = document.getElementById('colorPreview');
    if (colorPreview && gradient1_color && gradient2_color) {
        colorPreview.style.background = `linear-gradient(135deg, ${gradient1_color} 0%, ${gradient2_color} 100%)`;
    }
    
    // Update logo
    const logoElements = document.querySelectorAll('#appLogo, #printLogo');
    const iconElements = document.querySelectorAll('#appIcon, #printIcon');
    
    if (logo_url) {
        logoElements.forEach(logo => {
            logo.src = logo_url;
            logo.style.display = 'block';
        });
        iconElements.forEach(icon => icon.style.display = 'none');
        
        // Show logo preview
        const logoPreview = document.getElementById('logoPreview');
        const logoPreviewImg = document.getElementById('logoPreviewImg');
        if (logoPreview && logoPreviewImg) {
            logoPreviewImg.src = logo_url;
            logoPreview.style.display = 'flex';
        }
    } else {
        logoElements.forEach(logo => logo.style.display = 'none');
        iconElements.forEach(icon => icon.style.display = 'block');
    }
}

function setupCustomizationForm() {
    console.log('⚙️ Setting up customization form...');
    
    // Botão Salvar Nome
    const saveAppNameBtn = document.getElementById('saveAppNameBtn');
    if (saveAppNameBtn) {
        saveAppNameBtn.addEventListener('click', async () => {
            const appName = document.getElementById('appNameInput').value.trim();
            if (!appName) {
                showNotification('Por favor, insira um nome para a aplicação', 'error');
                return;
            }
            
            const db = LocalDB.getDB();
            if (!db.customization) db.customization = {};
            db.customization.app_name = appName;
            LocalDB.saveDB(db);
            
            APP_STATE.customization = db.customization;
            applyCustomization();
            showNotification('Nome salvo com sucesso!', 'success');
        });
    }
    
    // Botão Restaurar Nome
    const resetAppNameBtn = document.getElementById('resetAppNameBtn');
    if (resetAppNameBtn) {
        resetAppNameBtn.addEventListener('click', () => {
            document.getElementById('appNameInput').value = 'Print Calc';
            const db = LocalDB.getDB();
            if (!db.customization) db.customization = {};
            db.customization.app_name = 'Print Calc';
            LocalDB.saveDB(db);
            APP_STATE.customization = db.customization;
            applyCustomization();
            showNotification('Nome restaurado!', 'success');
        });
    }
    
    // Botão Salvar Cores
    const saveColorsBtn = document.getElementById('saveColorsBtn');
    if (saveColorsBtn) {
        saveColorsBtn.addEventListener('click', async () => {
            const gradient1 = document.getElementById('gradient1Input').value;
            const gradient2 = document.getElementById('gradient2Input').value;
            const buttonColor = document.getElementById('buttonColorInput').value;
            
            const db = LocalDB.getDB();
            if (!db.customization) db.customization = {};
            db.customization.gradient1_color = gradient1;
            db.customization.gradient2_color = gradient2;
            db.customization.button_color = buttonColor;
            LocalDB.saveDB(db);
            
            APP_STATE.customization = db.customization;
            applyCustomization();
            showNotification('Cores salvas com sucesso!', 'success');
        });
    }
    
    // Botão Restaurar Cores
    const resetColorsBtn = document.getElementById('resetColorsBtn');
    if (resetColorsBtn) {
        resetColorsBtn.addEventListener('click', () => {
            // Gradiente 1
            document.getElementById('gradient1Input').value = '#556ef0';
            document.getElementById('gradient1Picker').value = '#556ef0';
            // Gradiente 2
            document.getElementById('gradient2Input').value = '#754da6';
            document.getElementById('gradient2Picker').value = '#754da6';
            // Cor de botões
            document.getElementById('buttonColorInput').value = '#556ef0';
            document.getElementById('buttonColorPicker').value = '#556ef0';
            
            const db = LocalDB.getDB();
            if (!db.customization) db.customization = {};
            db.customization.gradient1_color = '#556ef0';
            db.customization.gradient2_color = '#754da6';
            db.customization.button_color = '#556ef0';
            LocalDB.saveDB(db);
            APP_STATE.customization = db.customization;
            applyCustomization();
            showNotification('Cores restauradas!', 'success');
        });
    }
    
    // Botão Restaurar Logo
    const resetLogoBtn = document.getElementById('resetLogoBtn');
    if (resetLogoBtn) {
        resetLogoBtn.addEventListener('click', () => {
            const db = LocalDB.getDB();
            if (!db.customization) db.customization = {};
            db.customization.logo_url = '';
            LocalDB.saveDB(db);
            APP_STATE.customization = db.customization;
            applyCustomization();
            document.getElementById('logoPreview').style.display = 'none';
            document.getElementById('logoInput').value = '';
            showNotification('Logo restaurado!', 'success');
        });
    }
    
    // Logo upload
    const logoInput = document.getElementById('logoInput');
    if (logoInput) {
        logoInput.addEventListener('change', handleLogoUpload);
    }
    
    // Remove logo
    const removeLogo = document.getElementById('removeLogo');
    if (removeLogo) {
        removeLogo.addEventListener('click', () => {
            const db = LocalDB.getDB();
            if (!db.customization) db.customization = {};
            db.customization.logo_url = '';
            LocalDB.saveDB(db);
            APP_STATE.customization = db.customization;
            applyCustomization();
            document.getElementById('logoPreview').style.display = 'none';
            document.getElementById('logoInput').value = '';
            showNotification('Logo removido!', 'success');
        });
    }
    
    // Color pickers sync
    setupColorSync('gradient1');
    setupColorSync('gradient2');
    setupColorSync('buttonColor');
    
    // Update preview on color change
    ['gradient1', 'gradient2'].forEach(name => {
        const picker = document.getElementById(`${name}Picker`);
        const input = document.getElementById(`${name}Input`);
        if (picker) {
            picker.addEventListener('input', updateColorPreview);
        }
        if (input) {
            input.addEventListener('input', updateColorPreview);
        }
    });
    
    // Load current values
    loadCustomizationForm();
}

function updateColorPreview() {
    const gradient1 = document.getElementById('gradient1Input')?.value || '#556ef0';
    const gradient2 = document.getElementById('gradient2Input')?.value || '#754da6';
    const colorPreview = document.getElementById('colorPreview');
    if (colorPreview) {
        colorPreview.style.background = `linear-gradient(135deg, ${gradient1} 0%, ${gradient2} 100%)`;
    }
}

function setupColorSync(colorName) {
    const picker = document.getElementById(`${colorName}Picker`);
    const input = document.getElementById(`${colorName}Input`);
    
    if (picker && input) {
        picker.addEventListener('input', () => {
            input.value = picker.value;
        });
        input.addEventListener('input', () => {
            if (/^#[0-9A-F]{6}$/i.test(input.value)) {
                picker.value = input.value;
            }
        });
    }
}

function loadCustomizationForm() {
    if (!APP_STATE.customization) {
        // Load defaults
        updateColorPreview();
        return;
    }
    
    const { app_name, gradient1_color, gradient2_color, button_color } = APP_STATE.customization;
    
    if (app_name) {
        document.getElementById('appNameInput').value = app_name;
    }
    
    if (gradient1_color) {
        document.getElementById('gradient1Input').value = gradient1_color;
        document.getElementById('gradient1Picker').value = gradient1_color;
    }
    if (gradient2_color) {
        document.getElementById('gradient2Input').value = gradient2_color;
        document.getElementById('gradient2Picker').value = gradient2_color;
    }
    if (button_color) {
        document.getElementById('buttonColorInput').value = button_color;
        document.getElementById('buttonColorPicker').value = button_color;
    }
    
    // Update preview
    updateColorPreview();
}

async function handleLogoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        showNotification('Arquivo muito grande. Máximo: 2MB', 'error');
        return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = async (event) => {
        const logoUrl = event.target.result;
        
        // Update customization
        if (APP_STATE.customization) {
            APP_STATE.customization.logo_url = logoUrl;
        } else {
            APP_STATE.customization = { logo_url: logoUrl };
        }
        
        // Save to database
        const db = LocalDB.getDB();
        db.customization = APP_STATE.customization;
        LocalDB.saveDB(db);
        
        applyCustomization();
        showNotification('Logo atualizado com sucesso!', 'success');
    };
    reader.readAsDataURL(file);
}

async function saveCustomization() {
    const appName = document.getElementById('appNameInput').value.trim();
    const primaryColor = document.getElementById('primaryColorInput').value;
    const secondaryColor = document.getElementById('secondaryColorInput').value;
    const backgroundColor = document.getElementById('backgroundColorInput').value;
    
    // Validação básica
    if (!appName) {
        showNotification('Por favor, insira um nome para o aplicativo', 'error');
        return;
    }
    
    const customizationData = {
        app_name: appName,
        primary_color: primaryColor,
        secondary_color: secondaryColor,
        background_color: backgroundColor,
        logo_url: APP_STATE.customization?.logo_url || ''
    };
    
    try {
        // Save to database
        const db = LocalDB.getDB();
        db.customization = customizationData;
        LocalDB.saveDB(db);
        
        APP_STATE.customization = customizationData;
        applyCustomization();
        
        showNotification('Personalização salva com sucesso!', 'success');
    } catch (error) {
        console.error('Error saving customization:', error);
        showNotification('Erro ao salvar personalização', 'error');
    }
}

// ========================================
// Printers Functions
// ========================================
async function loadPrinters() {
    try {
        APP_STATE.printers = LocalDB.getTable('printers');
        renderPrintersList();
        updatePrinterSelect();
    } catch (error) {
        console.error('Error loading printers:', error);
        showNotification('Erro ao carregar impressoras', 'error');
    }
}

function renderPrintersList() {
    const grid = document.getElementById('printersGrid');
    if (!grid) return;
    
    if (APP_STATE.printers.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-print fa-3x"></i>
                <p>Nenhuma impressora cadastrada ainda.</p>
                <p>Clique em "Adicionar Impressora" para começar.</p>
            </div>
        `;
        return;
    }
    
    // Check if mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Render as compact list on mobile
        grid.innerHTML = APP_STATE.printers.map(printer => `
            <div class="printer-card">
                <div class="printer-card-content">
                    <div class="printer-card-title">${printer.name}</div>
                    <div class="printer-card-info">
                        <span>${printer.model}</span>
                        <span>${printer.power_watts}W • R$ ${printer.energy_cost_kwh.toFixed(2)}/kWh</span>
                    </div>
                </div>
                <div class="printer-card-actions">
                    <button class="btn-icon-small" onclick="editPrinter('${printer.id}')" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon-small" onclick="deletePrinter('${printer.id}')" title="Excluir">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    } else {
        // Render as cards on desktop
        grid.innerHTML = APP_STATE.printers.map(printer => `
            <div class="printer-card">
                <div class="printer-header">
                    <div class="printer-title">
                        <h3>${printer.name}</h3>
                        <p class="printer-model">${printer.model}</p>
                    </div>
                    <div class="printer-actions">
                        <button onclick="editPrinter('${printer.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deletePrinter('${printer.id}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="printer-info">
                    <div class="printer-info-item">
                        <span>Consumo</span>
                        <span>${printer.power_watts} W</span>
                    </div>
                    <div class="printer-info-item">
                        <span>Custo kWh</span>
                        <span>R$ ${printer.energy_cost_kwh.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function updatePrinterSelect() {
    const select = document.getElementById('printerSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione a impressora</option>' +
        APP_STATE.printers.map(p => 
            `<option value="${p.id}">${p.name} - ${p.model}</option>`
        ).join('');
}

function setupPrinterForm() {
    const addBtn = document.getElementById('addPrinterBtn');
    const modal = document.getElementById('printerModal');
    const closeBtn = modal?.querySelector('.modal-close');
    const form = document.getElementById('printerForm');
    
    if (addBtn && modal) {
        addBtn.addEventListener('click', () => {
            form.reset();
            delete form.dataset.editId;
            document.getElementById('printerModalTitle').textContent = 'Adicionar Impressora';
            modal.classList.add('active');
        });
    }
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    // Close modal on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await savePrinter();
        });
    }
}

async function savePrinter() {
    const form = document.getElementById('printerForm');
    const editId = form.dataset.editId;
    
    const printerData = {
        name: document.getElementById('printerName').value,
        model: document.getElementById('printerModel').value,
        power_watts: parseFloat(document.getElementById('printerPower').value),
        energy_cost_kwh: parseFloat(document.getElementById('printerEnergyCost').value)
    };
    
    try {
        if (editId) {
            // Update existing
            LocalDB.updateItem('printers', editId, printerData);
            showNotification('Impressora atualizada com sucesso!', 'success');
        } else {
            // Create new
            LocalDB.addItem('printers', printerData);
            showNotification('Impressora adicionada com sucesso!', 'success');
        }
        
        await loadPrinters();
        document.getElementById('printerModal').classList.remove('active');
    } catch (error) {
        console.error('Error saving printer:', error);
        showNotification('Erro ao salvar impressora', 'error');
    }
}

function editPrinter(id) {
    const printer = LocalDB.getItem('printers', id);
    if (!printer) return;
    
    const form = document.getElementById('printerForm');
    form.dataset.editId = id;
    
    document.getElementById('printerName').value = printer.name;
    document.getElementById('printerModel').value = printer.model;
    document.getElementById('printerPower').value = printer.power_watts;
    document.getElementById('printerEnergyCost').value = printer.energy_cost_kwh;
    
    document.getElementById('printerModalTitle').textContent = 'Editar Impressora';
    document.getElementById('printerModal').classList.add('active');
}

async function deletePrinter(id) {
    if (!confirm('Tem certeza que deseja excluir esta impressora?')) {
        return;
    }
    
    try {
        LocalDB.deleteItem('printers', id);
        showNotification('Impressora excluída com sucesso!', 'success');
        await loadPrinters();
    } catch (error) {
        console.error('Error deleting printer:', error);
        showNotification('Erro ao excluir impressora', 'error');
    }
}

// ========================================
// Filaments Functions
// ========================================
async function loadFilaments() {
    try {
        APP_STATE.filaments = LocalDB.getTable('filaments');
        renderFilamentsList();
        updateFilamentSelect();
    } catch (error) {
        console.error('Error loading filaments:', error);
        showNotification('Erro ao carregar filamentos', 'error');
    }
}

function renderFilamentsList() {
    const grid = document.getElementById('filamentsGrid');
    if (!grid) return;
    
    if (APP_STATE.filaments.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-boxes fa-3x"></i>
                <p>Nenhum filamento cadastrado ainda.</p>
                <p>Clique em "Adicionar Filamento" para começar.</p>
            </div>
        `;
        return;
    }
    
    // Check if mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Render as compact list on mobile
        grid.innerHTML = APP_STATE.filaments.map(filament => {
            const colorDot = filament.color_hex ? 
                `<span style="display:inline-block; width:12px; height:12px; background:${filament.color_hex}; border-radius:50%; margin-right:0.5rem; vertical-align:middle; border:1px solid #ccc;"></span>` : '';
            
            return `
                <div class="filament-card">
                    <div class="filament-card-content">
                        <div class="filament-card-title">${colorDot}${filament.name}</div>
                        <div class="filament-card-info">
                            <span>${filament.type}</span>
                            <span>R$ ${filament.price_total.toFixed(2)} • ${filament.quantity_grams}g</span>
                        </div>
                    </div>
                    <div class="filament-card-actions">
                        <button class="btn-icon-small" onclick="editFilament('${filament.id}')" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon-small" onclick="deleteFilament('${filament.id}')" title="Excluir">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        // Render as cards on desktop (igual ao de impressora)
        grid.innerHTML = APP_STATE.filaments.map(filament => {
            const colorPreview = filament.color_hex ?
                `<div class="filament-color-preview" style="background: ${filament.color_hex}; width: 40px; height: 40px; border-radius: 8px; border: 2px solid #ddd;"></div>` : '';
            
            return `
                <div class="filament-card">
                    <div class="filament-header">
                        <div class="filament-title">
                            <h3>${filament.name}</h3>
                            <p class="filament-type">${filament.type}</p>
                        </div>
                        ${colorPreview}
                        <div class="filament-actions">
                            <button onclick="editFilament('${filament.id}')" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="deleteFilament('${filament.id}')" title="Excluir">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="filament-info">
                        <div class="filament-info-item">
                            <span>Preço Total</span>
                            <span>R$ ${filament.price_total.toFixed(2)}</span>
                        </div>
                        <div class="filament-info-item">
                            <span>Quantidade</span>
                            <span>${filament.quantity_grams}g</span>
                        </div>
                        <div class="filament-info-item">
                            <span>Preço/Grama</span>
                            <span>R$ ${filament.price_per_gram.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function getContrastColor(hexColor) {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black or white based on luminance
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

function updateFilamentSelect() {
    const select = document.getElementById('filamentSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Selecione o filamento</option>' +
        APP_STATE.filaments.map(f => {
            const colorIndicator = f.color_hex ? 
                `<span style="display:inline-block; width:12px; height:12px; background:${f.color_hex}; border-radius:50%; margin-right:5px; vertical-align:middle;"></span>` : '';
            return `<option value="${f.id}">${f.name} (R$ ${f.price_per_gram.toFixed(4)}/g)</option>`;
        }).join('');
}

function setupFilamentForm() {
    const addBtn = document.getElementById('addFilamentBtn');
    const modal = document.getElementById('filamentModal');
    const closeBtn = modal?.querySelector('.modal-close');
    const form = document.getElementById('filamentForm');
    
    if (addBtn && modal) {
        addBtn.addEventListener('click', () => {
            form.reset();
            delete form.dataset.editId;
            document.getElementById('filamentModalTitle').textContent = 'Adicionar Filamento';
            modal.classList.add('active');
        });
    }
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    
    // Close modal on backdrop click
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveFilament();
        });
        
        // Sync color picker and hex input
        const colorPicker = document.getElementById('filamentColorPicker');
        const colorHex = document.getElementById('filamentColorHex');
        
        if (colorPicker && colorHex) {
            colorPicker.addEventListener('input', () => {
                colorHex.value = colorPicker.value.toUpperCase();
            });
            
            colorHex.addEventListener('input', () => {
                const hexValue = colorHex.value.trim();
                if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
                    colorPicker.value = hexValue;
                }
            });
        }
        
        // Auto-calculate price per gram
        const quantityInput = document.getElementById('filamentQuantity');
        const priceInput = document.getElementById('filamentPrice');
        
        if (quantityInput && priceInput) {
            const updatePricePerGram = () => {
                const quantity = parseFloat(quantityInput.value) || 0;
                const price = parseFloat(priceInput.value) || 0;
                const pricePerGram = quantity > 0 ? (price / quantity).toFixed(4) : '0.0000';
                const display = document.getElementById('pricePerGramDisplay');
                if (display) {
                    display.textContent = `R$ ${pricePerGram}/g`;
                }
            };
            
            quantityInput.addEventListener('input', updatePricePerGram);
            priceInput.addEventListener('input', updatePricePerGram);
        }
    }
}

async function saveFilament() {
    const form = document.getElementById('filamentForm');
    const editId = form.dataset.editId;
    
    const quantity = parseFloat(document.getElementById('filamentQuantity').value);
    const price = parseFloat(document.getElementById('filamentPrice').value);
    
    const filamentData = {
        name: document.getElementById('filamentName').value,
        type: document.getElementById('filamentType').value,
        color_hex: document.getElementById('filamentColorHex').value,
        quantity_grams: quantity,
        price_total: price,
        price_per_gram: quantity > 0 ? price / quantity : 0
    };
    
    try {
        if (editId) {
            // Update existing
            LocalDB.updateItem('filaments', editId, filamentData);
            showNotification('Filamento atualizado com sucesso!', 'success');
        } else {
            // Create new
            LocalDB.addItem('filaments', filamentData);
            showNotification('Filamento adicionado com sucesso!', 'success');
        }
        
        await loadFilaments();
        document.getElementById('filamentModal').classList.remove('active');
    } catch (error) {
        console.error('Error saving filament:', error);
        showNotification('Erro ao salvar filamento', 'error');
    }
}

function editFilament(id) {
    const filament = LocalDB.getItem('filaments', id);
    if (!filament) return;
    
    const form = document.getElementById('filamentForm');
    form.dataset.editId = id;
    
    document.getElementById('filamentName').value = filament.name;
    document.getElementById('filamentType').value = filament.type;
    document.getElementById('filamentColorHex').value = filament.color_hex || '#000000'; // Preto por padrão
    document.getElementById('filamentColorPicker').value = filament.color_hex || '#000000'; // Sincroniza picker
    document.getElementById('filamentQuantity').value = filament.quantity_grams;
    document.getElementById('filamentPrice').value = filament.price_total;
    
    // Trigger price calculation
    document.getElementById('filamentQuantity').dispatchEvent(new Event('input'));
    
    document.getElementById('filamentModalTitle').textContent = 'Editar Filamento';
    document.getElementById('filamentModal').classList.add('active');
}

async function deleteFilament(id) {
    if (!confirm('Tem certeza que deseja excluir este filamento?')) {
        return;
    }
    
    try {
        LocalDB.deleteItem('filaments', id);
        showNotification('Filamento excluído com sucesso!', 'success');
        await loadFilaments();
    } catch (error) {
        console.error('Error deleting filament:', error);
        showNotification('Erro ao excluir filamento', 'error');
    }
}

// ========================================
// Calculator Functions
// ========================================
function setupCalculatorForm() {
    console.log('🛠️ Setting up calculator form...');
    
    const form = document.getElementById('calculatorForm');
    const calculateBtn = document.getElementById('calculateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveCalculation');
    const printBtn = document.getElementById('printBudget');
    
    console.log('Form elements:', { form, calculateBtn, clearBtn, saveBtn, printBtn });
    
    // Prevent form submission from reloading the page
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('📤 Form submitted - calling calculatePrintCost()');
            calculatePrintCost();
        });
        console.log('✅ Form submit listener added');
    } else {
        console.error('❌ Form element not found!');
    }
    
    if (calculateBtn) {
        calculateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🔘 Calculate button clicked');
            calculatePrintCost();
        });
        console.log('✅ Calculate button listener added');
    } else {
        console.error('❌ Calculate button not found!');
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            form.reset();
            document.getElementById('resultCard').style.display = 'none';
            APP_STATE.currentCalculation = null;
        });
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveCalculation);
    }
    
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            // Change document title for print
            const originalTitle = document.title;
            const modelName = document.getElementById('resultModelName')?.textContent || 'Orçamento';
            document.title = `Orçamento - ${modelName}`;
            
            // Print
            window.print();
            
            // Restore title after print
            setTimeout(() => {
                document.title = originalTitle;
            }, 100);
        });
    }
}

function calculatePrintCost() {
    console.log('🧮 calculatePrintCost() called');
    
    // Get form values
    const modelName = document.getElementById('modelName').value.trim();
    const printerId = document.getElementById('printerSelect').value;
    const filamentId = document.getElementById('filamentSelect').value;
    const weight = parseFloat(document.getElementById('weight').value) || 0;
    const hours = parseInt(document.getElementById('printTimeHours').value) || 0;
    const minutes = parseInt(document.getElementById('printTimeMinutes').value) || 0;
    const failureRate = parseFloat(document.getElementById('failureRate').value) || 0;
    const profitMargin = parseFloat(document.getElementById('profitMargin').value) || 0;
    
    console.log('📝 Form values:', { modelName, printerId, filamentId, weight, hours, minutes, failureRate, profitMargin });
    
    // Validate required fields
    if (!printerId) {
        console.error('❌ No printer selected');
        showNotification('Selecione uma impressora', 'error');
        return;
    }
    
    if (!filamentId) {
        console.error('❌ No filament selected');
        showNotification('Selecione um filamento', 'error');
        return;
    }
    
    // Get printer and filament data
    console.log('🔍 Looking for printer ID:', printerId);
    console.log('🔍 Looking for filament ID:', filamentId);
    
    const printer = LocalDB.getItem('printers', printerId);
    const filament = LocalDB.getItem('filaments', filamentId);
    
    console.log('🖨️ Printer found:', printer);
    console.log('🎨 Filament found:', filament);
    
    if (!printer) {
        console.error('❌ Printer not found in database');
        showNotification('Impressora não encontrada', 'error');
        return;
    }
    
    if (!filament) {
        console.error('❌ Filament not found in database');
        showNotification('Filamento não encontrado', 'error');
        return;
    }
    
    // Convert time to hours
    const timeInHours = hours + (minutes / 60);
    
    // Calculate costs
    const baseCost = weight * filament.price_per_gram;
    const failureCost = baseCost * (failureRate / 100);
    const energyCost = (printer.power_watts / 1000) * timeInHours * printer.energy_cost_kwh;
    const totalCost = baseCost + failureCost + energyCost;
    const profitValue = baseCost * (profitMargin / 100);
    const finalPrice = totalCost + profitValue;
    
    console.log('💰 Calculations:', {
        baseCost: baseCost.toFixed(2),
        failureCost: failureCost.toFixed(2),
        energyCost: energyCost.toFixed(2),
        totalCost: totalCost.toFixed(2),
        profitValue: profitValue.toFixed(2),
        finalPrice: finalPrice.toFixed(2)
    });
    
    // Format time for display
    const timeFormatted = `${hours}h ${minutes.toString().padStart(2, '0')}min`;
    
    // Store calculation
    APP_STATE.currentCalculation = {
        model_name: modelName,
        printer_id: printerId,
        printer_name: printer.name,
        filament_id: filamentId,
        filament_name: filament.name,
        weight_grams: weight,
        weight_with_failure: weight + (weight * failureRate / 100),
        failure_rate: failureRate,
        print_time_hours: timeInHours,
        print_time_formatted: timeFormatted,
        material_cost: baseCost,
        energy_cost: energyCost,
        total_cost: totalCost,
        profit_margin_percent: profitMargin,
        profit_value: profitValue,
        final_price: finalPrice,
        calculation_date: new Date().toISOString()
    };
    
    console.log('✅ Calculation completed:', APP_STATE.currentCalculation);
    
    // Display results
    displayCalculationResults();
    console.log('✅ Results displayed');
}

function displayCalculationResults() {
    console.log('📊 displayCalculationResults() called');
    
    const calc = APP_STATE.currentCalculation;
    console.log('Calculation data:', calc);
    
    // Show result card
    const resultCard = document.getElementById('resultCard');
    console.log('Result card element:', resultCard);
    
    if (!resultCard) {
        console.error('❌ Result card element not found!');
        return;
    }
    
    resultCard.style.display = 'block';
    console.log('✅ Result card displayed');
    
    // Fill in the values
    try {
        document.getElementById('resultModelName').textContent = calc.model_name || 'N/A';
        document.getElementById('resultPrinter').textContent = calc.printer_name;
        document.getElementById('resultFilament').textContent = calc.filament_name;
        document.getElementById('resultWeight').textContent = Math.round(calc.weight_grams); // Sem decimais
        document.getElementById('resultTime').textContent = calc.print_time_formatted;
        document.getElementById('resultMaterialCost').textContent = calc.material_cost.toFixed(2);
        document.getElementById('resultEnergyCost').textContent = calc.energy_cost.toFixed(2);
        document.getElementById('resultTotalCost').textContent = calc.total_cost.toFixed(2);
        document.getElementById('resultProfitMargin').textContent = calc.profit_margin_percent.toFixed(0);
        document.getElementById('resultProfitValue').textContent = calc.profit_value.toFixed(2);
        
        // For print: unified total (total_cost + profit_value)
        const totalWithProfit = calc.total_cost + calc.profit_value;
        document.getElementById('resultTotalCostWithProfit').textContent = totalWithProfit.toFixed(2);
        
        const finalPriceElement = document.getElementById('resultFinalPrice');
        console.log('🎯 Final price element:', finalPriceElement);
        console.log('🎯 Final price value:', calc.final_price);
        finalPriceElement.textContent = calc.final_price.toFixed(2); // Sem R$ duplicado
        console.log('🎯 Final price element after update:', finalPriceElement.textContent);
        
        console.log('✅ All result fields populated');
    } catch (error) {
        console.error('❌ Error filling result fields:', error);
    }
    
    // Update print date
    const printDate = document.getElementById('printDate');
    if (printDate) {
        const date = new Date();
        printDate.textContent = date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Update print model name with prefix
    const printModelName = document.getElementById('printModelName');
    if (printModelName && calc.model_name) {
        printModelName.textContent = `Orçamento - ${calc.model_name}`;
    }
    
    // Scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function saveCalculation() {
    if (!APP_STATE.currentCalculation) {
        showNotification('Nenhum cálculo para salvar', 'error');
        return;
    }
    
    try {
        LocalDB.addItem('calculations', APP_STATE.currentCalculation);
        showNotification('Cálculo salvo no histórico!', 'success');
        await loadCalculations();
        renderDashboard();
    } catch (error) {
        console.error('Error saving calculation:', error);
        showNotification('Erro ao salvar cálculo', 'error');
    }
}

// ========================================
// Calculations/History Functions
// ========================================
async function loadCalculations() {
    try {
        APP_STATE.calculations = LocalDB.getTable('calculations');
        renderHistoryTable();
    } catch (error) {
        console.error('Error loading calculations:', error);
        showNotification('Erro ao carregar histórico', 'error');
    }
}

function setupHistoryHandlers() {
    const searchInput = document.getElementById('historySearch');
    const filterSelect = document.getElementById('filterPeriod');
    const clearBtn = document.getElementById('clearHistory');
    
    if (searchInput) {
        searchInput.addEventListener('input', renderHistoryTable);
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            const customDateRange = document.getElementById('customDateRange');
            if (e.target.value === 'custom') {
                customDateRange.style.display = 'flex';
            } else {
                customDateRange.style.display = 'none';
            }
            renderHistoryTable();
        });
    }
    
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    if (startDate && endDate) {
        startDate.addEventListener('change', renderHistoryTable);
        endDate.addEventListener('change', renderHistoryTable);
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllHistory);
    }
}

function renderHistoryTable() {
    const cardsGrid = document.getElementById('historyCardsGrid');
    
    if (!cardsGrid) return;
    
    let filteredCalcs = [...APP_STATE.calculations];
    
    // Apply search filter
    const searchTerm = document.getElementById('historySearch')?.value.toLowerCase() || '';
    if (searchTerm) {
        filteredCalcs = filteredCalcs.filter(calc => 
            calc.model_name.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply period filter
    const period = document.getElementById('filterPeriod')?.value || 'all';
    if (period !== 'all') {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        filteredCalcs = filteredCalcs.filter(calc => {
            const calcDate = new Date(calc.calculation_date);
            
            switch (period) {
                case 'today':
                    return calcDate >= startOfToday;
                case 'week':
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    return calcDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    return calcDate >= monthAgo;
                case 'year':
                    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    return calcDate >= yearAgo;
                case 'custom':
                    const startDate = document.getElementById('startDate')?.value;
                    const endDate = document.getElementById('endDate')?.value;
                    if (startDate && endDate) {
                        const start = new Date(startDate);
                        const end = new Date(endDate);
                        end.setHours(23, 59, 59, 999);
                        return calcDate >= start && calcDate <= end;
                    }
                    return true;
                default:
                    return true;
            }
        });
    }
    
    // Sort by date (newest first)
    filteredCalcs.sort((a, b) => new Date(b.calculation_date) - new Date(a.calculation_date));
    
    if (filteredCalcs.length === 0) {
        cardsGrid.innerHTML = `
            <div style="text-align: center; padding: 3rem; grid-column: 1/-1;">
                <i class="fas fa-inbox" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem; display: block;"></i>
                <p style="color: var(--text-secondary); font-size: 1.1rem;">Nenhum cálculo encontrado</p>
            </div>
        `;
        return;
    }
    
    // Render cards
    cardsGrid.innerHTML = filteredCalcs.map(calc => {
        const date = new Date(calc.calculation_date);
        const dateStr = date.toLocaleDateString('pt-BR');
        const timeStr = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="history-card">
                <div class="history-card-header">
                    <h4>${calc.model_name}</h4>
                    <div class="history-card-date">
                        <i class="fas fa-calendar"></i> ${dateStr} ${timeStr}
                    </div>
                </div>
                <div class="history-card-body">
                    <div class="history-card-item">
                        <label>Peso</label>
                        <span>${calc.weight_grams.toFixed(2)}g</span>
                    </div>
                    <div class="history-card-item">
                        <label>Tempo</label>
                        <span>${calc.print_time_formatted}</span>
                    </div>
                    <div class="history-card-item">
                        <label>Custo Total</label>
                        <span>R$ ${calc.total_cost.toFixed(2)}</span>
                    </div>
                    <div class="history-card-item">
                        <label>Preço Final</label>
                        <span style="color: #28a745; font-weight: 700;">R$ ${calc.final_price.toFixed(2)}</span>
                    </div>
                </div>
                <div class="history-card-actions">
                    <button class="btn-view" onclick="showCalculationDetails('${calc.id}')">
                        <i class="fas fa-eye"></i> Visualizar
                    </button>
                    <button class="btn-delete" onclick="deleteCalculation('${calc.id}')">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function showCalculationDetails(id) {
    const calc = LocalDB.getItem('calculations', id);
    if (!calc) return;
    
    // Store as current calculation
    APP_STATE.currentCalculation = calc;
    
    // Navigate to calculator page
    showPage('calculator');
    
    // Display results
    displayCalculationResults();
    
    // Fill form with calculation data
    document.getElementById('modelName').value = calc.model_name;
    document.getElementById('printerSelect').value = calc.printer_id;
    document.getElementById('filamentSelect').value = calc.filament_id;
    document.getElementById('weight').value = calc.weight_grams;
    
    // Parse time
    const hours = Math.floor(calc.print_time_hours);
    const minutes = Math.round((calc.print_time_hours - hours) * 60);
    document.getElementById('printTimeHours').value = hours;
    document.getElementById('printTimeMinutes').value = minutes;
    
    document.getElementById('failureRate').value = calc.failure_rate || 5;
    document.getElementById('profitMargin').value = calc.profit_margin_percent;
}

async function deleteCalculation(id) {
    if (!confirm('Tem certeza que deseja excluir este cálculo?')) {
        return;
    }
    
    try {
        LocalDB.deleteItem('calculations', id);
        showNotification('Cálculo excluído com sucesso!', 'success');
        await loadCalculations();
        renderDashboard();
    } catch (error) {
        console.error('Error deleting calculation:', error);
        showNotification('Erro ao excluir cálculo', 'error');
    }
}

async function clearAllHistory() {
    if (!confirm('Tem certeza que deseja limpar todo o histórico? Esta ação não pode ser desfeita.')) {
        return;
    }
    
    try {
        LocalDB.saveTable('calculations', []);
        APP_STATE.calculations = [];
        showNotification('Histórico limpo com sucesso!', 'success');
        renderHistoryTable();
        renderDashboard();
    } catch (error) {
        console.error('Error clearing history:', error);
        showNotification('Erro ao limpar histórico', 'error');
    }
}

// ========================================
// Dashboard Functions
// ========================================
function renderDashboard() {
    const stats = calculateStatistics();
    
    // Update stats
    document.getElementById('statTotalCalculations').textContent = stats.totalCalculations;
    document.getElementById('statTotalValue').textContent = stats.totalValue.toFixed(2);
    document.getElementById('statTotalProfit').textContent = stats.totalProfit.toFixed(2);
    document.getElementById('statTotalWeight').textContent = Math.round(stats.totalWeight);
    
    // Render charts
    renderFilamentsChart(stats.filamentUsage, stats.filamentColors);
    renderCostsChart(stats.costsOverTime);
}

function calculateStatistics() {
    const calculations = APP_STATE.calculations;
    
    const stats = {
        totalCalculations: calculations.length,
        totalValue: calculations.reduce((sum, c) => sum + (c.final_price || 0), 0),
        totalProfit: calculations.reduce((sum, c) => sum + (c.profit_value || 0), 0),
        totalFilaments: new Set(calculations.map(c => c.filament_name)).size,
        totalWeight: calculations.reduce((sum, c) => sum + (c.weight_grams || 0), 0),
        filamentUsage: {},
        filamentColors: {},
        costsOverTime: []
    };
    
    // Calculate filament usage
    calculations.forEach(calc => {
        const name = calc.filament_name;
        if (!stats.filamentUsage[name]) {
            stats.filamentUsage[name] = 0;
            
            // Get filament color
            const filament = APP_STATE.filaments.find(f => f.name === name);
            if (filament && filament.color_hex) {
                stats.filamentColors[name] = filament.color_hex;
            }
        }
        stats.filamentUsage[name] += calc.weight_grams || 0;
    });
    
    // Get last 10 calculations for costs chart
    stats.costsOverTime = calculations
        .slice(-10)
        .reverse()
        .map(calc => ({
            name: calc.model_name,
            cost: calc.total_cost || 0,
            price: calc.final_price || 0
        }));
    
    return stats;
}

let filamentsChartInstance = null;

function renderFilamentsChart(filamentUsage, filamentColors) {
    const canvas = document.getElementById('filamentsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (filamentsChartInstance) {
        filamentsChartInstance.destroy();
    }
    
    const labels = Object.keys(filamentUsage);
    const data = Object.values(filamentUsage);
    
    if (labels.length === 0) {
        canvas.parentElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-pie fa-2x"></i>
                <p>Nenhum dado disponível</p>
            </div>
        `;
        return;
    }
    
    // Default colors for when filament has no color defined
    const defaultColors = [
        '#667eea', '#764ba2', '#f093fb', 
        '#4facfe', '#28a745', '#fa709a',
        '#ff6b6b', '#4ecdc4', '#45b7d1'
    ];
    
    // Map colors: use filament color if available, otherwise use default
    const backgroundColors = labels.map((label, index) => {
        return filamentColors[label] || defaultColors[index % defaultColors.length];
    });
    
    filamentsChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return `${label}: ${value.toFixed(0)}g`;
                        }
                    }
                }
            }
        }
    });
}

let costsChartInstance = null;

function renderCostsChart(costsOverTime) {
    const canvas = document.getElementById('costsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (costsChartInstance) {
        costsChartInstance.destroy();
    }
    
    if (costsOverTime.length === 0) {
        canvas.parentElement.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-chart-bar fa-2x"></i>
                <p>Nenhum dado disponível</p>
            </div>
        `;
        return;
    }
    
    costsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: costsOverTime.map(item => item.name),
            datasets: [
                {
                    label: 'Custo Total',
                    data: costsOverTime.map(item => item.cost),
                    backgroundColor: '#ff9500'
                },
                {
                    label: 'Preço Final',
                    data: costsOverTime.map(item => item.price),
                    backgroundColor: '#28a745'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: R$ ${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

// ========================================
// Notifications
// ========================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Set color based on type
    const colors = {
        success: '#48bb78',
        error: '#f56565',
        info: '#4299e1'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    notification.style.color = 'white';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    notification.style.position = 'fixed';
    notification.style.top = '2rem';
    notification.style.right = '2rem';
    notification.style.zIndex = '10000';
    notification.style.maxWidth = '300px';
    notification.style.animation = 'slideIn 0.3s ease';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Make functions global
window.editPrinter = editPrinter;
window.deletePrinter = deletePrinter;
window.editFilament = editFilament;
window.deleteFilament = deleteFilament;
window.showCalculationDetails = showCalculationDetails;
window.deleteCalculation = deleteCalculation;
