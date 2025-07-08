# TeamTune - Navigation Structure

## 📁 File Structure Overview

### **Root Files (Main Access Points)**
- `index.html` - **Main Landing Page** (Dashboard sebelum login)
- `login.html` - Login page
- `register.html` - Registration page
- `user-dashboard.html` - User dashboard (after login)
- `admin-dashboard.html` - Admin dashboard
- `create-team.html` - Create new team
- `join-team.html` - Join existing team
- `debug.html` - Debug localStorage data

### **Public Folder**
- `public/index.html` - Alternative landing page (same as root index.html)

## 🚀 **Landing Page Features (index.html)**

### **Header Navigation**
- **Logo & Brand:** TeamTune with logo
- **Nav Links:** Features, About sections
- **Auth Buttons:** 
  - Login → `login.html`
  - Sign Up → `register.html`
  - **Dynamic:** Shows user name + Dashboard/Logout if logged in

### **Hero Section**
- **Title:** "Track Your Team's Mood"
- **Description:** Platform overview
- **CTA Buttons:**
  - "Get Started Free" → `register.html`
  - "Login" → `login.html`

### **Features Section**
6 feature cards with icons:
1. **Daily Mood Check-ins** 😊
2. **Team Mood Analytics** 📊
3. **Smart Feedback** 💡
4. **Team Management** 👥
5. **Team Announcements** 📢
6. **Anonymous Feedback** 🕵️

### **Call-to-Action Section**
- Final push to register
- "Start Your Free Trial" button

### **Footer**
- Copyright information
- Built with ❤️ message

## 🎨 **Design Features**

### **Visual Elements**
- **Background:** Purple gradient (667eea → 764ba2)
- **Header:** Glass morphism with blur effect
- **Cards:** Hover animations (translateY effect)
- **Buttons:** Smooth transitions with hover effects
- **Typography:** Poppins font family

### **Responsive Design**
- Mobile-friendly navigation
- Collapsible nav menu on mobile
- Responsive grid layouts
- Optimal viewing on all devices

### **Interactive Features**
- **Smooth scrolling** for anchor links
- **Auto-login detection** - shows different buttons if user already logged in
- **Scroll effects** on header background
- **Hover animations** on cards and buttons

## 🔄 **Navigation Flow**

```
Landing Page (index.html)
├── Login → login.html → user-dashboard.html
├── Register → register.html → user-dashboard.html
└── If logged in → Shows "Dashboard" button → user-dashboard.html
```

### **User Journey**
1. **New User:**
   - Landing page → Sign Up → Register → Dashboard
   
2. **Returning User:**
   - Landing page → Login → Dashboard
   
3. **Already Logged In:**
   - Landing page shows personalized header → Direct access to Dashboard

## 📱 **Mobile Optimization**

- **Responsive navigation** - nav links hidden on mobile
- **Touch-friendly buttons** - adequate spacing and sizing
- **Optimized text sizes** - readable on small screens
- **Flexible layouts** - grid systems adapt to screen size

## 🎯 **Key Benefits Highlighted**

1. **Easy Onboarding** - Clear CTAs and registration flow
2. **Professional Appearance** - Modern design with animations
3. **Feature Showcase** - Visual representation of platform capabilities
4. **User-Centric** - Personalized experience for logged-in users
5. **Brand Identity** - Consistent logo and color scheme

## 🔧 **Technical Features**

- **LocalStorage Integration** - Detects logged-in users
- **Smooth Animations** - CSS transitions and JavaScript effects
- **Font Awesome Icons** - Professional iconography
- **Google Fonts** - Poppins typography
- **Modern CSS** - Flexbox, Grid, and CSS3 features

---

**Ready to use!** 🚀 The landing page provides a professional first impression and seamless navigation to all platform features.
