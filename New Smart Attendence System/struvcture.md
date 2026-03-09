smart-attendance-system/
│
├── index.html                 # landing page (choose login type)
│
├── auth/
│   ├── login.html             # login page (teacher/student)
│   ├── register.html          # optional signup
│   └── auth.js                # login logic
│
├── teacher/
│   ├── dashboard.html         # main teacher dashboard
│   ├── session.html           # start QR attendance session
│   └── history.html           # attendance history page
│
├── student/
│   ├── dashboard.html         # student home
│   ├── scan.html              # QR scanner page
│   └── attendance.html        # student's attendance records
│
├── css/
│   ├── global.css             # common styles
│   ├── dashboard.css          # dashboard layout
│   ├── auth.css               # login page styling
│   └── tables.css             # table styling
│
├── js/
│   ├── auth.js                # login/logout logic
│   ├── auth-check.js          # protect pages
│   │
│   ├── teacher-dashboard.js   # teacher dashboard logic
│   ├── student-dashboard.js   # student dashboard logic
│   │
│   ├── attendance-manager.js  # attendance handling
│   ├── session-manager.js     # start/stop session
│   │
│   ├── qr-generator.js        # generate QR codes
│   └── qr-scanner.js          # scan QR codes
│
├── data/                      # mock database
│   ├── teachers.json
│   ├── students.json
│   ├── classes.json
│   └── attendance.json
│
├── libs/                      # external libraries
│   ├── qrcode.min.js
│   └── html5-qrcode.min.js
│
├── assets/
│   ├── icons/
│   ├── images/
│   └── logo.png
│
└── README.md