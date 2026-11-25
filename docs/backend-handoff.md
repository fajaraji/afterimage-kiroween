# Panduan backend Afterimage

Afterimage mengikuti satu pelanggan fiktif yang meminta penghapusan. Pengunjung menghapus data utama, membaca empat tempat penyimpanan, lalu mencoba memulihkan backup. Hantu berarti pembacaan menemukan salinan. Nisan berarti pembacaan memastikan data absen di lokasi itu pada waktu tertentu. Adegan puncak Costume Contest bergantung pada dua peristiwa terpisah, yaitu impor backup dan pembacaan yang membuktikan data kembali.

Frontend dibangun dengan Codex. Bagianmu adalah membangun backend AWS dengan Kiro dan mengevaluasi apakah pengalaman di browser sesuai dengan bukti di penyimpanan. Demo publik saat ini memakai simulasi per tab. [Coba Afterimage](https://afterimage-kiroween.vercel.app/)

## Alur AWS untuk video juri

**Target rekaman adalah 2 menit 45 detik dalam mode Connected.** Pertanyaan untuk juri adalah “Kami sudah menghapus Evelyn. Bisakah satu backup mengembalikan datanya?” Dalam satu kasus fiktif, tunjukkan tiga fakta yang bisa dibaca di layar: primary pernah kosong, sebuah versi snapshot masih menyimpan record, lalu pembacaan primary menemukan isi snapshot itu kembali. Alur berikut adalah pekerjaan backend yang masih terbuka. Demo publik saat handoff ini ditulis memakai simulator.

### Tiket teman backend

Kerjakan berurutan. Setiap tiket memiliki kriteria penerimaan. Pakai kasus baru untuk percobaan gagal agar rekaman utama tetap mudah diikuti.

| Urutan | Hasil yang harus tersedia untuk tiket berikutnya |
| --- | --- |
| [#20 · Kasus dan snapshot](https://github.com/fajaraji/afterimage-kiroween/issues/20) | Spec Kiro, kasus AWS terisolasi, snapshot S3 berversi yang bisa dibaca ulang. |
| [#21 · Bukti penghapusan](https://github.com/fajaraji/afterimage-kiroween/issues/21) | Pembacaan primary kosong dan pembacaan backup positif untuk subjek yang sama. |
| [#22 · Restore terverifikasi](https://github.com/fajaraji/afterimage-kiroween/issues/22) | Impor objek versi tertentu, baca ulang target, bukti asal dan pengujian jalur gagal. |
| [#23 · Gladi di Connected Preview](https://github.com/fajaraji/afterimage-kiroween/issues/23) | Peta, log dan sertifikat cocok dengan bukti AWS. Kasus kontrol gagal tetap belum terverifikasi. |
| [#24 · Rekaman 2:45](https://github.com/fajaraji/afterimage-kiroween/issues/24) | Video berteks Inggris, bukti satu run, dan uji keterbacaan tanpa audio. |

### Satu run yang bisa diperiksa ulang

1. **Sebelum dihapus.** Gunakan pasangan `caseId` dan `subjectId` sebagai identitas record. Buat satu penanda acak per kasus, misalnya `recordTag`, sebagai bagian dari payload fiktif. Baca item awal dari DynamoDB dan simpan payload itu ke S3 dengan versioning aktif. Catat key dan `VersionId` aktual dari hasil penulisan. Tunggu sampai salinan awal siap sebelum merekam.
2. **Buktikan primary kosong.** Sesudah `DeleteItem`, biarkan status menunggu pemeriksaan. Lakukan `GetItem(ConsistentRead=true)` pada **tabel dasar, region dan kunci yang sama**. Respons sukses tanpa `Item` menghasilkan `clear` dengan waktu baca UTC. Tampilkan juga hasil `GetObject` untuk versi backup yang masih memuat subjek dan penandanya. Kegagalan akses atau timeout tetap belum terverifikasi. [DynamoDB GetItem](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_GetItem.html) · [S3 GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html)
3. **Pulihkan dari objek yang ditunjuk.** Saat menerima `restore`, validasi sesi dan versi kasus. Ambil bytes melalui `GetObject(Key, VersionId)`, cocokkan kasus dan subjek, lalu tulis payload hasil pembacaan itu ke primary dengan syarat item masih kosong. Kaitkan operasi dengan `commandId` dan referensi impor. Cara ini mencegah record yang sudah muncul dari penulis lain dianggap hasil restore. Simpan kemajuan perintah agar retry setelah penulisan bisa melanjutkan verifikasi tanpa mengimpor ulang.
4. **Buktikan record kembali.** Setelah penulisan, lakukan `GetItem` strongly consistent yang baru. Bandingkan identitas dan penanda hasil **baca target** dengan hasil **baca versi S3**, serta cocokkan referensi impor pada item target dengan operasi ini. Simpan jejak berurutan berisi ID kasus, subjek, versi snapshot, `commandId`, hasil baca dan waktu UTC. Untuk video, gunakan referensi singkat yang bisa dicocokkan dengan versi penuh pada lampiran run. Isi `event.detail` dalam bahasa Inggris agar laporan saat ini langsung bisa menampilkan bukti tersebut.

### Kapan hantu muncul?

| Bukti yang sudah tersedia | Yang boleh terlihat atau terdengar |
| --- | --- |
| Pembacaan suatu lokasi menemukan salinan | Hantu kecil pada lokasi itu. Nisan diberikan ketika pembacaan lokasi berhasil dan record memang absen. |
| Primary terverifikasi kosong dan backup ditemukan | Jalur putus-putus yang menunjukkan kemungkinan restore. |
| Impor berhasil, verifikasi target belum berhasil | Event `restore` bersumber dari `backup`. Pintu vault boleh terbuka. Primary tetap pending atau `unreachable` sesuai hasil pemeriksaan. |
| Pembacaan target baru cocok dengan payload dan asal impor | Backend menambahkan event `return` pada `primary`, dengan `seq` lebih besar daripada event `restore` untuk perintah itu. Dalam snapshot respons yang sama, entri primary memiliki `finding: "returned"`, `sourceId: "backup"`, `pendingCheck: false` dan `checkedAt` dari pembacaan baru. Baru di sini penampakan besar, suara hantu, dan jalur terkonfirmasi boleh muncul. |

Backend bertanggung jawab mencocokkan versi, penanda dan operasi. Frontend membaca event baru beserta status primary dalam respons perintah. Bila hasil baca kosong, salah subjek, penanda berbeda, atau verifikasi gagal, catat hasil aktual dan tahan event `return`. Uji juga replay dan retry: replay hanya memutar bukti yang sudah ada, sedangkan retry perintah yang sama harus mempertahankan satu impor logis. [Logika penampakan](../lib/trace.ts) · [Kontrak HTTP](backend-contract.md)

### Storyboard 2:45 yang tetap terbaca saat mute

| Waktu | Gambar utama | Pesan di layar dalam bahasa Inggris |
| --- | --- | --- |
| 0:00–0:15 | Evelyn, ID subjek, dan pertanyaan kasus. Tunjukkan siapa yang membutuhkan bukti ini, misalnya petugas privasi. | “Evelyn asked to be erased. How can we prove every copy is gone?” |
| 0:15–0:42 | Perlihatkan label Connected, tekan erase lalu scan. Tahan pada nisan primary dan hantu vault. | “Primary read: absent. Backup read: present.” |
| 0:42–1:02 | Sisipkan potongan hasil baca AWS dari run yang sama. Perbesar ID subjek, referensi versi dan penanda singkat. | “This backup still holds Evelyn’s record.” |
| 1:02–1:25 | Satu pengambilan gambar utuh dari klik restore hingga penampakan dan cap sumber. Biarkan jalur vault ke primary terbaca. | “Snapshot imported.” Lalu setelah konfirmasi, “A new primary read found Evelyn again.” |
| 1:25–2:05 | Buka sertifikat. Tahan perbandingan sebelum/sesudah. Sandingkan penanda dari S3 dan hasil baca DynamoDB, dengan waktu UTC dan referensi impor yang sama. | “Same case. Same record tag. Read back from DynamoDB.” |
| 2:05–2:30 | Perlihatkan spec atau pengujian Kiro yang benar-benar dipakai. Sisipkan satu kasus kontrol terpisah dengan caption yang membedakannya. | “Control run: import succeeded, verification failed. No confirmed return.” |
| 2:30–2:45 | Kembali ke bukti kasus utama dan tampilkan URL aplikasi. | “An erasure report is only as good as its last verified read.” |

**Gladi sebelum rekam.** Siapkan tampilan ringkas hasil AWS SDK atau log backend dari operasi aktual. Tampilkan field yang relevan dengan ukuran yang terbaca di pemutar video; sembunyikan kredensial dan detail akun. Ambil nilai caption dari run tersebut. Simpan bukti lengkap yang disanitasi bersama commit yang direkam. Putar hasil ekspor dengan suara mati kepada orang yang belum mencoba demo. Jika ia bisa menunjuk kapan primary kosong, backup mana yang diimpor dan pembacaan mana yang membuktikan record kembali, video sudah menyampaikan inti produk.

Aturan meminta video demonstrasi di bawah tiga menit dan memperbolehkan juri menilai dari video, gambar, dan deskripsi saja. Target 2:45 menyisakan 15 detik dari batas tiga menit. [Aturan resmi Kiroween](https://kiroween.devpost.com/rules)

## Kenali satu putaran kasus

Petunjuk lapangan tampil di atas peta sejak kasus dibuka. Baca tujuan langkah aktif pada urutan **Erase → Inspect → Restore → Report**, lalu jalankan satu tombol utama di bawah peta. Pemilihan makam membuka bukti lokasi dan bersifat opsional.

1. **Erase primary record** menghapus rekaman aktif. Primary menunggu pemeriksaan.
2. **Scan all locations** membaca keempat lokasi. Di demo, primary menjadi *Verified clear*. Replika, ekspor, dan backup masih memuat salinan. Garis putus-putus dari vault ke primary menunjukkan kemungkinan pemulihan.
3. **Restore from backup** mengimpor snapshot dan memeriksa primary. Impor membuka engsel vault. Pembacaan primary yang mengonfirmasi sumber memicu penampakan besar dari makam primary, suara hantu, lalu garis utuh berwarna jingga. Dengan reduced motion, penampakan ditunjukkan sebagai potret diam dan cap bukti. Pada jalur langsung ini hasilnya empat lokasi ditemukan memuat salinan.
4. **View certificate** membuka bukti terbaru untuk empat lokasi beserta waktu pemeriksaannya. Sesudah impor, bagian **What changed at the primary database?** menunjukkan pembacaan sebelum dan sesudah impor beserta waktunya. **Print / save PDF** menghasilkan salinan laporan pada saat itu.

Untuk menguji pembersihan tambahan, pilih replika atau ekspor pada peta atau tabel. Di panel bukti, **Erase this copy** menghapus salinan setempat dan **Recheck this location** membaca kembali lokasi tersebut. Tombol utama tetap menuntun kasus meskipun pengguna memilih lokasi lain. Sesudah ada bukti kebangkitan, **Replay the return** memutar ulang penampakan, termasuk setelah halaman dimuat ulang. Di **Map tools**, **Replay last scene** memutar ulang operasi terakhir. Keduanya mempertahankan semua bukti. Ambiens mulai saat halaman dibuka bila browser mengizinkan, atau saat interaksi pertama. Tombol suara ada di header.

### Apa arti pembaruan kasus pada sertifikat?

Nomor **Case update** bertambah ketika sebuah perintah mengubah bukti kasus. Contohnya, pemeriksaan pertama menemukan primary kosong, lalu restore dan pemeriksaan berikutnya menemukan pelanggan yang sama di primary. Kode aplikasi bisa tetap sama selama kedua pemeriksaan itu. Juri bisa melihat perbedaannya dalam satu sertifikat.

Frontend mengambil perbandingan dari `events` milik impor terakhir. Sertakan lokasi, waktu UTC, urutan dan hasil baca dalam detail yang bisa dipahami manusia. Saat salah satu pembacaan belum tercatat, laporan menyebutnya. Mematikan suara, memutar replay atau mencetak laporan mempertahankan nomor kasus dan revisinya. Untuk MVP cukup laporan terkini dan log. Arsip sertifikat tetap per revisi hanya berguna bila nanti auditor perlu membuka ulang laporan persis seperti yang diterbitkan pada waktu lampau.

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
| Pulihkan langsung dari tombol utama, lalu buka sertifikat | Setelah pindai terdapat 1 clear dan 3 found. Setelah impor dan baca primary, keempat lokasi di simulator berisi salinan. Periksa urutan `restore` → `return`, sumber, dan waktu baca. |
| Bersihkan replika dan ekspor, pertahankan backup, lalu pulihkan | Sesaat sebelum restore terdapat 3 clear dan 1 found. Setelah impor dan konfirmasi, primary menampilkan *Resurrected* dengan sumber backup. Pada alur contoh hasilnya 2 clear dan 2 found. Catat bila perilaku replikasi di AWS menghasilkan salinan tambahan dan periksa ulang lokasi terkait. |
| Hilangkan backup dan periksa ulang | Saat backup sudah terverifikasi kosong, server menolak pemulihan. Empat pembacaan yang semuanya kosong dapat menghasilkan empat lokasi *Verified clear*. |
| Gagalkan satu pembacaan | Lokasi tersebut muncul sebagai *Out of scope* atau masih menunggu pemeriksaan. Sertifikat tetap menyebut cakupannya. Impor yang gagal dikonfirmasi memiliki event impor tanpa event `return`. |
| Ulangi perintah dan buat konflik | Kirim ulang envelope yang identik, lalu kirim perintah baru dengan revisi lama. Pengulangan tidak menambah event. Perintah baru menerima 409. Setelah **Reload case**, revisi cocok dengan server. |
| Pisahkan pengunjung | Dua sesi browser terpisah mendapat kasus berbeda. Sesi B tidak bisa membaca atau mengubah kasus A. Reset membuat ID baru. |
| Coba kontrol tampilan, suara, dan replay | Memilih lokasi, membuka Map tools, mematikan suara, atau memutar ulang adegan mempertahankan revisi dan log. Perintah kasus hanya dikirim ketika pengguna menjalankan operasi. |

Saat menyerahkan hasil, cantumkan URL frontend preview, alamat API uji, commit, dan hasil aktual untuk setiap skenario. Lampirkan satu urutan event dari kasus fiktif dan sertifikat sebelum serta sesudah restore. Tandai skenario yang masih belum diuji. Tes bawaan menjalankan simulator dan adapter dengan respons contoh. Pengujian melalui Preview dan AWS memberi hasil integrasi sesungguhnya.

## Ide dari tiga proyek rujukan

| Ide dan rujukan | Status pada Afterimage | Pekerjaan backend dan cara mengevaluasi |
| --- | --- | --- |
| **Jalur yang mungkin vs. kebangkitan yang terbukti.** [Graf GhostTrace](https://github.com/Ashish-AIML-systems/ghosttrace/blob/main/code/slam/reconstruction/graph.py) | **Sudah ada di demo.** Peta menunjukkan jalur putus-putus ketika primary terverifikasi kosong dan vault masih memuat salinan. Garis utuh memakai sumber impor dan event pembacaan primary setelah impor. | Di AWS, periksa juga izin pemulihan dan ID snapshot. Uji impor yang berhasil diikuti pembacaan gagal. Sertifikat harus tetap menunjukkan celah bukti dan peta hanya boleh menggambar jalur terkonfirmasi bila urutan serta sumbernya cocok. |
| **Sertifikat per revisi.** [Rekonstruksi waktu audit G26karthik](https://github.com/G26karthik/ghost-data-still-exists/blob/main/ghost/state.py) | **Opsional sesudah MVP.** Satu laporan sudah membandingkan pembacaan primary sebelum dan sesudah impor. Arsip terpisah berguna jika auditor perlu membuka kembali seluruh laporan empat lokasi persis seperti saat diterbitkan. | Sepakati penyimpanan revisi tetap, batas waktu audit dan ID bukti. Uji membuka revisi sebelum restore setelah kasus berubah. Hasil dan waktu bacanya harus sama dengan laporan lama. |
| **Uji hasil, urutan, dan asal bukti secara terpisah.** [Evaluator Ghostinel](https://github.com/RITIKSINGH-DEOS/Ghostinel/blob/main/code/evaluation/evaluator.py) | **Ada di pengujian lokal dan skenario evaluasi.** Tes membandingkan isi empat lokasi, urutan impor dan pembacaan, serta sumber pada jalur pemulihan. | Jalankan skenario di atas terhadap AWS. Sertakan kasus yang status akhirnya tampak benar tetapi sumber salah, impor tanpa konfirmasi, dan perintah duplikat. Catat ketiga hasil pemeriksaan secara terpisah. |

Status pengujian di sini mengacu pada simulator dan adapter frontend. Teman backend dapat mengisi hasil integrasi setelah Preview terhubung ke AWS.
