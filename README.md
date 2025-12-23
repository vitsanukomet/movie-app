# 🎬 Movie App - AWS Cloud Architecture Project

โปรเจกต์เว็บดูหนังแบบ Full-Stack บน AWS Cloud พร้อมระบบ Auto Scaling และ Failover

## 📋 สารบัญ

- [ภาพรวมโปรเจกต์](#ภาพรวมโปรเจกต์)
- [สถาปัตยกรรมระบบ](#สถาปัตยกรรมระบบ)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [การติดตั้ง](#การติดตั้ง)
- [การ Deploy บน AWS](#การ-deploy-บน-aws)
- [API Documentation](#api-documentation)
- [Failover Case](#failover-case)

---

## 📖 ภาพรวมโปรเจกต์

**Movie App** เป็น Web Application 3 ชั้น (3-Tier Architecture) สำหรับดูหนังออนไลน์:

1. **Frontend** - React + Vite (SPA)
2. **Backend API** - Node.js + Express + JWT Authentication
3. **Database** - Amazon RDS (MySQL) with Multi-AZ

### ความสามารถหลัก:
- ✅ ผู้ใช้สามารถสมัครสมาชิก / เข้าสู่ระบบ
- ✅ ดูรายการหนังและเล่นหนัง
- ✅ Admin สามารถจัดการหนัง (CRUD)
- ✅ Auto Scaling รองรับ traffic สูง
- ✅ Multi-AZ Failover สำหรับ High Availability

---

## 🏗 สถาปัตยกรรมระบบ

```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                         AWS Cloud                            │
                    │                                                              │
    Internet        │   ┌──────────────────────────────────────────────────────┐  │
        │           │   │                    Public Subnets                     │  │
        ▼           │   │                                                       │  │
   ┌─────────┐      │   │  ┌─────────────────────────────────────────────────┐ │  │
   │  Users  │──────┼──▶│  │         Application Load Balancer (ALB)         │ │  │
   └─────────┘      │   │  │              (internet-facing)                   │ │  │
                    │   │  └─────────────────────┬───────────────────────────┘ │  │
                    │   │                        │                              │  │
                    │   │           ┌────────────┴────────────┐                │  │
                    │   │           ▼                         ▼                │  │
                    │   │   ┌──────────────┐          ┌──────────────┐         │  │
                    │   │   │   EC2 (AZ-A) │          │   EC2 (AZ-B) │         │  │
                    │   │   │   Node.js    │          │   Node.js    │         │  │
                    │   │   │   App Server │          │   App Server │         │  │
                    │   │   └──────┬───────┘          └──────┬───────┘         │  │
                    │   │          │    Auto Scaling Group   │                 │  │
                    │   └──────────┼─────────────────────────┼─────────────────┘  │
                    │              │                         │                    │
                    │   ┌──────────┼─────────────────────────┼─────────────────┐  │
                    │   │          │    Private Subnets      │                 │  │
                    │   │          ▼                         ▼                 │  │
                    │   │   ┌──────────────┐          ┌──────────────┐         │  │
                    │   │   │  RDS Primary │◀────────▶│  RDS Standby │         │  │
                    │   │   │   (AZ-A)     │  sync    │   (AZ-B)     │         │  │
                    │   │   │   MySQL      │  repl    │   MySQL      │         │  │
                    │   │   └──────────────┘          └──────────────┘         │  │
                    │   │              Multi-AZ Deployment                     │  │
                    │   └──────────────────────────────────────────────────────┘  │
                    │                                                              │
                    └──────────────────────────────────────────────────────────────┘
```

### AWS Resources ที่ใช้:

| Resource | Description |
|----------|-------------|
| **VPC** | 10.0.0.0/16 พร้อม Public/Private Subnets |
| **ALB** | Application Load Balancer (internet-facing) |
| **EC2** | Auto Scaling Group (min: 2, max: 4) |
| **RDS** | MySQL 8.0 Multi-AZ |
| **Security Groups** | ALB SG, EC2 SG, RDS SG |

---

## ⭐ Features

### สำหรับผู้ใช้ทั่วไป (User)
- 📝 สมัครสมาชิก
- 🔐 เข้าสู่ระบบด้วย JWT Token
- 🎬 ดูรายการหนังทั้งหมด
- ▶️ เล่นหนัง (streaming จาก URL)
- 🔍 ค้นหาหนัง

### สำหรับผู้ดูแลระบบ (Admin)
- ➕ เพิ่มหนังใหม่
- ✏️ แก้ไขข้อมูลหนัง
- 🗑️ ลบหนัง
- 👥 ดูรายการผู้ใช้

---

## 🛠 Tech Stack

### Frontend
- **React 18** - UI Library
- **Vite** - Build Tool
- **React Router** - Routing
- **Axios** - HTTP Client
- **Tailwind CSS** - Styling

### Backend
- **Node.js 20** - Runtime
- **Express.js** - Web Framework
- **MySQL2** - Database Driver
- **JWT** - Authentication
- **bcryptjs** - Password Hashing
- **cors** - Cross-Origin Resource Sharing

### Infrastructure
- **AWS CloudFormation** - Infrastructure as Code
- **Amazon EC2** - Compute
- **Amazon RDS** - Managed Database
- **Elastic Load Balancing** - Load Balancer
- **Auto Scaling** - Automatic Scaling

---

## 🚀 การติดตั้ง

### Prerequisites
- Node.js 20+
- MySQL 8.0+ (local) หรือ RDS
- AWS CLI (สำหรับ deploy)

### 1. Clone Repository

```bash
git clone https://github.com/your-username/movie-app.git
cd movie-app
```

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
# แก้ไขค่าใน .env ตามต้องการ
npm install
npm run dev
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Initialize Database

```bash
cd backend
npm run db:init    # สร้างตาราง
npm run db:seed    # เพิ่มข้อมูลหนังตัวอย่าง
```

---

## ☁️ การ Deploy บน AWS

### 1. เตรียม AWS CLI

```bash
aws configure
# ใส่ Access Key, Secret Key, Region
```

### 2. สร้าง EC2 Key Pair

```bash
aws ec2 create-key-pair --key-name movie-app-key --query 'KeyMaterial' --output text > movie-app-key.pem
chmod 400 movie-app-key.pem
```

### 3. Deploy CloudFormation Stack

```bash
aws cloudformation deploy \
  --template-file infra/movie-app-template.yaml \
  --stack-name movie-app-stack \
  --parameter-overrides \
    KeyName=movie-app-key \
    AmiId=ami-0c55b159cbfafe1f0 \
    AppRepoUrl=https://github.com/your-username/movie-app.git \
    DBUsername=admin \
    DBPassword=YourSecurePassword123 \
  --capabilities CAPABILITY_IAM
```

### 4. ดู ALB DNS

```bash
aws cloudformation describe-stacks \
  --stack-name movie-app-stack \
  --query 'Stacks[0].Outputs[?OutputKey==`ALBDNSName`].OutputValue' \
  --output text
```

---

## 📚 API Documentation

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | สมัครสมาชิก |
| POST | `/api/auth/login` | เข้าสู่ระบบ |
| GET | `/api/auth/me` | ดูข้อมูลผู้ใช้ปัจจุบัน |

### Movies

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies` | ดูหนังทั้งหมด |
| GET | `/api/movies/:id` | ดูหนังตาม ID |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/movies` | ดูหนังทั้งหมด (admin) |
| POST | `/api/admin/movies` | เพิ่มหนังใหม่ |
| PUT | `/api/admin/movies/:id` | แก้ไขหนัง |
| DELETE | `/api/admin/movies/:id` | ลบหนัง |

### Request/Response Examples

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "user1",
  "password": "password123",
  "email": "user1@example.com"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "user1",
  "password": "password123"
}

# Response
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user1",
    "role": "user"
  }
}
```

---

## 🔄 Failover Case

### 1. Database Failover (RDS Multi-AZ)

**Scenario:** Primary DB instance ใน AZ-A ล้ม

**การทำงาน:**
1. RDS ตรวจพบ Primary instance มีปัญหา
2. RDS อัพเดท DNS endpoint ให้ชี้ไป Standby instance ใน AZ-B
3. Standby กลายเป็น Primary ใหม่
4. Application ยังเชื่อมต่อผ่าน endpoint เดิม (RDS endpoint ไม่เปลี่ยน)

**Downtime:** ~60-120 วินาที

**การทดสอบ:**
```bash
# Reboot RDS with failover
aws rds reboot-db-instance \
  --db-instance-identifier movie-app-db \
  --force-failover
```

### 2. Application Layer Failover (ALB + Auto Scaling)

**Scenario:** EC2 instance ตัวหนึ่งล้ม

**การทำงาน:**
1. ALB ทำ Health Check และพบว่า instance ไม่ตอบสนอง
2. ALB หยุดส่ง traffic ไป instance ที่มีปัญหา
3. Auto Scaling Group สร้าง instance ใหม่ขึ้นมาแทน
4. instance ใหม่ register กับ ALB Target Group
5. ALB เริ่มส่ง traffic ไป instance ใหม่

**Downtime:** ไม่มี (สำหรับ user) เพราะ traffic ถูก route ไป instance อื่น

**การทดสอบ:**
```bash
# Terminate EC2 instance
aws ec2 terminate-instances --instance-ids i-1234567890abcdef0
```

### 3. Availability Zone Failure

**Scenario:** AZ-A ทั้งหมดมีปัญหา

**การทำงาน:**
1. EC2 instances ใน AZ-A ล้ม → ALB route traffic ไป AZ-B
2. RDS failover จาก AZ-A ไป AZ-B (ถ้า Primary อยู่ใน AZ-A)
3. Auto Scaling สร้าง instance ใหม่ใน AZ-B (ถ้ามี capacity)

---

## 📁 โครงสร้างโปรเจกต์

```
movie-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── movies.js
│   │   │   └── admin.js
│   │   └── index.js
│   ├── scripts/
│   │   ├── init-db.js
│   │   └── seed-data.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── infra/
│   └── movie-app-template.yaml
│
└── README.md
```

---

## 👥 Team

- **ชื่อ:** [ใส่ชื่อ]
- **รหัสนักศึกษา:** [ใส่รหัส]

---

## 📄 License

MIT License - ใช้เพื่อการศึกษาเท่านั้น

