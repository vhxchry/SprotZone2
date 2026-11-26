const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const courtSelect = document.getElementById('courtSelect');
const priceEstimate = document.getElementById('priceEstimate');
const bookingForm = document.getElementById('bookingForm');
const successMessage = document.getElementById('successMessage');
const bookingDate = document.getElementById('bookingDate');
const receipt = document.getElementById('receipt');
const printReceiptButton = document.getElementById('printReceipt');

const prices = { 'Futsal A': 100000, 'Futsal B': 120000, 'Badminton': 50000 };

const rupiah = (number) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0
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

const today = new Date();
const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
  .toISOString().split('T')[0];
bookingDate.min = localToday;

function updatePrice() {
  priceEstimate.textContent = rupiah(prices[courtSelect.value] || 0);
}
courtSelect.addEventListener('change', updatePrice);

document.querySelectorAll('.book-button').forEach((button) => {
  button.addEventListener('click', () => {
    courtSelect.value = button.dataset.court;
    updatePrice();
    document.getElementById('pemesanan').scrollIntoView({ behavior: 'smooth' });
  });
});

function formatDate(dateString) {
  return new Date(`${dateString}T00:00:00`).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

function createBookingNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replaceAll('-', '');
  return `SZ-${datePart}-${Math.floor(1000 + Math.random() * 9000)}`;
}

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!bookingForm.reportValidity()) return;

  const data = new FormData(bookingForm);
  const name = data.get('customerName').trim();
  const phone = data.get('phone').trim();
  const date = data.get('bookingDate');
  const court = data.get('court');
  const time = data.get('time');

  if (!/^[0-9+\s-]{9,16}$/.test(phone)) {
    successMessage.className = 'success-message show';
    successMessage.textContent = 'Nomor WhatsApp belum sesuai. Periksa kembali nomor yang kamu masukkan.';
    return;
  }

  document.getElementById('receiptNumber').textContent = `Nomor booking: ${createBookingNumber()}`;
  document.getElementById('receiptName').textContent = name;
  document.getElementById('receiptPhone').textContent = phone;
  document.getElementById('receiptDate').textContent = formatDate(date);
  document.getElementById('receiptCourt').textContent = court;
  document.getElementById('receiptTime').textContent = time;
  document.getElementById('receiptPrice').textContent = rupiah(prices[court]);

  successMessage.className = 'success-message show';
  successMessage.textContent = 'Booking berhasil dicatat pada demo SportZone. Struk pemesanan sudah dibuat di bawah ini.';
  receipt.hidden = false;
  receipt.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

printReceiptButton.addEventListener('click', () => window.print());
