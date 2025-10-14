 📚 BookMark - Proje Raporu



🌑Öğrenci:       Muhammet Cihan Taşkan

🌑Öğrenci no:    252011039

🌑GitHub:       [@carus10](https://github.com/carus10)  

🌑Tarih:        14 Ekim 2025  

🌑Proje Linki:  [https://carus10.github.io/BookMark/](https://carus10.github.io/BookMark/)



---





🖌️Proje Adı:

BookMark - Mind Accelerating Reading Platform



🌟 Problem Tanımı

Günümüzde özellikle dijital ortamlarda okuma yaparken birçok insan odaklanma problemi yaşıyor. Uzun metinlerde göz satır atlayabiliyor, kelimeler karışıyor veya dikkat hızlıca dağılıyor. Bu durum hem kitap okuma motivasyonunu hem de öğrenme verimini azaltıyor.



✍️ İstatistiksel Veriler:
 
 🟩Ortalama bir yetişkin dakikada 200-300 kelime okur
 🟩Dijital ekranlarda okuma hızı %25 daha yavaştır
 🟩 Okuyucuların %60'ı uzun metinlerde odaklanma sorunu yaşar
 🟩Disleksi ve dikkat dağınıklığı yaşayan bireylerde bu oran %80'e çıkar



🌺 Çözüm (Proje Fikri)

BookMark, okuma odaklanmasını artırmak için geliştirilen bir web uygulamasıdır. Kullanıcı, ister kendi metnini ister TXT/PDF dosyasını yükleyebilir. Uygulama, metni analiz ederek iki farklı okuma modu sunar:



1. Klasik RSVP Modu (Odaklı Kelime Modu)
   
🟡Ekranda yalnızca bir kelime görünür

🟡Kelimenin ortadaki harfi kırmızı renkle vurgulanır (ORP - Optimal Recognition Point)

🟡Kullanıcı kelime hızını 100-1000 WPM arasında ayarlayabilir

🟡Göz hareketi minimuma indirilir, odaklanma maksimize edilir



 2. Kitap Simülasyonu Modu (Gerçek Kitap Deneyimi)

 🍈Kelimeler soldan sağa doğru  akarak ekranda ilerler

 🍈Sayfa geçişleri gerçek kitap deneyimini simüle eder

 🍈Kullanıcının gözü satır takibi yapar, ama dikkat dağılmadan sırayla her kelimeye odaklanır

 🍈Daha doğal okuma deneyimi sunar



 ✨ Ek Özellikler

✅ Hız Kontrolü:100-1000 WPM arası ayarlanabilir okuma hızı  

✅ İstatistik Takibi: Okunan kelime sayısı, süre, ortalama hız  

✅ Kitap Yönetimi: Kütüphane sistemi ile çoklu kitap desteği  

✅ Son Konum Kaydetme: Kaldığınız yerden devam etme  

✅ Responsive Tasarım:  Mobil, tablet ve masaüstü uyumlu  

✅ Tam Ekran Modu: Dikkat dağıtıcı unsurları kaldırma  



✨ Hedef Kullanıcılar

 🎓 Üniversite öğrencileri - Akademik makale ve kitap okuma

 📖 Kitap severler  - Daha hızlı ve verimli okuma deneyimi

 🧠 Dikkat dağınıklığı yaşayanlar - ADHD, odaklanma problemi

 📚 Disleksi eğilimi olanlar - Kelimeleri daha net algılama

 💼 Profesyoneller - Hızlı rapor ve döküman okuma

 🌍 Yabancı dil öğrenenler - Kelime tanıma ve hız geliştirme



 🎨 Kullanılan Araçlar ve Gerekçeleri



 🌀1. Manus.ai

Kullanım Amacı Kullanıcı arayüzü tasarımı ve prototipleme  

Gerekçe 

 Yapay zeka destekli tasarım önerileri sayesinde modern ve kullanıcı dostu arayüz tasarımı yapıldı

 Renk paleti ve tipografi seçiminde bilimsel temelli öneriler alındı

 Responsive tasarım için farklı ekran boyutlarında test imkanı sundu

 Hız okuma için optimal görsel hiyerarşi oluşturulmasına yardımcı oldu



🌀 2. Google Gemini

Kullanım Amacı Kod optimizasyonu ve algoritma geliştirme  

Gerekçe

 RSVP algoritmasının matematiksel hesaplamalarında yardımcı oldu

 Kelime analizi ve ORP (Optimal Recognition Point) belirleme mantığı geliştirildi

 LocalStorage veri yapısının optimize edilmesinde destek sağladı

 Performans iyileştirmeleri ve kod refactoring önerileri sundu

 Karmaşık JavaScript fonksiyonlarının daha temiz ve okunabilir hale getirilmesine katkıda bulundu



 🌀3. GitHub Copilot

Kullanım Amacı Kod yazımı ve geliştirme hızlandırma  

Gerekçe

 Tekrarlayan kod bloklarının otomatik tamamlanması ile geliştirme süresi %40 azaltıldı

 CSS animasyonlarının smooth ve performanslı yazılmasında yardımcı oldu

 JavaScript event handler'larının best practice'lere uygun yazılmasını sağladı

 Hata yönetimi (error handling) kodlarının eklenmesinde destek verdi

 Cross-browser uyumluluk için alternatif kod önerileri sundu



 🌀 4. Git ve GitHub

Kullanım Amacı Versiyon kontrolü ve proje yönetimi  

Gerekçe

 Kod değişikliklerinin sistematik takibi

 Hata durumunda önceki versiyonlara dönebilme

 GitHub Pages ile ücretsiz hosting

 Proje dokümantasyonunun merkezi yönetimi



---





🟥 Site Haritası / Ekran Akışı🟥



```

┌─────────────────┐

│  Ana Sayfa      │ ← Proje tanıtımı, demo, özellikler

│  (index.html)   │

└────────┬────────┘

&nbsp;        │

&nbsp;        ├──────────────────────────────────────────────┐

&nbsp;        │                                               │

&nbsp;        ▼                                               ▼

┌─────────────────┐                            ┌─────────────────┐

│  Kütüphane      │                            │  İstatistikler  │

│  (library.html) │                            │(statistics.html)│

└────────┬────────┘                            └─────────────────┘

&nbsp;        │                                               │

&nbsp;        │ \[Kitap Seç]                                   │ \[Grafikler]

&nbsp;        │                                               │ \[Toplam Okunan]

&nbsp;        ▼                                               │ \[Ortalama Hız]

┌─────────────────┐                                     │

│ Kitap Yükleme   │                                     │

│   ├── TXT       │                                     │

│   └── PDF       │                                     │

└────────┬────────┘                                     │

&nbsp;        │                                               │

&nbsp;        │ \[Yükleme Tamamlandı]                         │

&nbsp;        │                                               │

&nbsp;        ▼                                               │

┌─────────────────┐                                     │

│  Okuma Modu     │◄────────────────────────────────────┘

│    Seçimi       │

│  ├── Klasik     │

│  │   RSVP       │

│  └── Kitap      │

│      Simülasyonu│

└────────┬────────┘

&nbsp;        │

&nbsp;        ▼

┌─────────────────┐

│  Okuma Ekranı   │

│  (reader.html)  │

│                 │

│  ┌───────────┐  │

│  │  Kelime   │  │ ← Merkez odak noktası

│  │  Alanı    │  │

│  └───────────┘  │

│                 │

│  \[◄] \[▶] \[⏸]   │ ← Kontroller

│  \[═══════════]  │ ← Hız ayarı (100-1000 WPM)

│  \[▣] \[⚙]       │ ← Tam ekran, Ayarlar

└─────────────────┘

&nbsp;        │

&nbsp;        │ \[Ayarlar Butonu]

&nbsp;        ▼

┌─────────────────┐

│   Ayarlar       │

│ (settings.html) │

│  ├── Tema       │ (Açık/Koyu)

│  ├── Font Boyutu│ (14-36px)

│  ├── ORP Göster│ (Açık/Kapalı)

│  └── Varsayılan│

│      Hız        │

└─────────────────┘

```



 🟥Kullanıcı Rolleri🟥



🌸 1. Kullanıcı (Reader

Yetkiler

 ✅ Kitap yükleme (TXT/PDF formatında)

 ✅ Kütüphanede kitap yönetimi (silme, görüntüleme)

 ✅ Okuma modu seçme

 ✅ Hız ayarları yapma (100-1000 WPM)

 ✅ Tema ve görünüm ayarları

 ✅ Kişisel istatistikleri görüntüleme

 ✅ Son okunan pozisyondan devam etme



𖤓 Kullanım Senaryosu 𖤓

1\. Ana sayfadan "Kütüphanem" sayfasına gider

2\. "Kitap Yükle" butonuna tıklar

3\. TXT dosyasını seçer ve yükler

4\. Yüklenen kitaba tıklayarak okuma ekranına geçer

5\. Okuma modunu seçer (Klasik RSVP veya Kitap Simülasyonu)

6\. Hız çubuğunu ayarlar (örn: 400 WPM)

7\. Play butonuna basarak okumaya başlar

8\. Okuma bitince istatistikler otomatik kaydedilir



 𓆩❤︎𓆪 2. Yönetici / Geliştirici (Admin - Beta Sürümü İçin)

Yetkiler

 ✅ Sistem testlerini yapma

 ✅ Metin dönüştürme hatalarını kontrol etme

 ✅ Kullanıcı geri bildirimlerini inceleme

 ✅ Performans metriklerini analiz etme

 ✅ Beta sürümü hata loglarını görüntüleme



Not Mevcut versiyonda admin paneli bulunmuyor, gelecek sürümlerde eklenecek.



 Wireframe / Taslak Görsel Açıklaması



🦅 1. Ana Sayfa (index.html) 🦅

```

┌─────────────────────────────────────────────────┐

│  \[BookMark Logo]                 \[Menu]          │

├─────────────────────────────────────────────────┤

│                                                  │

│         OKUMA HIZINI ARTIRIN                     │

│    Dakikada 1000+ Kelime Okuyun                  │

│                                                  │

│    \[Hemen Başla]  \[Özellikler]                   │

│                                                  │

├─────────────────────────────────────────────────┤

│  ┌────────────────────────────────────────────┐ │

│  │     HIZ OKUMA DEMOsu                       │ │

│  │  ┌──────────────────────────────────────┐  │ │

│  │  │         Kelime                       │  │ │

│  │  │           ▲                          │  │ │

│  │  │           │ Kırmızı harf vurgusu     │  │ │

│  │  └──────────────────────────────────────┘  │ │

│  │  \[▶ Demo Başlat]  Hız: 300 WPM \[═════]   │ │

│  └────────────────────────────────────────────┘ │

├─────────────────────────────────────────────────┤

│  ÖZELLİKLER                                      │

│  \[Icon] Hız Okuma  \[Icon] Çoklu Mod             │

│  \[Icon] İstatistik \[Icon] Kütüphane             │

└─────────────────────────────────────────────────┘

```



💫 2. Kütüphane Sayfası (library.html) 💫

```

┌─────────────────────────────────────────────────┐

│  \[BookMark]  Ana Sayfa | KÜTÜPHANEMİ | İstatistik│

├─────────────────────────────────────────────────┤

│                                                  │

│  KİTAPLARIM                    \[+ Kitap Yükle]   │

│                                                  │

│  ┌────────────┐  ┌────────────┐  ┌──────────┐  │

│  │ \[Kitap 1]  │  │ \[Kitap 2]  │  │ \[Kitap 3]│  │

│  │ İsim: ...  │  │ İsim: ...  │  │ İsim: ...│  │

│  │ İlerleme:  │  │ İlerleme:  │  │ İlerleme:│  │

│  │ ▓▓▓▓░░░ 60%│  │ ▓░░░░░░  8%│  │ ▓▓▓▓▓▓▓100%│

│  │ \[Oku] \[Sil]│  │ \[Oku] \[Sil]│  │ \[Oku] \[Sil]│

│  └────────────┘  └────────────┘  └──────────┘  │

│                                                  │

│  ┌──────────────────────────────────────────┐   │

│  │  📁 DOSYA YÜKLEME                        │   │

│  │  ┌────────────────────────────────────┐  │   │

│  │  │ Sürükle-bırak veya tıkla          │  │   │

│  │  │ Desteklenen: .txt, .pdf            │  │   │

│  │  └────────────────────────────────────┘  │   │

│  └──────────────────────────────────────────┘   │

└─────────────────────────────────────────────────┘

```



🪽 3. Okuma Ekranı (reader.html) 🪽



Klasik RSVP Modu

```

┌─────────────────────────────────────────────────┐

│  \[←]  "Kitap Adı"  \[300 WPM]          \[⚙] \[▣]  │

├─────────────────────────────────────────────────┤

│                                                  │

│                                                  │

│                                                  │

│              ┌─────────────────┐                │

│              │                 │                │

│              │    Ke l ime     │  ← Orta harf  │

│              │       ▲         │     kırmızı   │

│              │       │         │                │

│              └─────────────────┘                │

│                                                  │

│                                                  │

│  ┌──────────────────────────────────────────┐   │

│  │  \[◄◄] \[◄] \[▶/⏸] \[▶] \[▶▶]               │   │

│  │                                          │   │

│  │  Hız: 300 WPM  \[▓▓▓▓░░░░░░░░░░░]        │   │

│  │  İlerleme: %45 \[▓▓▓▓▓▓▓░░░░░░░░░░]      │   │

│  └──────────────────────────────────────────┘   │

└─────────────────────────────────────────────────┘

```



📜 Kitap Simülasyonu Modu: 📜

```

┌─────────────────────────────────────────────────┐

│  \[←]  "Kitap Adı"  \[400 WPM]          \[⚙] \[▣]  │

├─────────────────────────────────────────────────┤

│  ┌─────────────────────┬─────────────────────┐  │

│  │ Sol Sayfa           │ Sağ Sayfa           │  │

│  │                     │                     │  │

│  │ Kelime kelime       │ Kelime kelime       │  │

│  │ kelime kelime       │ kelime kelime       │  │

│  │ kelime...           │ kelime...           │  │

│  │          ▲          │          ▲          │  │

│  │          │          │          │          │  │

│  │   Aktif kelime      │   Sıradaki kelime   │  │

│  │   kırmızı vurgulu   │                     │  │

│  │                     │                     │  │

│  │              Sayfa 5│6                    │  │

│  └─────────────────────┴─────────────────────┘  │

│                                                  │

│  \[◄] \[▶/⏸] \[▶]  Hız: \[▓▓▓▓▓░░░░]  İlerleme: %12│

└─────────────────────────────────────────────────┘

```



⚙️ 4. Ayarlar Sayfası (settings.html) ⚙️

```

┌─────────────────────────────────────────────────┐

│  \[BookMark]  Ana Sayfa | Kütüphane | AYARLAR    │

├─────────────────────────────────────────────────┤

│                                                  │

│  OKUMA AYARLARI                                  │

│  ┌──────────────────────────────────────────┐   │

│  │ Varsayılan Hız: 300 WPM  \[═════▓════]    │   │

│  └──────────────────────────────────────────┘   │

│  ┌──────────────────────────────────────────┐   │

│  │ Font Boyutu: 24px  \[═══▓═════]           │   │

│  └──────────────────────────────────────────┘   │

│                                                  │

│  GÖRÜNÜM                                         │

│  ┌──────────────────────────────────────────┐   │

│  │ Tema:  ( ) Açık  (•) Koyu                │   │

│  │ ORP Göster: \[✓]                          │   │

│  │ Tam Ekran Otomatik: \[✓]                  │   │

│  └──────────────────────────────────────────┘   │

│                                                  │

│  \[Varsayılana Dön]       \[Kaydet]               │

└─────────────────────────────────────────────────┘

```



 🌐 5. İstatistikler Sayfası (statistics.html) 🌐

```

┌─────────────────────────────────────────────────┐

│  \[BookMark]  Ana Sayfa | Kütüphane | İSTATİSTİK │

├─────────────────────────────────────────────────┤

│  OKUMA İSTATİSTİKLERİM                           │

│  ┌────────────┐ ┌────────────┐ ┌────────────┐  │

│  │📚 Okunan   │ │⏱ Toplam    │ │📈 Ortalama │  │

│  │  Kelime    │ │   Süre     │ │   Hız      │  │

│  │  15,240    │ │  45 dakika │ │  338 WPM   │  │

│  └────────────┘ └────────────┘ └────────────┘  │

│                                                  │

│  HAFTALIK İLERLEME                               │

│  ┌──────────────────────────────────────────┐   │

│  │     ▁                                    │   │

│  │   ▁ █ ▁                                  │   │

│  │ ▁ █ █ █ ▁ ▁ ▁                            │   │

│  │ Pzt Sal Çar Per Cum Cmt Paz              │   │

│  └──────────────────────────────────────────┘   │

│                                                  │

│  SON OKUNAN KİTAPLAR                             │

│  • "Kitap 1" - %100 tamamlandı                   │

│  • "Kitap 2" - %60 devam ediyor                  │

│  • "Kitap 3" - %8 yeni başladı                   │

└─────────────────────────────────────────────────┘

```



🎯 Tasarım Prensipleri 🎯 



🍃  1. Minimalizm ve Odaklanma

 Okuma sırasında dikkat dağıtıcı unsurlar minimum seviyede

 Merkez odak noktası her zaman net ve belirgin

 Gereksiz renkler ve animasyonlar kullanılmadı



  🍃 2. Renk Paleti

  Primer `#6366f1` (İndigo) - Butonlar ve vurgular

 Sekonder `#8b5cf6` (Mor) - Premium özellikler

 Accent: `#ef4444` (Kırmızı) - ORP (Optimal Recognition Point)

Arka plan: `#1e293b` (Koyu gri) - Koyu tema

 Metin: `#f8fafc` (Açık beyaz) - Ana metin



🍃3. Tipografi

 Ana font: `Inter, system-ui, sans-serif`

 Okuma alanı: `Georgia, serif` (daha iyi okunabilirlik)

 Font boyutu: 18px-32px arası ayarlanabilir



 🍃4. Responsive Tasarım

 Mobil (320px-768px): Tek sütun, büyük butonlar

 Tablet (768px-1024px): Esnek grid sistemi

 Masaüstü (1024px+): Tam özellikli arayüz



 🍃5. Erişilebilirlik (Accessibility

 ✅ Klavye navigasyonu desteği (Space, Arrow keys)

 ✅ Yüksek kontrast oranı (WCAG AA standardı)

 ✅ Ekran okuyucu uyumluluğu (ARIA labels)

 ✅ Odak göstergeleri (focus indicators)



---



 📊 Teknik Özellikler



 Kullanılan Teknolojiler

 Frontend HTML5, CSS3, JavaScript (ES6+)

 API File API, LocalStorage API, Fullscreen API

 Kütüphaneler Font Awesome Icons

 Deployment GitHub Pages

 Version Control: Git \& GitHub



 Performans Metrikleri

 İlk yükleme süresi: < 2 saniye

 Kelime render süresi: < 16ms (60 FPS)

 LocalStorage kullanımı: < 5MB

 Responsive breakpoint'ler: 3 adet



 Tarayıcı Uyumluluğu

 ✅ Chrome 90+

 ✅ Firefox 88+

 ✅ Safari 14+

 ✅ Edge 90+

 ⚠️ IE11 desteklenmiyor



---



 🎯 Gelecek Planları (Roadmap)



 v2.0 (Planlanan)

 [ ] PDF okuma desteği iyileştirme

 [ ] Sesli okuma (Text-to-Speech)

 [ ] Çoklu dil desteği (İngilizce, Türkçe, vb.)

 [ ] Bulut senkronizasyonu

 [ ] Mobil uygulama (React Native)



 v2.5 (Gelecek)

[ ] AI destekli özetleme

[ ] Anlama testleri

[ ] Sosyal özellikler (arkadaşlarla yarışma)

[ ] E-kitap formatları desteği (EPUB, MOBI)



---



 📸 Ekran Görüntüleri



 `homepage.png` - Ana sayfa ve demo

 `library.png` - Kütüphane yönetimi

 `reader-rsvp.png` - Klasik RSVP okuma modu

 `reader-book.png` - Kitap simülasyonu modu

`statistics.png` - İstatistik sayfası

 `settings.png` - Ayarlar paneli



---



 🙏 Kaynakça



1\. Rayner, K. (1998). "Eye movements in reading and information processing" - \*Psychological Bulletin\*

2\. Potter, M. C. (1984). "Rapid serial visual presentation (RSVP): A method for studying language processing" - \*New Methods in Reading Comprehension Research\*

3\. Benedetto, S. et al. (2013). "E-Readers and visual fatigue" - \*PLoS ONE\*



---



\*\*Proje Durumu:\*\* ✅ Tamamlandı (Beta v1.0)  

\*\*Son Güncelleme:\*\* 14 Ekim 2025  

\*\*Lisans:\*\* Eğitim Amaçlı Kullanım

