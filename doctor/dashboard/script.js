// Toggle profile dropdown
document.addEventListener('DOMContentLoaded', () => {
  const profileMenu = document.getElementById('profileMenu');
  const profileDropdown = document.getElementById('profileDropdown');
  const avatarBtn = document.getElementById('avatarBtn');
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  // Profile dropdown logic
  if (avatarBtn && profileDropdown) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent immediate closing by window listener
      profileMenu.classList.toggle('open');
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', (event) => {
      // Check if the click is outside both the menu button and the dropdown itself
      if (!avatarBtn.contains(event.target) && !profileMenu.contains(event.target)) {
        profileMenu.classList.remove('open');
      }
    });
  }

  // Hamburger menu logic
  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Update dashboard metrics from shared storage
  try {
    const raw = localStorage.getItem('clf_patients');
    const patients = raw ? JSON.parse(raw) : [];
    const todayStr = new Date().toISOString().slice(0,10);
    const todayCount = patients.filter(p => (p.registeredAt || '').slice(0,10) === todayStr).length;
    const el = document.getElementById('todayPatientsCount');
    if (el) el.textContent = String(todayCount);
  } catch {}
});