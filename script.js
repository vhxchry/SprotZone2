const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const courtSelect = document.getElementById('courtSelect');
const priceEstimate = document.getElementById('priceEstimate');
const bookingForm = document.getElementById('bookingForm');
const successMessage = document.getElementById('successMessage');
const bookingDate = document.getElementById('bookingDate');

const prices = {
  'Futsal A': 100000,
  'Futsal B': 120000,
  'Badminton': 50000
};

const rupiah = (number) => new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0
}).format(number);

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '✕' : '☰';
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});

// Tanggal yang bisa dipilih dimulai dari hari ini.
const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString().split('T')[0];
bookingDate.min = localToday;

function updatePrice() {
  const selectedPrice = prices[courtSelect.value] || 0;
  priceEstimate.textContent = rupiah(selectedPrice);
}

courtSelect.addEventListener('change', updatePrice);

// Tombol pada setiap kartu akan memilih lapangan dan mengarahkan ke form.
document.querySelectorAll('.book-button').forEach((button) => {
  button.addEventListener('click', () => {
    courtSelect.value = button.dataset.court;
    updatePrice();
    document.getElementById('pemesanan').scrollIntoView({ behavior: 'smooth' });
  });
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!bookingForm.reportValidity()) return;

  const formData = new FormData(bookingForm);
  const name = formData.get('customerName').trim();
  const phone = formData.get('phone').trim();
  const date = formData.get('bookingDate');
  const court = formData.get('court');
  const time = formData.get('time');

  if (!/^[0-9+\s-]{9,16}$/.test(phone)) {
    successMessage.className = 'success-message show';
    successMessage.textContent = 'Nomor WhatsApp belum sesuai. Periksa kembali nomor yang kamu masukkan.';
    return;
  }

  successMessage.className = 'success-message show';
  successMessage.textContent =
    `Terima kasih, ${name}! Permintaan booking ${court} pada ${date}, pukul ${time} sudah tercatat di demo ini. Estimasi biaya: ${rupiah(prices[court])}.`;

  bookingForm.reset();
  priceEstimate.textContent = rupiah(0);
  bookingDate.min = localToday;
});
