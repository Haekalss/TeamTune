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
    // Check if user is authenticated and is admin
    if (!checkAuth()) {
        return; // Stop execution if not authenticated or not admin
    }
    
    // Display admin name
    document.getElementById('adminName').textContent = CURRENT_ADMIN.name;    // Add logout button
    addLogoutButton();
    
    // Load data for charts and anonymous notes
    loadTeamMoodStats();
    loadAnonymousNotes();
    
    // Update weekly reflection
    updateWeeklyReflection();

    // Logika navigasi sidebar
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const contentSections = document.querySelectorAll('.content-section');

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            contentSections.forEach(section => section.classList.remove('active-section'));
            const targetId = item.dataset.target;
            document.getElementById(targetId).classList.add('active-section');

            // Muat ulang data saat section diaktifkan
            if (targetId === 'statisticMoodTimSection') {
                let chartStatus = Chart.getChart("teamMoodAdminChart");
                if (chartStatus != undefined) {
                  chartStatus.destroy();
                }
                loadTeamMoodStats(); // Muat ulang data chart
            }
            if (targetId === 'anonymousNotesSection') {
                loadAnonymousNotes(); // Muat ulang catatan anonim
            }
        });
    });
});

// Function to log out the current user
function logout() {
    localStorage.removeItem(LOCAL_STORAGE.CURRENT_USER);
    window.location.href = 'login.html';
}

// Add a logout button to the navbar
function addLogoutButton() {
    const navbar = document.querySelector('.navbar-user');
    // Check if logout button already exists
    if (!navbar.querySelector('.logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.textContent = 'Logout';
        logoutBtn.classList.add('logout-btn');
        logoutBtn.addEventListener('click', logout);
        navbar.appendChild(logoutBtn);
    }
}

// Function to update weekly reflection content
function updateWeeklyReflection() {
    // Get all moods from local storage
    const allMoods = JSON.parse(localStorage.getItem(LOCAL_STORAGE.MOODS)) || [];
    
    // Filter for the last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentMoods = allMoods.filter(mood => {
        const moodDate = new Date(mood.timestamp);
        return moodDate >= oneWeekAgo;
    });
    
    const reflectionContent = document.getElementById('weeklyReflectionContent');
    
    // If there are no moods in the last week
    if (recentMoods.length === 0) {
        reflectionContent.innerHTML = `
            <h3>Laporan Mingguan Tim: Belum Ada Data</h3>
            <p>Belum ada data mood yang tercatat dalam minggu ini. Dorong anggota tim untuk melakukan check-in mood mereka.</p>
            <p>Rekomendasi: Ingatkan tim untuk secara rutin melakukan check-in mood untuk mendapatkan insight yang lebih akurat.</p>
        `;
        return;
    }
    
    // Count moods by type
    const moodCounts = {
        happy: 0,
        neutral: 0,
        sad: 0, 
        angry: 0,
        stressed: 0
    };
    
    recentMoods.forEach(mood => {
        if (moodCounts.hasOwnProperty(mood.moodValue)) {
            moodCounts[mood.moodValue]++;
        }
    });
    
    // Calculate total and percentage
    const totalMoods = Object.values(moodCounts).reduce((a, b) => a + b, 0);
    const negativeMoods = moodCounts.sad + moodCounts.angry + moodCounts.stressed;
    const negativePercentage = (negativeMoods / totalMoods) * 100;
    
    let reflection = '';
    
    if (negativePercentage >= 50) {
        reflection = `
            <h3>Laporan Mingguan Tim: Perhatian Diperlukan</h3>
            <p>Mood tim minggu ini cenderung negatif (${negativePercentage.toFixed(1)}% negatif). Sebagian besar anggota tim melaporkan mood "sedih", "marah", atau "stres".</p>
            <p>Rekomendasi refleksi: Segera adakan diskusi terbuka untuk mengidentifikasi sumber ketegangan. Pertimbangkan untuk menerapkan langkah-langkah mengurangi tekanan kerja dan meningkatkan dukungan antar anggota tim.</p>
        `;
    } else if (negativePercentage >= 25) {
        reflection = `
            <h3>Laporan Mingguan Tim: Perhatian Ringan</h3>
            <p>Mood tim minggu ini campuran, dengan ${negativePercentage.toFixed(1)}% mood negatif. Terdeteksi beberapa ketegangan pada beberapa anggota tim.</p>
            <p>Rekomendasi refleksi: Diskusikan potensi penyebab ketidaknyamanan dalam tim. Berikan dukungan ekstra untuk anggota yang mungkin sedang mengalami kesulitan.</p>
        `;
    } else {
        reflection = `
            <h3>Laporan Mingguan Tim: Positif</h3>
            <p>Mood tim minggu ini sangat positif, dengan hanya ${negativePercentage.toFixed(1)}% mood negatif. Sebagian besar anggota tim melaporkan merasa "senang" atau "netral".</p>
            <p>Rekomendasi refleksi: Pertahankan momentum positif ini. Lanjutkan praktik-praktik yang telah berhasil, dan tetap perhatikan anggota tim yang masih memiliki mood negatif.</p>
        `;
    }
    
    reflectionContent.innerHTML = reflection;
}

// Fungsi untuk memuat statistik mood tim dari localStorage
function loadTeamMoodStats() {
    // Get all moods from local storage
    const allMoods = JSON.parse(localStorage.getItem(LOCAL_STORAGE.MOODS)) || [];
    
    // Count moods by type
    const moodCounts = {
        happy: 0,
        neutral: 0,
        sad: 0, 
        angry: 0,
        stressed: 0
    };
    
    // Only count recent moods (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    allMoods.forEach(mood => {
        const moodDate = new Date(mood.timestamp);
        if (moodDate >= oneWeekAgo && moodCounts.hasOwnProperty(mood.moodValue)) {
            moodCounts[mood.moodValue]++;
        }
    });
    
    // Convert to array format for the chart
    const statsData = [
        moodCounts.happy,
        moodCounts.neutral,
        moodCounts.sad,
        moodCounts.angry,
        moodCounts.stressed
    ];
    
    // Render chart with data
    renderTeamMoodChart('teamMoodAdminChart', statsData);
}

// Fungsi untuk memuat catatan anonim dari localStorage
function loadAnonymousNotes() {
    const anonymousNotesList = document.getElementById('anonymousNotesList');
    anonymousNotesList.innerHTML = '';

    // Get notes from local storage
    const allNotes = JSON.parse(localStorage.getItem(LOCAL_STORAGE.NOTES)) || [];

    if (allNotes.length === 0) {
        anonymousNotesList.innerHTML = '<li>Belum ada catatan anonim.</li>';
        return;
    }

    // Sort by timestamp (most recent first)
    const sortedNotes = allNotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Display all notes
    sortedNotes.forEach(note => {
        const listItem = document.createElement('li');
        const date = new Date(note.timestamp).toLocaleDateString('id-ID', { 
            year: 'numeric', month: '2-digit', day: '2-digit' 
        });
        listItem.innerHTML = `<strong>${date}:</strong> ${note.message}`;
        anonymousNotesList.appendChild(listItem);
    });
}

// Fungsi untuk merender grafik mood tim (digunakan oleh user dan admin)
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
                    title: {
                        display: true,
                        text: 'Jumlah',
                        color: 'var(--text-dark)'
                    },
                    ticks: {
                        stepSize: 1,
                        color: 'var(--secondary-color)'
                    },
                    grid: {
                        color: '#E0E6F0'
                    }
                },
                x: {
                    ticks: {
                        color: 'var(--secondary-color)'
                    },
                    grid: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}