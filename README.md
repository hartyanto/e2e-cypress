PANDUAN

1. Mode Interaktif (Cypress Open)
Gunakan mode ini untuk pengembangan dan debugging. Anda dapat memilih file test secara spesifik dan melihat langkah-langkah eksekusi secara visual.

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run cy:open:quiz3` | Membuka QUIZ 3 |
| `npm run cy:open:tugas16` | Membuka Tugas 16 - How to using Intercept in cypress |
| `npm run cy:open:tugas17` | Membuka Tugas 17 - Create Automation with POM |
| `npm run cy:open:tugas18` | Membuka Tugas 18 - API Automation using Cypress |
| `npm run cy:open:final` | Membuka Final Project |

2. Mode Terminal (Cypress Run)
Gunakan mode ini untuk menjalankan seluruh pengujian secara otomatis di latar belakang. Laporan hasil akan muncul langsung di terminal.

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run cy:run:quiz3` | Membuka QUIZ 3 |
| `npm run cy:run:tugas16` | Membuka Tugas 16 - How to using Intercept in cypress |
| `npm run cy:run:tugas17` | Membuka Tugas 17 - Create Automation with POM |
| `npm run cy:run:tugas18` | Membuka Tugas 18 - API Automation using Cypress |
| `npm run cy:run:final` | Membuka Final Project |

Note :
Untuk menjalankan reqres dengan apikey mohon buat file cypress.env.json pada root folder dengan format sebagai berikut :

{
    "regres": {
        "api_key": "your_free_reqres_apikey"
    }
}