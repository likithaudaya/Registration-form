// Check if user is logged in
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        window.location.href = 'login.html';
    }
}

// Call checkAuth on page load
checkAuth();

// Load registration data from localStorage
let registrationData = [];

function loadData() {
    const savedData = localStorage.getItem('registrationData');
    if (savedData) {
        registrationData = JSON.parse(savedData);
    }
    updateDashboard();
}

// Calculate age from date of birth
function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (confirm('Are you sure you want to logout?')) {
        // Clear session
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('loginTime');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
});

// Update Dashboard Statistics
function updateDashboard() {
    // Total Registrations
    document.getElementById('totalRegistrations').textContent = registrationData.length;
    
    // Today's Registrations
    const today = new Date().toISOString().split('T')[0];
    const todayCount = registrationData.filter(r => r.timestamp?.startsWith(today)).length;
    document.getElementById('todayRegistrations').textContent = todayCount;
    
    // Active Users
    const activeCount = registrationData.filter(r => r.status === 'active').length;
    document.getElementById('activeUsers').textContent = activeCount;
    
    // Inactive Users
    const inactiveCount = registrationData.filter(r => r.status === 'inactive').length;
    document.getElementById('inactiveUsers').textContent = inactiveCount;
    
    // Suspended Users
    const suspendedCount = registrationData.filter(r => r.status === 'suspended').length;
    document.getElementById('suspendedUsers').textContent = suspendedCount;
    
    // Update recent table
    updateRecentTable();
    
    // Update full registrations table
    updateRegistrationsTable();
    
    // Update analytics
    updateAnalytics();
    
    // Create Registration Trend Chart
    createRegistrationTrendChart();
}

// Update Recent Registrations Table
function updateRecentTable() {
    const tbody = document.getElementById('recentTableBody');
    tbody.innerHTML = '';
    
    const recentData = registrationData.slice(-10).reverse();
    
    recentData.forEach(reg => {
        const age = calculateAge(reg.dateOfBirth);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reg.id}</td>
            <td>${reg.name}</td>
            <td>${age}</td>
            <td>${reg.gender}</td>
            <td>${reg.state}</td>
            <td><span class="status-badge status-${reg.status}">${reg.status}</span></td>
            <td>${new Date(reg.timestamp).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Update All Registrations Table
let currentPage = 1;
const itemsPerPage = 10;

function updateRegistrationsTable(filteredData = null) {
    const data = filteredData || registrationData;
    const tbody = document.getElementById('registrationsTableBody');
    tbody.innerHTML = '';
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = data.slice(startIndex, endIndex);
    
    pageData.forEach(reg => {
        const age = calculateAge(reg.dateOfBirth);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="select-item" data-id="${reg.id}"></td>
            <td>${reg.id}</td>
            <td>${reg.name}</td>
            <td>${reg.dateOfBirth}</td>
            <td>${age}</td>
            <td>${reg.gender}</td>
            <td>${reg.state}</td>
            <td>${reg.city}</td>
            <td><span class="status-badge status-${reg.status}">${reg.status}</span></td>
            <td>${reg.type}</td>
            <td>${new Date(reg.timestamp).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    });
    
    // Update pagination
    const totalPages = Math.ceil(data.length / itemsPerPage);
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
}

// Create Registration Trend Chart (Bar Chart: This Week vs Last Week)
function createRegistrationTrendChart() {
    const canvas = document.getElementById('registrationTrendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Get dates for this week and last week
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - dayOfWeek);
    startOfThisWeek.setHours(0, 0, 0, 0);
    
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);
    
    // Count registrations for each day
    const thisWeekData = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    const lastWeekData = [0, 0, 0, 0, 0, 0, 0];
    
    registrationData.forEach(reg => {
        const regDate = new Date(reg.timestamp);
        const diffThisWeek = Math.floor((regDate - startOfThisWeek) / (1000 * 60 * 60 * 24));
        const diffLastWeek = Math.floor((regDate - startOfLastWeek) / (1000 * 60 * 60 * 24));
        
        if (diffThisWeek >= 0 && diffThisWeek < 7) {
            thisWeekData[diffThisWeek]++;
        } else if (diffLastWeek >= 0 && diffLastWeek < 7) {
            lastWeekData[diffLastWeek]++;
        }
    });
    
    // Simple bar chart drawing
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 300;
    const barWidth = width / 16;
    const maxValue = Math.max(...thisWeekData, ...lastWeekData, 1);
    const scale = (height - 40) / maxValue;
    
    ctx.clearRect(0, 0, width, height);
    
    // Draw bars
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    days.forEach((day, i) => {
        const x = i * (barWidth * 2) + 40;
        
        // Last week bar (light blue)
        ctx.fillStyle = '#a8c5e4';
        const lastWeekHeight = lastWeekData[i] * scale;
        ctx.fillRect(x, height - lastWeekHeight - 20, barWidth, lastWeekHeight);
        
        // This week bar (dark blue)
        ctx.fillStyle = '#667eea';
        const thisWeekHeight = thisWeekData[i] * scale;
        ctx.fillRect(x + barWidth, height - thisWeekHeight - 20, barWidth, thisWeekHeight);
        
        // Day label
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(day, x + barWidth / 2, height - 5);
        
        // Values on bars
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px Arial';
        if (lastWeekData[i] > 0) {
            ctx.fillText(lastWeekData[i], x + barWidth / 2 - 5, height - lastWeekHeight - 25);
        }
        if (thisWeekData[i] > 0) {
            ctx.fillText(thisWeekData[i], x + barWidth + barWidth / 2 - 5, height - thisWeekHeight - 25);
        }
    });
    
    // Legend
    ctx.fillStyle = '#a8c5e4';
    ctx.fillRect(width - 150, 10, 20, 15);
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Last Week', width - 125, 22);
    
    ctx.fillStyle = '#667eea';
    ctx.fillRect(width - 150, 30, 20, 15);
    ctx.fillStyle = '#333';
    ctx.fillText('This Week', width - 125, 42);
}

// Update Analytics
function updateAnalytics() {
    // State distribution
    const stateCount = {};
    registrationData.forEach(reg => {
        stateCount[reg.state] = (stateCount[reg.state] || 0) + 1;
    });
    const topState = Object.keys(stateCount).sort((a, b) => stateCount[b] - stateCount[a])[0];
    document.getElementById('topState').textContent = topState || 'N/A';
    
    // Language distribution
    const languageCount = {};
    registrationData.forEach(reg => {
        reg.languages?.forEach(lang => {
            languageCount[lang] = (languageCount[lang] || 0) + 1;
        });
    });
    const topLanguage = Object.keys(languageCount).sort((a, b) => languageCount[b] - languageCount[a])[0];
    document.getElementById('topLanguage').textContent = topLanguage || 'N/A';
    
    // Average age
    const totalAge = registrationData.reduce((sum, reg) => sum + calculateAge(reg.dateOfBirth), 0);
    const avgAge = (totalAge / registrationData.length).toFixed(1);
    document.getElementById('avgAge').textContent = avgAge || '0';
    
    // Total cities
    const cities = new Set(registrationData.map(reg => reg.city));
    document.getElementById('totalCities').textContent = cities.size;
    
    // Create analytics charts
    createAnalyticsCharts();
}

// Create Analytics Charts
function createAnalyticsCharts() {
    createStateChart();
    createStatusChart();
    createTypeChart();
    createAgeChart();
}

function createStateChart() {
    const canvas = document.getElementById('stateChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const stateCount = {};
    
    registrationData.forEach(reg => {
        stateCount[reg.state] = (stateCount[reg.state] || 0) + 1;
    });
    
    // Get top 10 states
    const topStates = Object.entries(stateCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 300;
    const barHeight = height / (topStates.length + 1);
    const maxValue = topStates[0]?.[1] || 1;
    
    ctx.clearRect(0, 0, width, height);
    
    topStates.forEach(([ state, count], i) => {
        const barWidth = (count / maxValue) * (width - 150);
        const y = i * barHeight + 20;
        
        // Bar
        ctx.fillStyle = '#667eea';
        ctx.fillRect(120, y, barWidth, barHeight - 10);
        
        // State name
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(state.substring(0, 15), 115, y + barHeight / 2);
        
        // Count
        ctx.textAlign = 'left';
        ctx.fillStyle = '#fff';
        ctx.fillText(count, 125, y + barHeight / 2);
    });
}

function createStatusChart() {
    const canvas = document.getElementById('statusChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 300;
    
    const active = registrationData.filter(r => r.status === 'active').length;
    const inactive = registrationData.filter(r => r.status === 'inactive').length;
    const suspended = registrationData.filter(r => r.status === 'suspended').length;
    const total = active + inactive + suspended || 1;
    
    // Display statistics
    const statsDiv = document.getElementById('statusStats');
    const activePercent = ((active / total) * 100).toFixed(1);
    const inactivePercent = ((inactive / total) * 100).toFixed(1);
    const suspendedPercent = ((suspended / total) * 100).toFixed(1);
    
    statsDiv.innerHTML = `
        <div class="stat-line"><span class="stat-label">Total Users:</span><span class="stat-value">${total}</span></div>
        <div class="stat-line"><span class="stat-label" style="color: #28a745;">✓ Active:</span><span class="stat-value">${active} (${activePercent}%)</span></div>
        <div class="stat-line"><span class="stat-label" style="color: #dc3545;">✗ Inactive:</span><span class="stat-value">${inactive} (${inactivePercent}%)</span></div>
        <div class="stat-line"><span class="stat-label" style="color: #ffc107;">⏸ Suspended:</span><span class="stat-value">${suspended} (${suspendedPercent}%)</span></div>
    `;
    
    ctx.clearRect(0, 0, width, height);
    
    // Simple pie chart
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    let currentAngle = 0;
    
    // Active (green)
    const activeAngle = (active / total) * 2 * Math.PI;
    ctx.fillStyle = '#28a745';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + activeAngle);
    ctx.closePath();
    ctx.fill();
    currentAngle += activeAngle;
    
    // Inactive (red)
    const inactiveAngle = (inactive / total) * 2 * Math.PI;
    ctx.fillStyle = '#dc3545';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + inactiveAngle);
    ctx.closePath();
    ctx.fill();
    currentAngle += inactiveAngle;
    
    // Suspended (orange)
    const suspendedAngle = (suspended / total) * 2 * Math.PI;
    ctx.fillStyle = '#ffc107';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + suspendedAngle);
    ctx.closePath();
    ctx.fill();
    
    // Legend
    ctx.fillStyle = '#28a745';
    ctx.fillRect(20, 20, 15, 15);
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(`Active: ${active}`, 40, 32);
    
    ctx.fillStyle = '#dc3545';
    ctx.fillRect(20, 40, 15, 15);
    ctx.fillText(`Inactive: ${inactive}`, 40, 52);
    
    ctx.fillStyle = '#ffc107';
    ctx.fillRect(20, 60, 15, 15);
    ctx.fillText(`Suspended: ${suspended}`, 40, 72);
}

function createTypeChart() {
    const canvas = document.getElementById('typeChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 300;
    
    const individual = registrationData.filter(r => r.type === 'individual').length;
    const agency = registrationData.filter(r => r.type === 'agency').length;
    const subagency = registrationData.filter(r => r.type === 'subagency').length;
    const total = individual + agency + subagency || 1;
    
    // Display statistics
    const statsDiv = document.getElementById('typeStats');
    const individualPercent = ((individual / total) * 100).toFixed(1);
    const agencyPercent = ((agency / total) * 100).toFixed(1);
    const subagencyPercent = ((subagency / total) * 100).toFixed(1);
    
    statsDiv.innerHTML = `
        <div class="stat-line"><span class="stat-label">Total Registrations:</span><span class="stat-value">${total}</span></div>
        <div class="stat-line"><span class="stat-label">👤 Individual:</span><span class="stat-value">${individual} (${individualPercent}%)</span></div>
        <div class="stat-line"><span class="stat-label">🏢 Agency:</span><span class="stat-value">${agency} (${agencyPercent}%)</span></div>
        <div class="stat-line"><span class="stat-label">🏪 Sub-agency:</span><span class="stat-value">${subagency} (${subagencyPercent}%)</span></div>
    `;
    
    ctx.clearRect(0, 0, width, height);
    
    // Bar chart
    const barWidth = width / 4;
    const maxValue = Math.max(individual, agency, subagency, 1);
    const scale = (height - 60) / maxValue;
    
    // Individual
    ctx.fillStyle = '#667eea';
    ctx.fillRect(barWidth / 2, height - individual * scale - 40, barWidth, individual * scale);
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Individual', barWidth, height - 25);
    ctx.fillText(individual, barWidth, height - individual * scale - 45);
    
    // Agency
    ctx.fillStyle = '#764ba2';
    ctx.fillRect(barWidth * 1.5 + barWidth / 2, height - agency * scale - 40, barWidth, agency * scale);
    ctx.fillText('Agency', barWidth * 2, height - 25);
    ctx.fillText(agency, barWidth * 2, height - agency * scale - 45);
    
    // Sub-agency
    ctx.fillStyle = '#f093fb';
    ctx.fillRect(barWidth * 2.5 + barWidth / 2, height - subagency * scale - 40, barWidth, subagency * scale);
    ctx.fillText('Sub-agency', barWidth * 3, height - 25);
    ctx.fillText(subagency, barWidth * 3, height - subagency * scale - 45);
}

function createAgeChart() {
    const canvas = document.getElementById('ageChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 300;
    
    // Age groups
    const ageGroups = {
        '0-5': 0,
        '6-10': 0,
        '11-15': 0,
        '16-17': 0
    };
    
    registrationData.forEach(reg => {
        const age = calculateAge(reg.dateOfBirth);
        if (age <= 5) ageGroups['0-5']++;
        else if (age <= 10) ageGroups['6-10']++;
        else if (age <= 15) ageGroups['11-15']++;
        else ageGroups['16-17']++;
    });
    
    const total = registrationData.length || 1;
    
    // Display statistics
    const statsDiv = document.getElementById('ageStats');
    let statsHTML = '<div class="stat-line"><span class="stat-label">Total Users:</span><span class="stat-value">' + total + '</span></div>';
    
    Object.entries(ageGroups).forEach(([group, count]) => {
        const percent = ((count / total) * 100).toFixed(1);
        statsHTML += '<div class="stat-line"><span class="stat-label">Age ' + group + ':</span><span class="stat-value">' + count + ' (' + percent + '%)</span></div>';
    });
    
    // Calculate average age
    const totalAge = registrationData.reduce((sum, reg) => sum + calculateAge(reg.dateOfBirth), 0);
    const avgAge = (totalAge / total).toFixed(1);
    statsHTML += '<div class="stat-line"><span class="stat-label">Average Age:</span><span class="stat-value">' + avgAge + ' years</span></div>';
    
    statsDiv.innerHTML = statsHTML;
    
    ctx.clearRect(0, 0, width, height);
    
    // Bar chart
    const barWidth = width / 5;
    const maxValue = Math.max(...Object.values(ageGroups), 1);
    const scale = (height - 60) / maxValue;
    
    Object.entries(ageGroups).forEach(([group, count], i) => {
        const x = i * barWidth + barWidth / 4;
        const barHeight = count * scale;
        
        ctx.fillStyle = '#667eea';
        ctx.fillRect(x, height - barHeight - 40, barWidth / 2, barHeight);
        
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(group, x + barWidth / 4, height - 25);
        ctx.fillText(count, x + barWidth / 4, height - barHeight - 45);
    });
}

// User Actions
function viewUser(id) {
    const user = registrationData.find(r => r.id === id);
    if (user) {
        alert(`User Details:\n${JSON.stringify(user, null, 2)}`);
    }
}

function editUser(id) {
    alert(`Edit functionality for user ${id} - To be implemented`);
}

function deleteUser(id) {
    if (confirm('Are you sure you want to delete this registration?')) {
        registrationData = registrationData.filter(r => r.id !== id);
        localStorage.setItem('registrationData', JSON.stringify(registrationData));
        updateDashboard();
        alert('Registration deleted successfully!');
    }
}

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        
        // Show selected section
        const sectionId = this.dataset.section;
        document.getElementById(sectionId).classList.add('active');
    });
});

// Menu Toggle
document.getElementById('menuToggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    
    // On mobile, also toggle 'open' class
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
    }
});

// Page Search Functionality
document.getElementById('searchBtn').addEventListener('click', performPageSearch);
document.getElementById('globalSearch').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performPageSearch();
    }
});

function performPageSearch() {
    const searchTerm = document.getElementById('globalSearch').value.toLowerCase().trim();
    
    const pageMap = {
        'overview': 'overview',
        'home': 'overview',
        'dashboard': 'overview',
        'registrations': 'registrations',
        'registration': 'registrations',
        'users': 'registrations',
        'analytics': 'analytics',
        'analysis': 'analytics',
        'stats': 'analytics',
        'reports': 'reports',
        'report': 'reports',
        'export': 'reports',
        'user management': 'users',
        'manage users': 'users',
        'settings': 'settings',
        'setting': 'settings',
        'configuration': 'settings',
        'logs': 'logs',
        'log': 'logs',
        'activity': 'logs',
        'history': 'logs'
    };
    
    const targetSection = pageMap[searchTerm];
    
    if (targetSection) {
        // Remove active from all nav items
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
        
        // Activate target
        document.querySelector(`[data-section="${targetSection}"]`)?.classList.add('active');
        document.getElementById(targetSection)?.classList.add('active');
        
        // Clear search
        document.getElementById('globalSearch').value = '';
    } else {
        alert('Page not found. Try: overview, registrations, analytics, reports, settings, logs');
    }
}

// Pagination
document.getElementById('prevPage').addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        updateRegistrationsTable();
    }
});

document.getElementById('nextPage').addEventListener('click', function() {
    const totalPages = Math.ceil(registrationData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateRegistrationsTable();
    }
});

// Filters
document.getElementById('applyFilters').addEventListener('click', function() {
    const nameFilter = document.getElementById('searchName').value.toLowerCase();
    const stateFilter = document.getElementById('filterState').value;
    const genderFilter = document.getElementById('filterGender').value;
    const statusFilter = document.getElementById('filterStatus').value;
    
    const filtered = registrationData.filter(reg => {
        const matchName = !nameFilter || reg.name.toLowerCase().includes(nameFilter);
        const matchState = !stateFilter || reg.state === stateFilter;
        const matchGender = !genderFilter || reg.gender === genderFilter;
        const matchStatus = !statusFilter || reg.status === statusFilter;
        
        return matchName && matchState && matchGender && matchStatus;
    });
    
    currentPage = 1;
    updateRegistrationsTable(filtered);
});

document.getElementById('clearFilters').addEventListener('click', function() {
    document.getElementById('searchName').value = '';
    document.getElementById('filterState').value = '';
    document.getElementById('filterGender').value = '';
    document.getElementById('filterStatus').value = '';
    currentPage = 1;
    updateRegistrationsTable();
});

// Select All
document.getElementById('selectAll').addEventListener('change', function() {
    const checkboxes = document.querySelectorAll('.select-item');
    checkboxes.forEach(cb => cb.checked = this.checked);
});

// Bulk Delete
document.getElementById('bulkDelete').addEventListener('click', function() {
    const selected = Array.from(document.querySelectorAll('.select-item:checked')).map(cb => parseInt(cb.dataset.id));
    
    if (selected.length === 0) {
        alert('Please select registrations to delete');
        return;
    }
    
    if (confirm(`Are you sure you want to delete ${selected.length} registration(s)?`)) {
        registrationData = registrationData.filter(r => !selected.includes(r.id));
        localStorage.setItem('registrationData', JSON.stringify(registrationData));
        updateDashboard();
        alert('Selected registrations deleted successfully!');
    }
});

// Bulk Export
document.getElementById('bulkExport').addEventListener('click', function() {
    const selected = Array.from(document.querySelectorAll('.select-item:checked')).map(cb => parseInt(cb.dataset.id));
    
    if (selected.length === 0) {
        alert('Please select registrations to export');
        return;
    }
    
    const exportData = registrationData.filter(r => selected.includes(r.id));
    downloadJSON(exportData, 'selected_registrations.json');
});

// Export Functions
document.getElementById('exportJSON').addEventListener('click', function() {
    downloadJSON(registrationData, 'all_registrations.json');
});

document.getElementById('exportCSV').addEventListener('click', function() {
    downloadCSV(registrationData);
});

function downloadJSON(data, filename) {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function downloadCSV(data) {
    const headers = ['ID', 'Name', 'DOB', 'Gender', 'State', 'City', 'Status', 'Type', 'Created Date'];
    const csvContent = [
        headers.join(','),
        ...data.map(reg => [
            reg.id,
            `"${reg.name}"`,
            reg.dateOfBirth,
            reg.gender,
            `"${reg.state}"`,
            `"${reg.city}"`,
            reg.status,
            reg.type,
            new Date(reg.timestamp).toLocaleDateString()
        ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'registrations.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Reports
document.getElementById('generateSummary').addEventListener('click', function() {
    const format = document.querySelector('input[name="summaryFormat"]:checked').value;
    
    const summary = {
        totalRegistrations: registrationData.length,
        activeUsers: registrationData.filter(r => r.status === 'active').length,
        inactiveUsers: registrationData.filter(r => r.status === 'inactive').length,
        suspendedUsers: registrationData.filter(r => r.status === 'suspended').length,
        genderDistribution: {
            male: registrationData.filter(r => r.gender === 'male').length,
            female: registrationData.filter(r => r.gender === 'female').length,
            other: registrationData.filter(r => r.gender === 'other').length
        }
    };
    
    if (format === 'pdf') {
        // Generate PDF format text
        const pdfContent = `
REGISTRATION SUMMARY REPORT
============================

Generated: ${new Date().toLocaleString()}

OVERALL STATISTICS
------------------
Total Registrations: ${summary.totalRegistrations}
Active Users: ${summary.activeUsers}
Inactive Users: ${summary.inactiveUsers}
Suspended Users: ${summary.suspendedUsers}

GENDER DISTRIBUTION
-------------------
Male: ${summary.genderDistribution.male}
Female: ${summary.genderDistribution.female}
Other: ${summary.genderDistribution.other}

============================
End of Report
        `;
        
        downloadFile(pdfContent, 'summary_report.txt', 'text/plain');
        alert('Summary report generated! (Note: Full PDF generation requires additional library)');
    } else {
        // Generate Word format (HTML-based)
        const wordContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
<head><meta charset='utf-8'><title>Summary Report</title></head>
<body>
<h1>Registration Summary Report</h1>
<p>Generated: ${new Date().toLocaleString()}</p>
<h2>Overall Statistics</h2>
<table border="1" cellpadding="10">
<tr><td>Total Registrations</td><td>${summary.totalRegistrations}</td></tr>
<tr><td>Active Users</td><td>${summary.activeUsers}</td></tr>
<tr><td>Inactive Users</td><td>${summary.inactiveUsers}</td></tr>
<tr><td>Suspended Users</td><td>${summary.suspendedUsers}</td></tr>
</table>
<h2>Gender Distribution</h2>
<table border="1" cellpadding="10">
<tr><td>Male</td><td>${summary.genderDistribution.male}</td></tr>
<tr><td>Female</td><td>${summary.genderDistribution.female}</td></tr>
<tr><td>Other</td><td>${summary.genderDistribution.other}</td></tr>
</table>
</body>
</html>
        `;
        
        downloadFile(wordContent, 'summary_report.doc', 'application/msword');
        alert('Summary report generated in Word format!');
    }
});

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

document.getElementById('generateDateReport').addEventListener('click', function() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    
    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }
    
    const filtered = registrationData.filter(reg => {
        const regDate = new Date(reg.timestamp).toISOString().split('T')[0];
        return regDate >= startDate && regDate <= endDate;
    });
    
    alert(`Found ${filtered.length} registrations between ${startDate} and ${endDate}`);
    downloadJSON(filtered, 'date_range_report.json');
});

// Add New Registration
document.getElementById('addNewBtn').addEventListener('click', function() {
    window.location.href = 'index.html';
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear session
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('loginTime');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
});

// Update Date/Time
function updateDateTime() {
    const now = new Date();
    const dateTimeStr = now.toLocaleString();
    document.getElementById('currentDateTime').textContent = dateTimeStr;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// Populate state filter dropdown
function populateStateFilter() {
    const stateFilter = document.getElementById('filterState');
    const states = [...new Set(registrationData.map(r => r.state))].sort();
    
    // Add all Indian states
    const allStates = ["Andaman and Nicobar Islands","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chandigarh","Chhattisgarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jammu and Kashmir","Jharkhand","Karnataka","Kerala","Ladakh","Lakshadweep","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"];
    
    allStates.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateFilter.appendChild(option);
    });
}

// Logs functions
function exportLogs() {
    alert('Exporting logs... Feature in development');
}

function filterLogs() {
    const filter = document.getElementById('logFilter').value;
    const startDate = document.getElementById('logStartDate').value;
    const endDate = document.getElementById('logEndDate').value;
    
    alert(`Filtering logs:\nType: ${filter}\nStart: ${startDate}\nEnd: ${endDate}`);
    
    // Populate sample logs
    const logsBody = document.getElementById('logsTableBody');
    logsBody.innerHTML = `
        <tr>
            <td>${new Date().toLocaleString()}</td>
            <td>User Created</td>
            <td>Admin</td>
            <td>New registration added</td>
            <td>192.168.1.1</td>
        </tr>
        <tr>
            <td>${new Date(Date.now() - 3600000).toLocaleString()}</td>
            <td>Data Exported</td>
            <td>Admin</td>
            <td>Exported registrations to CSV</td>
            <td>192.168.1.1</td>
        </tr>
        <tr>
            <td>${new Date(Date.now() - 7200000).toLocaleString()}</td>
            <td>User Updated</td>
            <td>Admin</td>
            <td>Updated user status</td>
            <td>192.168.1.1</td>
        </tr>
    `;
}

// Initialize logs on page load
setTimeout(() => {
    filterLogs();
}, 1000);

// Initialize Dashboard
loadData();
populateStateFilter();