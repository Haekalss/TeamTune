# TeamTune - Enhanced Features Documentation

## 🎯 **Team-Based Mood Meter**

### User Dashboard:
- **Mood meter hanya menampilkan data dari anggota tim yang sama**
- **Smart feedback disesuaikan dengan ukuran tim dan data tim**
- **Jika user belum punya tim, akan muncul pesan untuk bergabung**

### Fitur:
- Filter mood berdasarkan teamId
- Persentase mood dengan konteks jumlah anggota
- Feedback yang lebih akurat berdasarkan data tim

---

## 👨‍💼 **Admin Dashboard - All Teams View**

### Fitur Baru:
1. **Team Selector Dropdown**
   - Bisa pilih "Semua Tim (Gabungan)"
   - Bisa pilih tim spesifik untuk analisis detail

2. **Enhanced Mood Chart**
   - Chart per tim atau gabungan semua tim
   - Data 7 hari terakhir

3. **Team Mood Summary**
   - Alert level: ✅ KONDISI BAIK / ⚠️ PANTAU TERUS / 🚨 PERLU PERHATIAN KHUSUS
   - Breakdown persentase setiap mood
   - Jumlah anggota dan total mood entries

4. **Improved Team List**
   - Styling yang lebih baik
   - Info anggota per tim
   - Status "Belum ada anggota" untuk tim kosong

---

## 👑 **Team Leader Privileges**

### Saat Create Team:
- **User yang membuat tim otomatis menjadi Team Leader**
- Role berubah dari 'user' → 'team_leader'
- Team.leaderId = user.id

### Fitur Khusus Team Leader:

#### 1. **👑 Status Badge**
- Badge "Anda adalah Team Leader" di dashboard
- Icon crown (👑) di member list

#### 2. **👥 Kelola Anggota**
- Modal pop-up list semua anggota tim
- Indikator leader dengan crown icon
- Info email dan nama lengkap

#### 3. **📊 Detail Mood Tim**
- Modal dengan breakdown mood per anggota
- Data 7 hari terakhir per individu
- Mood terakhir + comment untuk setiap anggota
- Insight mendalam tentang kondisi tim

#### 4. **📢 Kirim Pengumuman**
- Prompt untuk menulis pengumuman
- Tersimpan di localStorage 'team_announcements'
- Visible untuk semua anggota tim

#### 5. **📋 Enhanced Action Buttons**
```
[Kelola Anggota] [Detail Mood Tim] [Kirim Pengumuman] [Keluar dari Tim]
```

### Regular Members:
```
[Keluar dari Tim]
```

---

## 📢 **Team Announcements System**

### Fitur:
1. **Sidebar Menu Baru**: "Tim Announcements"
2. **Team Leader dapat:**
   - Menulis dan mengirim pengumuman
   - Pengumuman otomatis ter-tag dengan nama dan timestamp

3. **All Team Members dapat:**
   - Melihat semua pengumuman tim
   - Diurutkan dari yang terbaru
   - Format: Author + Timestamp + Message

4. **Data Structure:**
```javascript
{
  id: timestamp,
  teamId: string,
  message: string,
  author: string,
  timestamp: ISO string
}
```

---

## 🔒 **Role-Based Access Control**

### Roles:
1. **'user'** - Regular team member
2. **'team_leader'** - Team creator with special privileges  
3. **'admin'** - System administrator

### Permission Matrix:
| Feature | User | Team Leader | Admin |
|---------|------|-------------|-------|
| View own team mood | ✅ | ✅ | ✅ |
| Submit mood | ✅ | ✅ | ✅ |
| View team member list | ❌ | ✅ | ✅ |
| View individual mood details | ❌ | ✅ | ✅ |
| Send team announcements | ❌ | ✅ | ❌ |
| View all teams | ❌ | ❌ | ✅ |
| Access admin dashboard | ❌ | ❌ | ✅ |

---

## 💾 **Data Structure Updates**

### Teams:
```javascript
{
  id: string,
  name: string,
  code: string,
  members: array,
  leaderId: string,      // NEW
  createdAt: string      // NEW
}
```

### Users:
```javascript
{
  id: string,
  name: string,
  email: string,
  password: string,
  role: 'user' | 'team_leader' | 'admin',  // ENHANCED
  teamId: string
}
```

### Announcements (NEW):
```javascript
{
  id: string,
  teamId: string,
  message: string,
  author: string,
  timestamp: string
}
```

---

## 🚀 **User Experience Flow**

### Team Creation:
1. User creates team → Becomes team leader
2. Gets enhanced dashboard with leader features
3. Can invite others using team code
4. Can manage team and send announcements

### Team Joining:
1. User joins with team code → Becomes regular member
2. Gets access to team mood meter
3. Can view team announcements
4. Basic team features only

### Team Management:
1. Leader can monitor individual mood patterns
2. Leader can send motivational announcements
3. Leader has visibility into team dynamics
4. Admin can monitor all teams system-wide

## 🎯 **Business Value**

1. **Better Team Insights**: Team-based mood filtering
2. **Leadership Tools**: Special privileges for team creators
3. **Communication**: Team announcement system  
4. **Scalability**: Admin can monitor multiple teams
5. **Engagement**: Role-based features encourage participation
