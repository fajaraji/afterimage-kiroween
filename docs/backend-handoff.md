# Panduan backend Afterimage

Afterimage mengikuti satu pelanggan fiktif yang meminta penghapusan. Pengunjung menghapus data utama, membaca empat tempat penyimpanan, lalu mencoba memulihkan backup. Hantu berarti pembacaan menemukan salinan. Nisan berarti pembacaan memastikan data absen di lokasi itu pada waktu tertentu. Adegan puncak Costume Contest bergantung pada dua peristiwa terpisah, yaitu impor backup dan pembacaan yang membuktikan data kembali.

Frontend dibangun dengan Codex. Bagianmu adalah membangun backend AWS dengan Kiro dan mengevaluasi apakah pengalaman di browser sesuai dengan bukti di penyimpanan. Demo publik saat ini memakai simulasi per tab. [Coba Afterimage](https://afterimage-kiroween.vercel.app/)

## Kenali satu putaran kasus

1. Buka **Field guide** atau pilih **Enter with sound** pada kunjungan pertama. Pilih **Erase primary record**, kemudian **Scan all locations**. Pada data contoh, satu lokasi menjadi *Verified clear* dan tiga menjadi *Copy found*.
2. Ikuti tombol di bawah peta untuk membersihkan replika analitik dan ekspor. Sesudah setiap penghapusan, jalankan **Recheck location**. Simpan backup untuk percobaan pemulihan.
3. Pilih **Backup vault**, lalu **Restore snapshot**. Buka **Event log** untuk melihat impor dan pemeriksaan sesudahnya. Buka **Certificate** untuk membandingkan temuan dan waktu baca keempat lokasi. **Replay** hanya mengulang tampilan dan suara.

## Sepakati antarmuka sebelum menyambungkan AWS

| Bagian | Yang dipakai frontend |
| --- | --- |
| Membuat atau mereset kasus | `POST /cases` dengan badan `{}` membuat kasus baru milik sesi pengunjung. |
| Memuat ulang | `GET /cases/{id}` memuat revisi terbaru. Tab menyimpan ID, server memeriksa kepemilikan. |
| Mengubah kasus | `POST /cases/{id}/commands` menerima `commandId`, `expectedRevision`, dan `command`. Kelima perintah adalah `erase-primary`, `scan`, `erase-copy`, `inspect`, dan `restore`. Dua perintah per lokasi membawa `store`. |
| Respons sukses | Ketiga endpoint mengembalikan objek `CaseFile` lengkap langsung pada akar JSON. Semua respons memuat empat lokasi, revisi, dan riwayat terurut. |
| Bukti | `finding`, `pendingCheck`, `checkedAt`, dan `sourceId` mengisi peta, hitungan, dan sertifikat. `events[].seq` meningkat dan waktu memakai ISO 8601 UTC. |

Mulailah dari contoh permintaan dan aturan respons yang sudah digunakan browser. Fungsi `startDemo` memberi contoh snapshot awal dan `runDemo` memberi contoh sesudah setiap perintah. Bagian `copies` di simulator adalah keadaan internal. Kirim hanya `file` kepada frontend. [Kontrak HTTP](backend-contract.md) · [Tipe dan validator](../lib/case.ts) · [Adapter browser](../lib/gateway.ts) · [Pemetaan peristiwa ke adegan](../lib/trace.ts)

## Urutan pengerjaan di Kiro

1. **Buat spesifikasi dan satu kasus di AWS.** Tuliskan skenario di bawah sebagai kriteria penerimaan dalam spec Kiro. Gunakan CDK untuk menyediakan penyimpanan dan API. Beri data fiktif pada setiap sesi dan awali keempat temuan dengan `unchecked`. Gunakan awalan kunci per kasus agar penghapusan dan pemulihan hanya menyentuh data pengunjung tersebut. Simpan spec, steering, dan hook yang benar-benar digunakan di `.kiro/`. [Panduan spec Kiro](https://kiro.dev/docs/specs/)
2. **Hubungkan empat lokasi.** `primary` membaca item pelanggan di DynamoDB. `analytics` membaca tabel replika yang diisi Lambda dari DynamoDB Streams. `export` membaca baris pelanggan dalam objek ekspor S3. `backup` membaca objek snapshot S3 yang dipilih untuk kasus itu. Sepakati kapan salinan awal sudah tersedia sebelum kasus dinyatakan siap. Buat pemrosesan stream tahan terhadap pengiriman ulang. Tentukan juga apa yang dilakukan replika ketika data utama dipulihkan. [Lambda dengan DynamoDB Streams](https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html)
3. **Pisahkan operasi tulis dan pemeriksaan.** Saat penghapusan diterima, set `pendingCheck: true`. Set `clear` beserta waktu baca hanya jika pemeriksaan independen memastikan lokasi itu tidak lagi memuat data subjek tersebut. Baca tiap lokasi secara terpisah agar kegagalan satu lokasi menghasilkan `unreachable` dan hasil lokasi lain tetap tersedia. Jika bucket memakai versioning, tetapkan versi yang termasuk cakupan. Delete marker dapat menyembunyikan objek dari pembacaan biasa sementara versi lama tetap tersimpan. [Delete marker S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeleteMarker.html)
4. **Buktikan pemulihan.** Baca ulang prasyarat di server. Primary harus terverifikasi kosong dan backup masih memuat subjek. Impor salinan milik kasus itu, catat event `restore` dengan `store: "backup"` dan ID snapshot. Baca ulang primary. Hanya hasil positif menambahkan event `return` dengan `store: "primary"`, `finding: "returned"`, `sourceId: "backup"`, dan `pendingCheck: false`. Jika impor sukses tetapi pembacaan gagal, simpan event impor dan status belum terverifikasi. Frontend dapat membunyikan pintu, sedangkan suara kebangkitan menunggu bukti pembacaan.
5. **Jaga konsistensi saat klik diulang.** Kenali pengulangan `commandId` dalam kasus yang sama sebelum pemeriksaan revisi. Pulihkan hasil operasi yang sudah diproses tanpa efek atau event ganda. Untuk perintah baru dengan revisi lama, kembalikan HTTP 409. Simpan jejak proses impor agar kegagalan di tengah jalan bisa direkonsiliasi. Browser berhenti menunggu respons setelah 15 detik dan menawarkan **Reload case**. Ukur waktu restore dengan data demo sejak awal.

## Hubungkan frontend ke lingkungan uji

Dengan Node.js 22.13 atau lebih baru, jalankan dari akar repo. Buat `.env.local` dengan alamat API milik tim. Contoh berikut menggunakan alamat pengganti.

```dotenv
NEXT_PUBLIC_AFTERIMAGE_API_BASE=https://api.example.org/v1
```

```sh
npm ci
npm test
npm run dev
```

Buka alamat lokal yang dicetak Next.js. Header memakai **Connected workspace** sesudah adapter diaktifkan. Pada layar sempit labelnya **Connected**. Di Vercel, isi variabel yang sama pada lingkungan Preview dan lakukan build ulang. Sertakan hanya URL publik API dalam variabel frontend.

Adapter mengirim cookie sesi pada setiap permintaan. Atur CORS, yaitu izin akses browser antar-origin, untuk alamat frontend lokal atau preview yang sedang diuji. Dukung `OPTIONS`, `GET`, `POST`, header `Content-Type`, dan credential. Uji pembuatan serta pembacaan kasus pada browser target. Cookie lintas situs dapat dibatasi browser, sehingga domain frontend dan API dalam situs yang sama layak dipilih tim. [Kontrak browser](backend-contract.md) · [Dokumentasi CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

## Evaluasi bersama pada AWS

Jalankan kasus baru untuk setiap cabang yang mengubah isi penyimpanan. Catat revisi, nomor urut event, ID kasus fiktif, hasil baca empat lokasi dan hasil aktual. Bandingkan dengan tampilan browser pada revisi yang sama.

| Percobaan | Hasil yang harus bisa ditunjukkan |
| --- | --- |
| Hapus primary, lalu pindai | Sebelum pindai muncul *Recheck needed*. Setelah pindai normal terdapat 1 clear dan 3 found. |
| Bersihkan replika dan ekspor, pertahankan backup, lalu pulihkan | Sesaat sebelum restore terdapat 3 clear dan 1 found. Setelah impor dan konfirmasi, primary menampilkan *Resurrected* dengan sumber backup. Pada alur contoh hasilnya 2 clear dan 2 found. Catat bila perilaku replikasi di AWS menghasilkan salinan tambahan dan periksa ulang lokasi terkait. |
| Hilangkan backup dan periksa ulang | Saat backup sudah terverifikasi kosong, server menolak pemulihan. Empat pembacaan yang semuanya kosong dapat menghasilkan empat lokasi *Verified clear*. |
| Gagalkan satu pembacaan | Lokasi tersebut muncul sebagai *Out of scope* atau masih menunggu pemeriksaan. Sertifikat tetap menyebut cakupannya. Impor yang gagal dikonfirmasi memiliki event impor tanpa event `return`. |
| Ulangi perintah dan buat konflik | Kirim ulang envelope yang identik, lalu kirim perintah baru dengan revisi lama. Pengulangan tidak menambah event. Perintah baru menerima 409. Setelah **Reload case**, revisi cocok dengan server. |
| Pisahkan pengunjung | Dua sesi browser terpisah mendapat kasus berbeda. Sesi B tidak bisa membaca atau mengubah kasus A. Reset membuat ID baru. |
| Coba panduan, suara, dan replay | Membuka panduan, mematikan suara, atau memutar replay tidak mengirim perintah kasus. Nomor revisi serta log tetap sama. |

Saat menyerahkan hasil, cantumkan URL frontend preview, alamat API uji, commit, dan hasil aktual untuk setiap skenario. Lampirkan satu urutan event dari kasus fiktif dan sertifikat sebelum serta sesudah restore. Tandai skenario yang masih belum diuji. Tes bawaan menjalankan simulator dan adapter dengan respons contoh. Pengujian melalui Preview dan AWS memberi hasil integrasi sesungguhnya.

## Ide dari tiga proyek rujukan

Ketiganya mengerjakan tantangan audit penghapusan HackerRank. Afterimage punya kesempatan memperlihatkan penghapusan dan kebangkitan secara langsung. Berikut usulan untuk dievaluasi setelah kontrak dasar bekerja.

| Prioritas | Usulan untuk Afterimage | Cara mengevaluasi dan sumber |
| --- | --- | --- |
| 1 | Perlihatkan pada jalur backup apakah data **bisa kembali** atau **sudah terbukti kembali**. Sebelum restore gunakan bukti bahwa backup ditemukan dan primary kosong. Pada AWS, periksa juga apakah kebijakan kasus mengizinkan impor dari snapshot tersebut. Begitu pembacaan sesudah impor berhasil, hubungkan ke event dan waktu konfirmasi. Panduan saat ini sudah menjelaskan kemungkinan tersebut. | Paksa impor berhasil lalu gagalkan baca primary. Jalur potensial tidak boleh menghasilkan hantu terkonfirmasi. GhostTrace membedakan bukti keadaan dengan operasi yang hanya dilaporkan dalam graf dependensinya. [Graf GhostTrace](https://github.com/Ashish-AIML-systems/ghosttrace/blob/main/code/slam/reconstruction/graph.py) |
| 2 | Simpan sertifikat per revisi, dengan batas waktu audit dan ID pembacaan sebagai rujukan. Sertifikat frontend saat ini menampilkan revisi terbaru dan dapat dicetak. Riwayat yang bisa dibuka kembali akan menjawab mengapa nisan pada pemeriksaan pertama kemudian berubah menjadi hantu. | Buka sertifikat sebelum restore sesudah kasus mengalami restore. Hasil lama harus tetap cocok dengan waktu pemeriksaannya. G26karthik menyaring waktu pencatatan dan waktu pengambilan bukti terhadap batas audit. [Rekonstruksi waktu audit](https://github.com/G26karthik/ghost-data-still-exists/blob/main/ghost/state.py) |
| 3 | Pisahkan evaluasi hasil akhir, urutan peristiwa, dan isi bukti. Terapkan pada beberapa kasus kecil yang tim buat sendiri, termasuk pembacaan gagal dan permintaan yang dikirim dua kali. | Buat contoh yang status akhirnya benar tetapi sumber backup salah. Pemeriksaan status boleh lulus, pemeriksaan bukti harus gagal. Evaluator Ghostinel membandingkan status, urutan langkah, dan kolom bukti secara terpisah. [Evaluator Ghostinel](https://github.com/RITIKSINGH-DEOS/Ghostinel/blob/main/code/evaluation/evaluator.py) |

Untuk demo pertama, prioritas 1 membuat momen kebangkitan lebih mudah dipahami juri. Prioritas 3 bisa dipakai teman backend segera sebagai cara menguji. Prioritas 2 memerlukan keputusan tim tentang penyimpanan riwayat dan pemuatan revisi lama.
