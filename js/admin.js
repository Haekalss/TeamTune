// Constants for local storage keys
const LOCAL_STORAGE = {
    USERS: 'teamtune_users',
    MOODS: 'teamtune_moods',
    NOTES: 'teamtune_notes',
    CURRENT_USER: 'teamtune_current_user'
};

// Current admin user object
let CURRENT_ADMIN = null;

// Check authentication status and admin role
function checkAuth() {
    const currentUserData = localStorage.getItem(LOCAL_STORAGE.CURRENT_USER);
    if (!currentUserData) {
        // User is not logged in, redirect to login page
        window.location.href = 'login.html';
        return false;
    }

    // Parse the current user data
    CURRENT_ADMIN = JSON.parse(currentUserData);

    // Check if the user has admin role
    if (CURRENT_ADMIN.role !== 'admin') {
        alert('You do not have permission to access the admin dashboard.');
        window.location.href = 'user-dashboard.html';
        return false;
    }

    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;

    document.getElementById('adminName').textContent = CURRENT_ADMIN.name;
    addLogoutButton();
    loadTeamMoodStats();
    loadAnonymousNotes();
    updateWeeklyReflection();
    loadTeamList();

    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const contentSections = document.querySelectorAll('.content-section');

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            contentSections.forEach(section => section.classList.remove('active-section'));
            const targetId = item.dataset.target;
            document.getElementById(targetId).classList.add('active-section');

            if (targetId === 'statisticMoodTimSection') {
                let chartStatus = Chart.getChart("teamMoodAdminChart");
                if (chartStatus != undefined) chartStatus.destroy();
                loadTeamMoodStats();
            }
            if (targetId === 'anonymousNotesSection') {
                loadAnonymousNotes();
            }
            if (targetId === 'teamListSection') {
                loadTeamList();
            }
        });
    });
});

function logout() {
    localStorage.removeItem(LOCAL_STORAGE.CURRENT_USER);
    window.location.href = 'login.html';
}

function addLogoutButton() {
    const navbar = document.querySelector('.navbar-user');
    if (!navbar.querySelector('.logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.classList.add('logout-btn');
        logoutBtn.addEventListener('click', logout);
        navbar.appendChild(logoutBtn);
    }
}

function updateWeeklyReflection() {
    const allMoods = JSON.parse(localStorage.getItem(LOCAL_STORAGE.MOODS)) || [];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentMoods = allMoods.filter(mood => new Date(mood.timestamp) >= oneWeekAgo);
    const reflectionContent = document.getElementById('weeklyReflectionContent');

    if (recentMoods.length === 0) {
        reflectionContent.innerHTML = `
            <h3>Laporan Mingguan Tim: Belum Ada Data</h3>
            <p>Belum ada data mood yang tercatat dalam minggu ini. Dorong anggota tim untuk melakukan check-in mood mereka.</p>
            <p>Rekomendasi: Ingatkan tim untuk secara rutin melakukan check-in mood untuk mendapatkan insight yang lebih akurat.</p>
        `;
        return;
    }

    const moodCounts = { happy: 0, neutral: 0, sad: 0, angry: 0, stressed: 0 };
    recentMoods.forEach(mood => { if (moodCounts[mood.moodValue] !== undefined) moodCounts[mood.moodValue]++; });

    const total = Object.values(moodCounts).reduce((a, b) => a + b, 0);
    const negative = moodCounts.sad + moodCounts.angry + moodCounts.stressed;
    const percent = (negative / total) * 100;

    let html = '';
    if (percent >= 50) {
        html = `
            <h3>Laporan Mingguan Tim: Perhatian Diperlukan</h3>
            <p>Mood tim minggu ini cenderung negatif (${percent.toFixed(1)}% negatif)...</p>
            <p>Rekomendasi refleksi: Segera adakan diskusi terbuka...</p>
        `;
    } else if (percent >= 25) {
        html = `
            <h3>Laporan Mingguan Tim: Perhatian Ringan</h3>
            <p>Mood tim minggu ini campuran, dengan ${percent.toFixed(1)}% mood negatif...</p>
            <p>Rekomendasi refleksi: Diskusikan potensi penyebab ketidaknyamanan...</p>
        `;
    } else {
        html = `
            <h3>Laporan Mingguan Tim: Positif</h3>
            <p>Mood tim minggu ini sangat positif, dengan hanya ${percent.toFixed(1)}% mood negatif...</p>
            <p>Rekomendasi refleksi: Pertahankan momentum positif ini...</p>
        `;
    }

    reflectionContent.innerHTML = html;
}

function loadTeamMoodStats() {
    const allMoods = JSON.parse(localStorage.getItem(LOCAL_STORAGE.MOODS)) || [];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const moodCounts = { happy: 0, neutral: 0, sad: 0, angry: 0, stressed: 0 };
    allMoods.forEach(mood => {
        const moodDate = new Date(mood.timestamp);
        if (moodDate >= oneWeekAgo && moodCounts[mood.moodValue] !== undefined) moodCounts[mood.moodValue]++;
    });
    const data = [moodCounts.happy, moodCounts.neutral, moodCounts.sad, moodCounts.angry, moodCounts.stressed];
    renderTeamMoodChart('teamMoodAdminChart', data);
}

function loadAnonymousNotes() {
    const list = document.getElementById('anonymousNotesList');
    list.innerHTML = '';
    const notes = JSON.parse(localStorage.getItem(LOCAL_STORAGE.NOTES)) || [];
    if (notes.length === 0) {
        list.innerHTML = '<li>Belum ada catatan anonim.</li>';
        return;
    }
    notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).forEach(note => {
        const item = document.createElement('li');
        const date = new Date(note.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
        item.innerHTML = `<strong>${date}:</strong> ${note.message}`;
        list.appendChild(item);
    });
}

function loadTeamList() {
    const users = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USERS)) || [];
    const container = document.getElementById('teamListContent');
    container.innerHTML = '';
    if (users.length === 0) {
        container.innerHTML = '<p>Tidak ada data pengguna ditemukan.</p>';
        return;
    }
    const grouped = {};
    users.forEach(user => {
        const team = user.teamId || 'Tanpa Tim';
        if (!grouped[team]) grouped[team] = [];
        grouped[team].push(user);
    });
    for (const [teamName, members] of Object.entries(grouped)) {
        const section = document.createElement('div');
        section.classList.add('team-section');
        section.innerHTML = `<h3>${teamName}</h3><ul>${members.map(u => `<li>${u.name} (${u.email})</li>`).join('')}</ul>`;
        container.appendChild(section);
    }
}

function renderTeamMoodChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['😊 Happy', '😐 Neutral', '😞 Sad', '😠 Angry', '😩 Stressed'],
            datasets: [{
                label: 'Jumlah Anggota',
                data: data,
                backgroundColor: [
                    'rgba(74, 144, 226, 0.8)',
                    'rgba(108, 117, 125, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(220, 53, 69, 0.8)',
                    'rgba(253, 126, 20, 0.8)'
                ],
                borderColor: [
                    '#4A90E2',
                    '#6C757D',
                    '#FFC107',
                    '#DC3545',
                    '#FD7E14'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, color: 'var(--secondary-color)' },
                    grid: { color: '#E0E6F0' }
                },
                x: {
                    ticks: { color: 'var(--secondary-color)' },
                    grid: { display: false }
                }
            },
            plugins: { legend: { display: false } }
        }
    });
}
