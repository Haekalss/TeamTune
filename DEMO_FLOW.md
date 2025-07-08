# 🎯 Demo Flow TeamTune - Team Leader Features

## **Scenario Testing Flow:**

### **1. User Membuat Tim Baru**
```
👤 User "Joko" login → Dashboard
📝 Klik "Buat Tim" → Input nama tim "Development Team"
🎯 Tim berhasil dibuat → Joko otomatis jadi Team Leader
👑 Dashboard berubah: Badge "Anda adalah Team Leader"
📊 Team Mood Meter: Chart kosong (0,0,0,0,0)
💬 Smart Feedback: "Tim baru dengan 1 anggota. Mulai lakukan mood check-in..."
```

### **2. Team Leader Akses Khusus**
```
🎛️ UI Team Leader (4 tombol):
   [Kelola Anggota] [Detail Mood Tim] [Kirim Pengumuman] [Keluar dari Tim]

📢 Klik "Kirim Pengumuman":
   → Prompt muncul
   → Input: "Selamat datang di tim Development!"
   → Save ke localStorage dengan teamId
   → Muncul di tab "Tim Announcements"
```

### **3. User Lain Join Tim**
```
👤 User "Ani" login → Dashboard  
🔗 Klik "Gabung Tim" → Input kode tim
✅ Berhasil join → Jadi member biasa
📱 UI Member (1 tombol saja):
   [Keluar dari Tim]
🚫 Tidak ada akses kirim announcement
```

### **4. Mood Check-In Berdasarkan Tim**
```
😊 Joko submit mood "Happy" + comment
😐 Ani submit mood "Neutral" + comment

📊 Team Mood Meter Update:
   - Happy: 1 (dari Joko)
   - Neutral: 1 (dari Ani)
   - Sad, Angry, Stressed: 0

🔒 Privacy:
   - Joko (Leader): Bisa lihat detail siapa submit apa
   - Ani (Member): Hanya lihat agregat chart
```

### **5. Team Leadership Actions**
```
👑 Joko sebagai Leader bisa:

📋 "Kelola Anggota":
   → Modal popup list: Joko (email) 👑, Ani (email)

📊 "Detail Mood Tim":
   → Joko: 1 entries, mood terakhir 😊 "comment..."
   → Ani: 1 entries, mood terakhir 😐 "comment..."

📢 "Kirim Pengumuman":
   → "Meeting besok jam 2 siang"
   → Semua anggota bisa baca di tab announcements
```

## **🔍 Verifikasi Data Terpisah Per Tim:**

### **Tim A: "Development Team"**
- Leader: Joko 👑
- Members: Joko, Ani
- Mood Data: Hanya dari Joko & Ani
- Announcements: Hanya untuk tim ini

### **Tim B: "Marketing Team"** 
- Leader: Budi 👑  
- Members: Budi, Citra
- Mood Data: Hanya dari Budi & Citra
- Announcements: Terpisah dari Tim A

### **User Tanpa Tim: "Doni"**
- Dashboard: Tombol "Buat Tim" & "Gabung Tim"
- Mood Meter: Pesan "belum bergabung dalam tim"
- Announcements: Kosong

---

## **✅ Semua Sudah Sesuai Permintaan:**

✅ **Team Leader punya akses bikin announcement**
✅ **Team mood meter berdasarkan tim saja (tidak tercampur)**  
✅ **User yang buat tim otomatis jadi leader**
✅ **Member biasa tidak bisa bikin announcement**
✅ **Data terpisah per tim dengan privacy protection**

**Aplikasi siap digunakan! 🚀**

*Note: Admin dashboard sudah ada tapi kita skip dulu seperti permintaan Anda.*
