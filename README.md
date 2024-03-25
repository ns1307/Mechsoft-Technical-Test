# Mechsoft-Technical-Test
Mechsoft Teknik Test aşamasında istenen algoritma sorusunun cevapları ve istenen projedir.

## Meeting Organizer(Proje)

Meeting Organizer, müşteriler ile yapılacak toplantıların kaydedilebileceği, güncellenebileceği ve silinebileceği bir tek sayfa uygulamasıdır.
Flask sayesinde önyüzde sadece HTML,CSS, JavaScript kullanırken arka planda Python ile bir çok işlemi gerçekleştirebiliriz. Localde tuttuğumuz "meetings.json" dosyasını güncellemek yerine, bu işlemleri Veritabanında da gerçek zamanlı olarak işleyebiliriz.

### Önkoşullar

Projeyi çalıştırmak için bilgisayarda Python ve Flask yüklü olmalıdır.

### Kurulum

Projeyi lokal olarak çalıştırmak için aşağıdaki adımları takip edin:

1. Proje dosyalarını bilgisayarınıza klonlayın.
2. Proje için gerekli olan python ve flask kurulumunu tamamlayın.
3. Dosyanın bulunduğu dizinde terminali açarak Flask'ı çalıştırın:
```bash
flask run
```
4. Tarayıcınızda `http://127.0.0.1:5000/` adresine giderek uygulamayı kullanabilirsiniz.

## Kullanılan Teknolojiler

- Backend için **Flask**: Python tabanlı mikro web framework
- Frontend için **HTML**, **CSS** ve **JavaScript**: Kullanıcı arayüzü tasarımı ve etkileşimi
- **Materialize CSS**: Arayüz bileşenleri için modern bir CSS framework

## Özellikler
- Web arayüzünde yapılan "Yeni Toplantı ekleme", "Toplantı bilgilerini güncelleştirme", "Toplantı silme" gibi her işlem Flask ile "meetings.json" dosyasına yansıtılır. 
- **Toplantı Kayıt Formu**: Kullanıcıların toplantıya ait bilgileri girebilecekleri arayüz.
- Toplantı oluştururken alanların boş olmaması, seçilen tarihin gelecekte olması, toplantı bitiş saatinin toplantı başlangıç saatinden önce olmaması gibi önlemler alınmıştır.
- **Toplantı Güncelleme Formu**: Kullanıcıların toplantı bilgilerini güncelleyebilecekleri arayüz.
- Toplantı güncelleştirildikten sonra Toplantı Listesi de güncelleştirilir.
- **Toplantı Listesi**: Kullanıcıların eklenen toplantıları görüntüleyebilecekleri, düzenleyebilecekleri ve silebilecekleri arayüz.
- Toplantı Listesinde yer alan toplantılar tarihi en yakın olandan en uzak olana doğru sıralanmıştır. Her toplantı için güncelleme ve silme butonu vardır.

