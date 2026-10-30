/* JavaScript portofolio florist: navigasi mobile dan validasi form kontak. */
document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Buka/tutup navigasi pada layar kecil.
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Buka menu navigasi');
      });
    });
  }

  // Menandai menu sesuai section yang sedang terlihat.
  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (link) {
            const matchesSection = link.getAttribute('href') === '#' + entry.target.id;
            link.classList.toggle('active', matchesSection);
          });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submittedData = document.getElementById('submittedData');
  const nameInput = document.getElementById('nama');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('pesan');

  const errorElements = {
    nama: document.getElementById('namaError'),
    email: document.getElementById('emailError'),
    pesan: document.getElementById('pesanError')
  };

  // Pola email sederhana untuk memeriksa format alamat email.
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function showFieldError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.toggle('invalid', Boolean(message));
    input.setAttribute('aria-invalid', String(Boolean(message)));
  }

  function clearErrors() {
    showFieldError(nameInput, errorElements.nama, '');
    showFieldError(emailInput, errorElements.email, '');
    showFieldError(messageInput, errorElements.pesan, '');
    formStatus.textContent = '';
    formStatus.className = 'form-status';
  }

  // Hilangkan pesan error pada suatu kolom ketika pengguna mulai memperbaikinya.
  [[nameInput, errorElements.nama], [emailInput, errorElements.email], [messageInput, errorElements.pesan]].forEach(function (pair) {
    pair[0].addEventListener('input', function () {
      if (pair[0].value.trim() !== '') showFieldError(pair[0], pair[1], '');
      if (formStatus.classList.contains('error')) {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }
    });
  });

  contactForm.addEventListener('submit', function (event) {
    // Mencegah reload halaman agar hasil form dapat tampil di bawah formulir.
    event.preventDefault();
    clearErrors();

    const nama = nameInput.value.trim();
    const email = emailInput.value.trim();
    const pesan = messageInput.value.trim();
    let isFormValid = true;

    if (!nama) {
      showFieldError(nameInput, errorElements.nama, 'Nama wajib diisi.');
      isFormValid = false;
    }
    if (!email) {
      showFieldError(emailInput, errorElements.email, 'Email wajib diisi.');
      isFormValid = false;
    } else if (!isValidEmail(email)) {
      showFieldError(emailInput, errorElements.email, 'Format email belum valid. Contoh: nama@email.com');
      isFormValid = false;
    }
    if (!pesan) {
      showFieldError(messageInput, errorElements.pesan, 'Pesan wajib diisi.');
      isFormValid = false;
    }

    if (!isFormValid) {
      formStatus.textContent = 'Periksa kembali kolom yang ditandai. Semua kolom wajib diisi dengan benar.';
      formStatus.className = 'form-status error';
      const firstInvalid = contactForm.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      submittedData.hidden = true;
      return;
    }

    // textContent digunakan agar input pengguna ditampilkan sebagai teks, bukan HTML.
    document.getElementById('resultNama').textContent = nama;
    document.getElementById('resultEmail').textContent = email;
    document.getElementById('resultPesan').textContent = pesan;
    submittedData.hidden = false;
    formStatus.textContent = 'Berhasil! Data formulir sudah ditampilkan di bawah ini.';
    formStatus.className = 'form-status success';
    submittedData.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Persentase progress bar adalah contoh visual dan dapat diubah sesuai kebutuhan.
});
