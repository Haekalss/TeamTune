// File: js/create-team.js

// Event listener untuk form
document.addEventListener('DOMContentLoaded', function() {
    const createTeamForm = document.getElementById('createTeamForm');
    if (createTeamForm) {
        createTeamForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createTeam();
        });
    }
});

function createTeam() {
    const name = document.getElementById('teamName').value.trim();
    const code = document.getElementById('teamCode').value.trim();

    if (!name || !code) {
        alert("Nama dan kode tim wajib diisi.");
        return;
    }

    const teams = JSON.parse(localStorage.getItem('teams') || '[]');

    if (teams.some(t => t.code === code)) {
        alert("Kode tim sudah digunakan.");
        return;
    }

    const newTeam = {
        id: 'team-' + Date.now(),
        name,
        code,
        members: [],
        leaderId: null,
        createdAt: new Date().toISOString()
    };

    teams.push(newTeam);
    localStorage.setItem('teams', JSON.stringify(teams));

    const user = JSON.parse(localStorage.getItem('teamtune_current_user'));
    if (user) {
        // Set team leader FIRST before saving team
        newTeam.leaderId = user.id;
        
        teams.push(newTeam);
        localStorage.setItem('teams', JSON.stringify(teams));
        
        const allUsers = JSON.parse(localStorage.getItem('teamtune_users') || '[]');
        const userIndex = allUsers.findIndex(u => u.id === user.id);
        
        if (userIndex !== -1) {
            // Set user as team leader
            allUsers[userIndex].teamId = newTeam.id;
            allUsers[userIndex].role = 'team_leader'; // Upgrade role to team leader
            user.teamId = newTeam.id;
            user.role = 'team_leader';
            
            localStorage.setItem('teamtune_users', JSON.stringify(allUsers));
            localStorage.setItem('teamtune_current_user', JSON.stringify(user));
            
            console.log('✅ Team created with leader:', {
                teamId: newTeam.id,
                leaderId: newTeam.leaderId,
                userRole: user.role
            });
        }
    }

    alert("Tim berhasil dibuat!");
    window.location.href = 'user-dashboard.html';
}
