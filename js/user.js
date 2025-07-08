// Constants for local storage keys
const LOCAL_STORAGE = {
    USERS: 'teamtune_users',
    MOODS: 'teamtune_moods',
    NOTES: 'teamtune_notes',
    CURRENT_USER: 'teamtune_current_user'
};

// Variabel untuk menyimpan data saat ini
let CURRENT_USER = null;
let selectedMood = '';

// Inisialisasi data dummy jika belum ada
function initializeLocalData() {
    // Initialize users if not exist
    if (!localStorage.getItem(LOCAL_STORAGE.USERS)) {
        const dummyUsers = [
            { id: '1', name: 'Joko Anwar', email: 'tim@naruto.com', password: 'password123', role: 'user' },
            { id: '2', name: 'Admin Fasilitator', email: 'admin@teamtune.com', password: 'admin123', role: 'admin' }
        ];
        localStorage.setItem(LOCAL_STORAGE.USERS, JSON.stringify(dummyUsers));
    }

    // Initialize moods if not exist
    if (!localStorage.getItem(LOCAL_STORAGE.MOODS)) {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const twoDaysAgo = new Date(today);
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
        
        const dummyMoods = [
            { id: '1', userId: '1', moodValue: 'happy', comment: 'Hari ini terasa produktif sekali.', timestamp: today.toISOString() },
            { id: '2', userId: '1', moodValue: 'neutral', comment: 'Cukup sibuk tapi bisa diatasi.', timestamp: yesterday.toISOString() },
            { id: '3', userId: '1', moodValue: 'sad', comment: 'Sedikit frustasi dengan bug di kode.', timestamp: twoDaysAgo.toISOString() }
        ];
        localStorage.setItem(LOCAL_STORAGE.MOODS, JSON.stringify(dummyMoods));
    }

    // Initialize notes if not exist
    if (!localStorage.getItem(LOCAL_STORAGE.NOTES)) {
        localStorage.setItem(LOCAL_STORAGE.NOTES, JSON.stringify([]));
    }
}

// Check authentication status
function checkAuth() {
    const currentUserData = localStorage.getItem(LOCAL_STORAGE.CURRENT_USER);
    if (!currentUserData) {
        // User is not logged in, redirect to login page
        window.location.href = 'login.html';
        return false;
    }
    
    // Parse the current user data
    CURRENT_USER = JSON.parse(currentUserData);
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize local data
    initializeLocalData();
    
    // Check if user is authenticated
    if (!checkAuth()) {
        return; // Stop execution if not authenticated
    }
    
    // Display username
    document.getElementById('userName').textContent = CURRENT_USER.name;
    
    // Add logout button
    addLogoutButton();// Mood Check-in: Tambahkan event listeners ke emojis
    const emojis = document.querySelectorAll('.emoji');
    emojis.forEach(emoji => {
        emoji.addEventListener('click', () => {
            emojis.forEach(e => e.classList.remove('selected'));
            emoji.classList.add('selected');
            selectedMood = emoji.dataset.mood;
            console.log('Selected Mood:', selectedMood);
        });
    });

    // Inisialisasi awal TeamMood Meter dan Smart Feedback
    loadTeamMoodDataForUserView(); // Memuat data untuk chart dan feedback    // Logika navigasi sidebar
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
            if (targetId === 'teamMoodMeterSection' || targetId === 'smartFeedbackSection') {
                loadTeamMoodDataForUserView(); // Muat ulang data untuk chart dan feedback
            }
            if (targetId === 'personalReflectionSection') {
                loadPersonalMoodComments(); // Muat dari local storage
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
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.classList.add('logout-btn');
    logoutBtn.addEventListener('click', logout);
    navbar.appendChild(logoutBtn);
}

function submitMood() {
    const comment = document.getElementById('moodComment').value.trim();
    
    if (selectedMood) {
        // Get existing moods from local storage
        const moods = JSON.parse(localStorage.getItem(LOCAL_STORAGE.MOODS)) || [];
        
        // Create a new mood entry
        const newMood = {
            id: Date.now().toString(), // Use timestamp as ID
            userId: CURRENT_USER.id,
            moodValue: selectedMood,
            comment: comment,
            timestamp: new Date().toISOString()
        };
        
        // Add the new mood to the array
        moods.unshift(newMood); // Add to beginning for easier sorting
        
        // Save back to local storage
        localStorage.setItem(LOCAL_STORAGE.MOODS, JSON.stringify(moods));
        
        alert('Mood submitted successfully!');
        
        // Reset UI setelah submit
        document.querySelectorAll('.emoji').forEach(e => e.classList.remove('selected'));
        document.getElementById('moodComment').value = '';
        selectedMood = '';
        
        // --- PENTING: Perbarui tampilan setelah mood disubmit ---
        loadTeamMoodDataForUserView(); // Perbarui chart dan smart feedback
        loadPersonalMoodComments(); // Perbarui riwayat komentar mood
        // --- END PENTING ---
    } else {
        alert('Please select your mood before submitting.');
    }
}

function loadPersonalMoodComments() {
    const moodCommentHistoryList = document.getElementById('moodCommentHistory');
    moodCommentHistoryList.innerHTML = '';

    // Get moods from local storage
    const allMoods = JSON.parse(localStorage.getItem(LOCAL_STORAGE.MOODS)) || [];
    
    // Filter moods for current user with comments
    const userMoods = allMoods.filter(mood => 
        mood.userId === CURRENT_USER.id && 
        mood.comment && 
        mood.comment.length > 0
    );

    if (userMoods.length === 0) {
        moodCommentHistoryList.innerHTML = '<li>Belum ada riwayat komentar mood yang tercatat.</li>';
        return;
    }

    // Sort by timestamp (most recent first) and get top 5
    const recentMoods = userMoods
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    recentMoods.forEach(entry => {
        const listItem = document.createElement('li');
        const moodEmoji = getEmojiSymbol(entry.moodValue);
        const date = new Date(entry.timestamp).toLocaleDateString('id-ID', { 
            year: 'numeric', month: '2-digit', day: '2-digit' 
        });
        listItem.innerHTML = `<strong>${date} (${moodEmoji}):</strong> ${entry.comment}`;
        moodCommentHistoryList.appendChild(listItem);
    });
}

// Helper function to get emoji symbol for a mood value
function getEmojiSymbol(mood) {
    const emojiMap = {
        'happy': '😊',
        'neutral': '😐',
        'sad': '😞',
        'angry': '😠',
        'stressed': '😩'
    };
    return emojiMap[mood] || '❓';
}

function submitAnonymousNote() {
    const noteText = document.getElementById('anonymousNoteText').value.trim();
    
    if (noteText) {
        // Get existing notes from local storage
        const notes = JSON.parse(localStorage.getItem(LOCAL_STORAGE.NOTES)) || [];
        
        // Create a new note entry
        const newNote = {
            id: Date.now().toString(), // Use timestamp as ID
            userId: CURRENT_USER.id, // We store this but don't show it to maintain "anonymity"
            teamId: "team-1", // Dummy team ID
            message: noteText,
            timestamp: new Date().toISOString()
        };
        
        // Add the new note to the array
        notes.unshift(newNote); // Add to beginning for easier sorting
        
        // Save back to local storage
        localStorage.setItem(LOCAL_STORAGE.NOTES, JSON.stringify(notes));
        
        alert('Anonymous note submitted successfully!');
        document.getElementById('anonymousNoteText').value = '';
    } else {
        alert('Please write a note before submitting.');
    }
}


// ----------- Fungsi untuk TeamMood Meter dan Smart Feedback (User View) -----------

// Mengambil data mood agregat tim dari local storage untuk chart dan smart feedback
function loadTeamMoodDataForUserView() {
    // Check if user has a team
    if (!CURRENT_USER.teamId) {
        // No team - show message
        const feedbackTextElement = document.getElementById('smartFeedbackText');
        if (feedbackTextElement) {
            feedbackTextElement.textContent = 'Anda belum bergabung dalam tim. Bergabunglah dalam tim untuk melihat mood meter dan mendapat feedback.';
        }
        return;
    }

    // Get all users and moods from local storage
    const allUsers = JSON.parse(localStorage.getItem(LOCAL_STORAGE.USERS)) || [];
    const allMoods = JSON.parse(localStorage.getItem(LOCAL_STORAGE.MOODS)) || [];
    
    // Get team members (users with same teamId)
    const teamMembers = allUsers.filter(user => user.teamId === CURRENT_USER.teamId);
    const teamMemberIds = teamMembers.map(member => member.id);
    
    // Count moods by type - only for team members
    const moodCounts = {
        happy: 0,
        neutral: 0,
        sad: 0, 
        angry: 0,
        stressed: 0
    };
    
    // Only count recent moods (last 7 days) from team members
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    allMoods.forEach(mood => {
        const moodDate = new Date(mood.timestamp);
        if (moodDate >= oneWeekAgo && 
            teamMemberIds.includes(mood.userId) && 
            moodCounts.hasOwnProperty(mood.moodValue)) {
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
    
    // Destroy existing chart before rendering a new one
    let chartStatus = Chart.getChart("teamMoodChart");
    if (chartStatus != undefined) {
        chartStatus.destroy();
    }
    
    // Always render chart, even with empty data
    renderTeamMoodChart('teamMoodChart', statsData);
    updateSmartFeedback(statsData, teamMembers.length);
}

// Logika untuk menampilkan smart feedback berdasarkan data mood tim
function updateSmartFeedback(moodStats, teamSize = 0) {
    const feedbackTextElement = document.getElementById('smartFeedbackText');
    const [happy, neutral, sad, angry, stressed] = moodStats;
    const totalMoods = happy + neutral + sad + angry + stressed;

    if (totalMoods === 0) {
        if (teamSize === 1) {
            feedbackTextElement.textContent = `Tim baru dengan 1 anggota. Mulai lakukan mood check-in dan ajak anggota lain untuk bergabung!`;
        } else if (teamSize > 1) {
            feedbackTextElement.textContent = `Tim memiliki ${teamSize} anggota tetapi belum ada mood check-in dalam 7 hari terakhir. Ajak anggota tim untuk mulai melakukan mood check-in!`;
        } else {
            feedbackTextElement.textContent = `Belum ada data mood tim yang cukup untuk memberikan feedback.`;
        }
        feedbackTextElement.style.borderLeftColor = '#6c757d';
        feedbackTextElement.style.backgroundColor = '#f8f9fa';
        feedbackTextElement.style.color = '#495057';
        return;
    }

    // Hitung persentase mood negatif
    const negativeMoods = sad + angry + stressed;
    const negativePercentage = (negativeMoods / totalMoods) * 100;

    let feedbackMessage = '';
    let feedbackColor = 'var(--success-color)'; // Default warna hijau
    let feedbackBgColor = '#EBF9F1'; // Default background hijau muda
    let feedbackTextColor = '#1E7C3B'; // Default teks hijau gelap

    if (negativePercentage >= 50) {
        feedbackMessage = `Suasana tim terlihat sangat tegang atau tidak harmonis (${Math.round(negativePercentage)}% mood negatif). Segera adakan diskusi terbuka untuk mencari solusi dan meningkatkan dukungan antar anggota.`;
        feedbackColor = 'var(--danger-color)';
        feedbackBgColor = '#FDEAEA';
        feedbackTextColor = '#A63F4B';
    } else if (negativePercentage >= 25) {
        feedbackMessage = `Terdeteksi adanya ketegangan atau ketidaknyamanan pada beberapa anggota tim (${Math.round(negativePercentage)}% mood negatif). Perlu perhatian khusus untuk menjaga keseimbangan kerja tim.`;
        feedbackColor = 'var(--warning-color)';
        feedbackBgColor = '#FFF8E1';
        feedbackTextColor = '#8D6E00';
    } else {
        feedbackMessage = `Mood tim secara keseluruhan positif dan produktif (${Math.round(100-negativePercentage)}% mood positif). Pertahankan suasana kolaborasi yang baik ini!`;
        feedbackColor = 'var(--success-color)';
        feedbackBgColor = '#EBF9F1';
        feedbackTextColor = '#1E7C3B';
    }

    if (teamSize > 0) {
        feedbackMessage += ` (Tim: ${teamSize} anggota, Data minggu ini: ${totalMoods} mood entries)`;
    }

    feedbackTextElement.textContent = feedbackMessage;
    feedbackTextElement.style.borderLeftColor = feedbackColor;
    feedbackTextElement.style.backgroundColor = feedbackBgColor;
    feedbackTextElement.style.color = feedbackTextColor;
}


// Fungsi untuk merender grafik mood tim
function renderTeamMoodChart(canvasId, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['😊 Happy', '😐 Neutral', '😞 Sad', '😠 Angry', '😩 Stressed'], // Label yang lebih deskriptif
            datasets: [{
                label: 'Jumlah Anggota', // Label yang lebih sesuai
                data: data, // Data yang akan ditampilkan di chart
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
document.addEventListener("DOMContentLoaded", () => {
    const currentUser = JSON.parse(localStorage.getItem("teamtune_current_user"));
    if (!currentUser) return;

    const teamInfoDiv = document.getElementById("userTeamInfo");
    const teams = JSON.parse(localStorage.getItem("teamtune_teams") || "[]");
    const userTeam = teams.find(t => t.id === currentUser.teamId);

    if (userTeam) {
        teamInfoDiv.innerHTML = `
            <p><strong>Nama Tim:</strong> ${userTeam.name}</p>
            <p><strong>Kode Tim:</strong> ${userTeam.code}</p>
        `;
    } else {
        teamInfoDiv.innerHTML = `<p>Anda belum tergabung dalam tim mana pun.</p>`;
    }
});