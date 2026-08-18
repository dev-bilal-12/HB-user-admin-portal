/* =============================================
   HB DESIGNERS – Admin Panel Script v3
   Member: sirf apna data dekhega
   Admin: sab ka data dekhega
   ============================================= */

(function () {
  'use strict';

  // ===== SECURITY: Force login on reload =====
  (function forceLoginOnReload() {
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation');
    var isReload = nav && nav.length > 0 && (nav[0].type === 'reload' || nav[0].type === 'back_forward');
    if (isReload) { localStorage.removeItem('hb_session'); }
  })();

  // ===== SECURITY: Disable right-click =====
  document.addEventListener('contextmenu', function(e) { e.preventDefault(); return false; });

  // ===== SECURITY: Block dev tools shortcuts =====
  document.addEventListener('keydown', function(e) {
    // F12
    if (e.key === 'F12' || e.keyCode === 123) { e.preventDefault(); return false; }
    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+K
    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'K' || e.key === 'k' || e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 75)) { e.preventDefault(); return false; }
    // Ctrl+U (view source)
    if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) { e.preventDefault(); return false; }
    // Ctrl+S (save page)
    if (e.ctrlKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) { e.preventDefault(); return false; }
    // Ctrl+Shift+Delete
    if (e.ctrlKey && e.shiftKey && (e.key === 'Delete' || e.keyCode === 46)) { e.preventDefault(); return false; }
    // Cmd+Option+I (Mac)
    if (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'i')) { e.preventDefault(); return false; }
  });

  // ===== SECURITY: Anti-debugger =====
  setInterval(function() {
    var el = new Image();
    Object.defineProperty(el, 'id', {
      get: function() { throw new Error('Access denied'); }
    });
    console.dir(el);
  }, 1000);

  // ===== SECURITY: Block console =====
  (function() {
    var devToolsOpen = false;
    var threshold = 160;
    var widthCheck = function() {
      devToolsOpen = (window.outerWidth - window.innerWidth > threshold) || (window.outerHeight - window.innerHeight > threshold);
      if (devToolsOpen) {
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Inter,sans-serif;background:#030712;color:#f1f5f9;text-align:center;"><div><h1 style="font-size:28px;margin-bottom:12px;">Access Restricted</h1><p style="font-size:14px;color:#94a3b8;">DevTools detected. Session terminated.</p></div></div>';
        localStorage.removeItem('hb_session');
      }
    };
    setInterval(widthCheck, 1500);
    window.addEventListener('resize', widthCheck);
  })();

  // ===== SECURITY: Disable text selection on sensitive elements =====
  document.addEventListener('selectstart', function(e) {
    var tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (e.target.closest('.data-table') || e.target.closest('.sidebar') || e.target.closest('.report-card')) {
      e.preventDefault();
      return false;
    }
  });

  // ===== SECURITY: Disable dragging =====
  document.addEventListener('dragstart', function(e) {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
      return false;
    }
  });

  // ===== SECURITY: Block common screenshot shortcuts =====
  document.addEventListener('keyup', function(e) {
    if (e.key === 'PrintScreen') {
      try { navigator.clipboard.writeText(''); } catch(err) {}
    }
  });
  window.addEventListener('keyup', function(e) {
    if (e.keyCode === 44) { e.preventDefault(); return false; }
  });

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);

  const SESSION_KEY = 'hb_session';
  const USERS_KEY = 'hb_users';
  const REPORTS_KEY = 'hb_reports';
  const ATTENDANCE_KEY = 'hb_attendance';
  const THEME_KEY = 'hb_theme';
  const ACTIVITY_KEY = 'hb_activity';

  const ADMIN_CREDS = [
    { username: 'bilalsamadhbdesigners', password: 'hbdesigners2025bilal', name: 'Bilal Samad', email: 'bilal@hbdesigners.com', phone: '+92 300 1234567', designation: 'Admin' },
    { username: 'huzaifashahidhbdesigners', password: 'hbdesigners2025huzaifa', name: 'Huzaifa Shahid', email: 'uzaifashahid207@gmail.com', phone: '03193310554', designation: 'Admin' },
  ];

  // ===== DOM =====
  const loginPage = $('#loginPage');
  const dashboard = $('#dashboard');
  const loginForm = $('#loginForm');
  const usernameInput = $('#username');
  const passwordInput = $('#password');
  const roleSelect = $('#role');
  const loginError = $('#loginError');
  const loginBtn = $('#loginBtn');
  const themeToggle = $('#themeToggle');
  const togglePassword = $('#togglePassword');
  const logoImg = $('#logoImg');
  const logoFallback = $('#logoFallback');
  const roleSelectBox = $('#roleSelect');
  const roleDropdown = $('#roleDropdown');
  const rolePlaceholder = $('#rolePlaceholder');
  const roleValue = $('#roleValue');
  const selectOptions = $$('.custom-select-option');
  const sidebar = $('#sidebar');
  const sidebarOverlay = $('#sidebarOverlay');
  const menuToggle = $('#menuToggle');
  const navItems = $$('.nav-item');
  const logoutBtn = $('#logoutBtn');
  const mobileLogoutBtn = $('#mobileLogoutBtn');
  const mobileNavItems = $$('.mbn-item[data-page]');
  const globalSearch = $('#globalSearch');
  const searchModal = $('#searchModal');
  const searchModalClose = $('#searchModalClose');
  const searchResult = $('#searchResult');
  const addUserBtn = $('#addUserBtn');
  const addUserModal = $('#addUserModal');
  const modalClose = $('#modalClose');
  const modalCancel = $('#modalCancel');
  const addUserForm = $('#addUserForm');
  const usersTableBody = $('#usersTableBody');
  const usersEmpty = $('#usersEmpty');
  const userSearch = $('#userSearch');
  const reportsList = $('#reportsList');
  const reportsEmpty = $('#reportsEmpty');
  const reportSearch = $('#reportSearch');
  const attendanceTableBody = $('#attendanceTableBody');
  const attendanceEmpty = $('#attendanceEmpty');
  const attendanceSearch = $('#attendanceSearch');
  const markAttendanceBtn = $('#markAttendanceBtn');
  const dashMarkBtn = $('#dashMarkBtn');
  const submitReportBtn = $('#submitReportBtn');
  const reportModal = $('#reportModal');
  const reportModalClose = $('#reportModalClose');
  const reportForm = $('#reportForm');
  const reportCancel = $('#reportCancel');
  const reportFiles = $('#reportFiles');
  const fileUploadArea = $('#fileUploadArea');
  const filePreviewList = $('#filePreviewList');
  const profileAvatar = $('#profileAvatar');
  const avatarEditBtn = $('#avatarEditBtn');
  const avatarInput = $('#avatarInput');
  const profileName = $('#profileName');
  const profileRoleBadge = $('#profileRoleBadge');
  const profileEmail = $('#profileEmail');
  const profileFullName = $('#profileFullName');
  const profileEmailInput = $('#profileEmailInput');
  const profilePhone = $('#profilePhone');
  const profileDesignation = $('#profileDesignation');
  const saveProfileBtn = $('#saveProfileBtn');
  const topbarAvatar = $('#topbarAvatar');
  const topbarUsername = $('#topbarUsername');
  const sidebarRole = $('#sidebarRole');
  const imageModal = $('#imageModal');
  const imageModalClose = $('#imageModalClose');
  const imageModalImg = $('#imageModalImg');
  const reportDetailModal = $('#reportDetailModal');
  const reportDetailClose = $('#reportDetailClose');
  const reportDetailBody = $('#reportDetailBody');

  // ===== HELPERS =====
  function getStore(k, f) { try { return JSON.parse(localStorage.getItem(k)) || f; } catch { return f; } }
  function setStore(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  function toast(msg, type = 'info') { const t = $('#toast'); t.textContent = msg; t.className = 'toast ' + type; requestAnimationFrame(() => t.classList.add('show')); setTimeout(() => t.classList.remove('show'), 3000); }
  function today() { return new Date().toLocaleDateString('en-CA'); }
  function yesterday() { const d = new Date(); d.setDate(d.getDate() - 1); return d.toLocaleDateString('en-CA'); }
  function formatDate(s) { if (!s) return '—'; return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
  function formatTime(s) { if (!s) return '—'; return new Date(s).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); }
  function getInitials(n) { return (n || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2); }
  function addActivity(msg, userId) { const a = getStore(ACTIVITY_KEY, []); a.unshift({ msg, time: new Date().toISOString(), userId: userId || null }); if (a.length > 30) a.length = 30; setStore(ACTIVITY_KEY, a); }
  function isAdmin() { return getStore(SESSION_KEY, {}).role === 'admin'; }
  function myId() { return getStore(SESSION_KEY, {}).id; }

  // 6AM cycle
  function getCycleDate(date) {
    const d = date ? new Date(date) : new Date();
    if (d.getHours() < 6) { const p = new Date(d); p.setDate(p.getDate() - 1); return p.toLocaleDateString('en-CA'); }
    return d.toLocaleDateString('en-CA');
  }
  function getTodayCycle() { return getCycleDate(new Date()); }
  function getYesterdayCycle() {
    const today = getTodayCycle();
    const d = new Date(today + 'T12:00:00');
    d.setDate(d.getDate() - 1);
    return d.toLocaleDateString('en-CA');
  }
  function isTodayCycle(dateStr) { return dateStr === getTodayCycle(); }

  // ===== SEED DATA =====
  function seedData() {
    let users = getStore(USERS_KEY, []);
    if (users.length === 0) {
      users = ADMIN_CREDS.map((c, i) => ({ id: i + 1, name: c.name, username: c.username, email: c.email, phone: c.phone, designation: c.designation, password: c.password, role: 'admin', joined: new Date().toISOString(), status: 'active', avatar: '' }));
      setStore(USERS_KEY, users);
    } else {
      // Ensure new admins exist in existing data
      ADMIN_CREDS.forEach((c, i) => {
        if (!users.find(u => u.username === c.username)) {
          users.push({ id: Date.now() + i, name: c.name, username: c.username, email: c.email, phone: c.phone, designation: c.designation, password: c.password, role: 'admin', joined: new Date().toISOString(), status: 'active', avatar: '' });
        }
      });
      setStore(USERS_KEY, users);
    }
  }

  // ===== THEME =====
  function applyTheme(t) { document.documentElement.setAttribute('data-theme', t); localStorage.setItem(THEME_KEY, t); }
  applyTheme(localStorage.getItem(THEME_KEY) || 'light');
  themeToggle.addEventListener('click', () => applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

  // ===== LOGO =====
  if (logoImg) {
    logoImg.onload = () => { logoImg.classList.add('loaded'); logoFallback.classList.add('hidden'); };
    logoImg.onerror = () => { logoImg.style.display = 'none'; logoFallback.classList.remove('hidden'); };
    if (logoImg.complete && logoImg.naturalWidth > 0) { logoImg.classList.add('loaded'); logoFallback.classList.add('hidden'); }
  }

  // ===== PASSWORD TOGGLE =====
  togglePassword.addEventListener('click', () => { const p = passwordInput.type === 'password'; passwordInput.type = p ? 'text' : 'password'; togglePassword.classList.toggle('visible', p); });

  // ===== CUSTOM SELECT =====
  function closeDD() { roleSelectBox.classList.remove('open'); roleDropdown.classList.remove('show'); }
  roleSelectBox.addEventListener('click', (e) => { e.stopPropagation(); roleSelectBox.classList.contains('open') ? closeDD() : (roleSelectBox.classList.add('open'), roleDropdown.classList.add('show')); });
  document.addEventListener('click', () => closeDD());
  selectOptions.forEach(o => o.addEventListener('click', (e) => { e.stopPropagation(); roleSelect.value = o.dataset.value; rolePlaceholder.style.display = 'none'; roleValue.textContent = o.querySelector('.option-text').textContent; roleValue.classList.add('active'); selectOptions.forEach(x => x.classList.remove('selected')); o.classList.add('selected'); closeDD(); }));

  // ===== ENTER KEY NAVIGATION =====
  usernameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); passwordInput.focus(); } });
  passwordInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); roleSelectBox.click(); } });
  roleSelectBox.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); loginForm.requestSubmit(); } });

  // ===== LOGIN =====
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginError.textContent = '';
    loginError.classList.remove('visible');
    const user = usernameInput.value.trim(), pass = passwordInput.value.trim(), role = roleSelect.value;
    if (!user || !pass || !role) { showErr('Please fill in all fields.'); return; }
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    setTimeout(() => {
      const users = getStore(USERS_KEY, []);
      let matched = null;
      const adminCred = ADMIN_CREDS.find(c => c.username === user && c.password === pass);
      if (adminCred && role === 'admin') {
        matched = users.find(u => u.username === user);
        if (!matched) { matched = { id: Date.now(), name: adminCred.name, username: user, email: adminCred.email, phone: adminCred.phone, role: 'admin', designation: adminCred.designation, joined: new Date().toISOString(), status: 'active', avatar: '', password: pass }; users.unshift(matched); setStore(USERS_KEY, users); }
      } else if (role === 'member') {
        matched = users.find(u => u.username === user && u.password === pass);
      }
      if (!matched) { loginBtn.classList.remove('loading'); loginBtn.disabled = false; showErr('Invalid credentials.'); return; }
      const session = { ...matched, loginTime: new Date().toISOString() };
      setStore(SESSION_KEY, session);
      addActivity(matched.name + ' logged in', matched.id);
      loginBtn.classList.remove('loading'); loginBtn.disabled = false;
      toast('Welcome, ' + matched.name + '!', 'success');
      setTimeout(() => showDashboard(matched), 600);
    }, 700);
  });

  function showErr(m) { loginError.textContent = m; loginError.classList.add('visible'); }

  // ===== SHOW DASHBOARD =====
  function showDashboard(user) {
    loginPage.classList.add('hidden');
    dashboard.classList.remove('hidden');
    const admin = user.role === 'admin', name = user.name || user.username;
    sidebarRole.textContent = admin ? 'Admin' : 'Member';
    topbarUsername.textContent = name;
    topbarAvatar.textContent = getInitials(name);
    profileName.textContent = name;
    profileRoleBadge.textContent = admin ? 'Admin' : 'Member';
    profileEmail.textContent = user.email || '—';
    profileFullName.value = user.name || '';
    profileEmailInput.value = user.email || '';
    profilePhone.value = user.phone || '';
    profileDesignation.value = user.designation || '';
    profileAvatar.textContent = getInitials(name);
    if (user.avatar) { profileAvatar.innerHTML = '<img src="' + user.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>'; topbarAvatar.innerHTML = '<img src="' + user.avatar + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>'; }

    // === ROLE BASED UI ===
    // Admin only elements
    $$('.admin-only').forEach(el => el.style.display = admin ? '' : 'none');

    // Global search — sirf admin ke liye
    globalSearch.closest('.search-box').style.display = admin ? '' : 'none';

    // Users nav — sirf admin ke liye
    const usersNav = $('a[data-page="users"]');
    if (usersNav) usersNav.style.display = admin ? '' : 'none';

    // Users page search
    const usersPageToolbar = $('#userToolbar');
    if (usersPageToolbar) usersPageToolbar.style.display = admin ? '' : 'none';

    // Reports search — sirf admin ke liye
    const reportSearchBox = reportSearch?.closest('.search-box');
    if (reportSearchBox) reportSearchBox.style.display = admin ? '' : 'none';

    // Attendance search — sirf admin ke liye
    const attSearchBox = attendanceSearch?.closest('.search-box');
    if (attSearchBox) attSearchBox.style.display = admin ? '' : 'none';

    // Attendance mark button — sirf member
    markAttendanceBtn.style.display = admin ? 'none' : '';

    // Submit Report button — sirf member
    submitReportBtn.style.display = admin ? 'none' : '';

    // Users table show only to admin
    const usersTable = $('#usersTable');
    if (usersTable) usersTable.closest('.table-container').style.display = admin ? '' : 'none';
    if (usersEmpty) usersEmpty.style.display = admin ? '' : 'none';

    renderAll();
  }

  function checkSession() {
    seedData();
    const s = getStore(SESSION_KEY, null);
    if (s && s.username) { loginPage.classList.add('hidden'); dashboard.classList.remove('hidden'); showDashboard(s); }
  }

  // ===== NAV =====
  navItems.forEach(n => n.addEventListener('click', (e) => {
    e.preventDefault();
    const pg = n.dataset.page;
    // Member Users page pe ja nahi sakta
    if (!isAdmin() && pg === 'users') return;
    navItems.forEach(x => x.classList.remove('active'));
    n.classList.add('active');
    syncMobileNav(pg);
    $$('.page').forEach(p => p.classList.remove('active'));
    const t = $('#page-' + pg);
    if (t) t.classList.add('active');
    closeSidebar();
    if (pg === 'reports') setReportDate('today');
    if (pg === 'attendance') setAttDate('today');
    renderAll();
  }));

  $$('.quick-btn').forEach(b => b.addEventListener('click', () => {
    const p = b.dataset.goto;
    if (!isAdmin() && p === 'users') return;
    navItems.forEach(n => n.classList.toggle('active', n.dataset.page === p));
    syncMobileNav(p);
    $$('.page').forEach(pg => pg.classList.toggle('active', pg.id === 'page-' + p));
    closeSidebar();
    if (p === 'reports') setReportDate('today');
    if (p === 'attendance') setAttDate('today');
    renderAll();
  }));

  menuToggle.addEventListener('click', () => sidebar.classList.add('open'));
  sidebarOverlay.addEventListener('click', closeSidebar);
  function closeSidebar() { sidebar.classList.remove('open'); }
  function syncMobileNav(p) { $$('.mbn-item[data-page]').forEach(b => b.classList.toggle('active', b.dataset.page === p)); }

  // Mobile search toggle
  const mobileSearchBtn = $('#mobileSearchBtn');
  if (mobileSearchBtn) mobileSearchBtn.addEventListener('click', () => {
    const sb = globalSearch.closest('.search-box');
    sb.style.display = sb.style.display === 'flex' ? 'none' : 'flex';
    if (sb.style.display === 'flex') { globalSearch.focus(); sb.style.position = 'absolute'; sb.style.left = '0'; sb.style.right = '0'; sb.style.top = '56px'; sb.style.zIndex = '80'; sb.style.padding = '10px 14px'; sb.style.background = 'var(--bg-card-solid)'; sb.style.borderBottom = '1px solid var(--border)'; sb.style.boxShadow = 'var(--shadow-md)'; }
  });

  // Mobile bottom nav
  mobileNavItems.forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    const p = btn.dataset.page;
    $$('.mbn-item[data-page]').forEach(b => b.classList.toggle('active', b === btn));
    navItems.forEach(n => n.classList.toggle('active', n.dataset.page === p));
    $$('.page').forEach(pg => pg.classList.toggle('active', pg.id === 'page-' + p));
    if (p === 'reports') setReportDate('today');
    if (p === 'attendance') setAttDate('today');
    renderAll();
    window.scrollTo(0, 0);
  }));
  if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', () => { localStorage.removeItem(SESSION_KEY); dashboard.classList.add('hidden'); loginPage.classList.remove('hidden'); loginForm.reset(); roleSelect.value = ''; rolePlaceholder.style.display = ''; roleValue.textContent = ''; roleValue.classList.remove('active'); selectOptions.forEach(o => o.classList.remove('selected')); toast('Logged out.', 'info'); });

  logoutBtn.addEventListener('click', () => { localStorage.removeItem(SESSION_KEY); dashboard.classList.add('hidden'); loginPage.classList.remove('hidden'); loginForm.reset(); roleSelect.value = ''; rolePlaceholder.style.display = ''; roleValue.textContent = ''; roleValue.classList.remove('active'); selectOptions.forEach(o => o.classList.remove('selected')); toast('Logged out.', 'info'); });

  // ===== RENDER ALL =====
  function renderAll() { renderStats(); renderReviewStatus(); renderMyAttendance(); renderMyReports(); renderMyAttendance2(); renderActivity(); if (isAdmin()) renderUsers(); }

  // ===== STATS (MEMBER = apna data, ADMIN = sab ka) =====
  function renderStats() {
    const users = getStore(USERS_KEY, []), att = getStore(ATTENDANCE_KEY, []), reports = getStore(REPORTS_KEY, []);
    const cycle = getTodayCycle();
    const admin = isAdmin();

    if (admin) {
      // Admin: sab ka data
      const adminIds = users.filter(u => u.role === 'admin').map(u => u.id);
      const totalMembers = users.filter(u => u.role === 'member').length;
      const members = users.filter(u => u.role === 'member');

      // Present today (current 6AM cycle)
      const todayAtt = att.filter(a => a.date === cycle && !adminIds.includes(a.userId));
      $('#statUsers').textContent = totalMembers;
      $('#statPresent').textContent = todayAtt.length;
      $('#statReports').textContent = reports.filter(r => isTodayCycle(r.date)).length;

      // Absent = YESTERDAY's absent (previous 6AM cycle)
      const yestCycle = getYesterdayCycle();
      const yestAtt = att.filter(a => a.date === yestCycle && !adminIds.includes(a.userId));
      const yestPresentIds = yestAtt.map(a => a.userId);
      const yestAbsent = members.filter(u => !yestPresentIds.includes(u.id)).length;
      $('#statAbsent').textContent = yestAbsent;

      $('#statUsersLabel').textContent = 'Total Users';
      $('#statPresentLabel').textContent = 'Present Today';
      $('#statReportsLabel').textContent = 'Reports Today';
      $('#statAbsentLabel').textContent = 'Absent Yesterday';
    } else {
      // Member: sirf apna data
      const uid = myId();
      const myAtt = att.find(a => a.userId === uid && a.date === cycle);
      const myReports = reports.filter(r => r.userId === uid && isTodayCycle(r.date));
      $('#statUsers').textContent = '—';
      $('#statPresent').textContent = myAtt ? 'Present' : 'Absent';
      $('#statReports').textContent = myReports.length;
      $('#statAbsent').textContent = myAtt ? '—' : 'Not Marked';
      $('#statUsersLabel').textContent = 'Status';
      $('#statPresentLabel').textContent = 'My Attendance';
      $('#statReportsLabel').textContent = 'My Reports Today';
      $('#statAbsentLabel').textContent = 'Attendance Status';
    }
  }

  // ===== REVIEW STATUS =====
  function renderReviewStatus() {
    const users = getStore(USERS_KEY, []);
    const att = getStore(ATTENDANCE_KEY, []);
    const reports = getStore(REPORTS_KEY, []);
    const admin = isAdmin();
    const card = $('#reviewStatusCard');
    const fill = $('#reviewProgressFill');
    const percent = $('#reviewPercent');
    const details = $('#reviewDetails');

    if (!card) return;

    // Calculate user's review % based on days since joining
    function calcUserReview(user) {
      const joined = new Date(user.joined);
      const now = new Date();
      joined.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      const totalDays = Math.max(1, Math.floor((now - joined) / 86400000) + 1);

      // Collect all unique active dates (attendance OR report)
      const activeDates = new Set();
      att.filter(a => a.userId === user.id).forEach(a => activeDates.add(a.date));
      reports.filter(r => r.userId === user.id).forEach(r => {
        // reports store cycle date (6AM based)
        activeDates.add(r.date);
      });

      // Count how many of those active dates fall within the joining period
      let activeDays = 0;
      for (let i = 0; i < totalDays; i++) {
        const d = new Date(joined);
        d.setDate(d.getDate() + i);
        const dateStr = d.toLocaleDateString('en-CA');
        if (activeDates.has(dateStr)) activeDays++;
      }

      return { percent: Math.round((activeDays / totalDays) * 100), activeDays, totalDays };
    }

    let overallPercent = 0;
    let detailsHtml = '';

    if (admin) {
      const members = users.filter(u => u.role === 'member');
      if (members.length === 0) {
        overallPercent = 0;
        detailsHtml = '<span class="review-detail-item"><span class="review-dot dot-yellow"></span>No team members yet</span>';
      } else {
        let totalPct = 0;
        let bestMember = '', bestPct = 0;
        members.forEach(m => {
          const r = calcUserReview(m);
          totalPct += r.percent;
          if (r.percent > bestPct) { bestPct = r.percent; bestMember = m.name || m.username; }
        });
        overallPercent = Math.round(totalPct / members.length);
        detailsHtml =
          '<span class="review-detail-item"><span class="review-dot dot-green"></span>Team Average: ' + overallPercent + '%</span>' +
          (bestMember ? '<span class="review-detail-item"><span class="review-dot dot-blue"></span>Top: ' + bestMember + ' (' + bestPct + '%)</span>' : '');
      }
    } else {
      const me = users.find(u => u.id === myId());
      if (me) {
        const r = calcUserReview(me);
        overallPercent = r.percent;
        detailsHtml =
          '<span class="review-detail-item"><span class="review-dot dot-green"></span>Active: ' + r.activeDays + ' / ' + r.totalDays + ' days</span>' +
          '<span class="review-detail-item"><span class="review-dot dot-blue"></span>Since: ' + new Date(me.joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + '</span>';
      }
    }

    let colorClass = 'color-red';
    if (overallPercent >= 65) colorClass = 'color-green';
    else if (overallPercent >= 50) colorClass = 'color-yellow';

    fill.className = 'review-progress-fill ' + colorClass;
    percent.className = 'review-status-percent ' + colorClass;
    percent.textContent = overallPercent + '%';
    details.innerHTML = detailsHtml;

    requestAnimationFrame(() => { fill.style.width = overallPercent + '%'; });
  }

  // ===== MY ATTENDANCE CARD (Dashboard) =====
  function renderMyAttendance() {
    const session = getStore(SESSION_KEY, {});
    const myCard = $('#myAttendanceCard');
    if (session.role === 'admin') { myCard.style.display = 'none'; return; }
    myCard.style.display = '';
    const att = getStore(ATTENDANCE_KEY, []);
    const cycle = getTodayCycle();
    const myAtt = att.find(a => a.userId === session.id && a.date === cycle);
    $('#myAttDate').textContent = formatDate(cycle) + ' (6:00 AM cycle)';
    const icon = $('#myAttIcon'), status = $('#myAttStatus'), btn = $('#dashMarkBtn');
    if (myAtt) {
      icon.className = 'my-att-icon present';
      status.textContent = 'Present — ' + formatTime(myAtt.checkIn);
      status.className = 'my-att-status present';
      btn.textContent = '✓ Marked';
      btn.disabled = true;
      btn.classList.add('marked');
    } else {
      icon.className = 'my-att-icon absent';
      status.textContent = 'Not Marked Yet';
      status.className = 'my-att-status absent';
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> Mark Attendance';
      btn.disabled = false;
      btn.classList.remove('marked');
    }
  }

  // ===== HELPER: render files in report cards =====
  function renderReportFiles(files) {
    if (!files || !files.length) return '';
    let h = '<div class="report-files">';
    files.forEach((f) => {
      const isImg = f.type && f.type.startsWith('image/');
      const safeData = f.data || '';
      if (isImg) {
        h += '<div class="report-file-item"><img src="' + safeData + '" class="report-thumb" onclick="window._viewImage(this.src)" alt="' + f.name + '"/><div class="report-file-meta"><span class="report-file-name" title="' + f.name + '">' + f.name + '</span><a class="report-file-dl" href="' + safeData + '" download="' + f.name + '" title="Download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></a></div></div>';
      } else {
        h += '<div class="report-file-item file-doc"><div class="file-doc-icon">' + getFileIcon(f.name, f.type) + '</div><div class="report-file-meta"><span class="report-file-name" title="' + f.name + '">' + f.name + '</span><a class="report-file-dl" href="' + safeData + '" download="' + f.name + '" title="Download"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></a></div></div>';
      }
    });
    h += '</div>';
    return h;
  }

  // ===== MEMBER'S REPORTS (apne reports) =====
  function renderMyReports() {
    const session = getStore(SESSION_KEY, {});
    if (session.role === 'admin') { renderReports(); return; }
    let reports = getStore(REPORTS_KEY, []).filter(r => r.userId === session.id);
    const range = getReportDateRange();
    if (range) { reports = reports.filter(r => r.date >= range.start && r.date <= range.end); }
    reports.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    if (!reports.length) { reportsList.innerHTML = ''; reportsEmpty.classList.remove('hidden'); return; }
    reportsEmpty.classList.add('hidden');
    const grouped = {};
    reports.forEach(r => { if (!grouped[r.date]) grouped[r.date] = []; grouped[r.date].push(r); });
    let html = '';
    Object.keys(grouped).sort().reverse().forEach(date => {
      html += '<div class="report-date-group"><div class="report-date-header"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ' + formatDate(date) + '</div>';
      grouped[date].forEach(r => {
        html += '<div class="report-card clickable" onclick="window._openReport(' + r.id + ')"><div class="report-card-top"><div class="user-cell"><div class="avatar-sm">' + getInitials(r.userName) + '</div><div><strong>' + r.userName + '</strong><small>' + formatTime(r.createdAt || r.date) + '</small></div></div><span class="badge badge-' + (r.status === 'completed' ? 'green' : r.status === 'in-progress' ? 'yellow' : 'blue') + '">' + r.status + '</span></div><p class="report-text">' + (r.task || '—') + '</p>';
        html += renderReportFiles(r.files || (r.image ? [{ name: 'image.jpg', type: 'image/jpeg', data: r.image }] : []));
        html += '</div>';
      });
      html += '</div>';
    });
    reportsList.innerHTML = html;
  }

  // ===== MEMBER'S ATTENDANCE (apni attendance) =====
  function renderMyAttendance2() {
    const session = getStore(SESSION_KEY, {});
    if (session.role === 'admin') { renderAttendance(); return; }
    let att = getStore(ATTENDANCE_KEY, []).filter(a => a.userId === session.id);
    const range = getAttDateRange();
    if (range) { att = att.filter(a => a.date >= range.start && a.date <= range.end); }
    att.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    if (!att.length) { attendanceTableBody.innerHTML = ''; attendanceEmpty.classList.remove('hidden'); return; }
    attendanceEmpty.classList.add('hidden');
    attendanceTableBody.innerHTML = att.map(a =>
      '<tr><td><strong>' + (a.userName || '—') + '</strong></td><td>' + formatDate(a.date) + '<small class="cycle-label"> 6:00 AM cycle</small></td><td>' + formatTime(a.checkIn) + '</td><td><span class="badge badge-green">' + a.status + '</span></td></tr>'
    ).join('');
  }

  // ===== ADMIN: ALL REPORTS =====
  function renderReports(filter) {
    let reports = getStore(REPORTS_KEY, []);
    const range = getReportDateRange();
    reports = reports.filter(r => r.date >= range.start && r.date <= range.end);
    if (filter) { const q = filter.toLowerCase(); reports = reports.filter(r => (r.userName || '').toLowerCase().includes(q) || (r.task || '').toLowerCase().includes(q)); }
    if (!reports.length) { reportsList.innerHTML = ''; reportsEmpty.classList.remove('hidden'); return; }
    reportsEmpty.classList.add('hidden');
    const grouped = {};
    reports.forEach(r => { if (!grouped[r.date]) grouped[r.date] = []; grouped[r.date].push(r); });
    let html = '';
    Object.keys(grouped).sort().reverse().forEach(date => {
      html += '<div class="report-date-group"><div class="report-date-header"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ' + formatDate(date) + '</div>';
      grouped[date].forEach(r => {
        html += '<div class="report-card clickable" onclick="window._openReport(' + r.id + ')"><div class="report-card-top"><div class="user-cell"><div class="avatar-sm">' + getInitials(r.userName) + '</div><div><strong>' + r.userName + '</strong><small>' + formatTime(r.createdAt || r.date) + '</small></div></div><span class="badge badge-' + (r.status === 'completed' ? 'green' : r.status === 'in-progress' ? 'yellow' : 'blue') + '">' + r.status + '</span></div><p class="report-text">' + (r.task || '—') + '</p>';
        html += renderReportFiles(r.files || (r.image ? [{ name: 'image.jpg', type: 'image/jpeg', data: r.image }] : []));
        html += '</div>';
      });
      html += '</div>';
    });
    reportsList.innerHTML = html;
  }

  // ===== ADMIN: ALL ATTENDANCE =====
  function renderAttendance(filter) {
    const users = getStore(USERS_KEY, []);
    const adminUsernames = users.filter(u => u.role === 'admin').map(u => u.username);
    let att = getStore(ATTENDANCE_KEY, []);
    att = att.filter(a => !adminUsernames.includes(a.userName));
    const range = getAttDateRange();
    att = att.filter(a => a.date >= range.start && a.date <= range.end);
    if (filter) { const q = filter.toLowerCase(); att = att.filter(a => (a.userName || '').toLowerCase().includes(q)); }
    if (!att.length) { attendanceTableBody.innerHTML = ''; attendanceEmpty.classList.remove('hidden'); return; }
    attendanceEmpty.classList.add('hidden');
    att.sort((a, b) => (b.checkIn || '').localeCompare(a.checkIn || ''));
    attendanceTableBody.innerHTML = att.map(a =>
      '<tr><td><strong>' + (a.userName || '—') + '</strong></td><td>' + formatDate(a.date) + '<small class="cycle-label"> 6:00 AM cycle</small></td><td>' + formatTime(a.checkIn) + '</td><td><span class="badge badge-green">' + a.status + '</span></td></tr>'
    ).join('');
  }

  // ===== ACTIVITY =====
  function renderActivity() {
    let acts = getStore(ACTIVITY_KEY, []);
    if (!isAdmin()) { acts = acts.filter(a => a.userId === myId()); }
    const el = $('#activityList');
    if (!acts.length) { el.innerHTML = '<p class="empty-state">No activity yet.</p>'; return; }
    el.innerHTML = acts.slice(0, 8).map(a => '<div class="activity-item"><span class="activity-dot"></span><div><p>' + a.msg + '</p><small>' + formatTime(a.time) + '</small></div></div>').join('');
  }

  // ===== USERS (ADMIN ONLY) =====
  function renderUsers(filter) {
    if (!isAdmin()) return;
    let users = getStore(USERS_KEY, []);
    if (filter) { const q = filter.toLowerCase(); users = users.filter(u => (u.name || '').toLowerCase().includes(q) || (u.username || '').toLowerCase().includes(q)); }
    if (!users.length) { usersTableBody.innerHTML = ''; usersEmpty.classList.remove('hidden'); return; }
    usersEmpty.classList.add('hidden');
    const session = getStore(SESSION_KEY, {});
    usersTableBody.innerHTML = users.map(u => {
      const cur = u.username === session.username;
      return '<tr><td><div class="user-cell"><div class="avatar-sm">' + getInitials(u.name) + '</div><div><strong>' + (u.name || '—') + '</strong><small>@' + (u.username || '—') + '</small></div></div></td><td><span class="badge badge-' + (u.role === 'admin' ? 'blue' : 'green') + '">' + u.role + '</span></td><td>' + formatDate(u.joined) + '</td><td><span class="status-dot ' + u.status + '"></span>' + u.status + '</td><td><button class="btn-icon" onclick="window._viewUser(\'' + u.username + '\')" title="View"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>' + (!cur ? '<button class="btn-icon btn-danger" onclick="window._delUser(' + u.id + ')" title="Delete"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>' : '') + '</td></tr>';
    }).join('');
  }

  window._viewUser = function (username) {
    const u = getStore(USERS_KEY, []).find(x => x.username === username);
    if (!u) return;
    const reps = getStore(REPORTS_KEY, []).filter(r => r.userId === u.id);
    const att = getStore(ATTENDANCE_KEY, []).filter(a => a.userId === u.id);
    searchResult.innerHTML =
      '<div class="search-profile"><div class="search-avatar">' + getInitials(u.name) + '</div><h4>' + (u.name || '—') + '</h4><span class="badge badge-' + (u.role === 'admin' ? 'blue' : 'green') + '">' + u.role + '</span></div>' +
      '<div class="search-info-grid"><div class="info-item"><small>Username</small><span>@' + (u.username || '—') + '</span></div><div class="info-item"><small>Email</small><span>' + (u.email || '—') + '</span></div><div class="info-item"><small>Phone</small><span>' + (u.phone || '—') + '</span></div><div class="info-item"><small>Designation</small><span>' + (u.designation || '—') + '</span></div><div class="info-item"><small>Joined</small><span>' + formatDate(u.joined) + '</span></div><div class="info-item"><small>Status</small><span>' + u.status + '</span></div></div>' +
      '<div class="search-section"><h4>Reports (' + reps.length + ')</h4>' + (reps.length ? '<div class="search-list">' + reps.slice(0, 5).map(r => '<div class="search-list-item"><span>' + formatDate(r.date) + ': ' + r.task.slice(0, 60) + '</span><span class="badge badge-' + (r.status === 'completed' ? 'green' : 'yellow') + '">' + r.status + '</span></div>').join('') + '</div>' : '<p class="empty-state">No reports.</p>') + '</div>' +
      '<div class="search-section"><h4>Attendance (' + att.length + ')</h4>' + (att.length ? '<div class="search-list">' + att.slice(0, 5).map(a => '<div class="search-list-item"><span>' + formatDate(a.date) + ' — ' + formatTime(a.checkIn) + '</span><span class="badge badge-green">' + a.status + '</span></div>').join('') + '</div>' : '<p class="empty-state">No records.</p>') + '</div>';
    searchModal.classList.add('show');
  };

  window._delUser = function (id) { if (!confirm('Delete this user?')) return; let u = getStore(USERS_KEY, []); u = u.filter(x => x.id !== id); setStore(USERS_KEY, u); addActivity('User deleted'); renderAll(); toast('User deleted.', 'info'); };
  userSearch?.addEventListener('input', () => renderUsers(userSearch.value));

  // ===== ADD USER MODAL =====
  addUserBtn.addEventListener('click', () => addUserModal.classList.add('show'));
  modalClose.addEventListener('click', () => addUserModal.classList.remove('show'));
  modalCancel.addEventListener('click', () => addUserModal.classList.remove('show'));
  addUserModal.addEventListener('click', (e) => { if (e.target === addUserModal) addUserModal.classList.remove('show'); });

  addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#newUserName').value.trim(), username = $('#newUserUsername').value.trim(), email = $('#newUserEmail').value.trim(), phone = $('#newUserPhone').value.trim(), designation = $('#newUserDesignation').value.trim(), password = $('#newUserPassword').value.trim();
    if (!name || !username || !password) { toast('Name, username, password required.', 'error'); return; }
    if (password.length < 6) { toast('Password min 6 chars.', 'error'); return; }
    let users = getStore(USERS_KEY, []);
    if (users.find(u => u.username === username)) { toast('Username exists.', 'error'); return; }
    users.push({ id: Date.now(), name, username, email, phone, designation, password, role: 'member', joined: new Date().toISOString(), status: 'active', avatar: '' });
    setStore(USERS_KEY, users); addUserForm.reset(); addUserModal.classList.remove('show'); addActivity('Added user: ' + name); renderAll(); toast('User added!', 'success');
  });

  // ===== REPORT FILTERS =====
  let reportFilterDate = 'today';
  function setReportDate(v) {
    reportFilterDate = v;
    $$('#page-reports .date-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.date === v));
    const oldersSearch = $('#reportOldersSearch');
    if (oldersSearch) oldersSearch.style.display = v === 'olders' ? '' : 'none';
    if (v !== 'olders') { const f = $('#reportOldersFilter'); if (f) f.value = ''; }
    renderAll();
  }
  $$('#page-reports .date-filter-btn').forEach(b => b.addEventListener('click', () => setReportDate(b.dataset.date)));
  $('#reportOldersFilter')?.addEventListener('input', () => renderAll());
  function getReportDateRange() {
    if (reportFilterDate === 'yesterday') return { start: yesterday(), end: yesterday() };
    if (reportFilterDate === 'olders') return null;
    return { start: getTodayCycle(), end: getTodayCycle() };
  }

  window._viewImage = function (src) { imageModalImg.src = src; imageModal.classList.add('show'); };
  imageModalClose.addEventListener('click', () => imageModal.classList.remove('show'));
  imageModal.addEventListener('click', (e) => { if (e.target === imageModal) imageModal.classList.remove('show'); });

  // ===== REPORT DETAIL MODAL =====
  window._openReport = function (reportId) {
    const reports = getStore(REPORTS_KEY, []);
    const r = reports.find(x => x.id === reportId);
    if (!r) return;
    const files = r.files || (r.image ? [{ name: 'image.jpg', type: 'image/jpeg', data: r.image }] : []);
    const statusClass = r.status === 'completed' ? 'green' : r.status === 'in-progress' ? 'yellow' : 'blue';

    let filesHtml = '';
    if (files.length) {
      filesHtml = '<div class="rd-files"><h4>Attachments (' + files.length + ')</h4><div class="rd-files-grid">';
      files.forEach(f => {
        const isImg = f.type && f.type.startsWith('image/');
        const safeData = f.data || '';
        const size = formatFileSize(f.size || 0);
        if (isImg) {
          filesHtml += '<div class="rd-file"><div class="rd-file-img-wrap"><img src="' + safeData + '" alt="' + f.name + '" onclick="window._viewImage(this.src)"/></div><div class="rd-file-info"><span class="rd-file-name" title="' + f.name + '">' + f.name + '</span><span class="rd-file-size">' + size + '</span></div><a class="rd-file-dl" href="' + safeData + '" download="' + f.name + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download</a></div>';
        } else {
          filesHtml += '<div class="rd-file rd-file-doc"><div class="rd-file-doc-icon">' + getFileIcon(f.name, f.type) + '</div><div class="rd-file-info"><span class="rd-file-name" title="' + f.name + '">' + f.name + '</span><span class="rd-file-size">' + size + '</span></div><a class="rd-file-dl" href="' + safeData + '" download="' + f.name + '"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Download</a></div>';
        }
      });
      filesHtml += '</div></div>';
    }

    reportDetailBody.innerHTML =
      '<div class="rd-header"><div class="rd-user"><div class="avatar-sm">' + getInitials(r.userName) + '</div><div><strong>' + (r.userName || '—') + '</strong><small>' + (r.date || '—') + ' (6:00 AM cycle)</small></div></div><span class="badge badge-' + statusClass + '">' + r.status + '</span></div>' +
      '<div class="rd-task"><h4>Task Description</h4><p>' + (r.task || '—') + '</p></div>' +
      filesHtml;

    reportDetailModal.classList.add('show');
  };

  reportDetailClose.addEventListener('click', () => reportDetailModal.classList.remove('show'));
  reportDetailModal.addEventListener('click', (e) => { if (e.target === reportDetailModal) reportDetailModal.classList.remove('show'); });

  function formatFileSize(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  reportSearch?.addEventListener('input', () => renderReports(reportSearch.value));

  // ===== SUBMIT REPORT (MULTI-FILE) =====
  submitReportBtn.addEventListener('click', () => reportModal.classList.add('show'));
  reportModalClose.addEventListener('click', () => reportModal.classList.remove('show'));
  reportCancel.addEventListener('click', () => reportModal.classList.remove('show'));
  reportModal.addEventListener('click', (e) => { if (e.target === reportModal) reportModal.classList.remove('show'); });

  let reportAttachedFiles = [];

  fileUploadArea.addEventListener('click', () => reportFiles.click());
  fileUploadArea.addEventListener('dragover', (e) => { e.preventDefault(); fileUploadArea.classList.add('drag-over'); });
  fileUploadArea.addEventListener('dragleave', () => fileUploadArea.classList.remove('drag-over'));
  fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('drag-over');
    addFiles(e.dataTransfer.files);
  });
  reportFiles.addEventListener('change', () => { addFiles(reportFiles.files); reportFiles.value = ''; });

  function addFiles(fileList) {
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > 10 * 1024 * 1024) { toast(file.name + ' exceeds 10MB limit.', 'error'); continue; }
      if (reportAttachedFiles.length >= 10) { toast('Max 10 files allowed.', 'error'); break; }
      const reader = new FileReader();
      reader.onload = (e) => {
        reportAttachedFiles.push({ name: file.name, type: file.type, size: file.size, data: e.target.result });
        renderFilePreview();
      };
      reader.readAsDataURL(file);
    }
  }

  function renderFilePreview() {
    filePreviewList.innerHTML = reportAttachedFiles.map((f, i) => {
      const isImage = f.type && f.type.startsWith('image/');
      const icon = getFileIcon(f.name, f.type);
      const size = formatFileSize(f.size);
      return '<div class="file-preview-item">' +
        (isImage ? '<img src="' + f.data + '" class="file-thumb-img"/>' : '<div class="file-thumb-icon">' + icon + '</div>') +
        '<div class="file-info"><span class="file-name" title="' + f.name + '">' + f.name + '</span><span class="file-size">' + size + '</span></div>' +
        '<button type="button" class="file-remove-btn" onclick="window._removeFile(' + i + ')" title="Remove">&times;</button></div>';
    }).join('');
  }

  window._removeFile = function (idx) { reportAttachedFiles.splice(idx, 1); renderFilePreview(); };

  function getFileIcon(name, type) {
    if (!type && !name) return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
    if (type && type.startsWith('image/')) return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
    if (type === 'application/pdf' || (name && name.endsWith('.pdf'))) return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';
    if (name && (name.endsWith('.doc') || name.endsWith('.docx'))) return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
    if (name && (name.endsWith('.xls') || name.endsWith('.xlsx') || name.endsWith('.csv'))) return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>';
    if (name && (name.endsWith('.zip') || name.endsWith('.rar'))) return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8v13H3V3h12l6 5z"/></svg>';
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
  }

  reportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const session = getStore(SESSION_KEY, {});
    const task = $('#reportTask').value.trim(), status = $('#reportStatus').value;
    if (!task) { toast('Describe your task.', 'error'); return; }
    const reports = getStore(REPORTS_KEY, []);
    reports.unshift({ id: Date.now(), userId: session.id, userName: session.name || session.username, date: getTodayCycle(), task, status, files: reportAttachedFiles, createdAt: new Date().toISOString() });
    setStore(REPORTS_KEY, reports);
    addActivity(session.name + ' submitted a report', session.id);
    reportForm.reset(); reportAttachedFiles = []; filePreviewList.innerHTML = ''; reportModal.classList.remove('show');
    renderAll(); toast('Report submitted!', 'success');
  });

  // ===== ATTENDANCE FILTERS =====
  let attFilterDate = 'today';
  function setAttDate(v) {
    attFilterDate = v;
    $$('#page-attendance .date-filter-btn').forEach(b => b.classList.toggle('active', b.dataset.date === v));
    const oldersSearch = $('#attOldersSearch');
    if (oldersSearch) oldersSearch.style.display = v === 'olders' ? '' : 'none';
    if (v !== 'olders') { const f = $('#attOldersFilter'); if (f) f.value = ''; }
    renderAll();
  }
  $$('#page-attendance .date-filter-btn').forEach(b => b.addEventListener('click', () => setAttDate(b.dataset.date)));
  $('#attOldersFilter')?.addEventListener('input', () => renderAll());
  function getAttDateRange() {
    if (attFilterDate === 'yesterday') return { start: yesterday(), end: yesterday() };
    if (attFilterDate === 'olders') return null;
    return { start: getTodayCycle(), end: getTodayCycle() };
  }

  function markAttendance() {
    const session = getStore(SESSION_KEY, {});
    if (session.role === 'admin') { toast('Admin attendance not required.', 'info'); return; }
    let att = getStore(ATTENDANCE_KEY, []);
    const cycle = getTodayCycle();
    if (att.find(a => a.userId === session.id && a.date === cycle)) { toast('Already marked for today.', 'info'); return; }
    att.push({ id: Date.now(), userId: session.id, userName: session.name || session.username, date: cycle, checkIn: new Date().toISOString(), status: 'present' });
    setStore(ATTENDANCE_KEY, att);
    addActivity(session.name + ' marked attendance', session.id);
    renderAll(); toast('Attendance marked!', 'success');
  }
  markAttendanceBtn.addEventListener('click', markAttendance);
  dashMarkBtn.addEventListener('click', markAttendance);
  attendanceSearch?.addEventListener('input', () => renderAttendance(attendanceSearch.value));

  // ===== GLOBAL SEARCH (Admin only) =====
  globalSearch.addEventListener('input', () => {
    if (!isAdmin()) return;
    const q = globalSearch.value.trim().toLowerCase();
    if (q.length < 2) { searchModal.classList.remove('show'); return; }
    const users = getStore(USERS_KEY, []);
    const match = users.find(u => (u.username || '').toLowerCase().includes(q) || (u.name || '').toLowerCase().includes(q));
    if (!match) { searchResult.innerHTML = '<p class="empty-state">No user found for "' + q + '"</p>'; searchModal.classList.add('show'); return; }
    window._viewUser(match.username);
    globalSearch.value = '';
  });
  searchModalClose.addEventListener('click', () => searchModal.classList.remove('show'));
  searchModal.addEventListener('click', (e) => { if (e.target === searchModal) searchModal.classList.remove('show'); });

  // ===== PROFILE =====
  saveProfileBtn.addEventListener('click', () => {
    const session = getStore(SESSION_KEY, {});
    let users = getStore(USERS_KEY, []);
    const idx = users.findIndex(u => u.username === session.username);
    if (idx === -1) return;
    users[idx].name = profileFullName.value.trim() || users[idx].name;
    users[idx].email = profileEmailInput.value.trim();
    users[idx].phone = profilePhone.value.trim();
    users[idx].designation = profileDesignation.value.trim();
    setStore(USERS_KEY, users);
    setStore(SESSION_KEY, { ...users[idx], loginTime: session.loginTime });
    profileName.textContent = users[idx].name;
    profileEmail.textContent = users[idx].email || '—';
    topbarUsername.textContent = users[idx].name;
    topbarAvatar.textContent = getInitials(users[idx].name);
    profileAvatar.textContent = getInitials(users[idx].name);
    addActivity('Profile updated', session.id); toast('Profile saved!', 'success');
  });

  avatarEditBtn.addEventListener('click', () => avatarInput.click());
  avatarInput.addEventListener('change', () => {
    const file = avatarInput.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const d = e.target.result;
      profileAvatar.innerHTML = '<img src="' + d + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>';
      topbarAvatar.innerHTML = '<img src="' + d + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>';
      const session = getStore(SESSION_KEY, {});
      let users = getStore(USERS_KEY, []);
      const idx = users.findIndex(u => u.username === session.username);
      if (idx !== -1) { users[idx].avatar = d; setStore(USERS_KEY, users); setStore(SESSION_KEY, { ...users[idx], loginTime: session.loginTime }); }
      toast('Photo updated!', 'success');
    };
    reader.readAsDataURL(file);
  });

  // ===== KEYBOARD =====
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { addUserModal.classList.remove('show'); searchModal.classList.remove('show'); reportModal.classList.remove('show'); imageModal.classList.remove('show'); reportDetailModal.classList.remove('show'); closeSidebar(); } });

  // ===== INIT =====
  checkSession();
})();
