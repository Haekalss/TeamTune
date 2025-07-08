// File: js/join-team.js

// Event listener untuk form
document.addEventListener('DOMContentLoaded', function() {
    const joinTeamForm = document.getElementById('joinTeamForm');
    if (joinTeamForm) {
        joinTeamForm.addEventListener('submit', function(e) {
            e.preventDefault();
            joinTeam();
        });
    }
});

function joinTeam() {
    const code = document.getElementById('joinTeamCode').value.trim();

    if (!code) {
        alert("Kode tim wajib diisi.");
        return;
    }

    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    const foundTeam = teams.find(t => t.code === code);

    if (!foundTeam) {
        alert("Tim dengan kode tersebut tidak ditemukan.");
        return;
    }

    const user = JSON.parse(localStorage.getItem('teamtune_current_user'));
    if (user) {
        const allUsers = JSON.parse(localStorage.getItem('teamtune_users') || '[]');
        const userIndex = allUsers.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
            allUsers[userIndex].teamId = foundTeam.id;
            user.teamId = foundTeam.id;
            
            localStorage.setItem('teamtune_users', JSON.stringify(allUsers));
            localStorage.setItem('teamtune_current_user', JSON.stringify(user));
        }
    }

    alert("Berhasil bergabung ke tim!");
    window.location.href = 'user-dashboard.html';
}
