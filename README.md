# 🚀 Node.js Admin Panel & Management API

Bu proje; rol bazlı yetkilendirme (RBAC), JWT kimlik doğrulama, kategori yönetimi ve detaylı sistem denetim logları (Audit Logs) içeren modern ve güvenli bir **Admin Panel Backend API** servisidir.

## 🛠️ Kullanılan Teknolojiler

* **Runtime:** Node.js
* **Framework:** Express.js
* **Veritabanı:** MongoDB & Mongoose
* **Güvenlik & Auth:** JWT (JSON Web Tokens), bcrypt
* **Middleware & Ara Araçlar:** CORS, Morgan, Cookie-Parser

---

## ✨ Temel Özellikler

* 🔐 **JWT Tabanlı Kimlik Doğrulama:** Güvenli giriş/çıkış mimarisi.
* 🛡️ **Rol Bazlı Yetkilendirme (RBAC):** `ADMIN` ve standart kullanıcı rollerine göre korunan API rotaları.
* 📁 **Kategori Yönetimi:** Tam kapsamlı CRUD (Create, Read, Update, Delete) operasyonları.
* 📜 **Audit Logging:** Sistemdeki kritik işlemleri (Ekleme, Güncelleme, Silme) işlemi yapan kullanıcının e-posta adresiyle birlikte otomatik kayıt altına alma.
* 🌐 **CORS Desteği:** Frontend entegrasyonuna hazır mimari.

---

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

### 1. Repoyu Klonlayın
```bash
git clone <github-repo-linkiniz>
cd <proje-klasor-adi>
