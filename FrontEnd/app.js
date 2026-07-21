// --- Sleek Custom Toast Notifications ---
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let iconName = "info";
  if (type === "success") iconName = "check-circle-2";
  if (type === "error") iconName = "alert-triangle";

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
    <div class="toast-message">${message}</div>
  `;
  container.appendChild(toast);

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  setTimeout(() => toast.classList.add("show"), 10);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// --- Custom Confirmation Dialog Modal ---
function showConfirm(message, title = "Confirm") {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirm-modal");
    if (!modal) {
      // Fallback if modal HTML is not yet loaded
      resolve(confirm(message));
      return;
    }
    const titleEl = document.getElementById("confirm-modal-title");
    const msgEl = document.getElementById("confirm-modal-message");
    const btnOk = document.getElementById("btn-confirm-ok");
    const btnCancel = document.getElementById("btn-confirm-cancel");
    const btnClose = document.getElementById("btn-close-confirm-modal");

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");

    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }

    function cleanup(value) {
      modal.classList.add("hidden");
      modal.setAttribute("aria-hidden", "true");

      if (btnOk) btnOk.removeEventListener("click", onOk);
      if (btnCancel) btnCancel.removeEventListener("click", onCancel);
      if (btnClose) btnClose.removeEventListener("click", onCloseClick);
      modal.removeEventListener("click", onBackdropClick);

      resolve(value);
    }

    function onOk() {
      cleanup(true);
    }

    function onCancel() {
      cleanup(false);
    }

    function onCloseClick() {
      cleanup(false);
    }

    function onBackdropClick(e) {
      if (e.target === modal) {
        cleanup(false);
      }
    }

    if (btnOk) btnOk.addEventListener("click", onOk);
    if (btnCancel) btnCancel.addEventListener("click", onCancel);
    if (btnClose) btnClose.addEventListener("click", onCloseClick);
    modal.addEventListener("click", onBackdropClick);
  });
}

// --- DOM Element Bindings ---
const elements = {
  // Auth elements
  authScreen: document.getElementById("auth-screen"),
  loginForm: document.getElementById("login-form"),
  signupForm: document.getElementById("signup-form"),
  loginUsername: document.getElementById("login-username"),
  loginPassword: document.getElementById("login-password"),
  signupUsername: document.getElementById("signup-username"),
  signupName: document.getElementById("signup-name"),
  signupEmail: document.getElementById("signup-email"),
  signupPassword: document.getElementById("signup-password"),
  btnToggleLogin: document.getElementById("btn-toggle-login"),
  btnToggleSignup: document.getElementById("btn-toggle-signup"),
  authToggle: document.getElementById("auth-toggle"),
  loginError: document.getElementById("login-error"),
  signupError: document.getElementById("signup-error"),
  avatarPresetsGrid: document.getElementById("avatar-presets-grid"),
  btnGuestLogin: document.getElementById("btn-guest-login"),

  // Guest warning banner
  guestWarningBanner: document.getElementById("guest-warning-banner"),
  btnBannerRegister: document.getElementById("btn-banner-register"),

  // Main Container
  dashboardContainer: document.getElementById("dashboard-container"),

  // Theme Selector
  themeSelector: document.getElementById("theme-selector"),

  // Sidebar Tabs
  navItems: document.querySelectorAll(".nav-item"),
  fontSelector: document.getElementById("font-selector"),
  btnToggleScheme: document.getElementById("btn-toggle-scheme"),
  sections: {
    overview: document.getElementById("card-overview"),
    attendance: document.querySelector(".card-attendance"),
    routine: document.querySelector(".card-routine"),
    todo: document.querySelector(".card-todo"),
    profile: document.getElementById("card-profile"),
  },

  // User sidebar footer
  sidebarUserAvatar: document.getElementById("sidebar-user-avatar"),
  sidebarUserName: document.getElementById("sidebar-user-name"),
  sidebarUserHandle: document.getElementById("sidebar-user-handle"),
  btnLogout: document.getElementById("btn-logout"),

  // Header user info
  headerUserName: document.getElementById("header-user-name"),
  headerUserAvatar: document.getElementById("header-user-avatar"),
  headerUserBadgeName: document.getElementById("header-user-badge-name"),
  headerUserBadgeHandle: document.getElementById("header-user-badge-handle"),
  notifList: document.getElementById("nh-notif-list"),
  notifDot: document.getElementById("nh-notif-dot"),

  // Clock
  liveTime: document.getElementById("live-time"),
  liveDate: document.getElementById("live-date"),

  // Attendance Tracker
  subjectSelector: document.getElementById("subject-selector"),
  btnDeleteSubject: document.getElementById("btn-delete-subject"),
  statRate: document.getElementById("stat-rate"),
  statRateFill: document.getElementById("stat-rate-fill"),
  statStreak: document.getElementById("stat-streak"),
  classOccurrencesSummary: document.getElementById("class-occurrences-summary"),
  classTotalLogs: document.getElementById("class-total-logs"),
  summaryPresent: document.getElementById("summary-present"),
  summaryAbsent: document.getElementById("summary-absent"),
  summaryLate: document.getElementById("summary-late"),
  summaryExcused: document.getElementById("summary-excused"),
  calendarMonthYear: document.getElementById("calendar-month-year"),
  prevMonthBtn: document.getElementById("prev-month"),
  nextMonthBtn: document.getElementById("next-month"),
  calendarDaysGrid: document.getElementById("calendar-days-grid"),

  // Weekly Routine Layout Controls
  btnViewDaily: document.getElementById("btn-view-daily"),
  btnViewWeekly: document.getElementById("btn-view-weekly"),
  dailyTabsWrapper: document.getElementById("daily-tabs-wrapper"),
  dailyTimelineContainer: document.getElementById("daily-timeline-container"),
  weeklyGridContainer: document.getElementById("weekly-grid-container"),
  weeklyGridColumns: document.getElementById("weekly-grid-columns"),
  quickInfoText: document.getElementById("quick-info-text"),

  // Weekly Routine Operations
  addRoutineBtn: document.getElementById("add-routine-btn"),
  dayTabs: document.querySelectorAll(".day-tab"),
  routineItemsList: document.getElementById("routine-items-list"),

  // To-Do List
  todoStats: document.getElementById("todo-stats"),
  todoProgressFill: document.getElementById("todo-progress-fill"),
  todoProgressText: document.getElementById("todo-progress-text"),
  addTodoForm: document.getElementById("add-todo-form"),
  todoInput: document.getElementById("todo-input"),
  todoCategory: document.getElementById("todo-category"),
  todoUrgency: document.getElementById("todo-urgency"),
  todoDay: document.getElementById("todo-day"),
  todoFilters: document.querySelectorAll(".btn-filter"),
  todoItemsList: document.getElementById("todo-items-list"),

  // Profile settings view
  profileAvatarDisplay: document.getElementById("profile-avatar-display"),
  profileUsernameLabel: document.getElementById("profile-username-label"),
  profileEmailLabel: document.getElementById("profile-email-label"),
  profileBioLabel: document.getElementById("profile-bio-label"),
  profileTargetGoalText: document.getElementById("profile-target-goal-text"),
  profileGoalBadgeContainer: document.getElementById(
    "profile-goal-badge-container",
  ),
  profileActualRateVal: document.getElementById("profile-actual-rate-val"),
  profileTargetRateVal: document.getElementById("profile-target-rate-val"),
  profileActualFillBar: document.getElementById("profile-actual-fill-bar"),
  profileTargetMarkerLine: document.getElementById("profile-target-marker-line"),
  comparisonStatusText: document.getElementById("comparison-status-text"),

  // Regular Edit Section
  profileEditSection: document.getElementById("profile-edit-section"),
  profileEditForm: document.getElementById("profile-edit-form"),
  profileEmailInput: document.getElementById("profile-email"),
  profileBioInput: document.getElementById("profile-bio"),
  profileTargetRateInput: document.getElementById("profile-target-rate"),
  editAvatarPresetsGrid: document.getElementById("edit-avatar-presets-grid"),

  // Guest Convert Section
  guestConvertSection: document.getElementById("guest-convert-section"),
  guestConvertForm: document.getElementById("guest-convert-form"),
  convertUsername: document.getElementById("convert-username"),
  convertEmail: document.getElementById("convert-email"),
  convertPassword: document.getElementById("convert-password"),
  convertAvatarPresetsGrid: document.getElementById(
    "convert-avatar-presets-grid",
  ),
  convertError: document.getElementById("convert-error"),

  // Modals
  updateNameModal: document.getElementById("update-name-modal"),
  updateNameForm: document.getElementById("update-name-form"),
  updateNameInput: document.getElementById("update-name-input"),

  routineModal: document.getElementById("routine-modal"),
  routineForm: document.getElementById("routine-form"),
  routineTitle: document.getElementById("routine-title"),
  routineFaculty: document.getElementById("routine-faculty"),
  routineRoom: document.getElementById("routine-room"),
  routineType: document.getElementById("routine-type"),
  routineDay: document.getElementById("routine-day"),
  routineTag: document.getElementById("routine-tag"),
  routineStart: document.getElementById("routine-start"),
  routineEnd: document.getElementById("routine-end"),
  routineId: document.getElementById("routine-id"),
  routineSpecificDateGroup: document.getElementById("routine-specific-date-group"),
  routineSpecificDate: document.getElementById("routine-specific-date"),
  btnRoutineDelete: document.getElementById("btn-routine-delete"),
  btnRoutineSubmit: document.getElementById("btn-routine-submit"),

  dayModal: document.getElementById("day-modal"),
  modalDateString: document.getElementById("modal-date-string"),
  modalSubjectName: document.getElementById("modal-subject-name"),
  attendanceOptions: document.querySelectorAll(".btn-attendance-option"),

  closeModalBtns: document.querySelectorAll(".btn-close-modal"),
};

//API URL
const API_URL = "https://auratacker-backend.onrender.com";

// --- Application Master Users List & Active Session ---
let appUsers = [];
let sessionUser = null;

// --- Active Dashboard Scoped State ---
let state = {
  selectedTheme: "classic-obsidian",
  selectedFont: "font-modern",
  colorScheme: "dark",
  routineView: "daily",
  activeRoutineDay: 1,
  activeTodoFilter: "all",
  currentCalendarDate: new Date(),
  selectedCalendarDayInfo: null,

  // Scoped Data
  routine: [],
  todos: [],
  attendance: {},
};

// Selections trackers
let signupSelectedAvatar = "avatar-1";
let editSelectedAvatar = "avatar-1";
let convertSelectedAvatar = "avatar-1";

// --- Master Template Seeding (Copied for New Users / Guest Startup) ---
function getNewUserDefaultData() {
  return {
    selectedTheme: "classic-obsidian",
    selectedFont: "font-modern",
    colorScheme: "dark",
    routineView: "daily",
    activeRoutineDay: 1,
    activeTodoFilter: "all",
    routine: [],
    todos: [],
    attendance: {},
  };
}

// --- Scoped LocalStorage mappings ---
function saveMasterUsersList() {
  localStorage.setItem("auratracker_users", JSON.stringify(appUsers));
}

let syncTimeout = null;

function saveUserScopedData() {
  if (!sessionUser) return;
  
  const payload = {
    selectedTheme: state.selectedTheme,
    selectedFont: state.selectedFont,
    routineView: state.routineView,
    activeRoutineDay: state.activeRoutineDay,
    routine: state.routine,
    todos: state.todos,
    attendance: state.attendance,
  };

  // 1. Instant save to local storage
  localStorage.setItem(
    `auratracker_user_${sessionUser.username}_data`,
    JSON.stringify(payload)
  );

  // 2. Debounced save to cloud backend (only if logged in and not Guest)
  if (sessionUser.username !== "Guest") {
    clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      syncStateToBackend(payload);
    }, 1000); // 1 second debounce
  }
}

async function syncStateToBackend(payload) {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/api/sync`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ state: payload })
    });
    if (!res.ok) console.warn("Failed to sync state to backend.");
  } catch (err) {
    console.error("Error syncing to backend:", err);
  }
}

function loadUserScopedData() {
  if (!sessionUser) return;
  const dataStr = localStorage.getItem(
    `auratracker_user_${sessionUser.username}_data`,
  );
  if (dataStr) {
    try {
      const parsed = JSON.parse(dataStr);
      state.selectedTheme = parsed.selectedTheme || "classic-obsidian";
      state.selectedFont = parsed.selectedFont || "font-modern";
      state.routineView = parsed.routineView || "daily";
      state.activeRoutineDay =
        parsed.activeRoutineDay !== undefined ? parsed.activeRoutineDay : 1;
      state.routine = parsed.routine || [];
      state.todos = parsed.todos || [];
      state.attendance = parsed.attendance || {};
      
      state.currentCalendarDate = (sessionUser && sessionUser.academicProfile && sessionUser.academicProfile.termStartDate) 
        ? new Date(sessionUser.academicProfile.termStartDate) 
        : new Date();

      // Migrate legacy attendance keys from YYYY-MM-DD to YYYY-MM-DD_slotID
      if (state.attendance) {
        Object.keys(state.attendance).forEach(classTitle => {
          const logs = state.attendance[classTitle];
          Object.keys(logs).forEach(key => {
            if (!key.includes("_")) {
              const dateObj = new Date(key);
              const dayNum = dateObj.getDay();
              const slots = state.routine.filter(r => r.title === classTitle && r.day === dayNum && r.type === "class");
              if (slots.length > 0) {
                slots.forEach(slot => {
                  logs[`${key}_${slot.id}`] = logs[key];
                });
              }
              delete logs[key];
            }
          });
        });
      }
      return;
    } catch (e) {
      console.error("Failed to load scoped data", e);
    }
  }

  // Seed templates
  const defaults = getNewUserDefaultData();
  state.selectedTheme = defaults.selectedTheme;
  state.routineView = defaults.routineView;
  state.activeRoutineDay = defaults.activeRoutineDay;
  state.routine = defaults.routine;
  state.todos = defaults.todos;
  state.attendance = defaults.attendance;
  state.currentCalendarDate = (sessionUser && sessionUser.academicProfile && sessionUser.academicProfile.termStartDate) 
        ? new Date(sessionUser.academicProfile.termStartDate) 
        : new Date();

  saveUserScopedData();
}

function checkNotifications() {
  const notifList = elements.notifList;
  const notifDot = elements.notifDot;
  if (!notifList || !notifDot) return;

  // Clear existing
  notifList.innerHTML = "";
  let hasNotifications = false;

  if (!sessionUser.name && sessionUser.username !== "Guest") {
    hasNotifications = true;
    const notifItem = document.createElement("div");
    notifItem.className = "nh-notif-item unread";
    notifItem.style.cursor = "pointer";
    notifItem.innerHTML = `
      <div class="nh-notif-icon primary"><i data-lucide="user"></i></div>
      <div class="nh-notif-content">
        <h4>Profile Incomplete</h4>
        <p>Please update your full name to personalize your experience.</p>
        <span class="nh-notif-time">Just now</span>
      </div>
    `;
    notifItem.addEventListener("click", () => {
      elements.updateNameModal.classList.remove("hidden");
      const notifPanel = document.getElementById("nh-notif-panel");
      if (notifPanel) notifPanel.classList.add("hidden");
    });
    notifList.appendChild(notifItem);
  }

  if (hasNotifications) {
    notifDot.classList.add("visible");
    notifDot.style.display = ""; // clear inline style just in case
    lucide.createIcons();
  } else {
    notifDot.classList.remove("visible");
    notifDot.style.display = "";
    notifList.innerHTML = `
      <div class="nh-notif-empty">
        <i data-lucide="coffee"></i>
        <p>You're all caught up!</p>
      </div>
    `;
    lucide.createIcons();
  }
}

// --- Auth Handling ---Loops ---
async function checkAuthSession() {
  const token = localStorage.getItem("token");

  // No token => show login
  if (!token) {
    showAuthScreen();
    return;
  }

  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      localStorage.removeItem("token");
      localStorage.removeItem("auratracker_session");
      showAuthScreen();
      return;
    }

    sessionUser = {
      username: data.username,
      name: data.name || "",
      email: data.email,
      avatar: data.avatar,
      bio: data.bio,
      targetGoal: data.targetGoal,
      academicProfile: data.academicProfile || {},
    };

    await syncStateFromBackend(token);
    loadUserScopedData();
    await syncRoutineFromBackend(token);
    showDashboard();
  } catch (err) {
    console.error("Session check failed:", err);

    localStorage.removeItem("token");
    localStorage.removeItem("auratracker_session");

    showAuthScreen();
  }
}

async function syncStateFromBackend(token) {
  try {
    const res = await fetch(`${API_URL}/api/sync`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.state) {
        // Save the fetched state into local storage to merge/overwrite
        const localKey = `auratracker_user_${sessionUser.username}_data`;
        localStorage.setItem(localKey, JSON.stringify(data.state));
      }
    }
  } catch (err) {
    console.error("Failed to sync state from backend:", err);
  }
}

async function syncRoutineFromBackend(token) {
  try {
    const routineRes = await fetch(`${API_URL}/api/routine`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (routineRes.ok) {
      const routineData = await routineRes.json();
      const routinePayload = routineData.routine;
      if (!routinePayload) return;
      
      const backendClasses = Array.isArray(routinePayload?.classes)
        ? routinePayload.classes
        : Array.isArray(routinePayload)
          ? routinePayload
          : [];

      // Convert backend format to frontend format
      const convertedClasses = backendClasses.map((cls) => ({
        id: cls.id || cls._id || `imported-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        type: "class",
        day:
          typeof cls.day === "number"
            ? cls.day
            : DAY_NAME_TO_NUM[cls.day] ?? 1,
        title: cls.title || cls.subject || "",
        start: cls.startTime || cls.start || "",
        end: cls.endTime || cls.end || "",
        tag: "study",
      }));

      // Merge into existing state (avoid duplicates by title + day + start)
      let changed = false;
      convertedClasses.forEach((cls) => {
        const exists = state.routine.find((r) => r.title === cls.title && r.day === cls.day && r.start === cls.start);
        if (!exists) {
          state.routine.push(cls);
          changed = true;
        }
      });

      if (changed) {
        saveUserScopedData();
        renderRoutineTimeline();
        renderWeeklyScopeGrid();
        if (typeof renderAttendance === 'function') renderAttendance();
      }
    }
  } catch (err) {
    console.error("Failed to sync routine from backend:", err);
  }
}

function showAuthScreen() {
  elements.authScreen.classList.remove("hidden");
  elements.dashboardContainer.classList.add("hidden");
}

function showDashboard() {
  elements.authScreen.classList.add("hidden");
  elements.dashboardContainer.classList.remove("hidden");

  // Sync UI elements
  elements.themeSelector.value = state.selectedTheme;
  if (typeof initCustomSelect === "function") {
    initCustomSelect(elements.themeSelector);
  }
  document.documentElement.setAttribute("data-theme", state.selectedTheme);

  // Sync font selection
  if (elements.fontSelector) {
    elements.fontSelector.value = state.selectedFont;
    if (typeof initCustomSelect === "function") {
      initCustomSelect(elements.fontSelector);
    }
  }
  document.documentElement.setAttribute("data-font", state.selectedFont);

  // User header / sidebar mappings
  elements.sidebarUserName.textContent = sessionUser.name || sessionUser.username;
  if (elements.sidebarUserHandle) {
    elements.sidebarUserHandle.textContent = "@" + sessionUser.username;
  }
  elements.sidebarUserAvatar.className = `user-avatar-circle ${sessionUser.avatar}`;

  elements.headerUserName.textContent = sessionUser.name || sessionUser.username;
  elements.headerUserAvatar.className = `user-avatar-circle mini ${sessionUser.avatar}`;
  elements.headerUserBadgeName.textContent = sessionUser.name || sessionUser.username;
  if (elements.headerUserBadgeHandle) {
    elements.headerUserBadgeHandle.textContent = "@" + sessionUser.username;
  }

  checkNotifications();

  // Toggle warning banner
  if (sessionUser.username === "Guest") {
    elements.guestWarningBanner.classList.remove("hidden");
  } else {
    elements.guestWarningBanner.classList.add("hidden");
  }

  // Trigger reset tabs
  elements.navItems.forEach((nav) => nav.classList.remove("active"));
  elements.navItems[0].classList.add("active"); // Default tab: Overview
  showTab("overview");

  // Dynamic Renders
  renderAttendance();
  renderRoutineTimeline();
  renderTodoList();
  renderProfileView();

  // First time walkthrough check
  if (localStorage.getItem("is_first_signup") === "true") {
    setTimeout(() => {
      startWalkthrough();
    }, 1000);
  }

  // Onboarding profile check (delayed to not overlap with walkthrough)
  setTimeout(() => {
    checkOnboardingStatus();
  }, 1500);
}

function setupAuthHandlers() {
  // Form toggle — segmented pill control
  elements.btnToggleLogin.addEventListener("click", () => {
    elements.btnToggleLogin.classList.add("active");
    elements.btnToggleSignup.classList.remove("active");
    elements.authToggle.classList.remove("register-active"); // slide indicator left
    elements.loginForm.classList.remove("hidden");
    elements.signupForm.classList.add("hidden");
    elements.loginError.classList.add("hidden");
  });

  elements.btnToggleSignup.addEventListener("click", () => {
    elements.btnToggleSignup.classList.add("active");
    elements.btnToggleLogin.classList.remove("active");
    elements.authToggle.classList.add("register-active"); // slide indicator right
    elements.signupForm.classList.remove("hidden");
    elements.loginForm.classList.add("hidden");
    elements.signupError.classList.add("hidden");
  });

  // Signup avatar button highlights
  const signupPresetBtns =
    elements.avatarPresetsGrid.querySelectorAll(".btn-avatar-preset");
  signupPresetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      signupPresetBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      signupSelectedAvatar = btn.getAttribute("data-avatar");
    });
  });

  // Sign Up submit
  elements.signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = elements.signupUsername.value.trim();
    const name = elements.signupName.value.trim();
    const email = elements.signupEmail.value.trim();
    const password = elements.signupPassword.value;

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          name,
          email,
          avatar: signupSelectedAvatar,
          password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        elements.signupError.textContent = data.message;
        elements.signupError.classList.remove("hidden");
        return;
      }

      showToast("Registration successful! Logging in...", "success");

      // Auto-login background query
      try {
        const loginResponse = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok && loginData.success) {
          localStorage.setItem("token", loginData.token);
          localStorage.setItem("auratracker_session", username);
          localStorage.setItem("is_first_signup", "true");

          // Fetch user profile settings from backend
          const profileResponse = await fetch(`${API_URL}/profile`, {
            headers: {
              Authorization: `Bearer ${loginData.token}`,
            },
          });

          const profileData = await profileResponse.json();

          sessionUser = {
            username: profileData.username,
            name: profileData.name || "",
            email: profileData.email,
            avatar: profileData.avatar,
            bio: profileData.bio,
            targetGoal: profileData.targetGoal,
            academicProfile: profileData.academicProfile || {},
          };

          setTimeout(() => {
            // Clear signup inputs
            elements.signupUsername.value = "";
            elements.signupName.value = "";
            elements.signupEmail.value = "";
            elements.signupPassword.value = "";

            loadUserScopedData();
            showDashboard();
          }, 800);
        } else {
          // Fallback to login form if auto-login fails
          showToast("Registration successful! Please login manually.", "info");
          setTimeout(() => {
            elements.btnToggleLogin.click();
            elements.loginUsername.value = username;
            elements.loginPassword.focus();

            elements.signupUsername.value = "";
            elements.signupName.value = "";
            elements.signupEmail.value = "";
            elements.signupPassword.value = "";
          }, 1000);
        }
      } catch (loginErr) {
        console.error("Auto-login failed:", loginErr);
        elements.btnToggleLogin.click();
        elements.loginUsername.value = username;
      }
    } catch (err) {
      console.error(err);
      showToast("Connection failed: Server error.", "error");
    }
  });

  // Login Submit
  elements.loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = elements.loginUsername.value.trim();
    const password = elements.loginPassword.value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        elements.loginError.textContent = data.message;
        elements.loginError.classList.remove("hidden");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("auratracker_session", username);

      const profileResponse = await fetch(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const profileData = await profileResponse.json();

      sessionUser = {
        username: profileData.username,
        name: profileData.name || "",
        email: profileData.email,
        avatar: profileData.avatar,
        bio: profileData.bio,
        targetGoal: profileData.targetGoal,
        academicProfile: profileData.academicProfile || {},
      };

      await syncStateFromBackend(data.token);
      loadUserScopedData();
      await syncRoutineFromBackend(data.token);
      showDashboard();
    } catch (err) {
      console.error(err);
      showToast("Connection failed: Server error.", "error");
    }
  });



  // Guest Login click
  elements.btnGuestLogin.addEventListener("click", () => {
    sessionUser = {
      username: "Guest",
      email: "guest@auratracker.local",
      avatar: "avatar-1",
      bio: "Guest Session Mode",
      targetGoal: 80,
    };
    localStorage.setItem("auratracker_session", "Guest");
    loadUserScopedData();
    showDashboard();
  });

  // Banner warning click triggers Profile conversion redirect
  elements.btnBannerRegister.addEventListener("click", () => {
    elements.navItems.forEach((nav) => nav.classList.remove("active"));
    // Find profile tab item and highlight
    elements.navItems.forEach((nav) => {
      if (nav.getAttribute("data-tab") === "profile") {
        nav.classList.add("active");
      }
    });
    showTab("profile");
  });

  // Logout trigger
  const logoutBtns = [elements.btnLogout, document.getElementById("btn-logout-header")];
  logoutBtns.forEach(btn => {
    if (btn) {
      btn.addEventListener("click", async () => {
        if (
          await showConfirm(
            "Are you sure you want to log out?",
            "Logout Confirmation",
          )
        ) {
          sessionUser = null;
          localStorage.removeItem("token");
          localStorage.removeItem("auratracker_session");
          showAuthScreen();
        }
      });
    }
  });
}

// --- Navigation Tabs ---
function setupNavigation() {
  elements.navItems.forEach((item) => {
    item.addEventListener("click", () => {
      elements.navItems.forEach((nav) => nav.classList.remove("active"));
      item.classList.add("active");

      const targetTab = item.getAttribute("data-tab");
      showTab(targetTab);
    });
  });

  const overviewTileTasks = document.getElementById("overview-tile-tasks");
  if (overviewTileTasks) {
    overviewTileTasks.addEventListener("click", () => {
      const todoTabItem = document.querySelector('.nav-item[data-tab="todo"]');
      if (todoTabItem) {
        todoTabItem.click();
      }
    });
  }

  const overviewTileAttendance = document.getElementById(
    "overview-tile-attendance",
  );
  if (overviewTileAttendance) {
    overviewTileAttendance.addEventListener("click", () => {
      const attendanceTabItem = document.querySelector(
        '.nav-item[data-tab="attendance"]',
      );
      if (attendanceTabItem) {
        attendanceTabItem.click();
      }
    });
  }

  const overviewTileStreak = document.getElementById("overview-tile-streak");
  if (overviewTileStreak) {
    overviewTileStreak.addEventListener("click", () => {
      const attendanceTabItem = document.querySelector(
        '.nav-item[data-tab="attendance"]',
      );
      if (attendanceTabItem) {
        attendanceTabItem.click();
      }
    });
  }

  const overviewTileRoutine = document.getElementById("overview-tile-routine");
  if (overviewTileRoutine) {
    overviewTileRoutine.addEventListener("click", () => {
      const routineTabItem = document.querySelector(
        '.nav-item[data-tab="routine"]',
      );
      if (routineTabItem) {
        routineTabItem.click();
      }
    });
  }
}

function showTab(tabName) {
  // Hide all sections first
  if (elements.sections.overview)
    elements.sections.overview.classList.add("hidden");
  elements.sections.attendance.classList.add("hidden");
  elements.sections.routine.classList.add("hidden");
  elements.sections.todo.classList.add("hidden");
  elements.sections.profile.classList.add("hidden");

  // Show only the selected section
  const activeSection = elements.sections[tabName];
  if (activeSection) {
    activeSection.classList.remove("hidden");
  }

  if (tabName === "overview") {
    renderOverviewTab();
  } else if (tabName === "profile") {
    renderProfileView();
  }
}

// --- User Profile & Migration settings ---
function calculateOverallAttendance() {
  const classNames = getUniqueClassNames();
  if (classNames.length === 0) return 0;

  let totalPresents = 0;
  let totalAbsents = 0;
  let totalLates = 0;

  classNames.forEach((className) => {
    const logs = state.attendance[className] || {};
    const scheduledWeekdays = getClassScheduledWeekdays(className);

    Object.keys(logs).forEach((logKey) => {
      const status = logs[logKey];
      const dateStr = logKey.split('_')[0];
      const logDate = new Date(dateStr);

      if (isClassScheduledOnDate(className, logDate)) {
        if (status === "Present") totalPresents++;
        else if (status === "Absent") totalAbsents++;
        else if (status === "Late") totalLates++;
      }
    });
  });

  const denominator = totalPresents + totalAbsents + totalLates;
  if (denominator === 0) return 0;
  return Math.round(((totalPresents + totalLates) / denominator) * 100);
}

function renderProfileView() {
  if (!sessionUser) return;

  const isGuest = sessionUser.username === "Guest";

  // Core Profile overview details
  elements.profileAvatarDisplay.className = `user-avatar-circle large ${sessionUser.avatar}`;
  elements.profileUsernameLabel.textContent = sessionUser.name || sessionUser.username;
  elements.profileEmailLabel.textContent = sessionUser.email;
  if (elements.profileBioLabel) {
    elements.profileBioLabel.textContent = sessionUser.bio || "No motto or bio set yet.";
  }
  elements.profileTargetGoalText.textContent = `${sessionUser.targetGoal}%`;

  if (isGuest) {
    // Toggle view structures: Hide goal settings & normal edit, Show guest convert
    elements.profileGoalBadgeContainer.classList.add("hidden");
    elements.profileEditSection.classList.add("hidden");
    elements.guestConvertSection.classList.remove("hidden");

    // Render guest convert avatar preset selections
    renderConvertAvatarsGrid();
  } else {
    // Show normal settings
    elements.profileGoalBadgeContainer.classList.remove("hidden");
    elements.profileEditSection.classList.remove("hidden");
    elements.guestConvertSection.classList.add("hidden");

    // Edit Form inputs
    elements.profileEmailInput.value = sessionUser.email;
    elements.profileBioInput.value = sessionUser.bio || "";
    elements.profileTargetRateInput.value = sessionUser.targetGoal;
    updateTargetRateSliderUI();

    // Render preset edit selections
    renderEditAvatarsGrid();

    // Academic info display
    const ap = sessionUser.academicProfile || {};
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || "—";
    };
    setVal("academic-university-val", ap.university || ap.college);
    setVal("academic-department-val", ap.department);
    setVal("academic-program-val",    ap.program);
    setVal("academic-semester-val",   ap.semester ? `Semester ${ap.semester}` : null);
    setVal("academic-session-val",    ap.academicSession);
    setVal("academic-section-val",    ap.section);
    setVal("academic-term-start-val", ap.termStartDate ? new Date(ap.termStartDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "—");

    // Stats calculations
    const actualRate = calculateOverallAttendance();
    elements.profileActualRateVal.textContent = `${actualRate}%`;
    elements.profileTargetRateVal.textContent = `${sessionUser.targetGoal}%`;

    const target = sessionUser.targetGoal;
    if (elements.profileActualFillBar) {
      elements.profileActualFillBar.style.width = `${Math.min(actualRate, 100)}%`;
      elements.profileActualFillBar.className = "progress-actual-fill";
      if (actualRate < 75) {
        elements.profileActualFillBar.classList.add("low");
      } else if (actualRate < target) {
        elements.profileActualFillBar.classList.add("mid");
      } else {
        elements.profileActualFillBar.classList.add("high");
      }
    }
    if (elements.profileTargetMarkerLine) {
      elements.profileTargetMarkerLine.style.left = `${Math.min(target, 100)}%`;
    }

    const statusText = elements.comparisonStatusText;
    if (actualRate >= target) {
      statusText.textContent = "Objective Met 🏆";
      statusText.style.color = "var(--present)";
    } else if (actualRate >= target - 10) {
      statusText.textContent = "On Track (Near Target) 📈";
      statusText.style.color = "var(--late)";
    } else {
      statusText.textContent = "Needs Consistency ⚠️";
      statusText.style.color = "#ef4444";
    }
  }
}

function renderEditAvatarsGrid() {
  elements.editAvatarPresetsGrid.innerHTML = "";
  const presets = ["avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5"];
  editSelectedAvatar = sessionUser.avatar;

  presets.forEach((preset) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `btn-avatar-preset ${preset === editSelectedAvatar ? "active" : ""} ${preset}`;
    btn.setAttribute("data-avatar", preset);
    btn.addEventListener("click", () => {
      elements.editAvatarPresetsGrid
        .querySelectorAll(".btn-avatar-preset")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      editSelectedAvatar = preset;
    });
    elements.editAvatarPresetsGrid.appendChild(btn);
  });
}

function renderConvertAvatarsGrid() {
  elements.convertAvatarPresetsGrid.innerHTML = "";
  const presets = ["avatar-1", "avatar-2", "avatar-3", "avatar-4", "avatar-5"];
  convertSelectedAvatar = "avatar-1"; // Reset

  presets.forEach((preset) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `btn-avatar-preset ${preset === convertSelectedAvatar ? "active" : ""} ${preset}`;
    btn.setAttribute("data-avatar", preset);
    btn.addEventListener("click", () => {
      elements.convertAvatarPresetsGrid
        .querySelectorAll(".btn-avatar-preset")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      convertSelectedAvatar = preset;
    });
    elements.convertAvatarPresetsGrid.appendChild(btn);
  });
}

function updateTargetRateSliderUI() {
  const slider = document.getElementById("profile-target-rate");
  if (!slider) return;

  const val = slider.value;

  const badge = document.getElementById("target-rate-slider-val");
  if (badge) {
    badge.textContent = `${val}%`;
    badge.classList.remove("low", "mid", "high");
    if (val < 75) {
      badge.classList.add("low");
    } else if (val < 85) {
      badge.classList.add("mid");
    } else {
      badge.classList.add("high");
    }
  }

  // Real-time update the Target marker line on the visual progress track
  const targetLine = document.getElementById("profile-target-marker-line");
  if (targetLine) {
    targetLine.style.left = `${val}%`;
  }

  // Real-time update the Target Value text inside the stat bubble
  const targetValText = document.getElementById("profile-target-rate-val");
  if (targetValText) {
    targetValText.textContent = `${val}%`;
  }
}

// Setup User account conversion and registration upgrades
function setupProfileEditHandlers() {
  // Setup real-time target rate slider updater
  const slider = document.getElementById("profile-target-rate");
  if (slider) {
    slider.addEventListener("input", updateTargetRateSliderUI);
  }

  // Global Profile Edit Toggle logic
  const btnGlobalEdit = document.getElementById("btn-global-profile-edit");
  const profileEditForm = document.getElementById("profile-edit-form");
  const academicEditForm = document.getElementById("academic-edit-form");
  const academicDisplay = document.getElementById("academic-info-display");
  const btnCancelAcademic = document.getElementById("btn-cancel-academic-edit");

  let isEditing = false;

  const progressContainer = document.querySelector(".visual-progress-container");
  const progressTrack = document.querySelector(".progress-track-bg");

  let isDragging = false;

  function handleTrackInteraction(e) {
    if (!isEditing || !progressTrack) return;
    const rect = progressTrack.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    if (clientX === undefined) return;

    let pct = Math.round(((clientX - rect.left) / rect.width) * 100);
    pct = Math.max(50, Math.min(100, pct)); // target must be 50%-100%

    // Magnetic snap to 75%
    if (pct >= 72 && pct <= 78) {
      pct = 75;
    }

    const targetInput = document.getElementById("profile-target-rate");
    if (targetInput) {
      targetInput.value = pct;
      updateTargetRateSliderUI();
    }
  }

  if (progressTrack) {
    progressTrack.addEventListener("mousedown", (e) => {
      if (!isEditing) return;
      isDragging = true;
      handleTrackInteraction(e);
    });

    window.addEventListener("mousemove", (e) => {
      if (isDragging) {
        handleTrackInteraction(e);
      }
    });

    window.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Touch events for mobile support
    progressTrack.addEventListener("touchstart", (e) => {
      if (!isEditing) return;
      isDragging = true;
      handleTrackInteraction(e);
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (isDragging) {
        handleTrackInteraction(e);
      }
    }, { passive: false });

    window.addEventListener("touchend", () => {
      isDragging = false;
    });
  }

  function toggleProfileEditing(forceState) {
    isEditing = typeof forceState === "boolean" ? forceState : !isEditing;

    const profileEditActions = document.getElementById("profile-edit-actions");
    const btnEditAvatarOverlay = document.getElementById("btn-edit-avatar-overlay");
    const editAvatarGrid = document.getElementById("edit-avatar-presets-grid");
    
    // Inline edit elements
    const emailLabel = document.getElementById("profile-email-label");
    const emailInput = document.getElementById("profile-email");
    const bioLabel = document.getElementById("profile-bio-label");
    const bioInput = document.getElementById("profile-bio");

    if (isEditing) {
      // Enter Edit Mode
      if (btnGlobalEdit) btnGlobalEdit.classList.add("hidden");
      if (profileEditActions) profileEditActions.classList.remove("hidden");

      if (progressContainer) {
        progressContainer.classList.add("editable");
      }

      // Show inline inputs
      if (emailLabel) emailLabel.classList.add("hidden");
      if (emailInput) {
        emailInput.classList.remove("hidden");
        emailInput.value = sessionUser.email || "";
      }
      
      if (bioLabel) bioLabel.classList.add("hidden");
      if (bioInput) {
        bioInput.classList.remove("hidden");
        bioInput.value = sessionUser.bio || "";
      }

      // Show avatar edit overlay
      if (btnEditAvatarOverlay) btnEditAvatarOverlay.classList.remove("hidden");

      // Re-initialize avatarPreset selection Grid to match current user
      editSelectedAvatar = sessionUser.avatar;
      renderEditAvatarsGrid();

      if (academicEditForm) {
        academicEditForm.classList.remove("hidden");
        academicEditForm.classList.add("fade-in-animate");

        // Populate and Sync academic input fields
        const ap = sessionUser.academicProfile || {};
        const setInput = (id, val) => {
          const el = document.getElementById(id);
          if (el) el.value = val || "";
        };
        setInput("academic-edit-university", ap.university || ap.college || "");
        setInput("academic-edit-department", ap.department);
        setInput("academic-edit-semester",   ap.semester);
        setInput("academic-edit-session",    ap.academicSession);
        setInput("academic-edit-section",    ap.section);
        setInput("academic-edit-term-start", ap.termStartDate ? ap.termStartDate.substring(0, 10) : "");

        const progEl = document.getElementById("academic-edit-program");
        if (progEl) {
          progEl.value = ap.program || "";
          if (typeof initCustomSelect === "function") initCustomSelect(progEl);
        }
      }
      if (academicDisplay) {
        academicDisplay.classList.add("hidden");
      }
    } else {
      // Exit Edit Mode (Reset to View Mode)
      if (btnGlobalEdit) btnGlobalEdit.classList.remove("hidden");
      if (profileEditActions) profileEditActions.classList.add("hidden");

      if (progressContainer) {
        progressContainer.classList.remove("editable");
      }

      // Hide inline inputs
      if (emailLabel) emailLabel.classList.remove("hidden");
      if (emailInput) emailInput.classList.add("hidden");
      if (bioLabel) bioLabel.classList.remove("hidden");
      if (bioInput) bioInput.classList.add("hidden");

      // Hide avatar overlay and grid
      if (btnEditAvatarOverlay) btnEditAvatarOverlay.classList.add("hidden");
      if (editAvatarGrid) editAvatarGrid.classList.add("hidden");
      if (academicEditForm) {
        academicEditForm.classList.add("hidden");
        academicEditForm.classList.remove("fade-in-animate");
      }
      if (academicDisplay) {
        academicDisplay.classList.remove("hidden");
        academicDisplay.classList.add("fade-in-animate");
      }

      // Reset form values back to session values
      elements.profileEmailInput.value = sessionUser.email || "";
      elements.profileBioInput.value = sessionUser.bio || "";
      elements.profileTargetRateInput.value = sessionUser.targetGoal || 75;
      updateTargetRateSliderUI();
    }
  }

  if (btnGlobalEdit) {
    btnGlobalEdit.addEventListener("click", () => toggleProfileEditing());
  }
  
  const btnEditAvatarOverlay = document.getElementById("btn-edit-avatar-overlay");
  if (btnEditAvatarOverlay) {
    btnEditAvatarOverlay.addEventListener("click", () => {
      const grid = document.getElementById("edit-avatar-presets-grid");
      if (grid) grid.classList.toggle("hidden");
    });
  }
  const btnCancelProfileEdit = document.getElementById("btn-cancel-profile-edit");
  const btnSaveProfileEdit = document.getElementById("btn-save-profile-edit");
  if (btnCancelProfileEdit) {
    btnCancelProfileEdit.addEventListener("click", () => toggleProfileEditing(false));
  }

  // Global Profile settings save
  if (btnSaveProfileEdit) {
    btnSaveProfileEdit.addEventListener("click", async () => {
      if (!sessionUser || sessionUser.username === "Guest") return;

      const token = localStorage.getItem("token");
      if (!token) return;

      btnSaveProfileEdit.classList.add("btn-loading");

      // Gather Profile Data
      const email = elements.profileEmailInput.value.trim();
      const bio = elements.profileBioInput.value.trim();
      const targetGoal = parseInt(elements.profileTargetRateInput.value, 10);

      // Gather Academic Data
      const university = document.getElementById("academic-edit-university")?.value.trim();
      const department = document.getElementById("academic-edit-department")?.value.trim();
      const program = document.getElementById("academic-edit-program")?.value;
      const semester = parseInt(document.getElementById("academic-edit-semester")?.value, 10) || null;
      const academicSession = document.getElementById("academic-edit-session")?.value.trim();
      const section = document.getElementById("academic-edit-section")?.value.trim();
      const termStartDate = document.getElementById("academic-edit-term-start")?.value;

      try {
        const [profileRes, academicRes] = await Promise.all([
          fetch(`${API_URL}/profile`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ email, bio, targetGoal, avatar: editSelectedAvatar }),
          }),
          fetch(`${API_URL}/api/onboarding`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              university,
              college: university,
              department,
              program,
              semester,
              academicSession,
              section,
              termStartDate
            }),
          })
        ]);

        const profileData = await profileRes.json().catch(() => ({}));
        
        if (!profileRes.ok || !profileData.success) {
          throw new Error(profileData.message || "Failed to update profile settings.");
        }
        if (!academicRes.ok) {
          const academicData = await academicRes.json().catch(() => ({}));
          throw new Error(academicData.message || "Failed to update academic info.");
        }

        // Update in-memory
        sessionUser.email = email;
        sessionUser.bio = bio;
        sessionUser.targetGoal = targetGoal;
        sessionUser.avatar = editSelectedAvatar;
        sessionUser.academicProfile = { university, college: university, department, program, semester, academicSession, section, termStartDate };

        saveUserScopedData();

        elements.sidebarUserAvatar.className = `user-avatar-circle ${sessionUser.avatar}`;
        elements.headerUserAvatar.className = `user-avatar-circle mini ${sessionUser.avatar}`;

        renderProfileView();
        showToast("Profile completely updated!", "success");
        toggleProfileEditing(false); // Switch back to View Mode
      } catch (err) {
        console.error(err);
        showToast(err.message || "Server Error: Failed to save changes.", "error");
      } finally {
        btnSaveProfileEdit.classList.remove("btn-loading");
      }
    });
  }

  // Guest conversion form submit
  elements.guestConvertForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!sessionUser || sessionUser.username !== "Guest") return;

    const newUsername = elements.convertUsername.value.trim();
    const email = elements.convertEmail.value.trim();
    const password = elements.convertPassword.value;

    elements.convertError.classList.add("hidden");

    try {
      // 1. Register user on MongoDB via API
      const regResponse = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUsername,
          email,
          avatar: convertSelectedAvatar,
          password,
        }),
      });

      const regData = await regResponse.json();

      if (!regResponse.ok || !regData.success) {
        elements.convertError.textContent =
          regData.message || "Failed to register account.";
        elements.convertError.classList.remove("hidden");
        return;
      }

      // 2. Automatically log in to get JWT Session Token
      const loginResponse = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUsername,
          password,
        }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok || !loginData.success) {
        elements.convertError.textContent =
          "Registered successfully, but automatic login failed. Please reload and log in manually.";
        elements.convertError.classList.remove("hidden");
        return;
      }

      // Save token and session details
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("auratracker_session", newUsername);

      const newUser = {
        username: newUsername,
        email,
        avatar: convertSelectedAvatar,
        bio: "Keep pushing, stay consistent!",
        targetGoal: 85,
      };

      // 3. Data Migration: Copy Guest LocalStorage Data to New Account Scoped Data
      const guestDataKey = `auratracker_user_Guest_data`;
      const guestDataStr = localStorage.getItem(guestDataKey);

      if (guestDataStr) {
        localStorage.setItem(
          `auratracker_user_${newUsername}_data`,
          guestDataStr,
        );
        localStorage.removeItem(guestDataKey);
      }

      // 4. Set active user state
      sessionUser = newUser;

      // Reset conversion form fields
      elements.convertUsername.value = "";
      elements.convertEmail.value = "";
      elements.convertPassword.value = "";

      // 5. Reload new scoped state, save to backend, and update dashboard layout
      loadUserScopedData();
      saveUserScopedData(); // This triggers the debounced POST /api/sync
      showDashboard();

      showToast(
        `Account "${newUsername}" registered! All schedule routines and tasks have been migrated successfully.`,
        "success",
      );
    } catch (err) {
      console.error(err);
      elements.convertError.textContent = "Server connection error.";
      elements.convertError.classList.remove("hidden");
    }
  });
}

// --- Attendance Helpers ---
function getUniqueClassNames() {
  const classes = state.routine.filter((r) => r.type === "class");
  const names = [...new Set(classes.map((c) => c.title))];
  return names;
}

function getClassScheduledWeekdays(classTitle) {
  const classSlots = state.routine.filter(
    (r) => r.type === "class" && r.title === classTitle && !r.isSpecial,
  );
  return new Set(classSlots.map((c) => c.day));
}

function getClassSpecialDates(classTitle) {
  const specialSlots = state.routine.filter(
    (r) => r.type === "class" && r.title === classTitle && r.isSpecial && r.date,
  );
  return new Set(specialSlots.map((c) => c.date));
}

function isClassScheduledOnDate(classTitle, dateObj) {
  if (typeof sessionUser !== "undefined" && sessionUser?.academicProfile?.termStartDate) {
    const termStart = new Date(sessionUser.academicProfile.termStartDate);
    termStart.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateObj);
    checkDate.setHours(0, 0, 0, 0);
    if (checkDate < termStart) {
      return false;
    }
  }

  const scheduledWeekdays = getClassScheduledWeekdays(classTitle);
  const specialDates = getClassSpecialDates(classTitle);
  const dateKey = getFormattedDateKey(dateObj);
  return scheduledWeekdays.has(dateObj.getDay()) || specialDates.has(dateKey);
}

// --- Attendance Module Renderers ---
function renderAttendance() {
  const classNames = getUniqueClassNames();
  elements.subjectSelector.innerHTML = "";

  if (classNames.length === 0) {
    elements.subjectSelector.innerHTML =
      '<option value="">No Classes Scheduled</option>';
    elements.statRate.textContent = "0%";
    elements.statRateFill.style.width = "0%";
    elements.statStreak.textContent = "0 days";
    elements.classOccurrencesSummary.textContent = "None";
    elements.classTotalLogs.textContent = "Total Logs: 0";
    elements.summaryPresent.textContent = "P: 0";
    elements.summaryAbsent.textContent = "A: 0";
    elements.summaryLate.textContent = "L: 0";
    elements.summaryExcused.textContent = "E: 0";
    elements.calendarDaysGrid.innerHTML = "";
    return;
  }

  let selectedClass = elements.subjectSelector.value;
  if (!selectedClass || !classNames.includes(selectedClass)) {
    selectedClass = classNames.includes(state.currentSubjectId)
      ? state.currentSubjectId
      : classNames[0];
    state.currentSubjectId = selectedClass;
  }

  classNames.forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    if (name === selectedClass) {
      opt.selected = true;
    }
    elements.subjectSelector.appendChild(opt);
  });

  if (typeof initCustomSelect === "function") {
    initCustomSelect(elements.subjectSelector);
  }

  if (!state.attendance[selectedClass]) {
    state.attendance[selectedClass] = {};
  }
  const logs = state.attendance[selectedClass];

  const weekdaysNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const scheduledWeekdays = getClassScheduledWeekdays(selectedClass);
  const scheduledDaysText = [...scheduledWeekdays]
    .map((d) => weekdaysNames[d])
    .join(", ");
  elements.classOccurrencesSummary.textContent =
    scheduledDaysText || "Not Scheduled";

  let presents = 0;
  let absents = 0;
  let lates = 0;
  let excused = 0;

  Object.keys(logs).forEach((logKey) => {
    const status = logs[logKey];
    const dateStr = logKey.split('_')[0];
    const logDate = new Date(dateStr);

    if (scheduledWeekdays.has(logDate.getDay())) {
      if (status === "Present") presents++;
      else if (status === "Absent") absents++;
      else if (status === "Late") lates++;
      else if (status === "Excused") excused++;
    }
  });

  const totalLogsCount = presents + absents + lates + excused;
  elements.classTotalLogs.textContent = `Total Logs: ${totalLogsCount}`;

  const rateDenominator = presents + absents + lates;
  let rate = 0;
  if (rateDenominator > 0) {
    rate = Math.round(((presents + lates) / rateDenominator) * 100);
  }

  elements.statRate.textContent = `${rate}%`;
  elements.statRateFill.style.width = `${rate}%`;
  elements.statStreak.textContent = `${calculateClassStreak(selectedClass, logs)} days`;

  elements.summaryPresent.textContent = `P: ${presents}`;
  elements.summaryAbsent.textContent = `A: ${absents}`;
  elements.summaryLate.textContent = `L: ${lates}`;
  elements.summaryExcused.textContent = `E: ${excused}`;

  renderCalendar();
}

function runClock() {
  const updateTime = () => {
    const now = new Date();
    elements.liveTime.textContent = now.toLocaleTimeString();
    elements.liveDate.textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };
  updateTime();
  setInterval(updateTime, 1000);
}

function renderCalendar() {
  const selectedClass = state.currentSubjectId;
  if (!selectedClass) return;

  const year = state.currentCalendarDate.getFullYear();
  const month = state.currentCalendarDate.getMonth();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  elements.calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

  elements.calendarDaysGrid.innerHTML = "";

  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayIndex; i++) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "calendar-day empty";
    elements.calendarDaysGrid.appendChild(emptyDiv);
  }

  const today = new Date();
  const logs = state.attendance[selectedClass] || {};
  const scheduledWeekdays = getClassScheduledWeekdays(selectedClass);

  for (let day = 1; day <= lastDay; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "calendar-day";
    dayDiv.textContent = day;

    const cellDate = new Date(year, month, day);
    const dateKey = getFormattedDateKey(cellDate);
    const isScheduled = isClassScheduledOnDate(selectedClass, cellDate);

    if (isScheduled) {
      dayDiv.classList.add("class-scheduled");
    } else {
      dayDiv.classList.add("class-inactive");
    }

    if (
      cellDate.getDate() === today.getDate() &&
      cellDate.getMonth() === today.getMonth() &&
      cellDate.getFullYear() === today.getFullYear()
    ) {
      dayDiv.classList.add("today");
    }

    let dayAggregateStatus = "";
    if (isScheduled) {
      const dayNum = cellDate.getDay();
      const slots = state.routine.filter(r => r.title === selectedClass && r.type === "class" && (r.day === dayNum || r.date === dateKey));
      const statuses = slots.map(s => logs[`${dateKey}_${s.id}`]).filter(Boolean);
      if (statuses.length > 0) {
        if (statuses.includes("Absent")) dayAggregateStatus = "absent";
        else if (statuses.includes("Late")) dayAggregateStatus = "late";
        else if (statuses.includes("Present")) dayAggregateStatus = "present";
        else dayAggregateStatus = statuses[0].toLowerCase();
      }
    }

    if (dayAggregateStatus) {
      dayDiv.classList.add(dayAggregateStatus);
    }

    if (isScheduled || dayAggregateStatus) {
      dayDiv.addEventListener("click", () => {
        openDayEditModal(dateKey, cellDate);
      });
    }

    elements.calendarDaysGrid.appendChild(dayDiv);
  }

  if (window.lucide) window.lucide.createIcons();
}

function openDayEditModal(dateKey, dateObj) {
  state.selectedCalendarDayInfo = {
    dateKey,
    classTitle: state.currentSubjectId,
  };

  const options = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  elements.modalDateString.textContent = dateObj.toLocaleDateString(
    "en-US",
    options,
  );
  elements.modalSubjectName.textContent = state.currentSubjectId;

  const logs = state.attendance[state.currentSubjectId] || {};
  const dayNum = dateObj.getDay();
  const slots = state.routine.filter(r => r.title === state.currentSubjectId && r.type === "class" && (r.day === dayNum || r.date === dateKey));
  let currentStatus = "None";
  if (slots.length > 0) {
    const statuses = slots.map(s => logs[`${dateKey}_${s.id}`]).filter(Boolean);
    if (statuses.length > 0) {
      if (statuses.includes("Absent")) currentStatus = "Absent";
      else if (statuses.includes("Late")) currentStatus = "Late";
      else if (statuses.includes("Present")) currentStatus = "Present";
      else currentStatus = statuses[0];
    }
  }

  elements.attendanceOptions.forEach((opt) => {
    const status = opt.getAttribute("data-status");
    opt.className = `btn-attendance-option opt-${status.toLowerCase()}`;
    if (status === currentStatus) {
      opt.classList.add("selected");
    }
  });

  openModal(elements.dayModal);
}

function setupAttendanceHandlers() {
  elements.subjectSelector.addEventListener("change", (e) => {
    state.currentSubjectId = e.target.value;
    renderAttendance();
    saveUserScopedData();
  });

  elements.btnDeleteSubject.addEventListener("click", async () => {
    const subjectName = state.currentSubjectId;
    if (!subjectName) {
      showToast("No subject selected to delete.", "error");
      return;
    }

    const message = `Are you sure you want to delete the subject "${subjectName}" entirely? This will delete all of its schedule slots and clear its attendance log history.`;
    if (await showConfirm(message, "Delete Subject Entirely")) {
      // 1. Delete all classes with this title
      state.routine = state.routine.filter(
        (r) => !(r.type === "class" && r.title === subjectName),
      );

      // 2. Delete attendance records for this subject
      delete state.attendance[subjectName];

      // 3. Clear current selection state so renderAttendance selects another class
      state.currentSubjectId = "";

      // 4. Save and Re-render everything
      saveUserScopedData();
      renderAttendance();
      renderRoutineTimeline();
      renderWeeklyScopeGrid();
      if (typeof renderOverviewTab === "function") {
        renderOverviewTab();
      }

      showToast(`Subject "${subjectName}" deleted successfully.`, "success");

      // Auto-refresh the page to cleanly re-initialize all complex modules and charts
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  });

  elements.prevMonthBtn.addEventListener("click", () => {
    state.currentCalendarDate.setMonth(
      state.currentCalendarDate.getMonth() - 1,
    );
    renderCalendar();
  });

  elements.nextMonthBtn.addEventListener("click", () => {
    state.currentCalendarDate.setMonth(
      state.currentCalendarDate.getMonth() + 1,
    );
    renderCalendar();
  });

  elements.attendanceOptions.forEach((opt) => {
    opt.addEventListener("click", () => {
      if (!state.selectedCalendarDayInfo) return;
      const { dateKey, classTitle } = state.selectedCalendarDayInfo;
      const status = opt.getAttribute("data-status");

      if (!state.attendance[classTitle]) {
        state.attendance[classTitle] = {};
      }

      const dateObj = new Date(dateKey);
      const dayNum = dateObj.getDay();
      const slots = state.routine.filter(r => r.title === classTitle && r.type === "class" && (r.day === dayNum || r.date === dateKey));

      if (slots.length > 0) {
        slots.forEach(slot => {
          if (status === "None") {
            delete state.attendance[classTitle][`${dateKey}_${slot.id}`];
          } else {
            state.attendance[classTitle][`${dateKey}_${slot.id}`] = status;
          }
        });
      }

      saveUserScopedData();
      closeModal(elements.dayModal);
      renderAttendance();
      renderRoutineTimeline();
    });
  });
}

// --- Weekly Schedule Planner timeline / grid ---
function renderRoutineTimeline() {
  if (state.routineView === "weekly") {
    renderWeeklyScopeGrid();
    return;
  }

  elements.dailyTimelineContainer.classList.remove("hidden");
  elements.weeklyGridContainer.classList.add("hidden");
  elements.dailyTabsWrapper.classList.remove("hidden");
  elements.quickInfoText.textContent =
    "Classes, routines, and tasks are merged. Click any item to edit or delete.";

  elements.routineItemsList.innerHTML = "";

  const activeDay = state.activeRoutineDay;
  const today = new Date();
  const todayDay = today.getDay();
  const todayDateKey = getFormattedDateKey(today);

  const dayRoutines = state.routine.filter((r) => r.day === activeDay);
  const dayTasks = state.todos.filter((t) => t.day === activeDay);

  const timelineItems = [];

  dayRoutines.forEach((r) => {
    timelineItems.push({
      type: r.type,
      time: r.start,
      end: r.end,
      title: r.title,
      tag: r.tag,
      refId: r.id,
      rawItem: r,
    });
  });

  dayTasks.forEach((t) => {
    timelineItems.push({
      type: "todo",
      time: "23:59",
      title: t.text,
      tag: t.category,
      refId: t.id,
      completed: t.completed,
      urgency: t.urgency,
      rawItem: t,
    });
  });

  timelineItems.sort((a, b) => {
    const timeA = a.time.split(":").map(Number);
    const timeB = b.time.split(":").map(Number);
    const diff = timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    if (diff !== 0) return diff;
    const typeWeights = { class: 1, routine: 2, todo: 3 };
    return typeWeights[a.type] - typeWeights[b.type];
  });

  if (timelineItems.length === 0) {
    elements.routineItemsList.innerHTML = `
            <div class="routine-empty-state">
                <i data-lucide="info"></i>
                <span>No schedule events or tasks assigned to this day.</span>
            </div>
        `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }



  timelineItems.forEach((item) => {
    const itemDiv = document.createElement("div");

    if (item.type === "todo") {
      itemDiv.className = `routine-item type-todo tag-${item.tag} priority-${item.urgency} ${item.completed ? "completed-todo" : ""}`;
      itemDiv.innerHTML = `
                <div class="todo-item-left">
                    <button class="todo-checkbox ${item.completed ? "checked" : ""}" type="button">
                        <i data-lucide="check"></i>
                    </button>
                    <div class="routine-details">
                        <span class="routine-title">${escapeHTML(item.title)}</span>
                        <span class="routine-time-span"><i data-lucide="check-square"></i> Task Checklist</span>
                    </div>
                </div>
                <span class="routine-tag-pill">${item.tag}</span>
            `;

      const checkbox = itemDiv.querySelector(".todo-checkbox");
      checkbox.addEventListener("click", (e) => {
        e.stopPropagation();
        item.rawItem.completed = !item.rawItem.completed;
        saveUserScopedData();
        setTimeout(() => {
          renderRoutineTimeline();
          renderTodoList();
        }, 100);
      });

      itemDiv.addEventListener("click", async () => {
        if (await showConfirm(`Delete task "${item.title}"?`, "Delete Task")) {
          state.todos = state.todos.filter((t) => t.id !== item.refId);
          saveUserScopedData();
          renderRoutineTimeline();
          renderTodoList();
        }
      });
    } else {
      let specialClassStr = "";
      let badgeLabel = item.type === "class" ? "Class" : item.tag;
      if (item.type === "class" && item.rawItem && item.rawItem.isSpecial) {
          specialClassStr = " special-class";
          badgeLabel = "Special Class: " + item.rawItem.date;
      }
      
      const isSelected = typeof routineManageMode !== 'undefined' && routineManageMode && routineSelectedIds.has(item.refId);
      itemDiv.className = `routine-item type-${item.type} tag-${item.tag}${specialClassStr}${typeof routineManageMode !== 'undefined' && routineManageMode ? " manage-selectable" : ""}${isSelected ? " manage-selected" : ""}`;

      let attendanceHtml = "";
      if (item.type === "class" && !(typeof routineManageMode !== 'undefined' && routineManageMode)) {
        const logs = state.attendance[item.title] || {};
        const logKey = `${todayDateKey}_${item.refId}`;
        const currentLog = logs[logKey] || "None";

        attendanceHtml = `
                    <div class="inline-checkin-container" onclick="event.stopPropagation()">
                        <button class="inline-log-btn ${currentLog === "Present" ? "active-p" : ""}" data-status="Present">P</button>
                        <button class="inline-log-btn ${currentLog === "Absent" ? "active-a" : ""}" data-status="Absent">A</button>
                        <button class="inline-log-btn ${currentLog === "Late" ? "active-l" : ""}" data-status="Late">L</button>
                        <button class="inline-log-btn ${currentLog === "Excused" ? "active-e" : ""}" data-status="Excused">E</button>
                        <button class="inline-log-btn ${currentLog === "Cancelled" ? "active-c" : ""}" data-status="Cancelled">C</button>
                    </div>
                `;
      }

      if (typeof routineManageMode !== 'undefined' && routineManageMode) {
        itemDiv.innerHTML = `
                <label class="manage-checkbox-label" onclick="event.stopPropagation()">
                    <input type="checkbox" class="manage-checkbox" ${isSelected ? "checked" : ""} />
                    <span class="manage-check-custom"></span>
                </label>
                <div class="routine-details">
                    <span class="routine-title">${escapeHTML(item.title)}</span>
                    <span class="routine-time-span">
                        <i data-lucide="clock"></i> 
                        ${format12h(item.time)} - ${format12h(item.end)}
                    </span>
                </div>
                <span class="routine-tag-pill${item.rawItem && item.rawItem.isSpecial ? ' special-badge' : ''}">${badgeLabel}</span>
            `;

        const cb = itemDiv.querySelector(".manage-checkbox");
        if (cb) {
          cb.addEventListener("change", () => {
            if (cb.checked) {
              routineSelectedIds.add(item.refId);
            } else {
              routineSelectedIds.delete(item.refId);
            }
            if (typeof updateBulkDeleteBar === 'function') updateBulkDeleteBar();
            itemDiv.classList.toggle("manage-selected", cb.checked);
          });
        }

        itemDiv.addEventListener("click", () => {
          const chk = itemDiv.querySelector(".manage-checkbox");
          if (chk) {
            chk.checked = !chk.checked;
            chk.dispatchEvent(new Event("change"));
          }
        });
      } else {
        itemDiv.innerHTML = `
                  <div class="routine-details">
                      <span class="routine-title">${escapeHTML(item.title)}</span>
                      <span class="routine-time-span">
                          <i data-lucide="clock"></i> 
                          ${format12h(item.time)} - ${format12h(item.end)}
                      </span>
                      ${attendanceHtml}
                  </div>
                  <span class="routine-tag-pill${item.rawItem && item.rawItem.isSpecial ? ' special-badge' : ''}">${badgeLabel}</span>
              `;

        if (item.type === "class") {
          const logBtns = itemDiv.querySelectorAll(".inline-log-btn");
          logBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
              e.stopPropagation();
              const status = btn.getAttribute("data-status");
              const logs = state.attendance[item.title] || {};
              const logKey = `${todayDateKey}_${item.refId}`;

              if (logs[logKey] === status) {
                delete state.attendance[item.title][logKey];
              } else {
                if (!state.attendance[item.title])
                  state.attendance[item.title] = {};
                state.attendance[item.title][logKey] = status;
              }

              saveUserScopedData();
              renderRoutineTimeline();
              renderAttendance();
            });
          });
        }

        itemDiv.addEventListener("click", () => {
          if (typeof window.openRoutineDetailsModal === "function") {
            window.openRoutineDetailsModal(item.rawItem);
          }
        });
      }
    }

    elements.routineItemsList.appendChild(itemDiv);
  });

  if (window.lucide) window.lucide.createIcons();
}

function renderWeeklyScopeGrid() {
  elements.dailyTimelineContainer.classList.add("hidden");
  elements.weeklyGridContainer.classList.remove("hidden");
  elements.dailyTabsWrapper.classList.add("hidden");
  elements.quickInfoText.textContent =
    "Weekly Scope: Click any card to edit. Click (+) to add routine slots directly.";

  elements.weeklyGridColumns.innerHTML = "";

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const orderOfDays = [1, 2, 3, 4, 5, 6, 0];

  orderOfDays.forEach((dayIndex) => {
    const colDiv = document.createElement("div");
    colDiv.className = "weekly-day-column";

    const headerDiv = document.createElement("div");
    headerDiv.className = "weekly-column-header";
    headerDiv.innerHTML = `
            <h4>${dayNames[dayIndex]}</h4>
            <button class="btn-icon-small btn-quick-add" data-day="${dayIndex}" title="Add slot for ${dayNames[dayIndex]}">
                <i data-lucide="plus"></i>
            </button>
        `;

    const addBtn = headerDiv.querySelector(".btn-quick-add");
    addBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      elements.routineTitle.value = "";
      elements.routineDay.value = dayIndex;
      elements.routineType.value = "class";
      elements.routineTag.value = "study";
      elements.routineStart.value = "09:00";
      elements.routineEnd.value = "10:00";
      if (elements.routineId) elements.routineId.value = "";
      if (elements.btnRoutineSubmit) elements.btnRoutineSubmit.textContent = "Add Slot";
      if (elements.btnRoutineDelete) elements.btnRoutineDelete.classList.add("hidden");
      if (typeof initCustomSelect === "function") {
        initCustomSelect(elements.routineDay);
        initCustomSelect(elements.routineType);
        initCustomSelect(elements.routineTag);
      }
      openModal(elements.routineModal);
    });

    colDiv.appendChild(headerDiv);

    const bodyDiv = document.createElement("div");
    bodyDiv.className = "weekly-column-body";

    const dayRoutines = state.routine.filter((r) => r.day === dayIndex);
    const dayTasks = state.todos.filter((t) => t.day === dayIndex);

    const dayTimeline = [];
    dayRoutines.forEach((r) => {
      dayTimeline.push({
        type: r.type,
        time: r.start,
        title: r.title,
        tag: r.tag,
        refId: r.id,
        rawItem: r,
      });
    });
    dayTasks.forEach((t) => {
      dayTimeline.push({
        type: "todo",
        time: "23:59",
        title: t.text,
        tag: t.category,
        refId: t.id,
        completed: t.completed,
        rawItem: t,
      });
    });

    dayTimeline.sort((a, b) => {
      const timeA = a.time.split(":").map(Number);
      const timeB = b.time.split(":").map(Number);
      const diff = timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
      if (diff !== 0) return diff;
      const typeWeights = { class: 1, routine: 2, todo: 3 };
      return typeWeights[a.type] - typeWeights[b.type];
    });

    if (dayTimeline.length === 0) {
      bodyDiv.innerHTML = `<span class="weekly-day-empty">No events</span>`;
    } else {
      dayTimeline.forEach((item) => {
        const card = document.createElement("div");

        if (item.type === "todo") {
          card.className = `weekly-slot-card type-todo tag-${item.tag} ${item.completed ? "completed-todo" : ""}`;
          card.innerHTML = `
                        <span class="weekly-slot-title">${escapeHTML(item.title)}</span>
                        <span class="weekly-slot-time">Task Checklist</span>
                    `;

          card.addEventListener("click", async () => {
            if (
              await showConfirm(`Remove task "${item.title}"?`, "Remove Task")
            ) {
              state.todos = state.todos.filter((t) => t.id !== item.refId);
            } else {
              item.rawItem.completed = !item.rawItem.completed;
            }
            saveUserScopedData();
            renderWeeklyScopeGrid();
            renderTodoList();
          });
        } else {
          let specialClassStr = "";
          let badge = item.type === "class" ? "Class" : item.tag;
          if (item.type === "class" && item.rawItem && item.rawItem.isSpecial) {
              specialClassStr = " special-class";
              badge = "Special: " + item.rawItem.date;
          }
          const isSelected = typeof routineManageMode !== 'undefined' && routineManageMode && routineSelectedIds.has(item.refId);
          card.className = `weekly-slot-card type-${item.type} tag-${item.tag}${specialClassStr}${typeof routineManageMode !== 'undefined' && routineManageMode ? " manage-selectable" : ""}${isSelected ? " manage-selected" : ""}`;
          const timeStr = item.rawItem.start + " - " + item.rawItem.end;

          card.innerHTML = `
                        ${typeof routineManageMode !== 'undefined' && routineManageMode ? '<span class="weekly-slot-card-checkbox"></span>' : ''}
                        <span class="weekly-slot-title">${escapeHTML(item.title)}</span>
                        <span class="weekly-slot-time">${timeStr}</span>
                        <span class="weekly-slot-badge${item.rawItem && item.rawItem.isSpecial ? ' special-badge' : ''}">${badge}</span>
                    `;

          if (typeof routineManageMode !== 'undefined' && routineManageMode) {
            card.addEventListener("click", () => {
              if (routineSelectedIds.has(item.refId)) {
                routineSelectedIds.delete(item.refId);
                card.classList.remove("manage-selected");
              } else {
                routineSelectedIds.add(item.refId);
                card.classList.add("manage-selected");
              }
              if (typeof updateBulkDeleteBar === "function") updateBulkDeleteBar();
            });
          } else {
            card.addEventListener("click", () => {
              if (typeof window.openRoutineDetailsModal === "function") {
                window.openRoutineDetailsModal(item.rawItem);
              }
            });
          }
        }

        bodyDiv.appendChild(card);
      });
    }

    colDiv.appendChild(bodyDiv);
    elements.weeklyGridColumns.appendChild(colDiv);
  });

  if (window.lucide) window.lucide.createIcons();
}


// --- Routine Manage Mode ---
let routineManageMode = false;
let routineSelectedIds = new Set();

function enterRoutineManageMode() {
  routineManageMode = true;
  routineSelectedIds.clear();
  const btn = document.getElementById('btn-manage-routine');
  if (btn) btn.classList.add('active-manage');
  const bar = document.getElementById('routine-bulk-action-bar');
  if (bar) bar.classList.remove('hidden');
  updateBulkDeleteBar();
  if (state.routineView === 'weekly') {
    renderWeeklyScopeGrid();
  } else {
    renderRoutineTimeline();
  }
}

function exitRoutineManageMode() {
  routineManageMode = false;
  routineSelectedIds.clear();
  const btn = document.getElementById('btn-manage-routine');
  if (btn) btn.classList.remove('active-manage');
  const bar = document.getElementById('routine-bulk-action-bar');
  if (bar) bar.classList.add('hidden');
  const btnSelectAll = document.getElementById('btn-routine-select-all');
  if (btnSelectAll) btnSelectAll.textContent = 'Select All';
  if (state.routineView === 'weekly') {
    renderWeeklyScopeGrid();
  } else {
    renderRoutineTimeline();
  }
}

function updateBulkDeleteBar() {
  const countEl = document.getElementById('routine-selected-count');
  const deleteBtn = document.getElementById('btn-routine-delete-selected');
  if (countEl) countEl.textContent = `${routineSelectedIds.size} selected`;
  if (deleteBtn) deleteBtn.disabled = routineSelectedIds.size === 0;
}

function setupRoutineHandlers() {
  // Manage mode buttons
  const btnManage = document.getElementById('btn-manage-routine');
  if (btnManage) {
    btnManage.addEventListener('click', () => {
      if (routineManageMode) exitRoutineManageMode();
      else enterRoutineManageMode();
    });
  }

  const btnCancelManage = document.getElementById('btn-routine-cancel-manage');
  if (btnCancelManage) {
    btnCancelManage.addEventListener('click', exitRoutineManageMode);
  }

  const btnSelectAll = document.getElementById('btn-routine-select-all');
  if (btnSelectAll) {
    btnSelectAll.addEventListener('click', () => {
      let itemsToSelect = state.routineView === 'weekly' 
        ? state.routine 
        : state.routine.filter(r => r.day === state.activeRoutineDay);
      
      const allIds = itemsToSelect.map(r => r.id);
      const allSelected = allIds.every(id => routineSelectedIds.has(id));
      if (allSelected) {
        allIds.forEach(id => routineSelectedIds.delete(id));
        btnSelectAll.textContent = 'Select All';
      } else {
        allIds.forEach(id => routineSelectedIds.add(id));
        btnSelectAll.textContent = 'Deselect All';
      }
      updateBulkDeleteBar();
      if (state.routineView === 'weekly') renderWeeklyScopeGrid();
      else renderRoutineTimeline();
    });
  }

  const btnDeleteSelected = document.getElementById('btn-routine-delete-selected');
  if (btnDeleteSelected) {
    btnDeleteSelected.addEventListener('click', async () => {
      if (routineSelectedIds.size === 0) return;
      const count = routineSelectedIds.size;
      const confirmed = await showConfirm(
        `Delete ${count} selected slot${count !== 1 ? 's' : ''}? This cannot be undone.`,
        'Delete Slots'
      );
      if (confirmed) {
        state.routine = state.routine.filter(r => !routineSelectedIds.has(r.id));
        saveUserScopedData();
        exitRoutineManageMode();
        renderAttendance();
        if (typeof renderOverviewTab === 'function') renderOverviewTab();
        showToast(`${count} slot${count !== 1 ? 's' : ''} deleted.`, 'success');
      }
    });
  }

  elements.btnViewDaily.addEventListener("click", () => {
    elements.btnViewDaily.classList.add("active");
    elements.btnViewWeekly.classList.remove("active");
    state.routineView = "daily";
    saveUserScopedData();
    renderRoutineTimeline();
  });

  elements.btnViewWeekly.addEventListener("click", () => {
    elements.btnViewWeekly.classList.add("active");
    elements.btnViewDaily.classList.remove("active");
    state.routineView = "weekly";
    saveUserScopedData();
    renderRoutineTimeline();
  });

  elements.dayTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      elements.dayTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      state.activeRoutineDay = parseInt(tab.getAttribute("data-day"), 10);
      renderRoutineTimeline();
    });
  });

  elements.addRoutineBtn.addEventListener("click", () => {
    elements.routineTitle.value = "";
    elements.routineDay.value = state.activeRoutineDay;
    elements.routineType.value = "class";
    elements.routineTag.value = "study";
    elements.routineStart.value = "09:00";
    elements.routineEnd.value = "10:00";
    if (elements.routineId) elements.routineId.value = "";
    elements.routineSpecificDateGroup.classList.add("hidden");
    elements.routineSpecificDate.value = "";
    if (elements.btnRoutineSubmit) elements.btnRoutineSubmit.textContent = "Add Slot";
    if (elements.btnRoutineDelete) elements.btnRoutineDelete.classList.add("hidden");
    if (typeof initCustomSelect === "function") {
      initCustomSelect(elements.routineDay);
      initCustomSelect(elements.routineType);
      initCustomSelect(elements.routineTag);
    }
    openModal(elements.routineModal);
  });

  elements.routineDay.addEventListener("change", (e) => {
    if (e.target.value === "special") {
      elements.routineSpecificDateGroup.classList.remove("hidden");
    } else {
      elements.routineSpecificDateGroup.classList.add("hidden");
    }
  });

  window.openRoutineDetailsModal = function(item) {
    const modal = document.getElementById("routine-details-modal");
    if (!modal) return;
    
    document.getElementById("details-modal-title").textContent = item.title;
    
    const typeBadge = document.getElementById("details-modal-type");
    typeBadge.textContent = item.type === "class" ? "Class" : (item.tag || "Task");
    typeBadge.className = `routine-tag-pill tag-${item.tag || 'none'} ${item.isSpecial ? "special-badge" : ""}`;
    
    document.getElementById("details-modal-time").textContent = `${format12h(item.start || item.time || "")} - ${format12h(item.end || item.endTime || "")}`;
    document.getElementById("details-modal-faculty").textContent = item.faculty || "Not Assigned";
    document.getElementById("details-modal-room").textContent = item.room || "Not Assigned";
    
    const editBtn = document.getElementById("btn-edit-routine-details");
    if (editBtn) {
      editBtn.onclick = () => {
        closeModal(modal);
        if (typeof window.openRoutineEditModal === "function") {
          window.openRoutineEditModal(item);
        }
      };
    }
    
    const deleteBtn = document.getElementById("btn-delete-routine-details");
    if (deleteBtn) {
      deleteBtn.onclick = async () => {
        if (await showConfirm(`Delete "${item.title}"?`, "Confirm Delete")) {
          const targetId = item.id || item._id;
          state.routine = state.routine.filter((r) => r.id !== targetId && r._id !== targetId);
          saveUserScopedData();
          closeModal(modal);
          renderRoutineTimeline();
          if (typeof renderWeeklyScopeGrid === "function") renderWeeklyScopeGrid();
          if (typeof renderAttendance === "function") renderAttendance();
        }
      };
    }
    
    openModal(modal);
  };

  window.openRoutineEditModal = function(item) {
    elements.routineTitle.value = item.title;
    if (elements.routineFaculty) elements.routineFaculty.value = item.faculty || "";
    if (elements.routineRoom) elements.routineRoom.value = item.room || "";
    if (item.isSpecial) {
      elements.routineDay.value = "special";
      elements.routineSpecificDate.value = item.date;
      elements.routineSpecificDateGroup.classList.remove("hidden");
    } else {
      elements.routineDay.value = item.day;
      elements.routineSpecificDate.value = "";
      elements.routineSpecificDateGroup.classList.add("hidden");
    }
    elements.routineType.value = item.type;
    elements.routineTag.value = item.tag;
    elements.routineStart.value = item.start;
    elements.routineEnd.value = item.end;
    if (elements.routineId) elements.routineId.value = item.id || item.refId;
    if (elements.btnRoutineSubmit) elements.btnRoutineSubmit.textContent = "Update Slot";
    if (elements.btnRoutineDelete) elements.btnRoutineDelete.classList.remove("hidden");
    if (typeof initCustomSelect === "function") {
      initCustomSelect(elements.routineDay);
      initCustomSelect(elements.routineType);
      initCustomSelect(elements.routineTag);
    }
    openModal(elements.routineModal);
  };

  if (elements.btnRoutineDelete) {
    elements.btnRoutineDelete.addEventListener("click", async () => {
      const routineId = elements.routineId.value;
      if (!routineId) return;
      if (await showConfirm("Delete this routine slot?", "Delete Slot")) {
        state.routine = state.routine.filter((r) => r.id !== routineId);
        saveUserScopedData();
        closeModal(elements.routineModal);
        renderRoutineTimeline();
        renderWeeklyScopeGrid();
        if (typeof renderAttendance === 'function') renderAttendance();
      }
    });
  }

  elements.routineForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = elements.routineTitle.value.trim();
    const faculty = elements.routineFaculty ? elements.routineFaculty.value.trim() : "";
    const room = elements.routineRoom ? elements.routineRoom.value.trim() : "";
    const type = elements.routineType.value;
    const tag = elements.routineTag.value;
    const start = elements.routineStart.value;
    const end = elements.routineEnd.value;
    
    let day;
    let isSpecial = false;
    let date = null;
    
    if (elements.routineDay.value === "special") {
      isSpecial = true;
      date = elements.routineSpecificDate.value;
      if (!date) {
        showToast("Validation Error: Please select a specific date.", "error");
        return;
      }
      day = new Date(date).getDay();
    } else {
      day = parseInt(elements.routineDay.value, 10);
    }

    if (title && start && end) {
      if (start >= end) {
        showToast(
          "Validation Error: Start time must be before end time!",
          "error",
        );
        return;
      }

      const routineId = elements.routineId ? elements.routineId.value : "";
      
      if (routineId) {
        const index = state.routine.findIndex(r => r.id === routineId);
        if (index !== -1) {
          const oldTitle = state.routine[index].title;
          state.routine[index] = {
            ...state.routine[index],
            type, day, title, start, end, tag, isSpecial, date, faculty, room
          };
          
          // Optionally update other slots of the same class if user wants to sync faculty/room for a subject code
          state.routine.forEach(r => {
            if (r.title === title && r.type === "class") {
              r.faculty = faculty;
              r.room = room;
            }
          });
          // Migrate attendance if title changed and it was a class
          if (type === "class" && oldTitle !== title && state.attendance[oldTitle]) {
            state.attendance[title] = state.attendance[oldTitle];
            delete state.attendance[oldTitle];
          }
        }
      } else {
        const newRoutine = {
          id: "rot_" + Date.now(),
          type,
          day,
          title,
          start,
          end,
          tag,
          isSpecial,
          date,
          faculty,
          room
        };
        state.routine.push(newRoutine);
        
        // If adding a new slot of an existing subject, maybe we should also sync its faculty/room to other slots of the same subject code?
        state.routine.forEach(r => {
          if (r.title === title && r.type === "class") {
            r.faculty = faculty;
            r.room = room;
          }
        });
      }

      if (type === "class" && !state.attendance[title]) {
        state.attendance[title] = {};
      }

      saveUserScopedData();
      closeModal(elements.routineModal);

      state.activeRoutineDay = day;
      elements.dayTabs.forEach((t) => {
        t.classList.remove("active");
        if (parseInt(t.getAttribute("data-day"), 10) === day) {
          t.classList.add("active");
        }
      });

      renderRoutineTimeline();
      renderAttendance();
    }
  });
}

// --- Tasks / To-Do List Module ---
function renderTodoList() {
  elements.todoItemsList.innerHTML = "";

  const filteredTodos = state.todos.filter((t) => {
    if (state.activeTodoFilter === "active") return !t.completed;
    if (state.activeTodoFilter === "completed") return t.completed;
    return true;
  });

  const total = state.todos.length;
  const completed = state.todos.filter((t) => t.completed).length;
  elements.todoStats.textContent = `${completed} / ${total}`;

  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
  elements.todoProgressFill.style.width = `${progressPercent}%`;
  elements.todoProgressText.textContent = `${progressPercent}% Complete`;

  if (filteredTodos.length === 0) {
    elements.todoItemsList.innerHTML = `
            <div class="routine-empty-state" style="height: 140px;">
                <i data-lucide="clipboard"></i>
                <span style="font-size: 11px;">No tasks found. Add a new task below.</span>
            </div>
        `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const priorityWeights = { high: 3, medium: 2, low: 1 };
  filteredTodos.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return priorityWeights[b.urgency] - priorityWeights[a.urgency];
  });

  const dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  filteredTodos.forEach((task) => {
    const itemLi = document.createElement("li");
    itemLi.className = `todo-item priority-${task.urgency}`;

    const dayBadge =
      task.day !== null && task.day !== undefined && task.day !== ""
        ? `<span class="todo-badge" style="background: rgba(255, 255, 255, 0.05); color: var(--text-muted);">📅 ${dayNamesShort[task.day]}</span>`
        : `<span class="todo-badge" style="background: rgba(255, 255, 255, 0.02); color: var(--text-muted); opacity: 0.5;">Backlog</span>`;

    itemLi.innerHTML = `
            <div class="todo-item-left">
                <button class="todo-checkbox ${task.completed ? "checked" : ""}" type="button">
                    <i data-lucide="check"></i>
                </button>
                <div class="todo-content">
                    <span class="todo-text">${escapeHTML(task.text)}</span>
                    <div class="todo-meta" style="margin-top: 4px;">
                        <span class="todo-badge badge-${task.category}">${task.category}</span>
                        ${dayBadge}
                    </div>
                </div>
            </div>
            <button class="btn-icon-small btn-delete-task" title="Delete Task">
                <i data-lucide="trash-2"></i>
            </button>
        `;

    const checkbox = itemLi.querySelector(".todo-checkbox");
    checkbox.addEventListener("click", () => {
      task.completed = !task.completed;
      saveUserScopedData();
      setTimeout(() => {
        renderTodoList();
        renderRoutineTimeline();
      }, 100);
    });

    const deleteBtn = itemLi.querySelector(".btn-delete-task");
    deleteBtn.addEventListener("click", () => {
      state.todos = state.todos.filter((t) => t.id !== task.id);
      saveUserScopedData();
      renderTodoList();
      renderRoutineTimeline();
    });

    elements.todoItemsList.appendChild(itemLi);
  });

  if (window.lucide) window.lucide.createIcons();
}

function setupTodoHandlers() {
  elements.addTodoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = elements.todoInput.value.trim();
    const category = elements.todoCategory.value;
    const urgency = elements.todoUrgency.value;
    const dayVal = elements.todoDay.value;

    const day = dayVal === "" ? null : parseInt(dayVal, 10);

    if (text) {
      const newTodo = {
        id: "td_" + Date.now(),
        text,
        completed: false,
        category,
        urgency,
        day,
      };
      state.todos.push(newTodo);
      saveUserScopedData();

      elements.todoInput.value = "";
      elements.todoDay.value = "";
      if (typeof initCustomSelect === "function") {
        initCustomSelect(elements.todoDay);
      }

      renderTodoList();
      renderRoutineTimeline();
    }
  });

  elements.todoFilters.forEach((btn) => {
    btn.addEventListener("click", () => {
      elements.todoFilters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeTodoFilter = btn.getAttribute("data-filter");
      renderTodoList();
    });
  });
}

// --- Helper: Format Date Key (YYYY-MM-DD) ---
function getFormattedDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function format12h(time24) {
  if (!time24 || time24 === "23:59") return "All Day";
  const [hStr, mStr] = time24.split(":");
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  h = h ? h : 12;
  return `${h}:${mStr} ${ampm}`;
}

// --- Helper: Calculate Class Streak ---
function calculateClassStreak(classTitle, logs) {
  const scheduledWeekdays = getClassScheduledWeekdays(classTitle);
  if (scheduledWeekdays.size === 0) return 0;

  let streak = 0;
  let checkDate = new Date();
  let missedThreshold = 0;

  while (missedThreshold < 30) {
    const dayOfWeek = checkDate.getDay();
    if (isClassScheduledOnDate(classTitle, checkDate)) {
      const key = getFormattedDateKey(checkDate);
      const dayNum = checkDate.getDay();
      const slots = state.routine.filter(r => r.title === classTitle && r.type === "class" && (r.day === dayNum || r.date === key));
      const statuses = slots.map(s => logs[`${key}_${s.id}`]).filter(Boolean);

      if (statuses.length === 0) {
        const todayStr = getFormattedDateKey(new Date());
        if (key === todayStr) {
          // Skip today if not logged yet, continue checking previous days
        } else {
          break;
        }
      } else if (statuses.includes("Absent")) {
        break;
      } else if (statuses.includes("Present")) {
        streak += statuses.filter(s => s === "Present").length;
      } else if (statuses.includes("Cancelled")) {
        // Skip calculation for cancelled classes (they don't break the streak)
      } else {
        break;
      }
    }
    checkDate.setDate(checkDate.getDate() - 1);
    missedThreshold++;
  }

  return streak;
}

// --- General Modal Overlay Support ---
function openModal(modalEl) {
  modalEl.classList.remove("hidden");
  modalEl.setAttribute("aria-hidden", "false");
}

function closeModal(modalEl) {
  if (document.activeElement && modalEl.contains(document.activeElement)) {
    document.activeElement.blur();
  }
  modalEl.classList.add("hidden");
  modalEl.setAttribute("aria-hidden", "true");
}

function setupModalClosers() {
  elements.closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const activeBackdrop = btn.closest(".modal-backdrop");
      if (activeBackdrop) {
        closeModal(activeBackdrop);
      }
    });
  });

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-backdrop")) {
      closeModal(e.target);
    }
  });
}

// --- Utility: Escape HTML ---
function escapeHTML(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[tag] || tag,
  );
}

function setupTheme() {
  elements.themeSelector.addEventListener("change", (e) => {
    state.selectedTheme = e.target.value;
    document.documentElement.setAttribute("data-theme", state.selectedTheme);
    saveUserScopedData();

    // Redraw charts if Overview tab is active to apply new theme colors
    const activeTab = document.querySelector(".nav-item.active");
    if (activeTab && activeTab.getAttribute("data-tab") === "overview") {
      renderOverviewTab();
    }
  });
}

// Helper to dynamically adjust a dropdown panel's position to prevent screen overflow on mobile
function adjustPanelPosition(panel, button) {
  panel.style.left = "";
  panel.style.right = "";

  if (window.innerWidth > 480) {
    return;
  }

  const rect = panel.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const padding = 12; // Safety margin from screen edge

  const left = rect.left;
  const right = rect.right;
  const parentRect = button.parentElement.getBoundingClientRect();

  if (left < padding) {
    const newLeft = padding - parentRect.left;
    panel.style.left = `${newLeft}px`;
    panel.style.right = "auto";
  } else if (right > viewportWidth - padding) {
    const newRight = parentRect.right - (viewportWidth - padding);
    panel.style.right = `${newRight}px`;
    panel.style.left = "auto";
  }
}

// ============================================
// New Header — settings panel + search shortcut
// ============================================
function setupNewHeader() {
  const settingsBtn = document.getElementById("nh-settings-btn");
  const settingsPanel = document.getElementById("nh-settings-panel");
  const bellBtn = document.getElementById("nh-bell-btn");
  const notifPanel = document.getElementById("nh-notif-panel");
  const notifDot = document.getElementById("nh-notif-dot");
  const markReadBtn = document.getElementById("btn-mark-read");
  const searchInput = document.getElementById("nh-search-input");
  const profileBtn = document.getElementById("header-avatar-badge");
  const profilePanel = document.getElementById("nh-profile-panel");
  const profileViewBtn = document.getElementById("nh-profile-btn-view");

  // Toggle settings panel open/close
  if (settingsBtn && settingsPanel) {
    settingsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      settingsPanel.classList.toggle("hidden");
      if (notifPanel) notifPanel.classList.add("hidden"); // mutually exclusive
      if (profilePanel) profilePanel.classList.add("hidden"); // mutually exclusive
      if (!settingsPanel.classList.contains("hidden")) {
        adjustPanelPosition(settingsPanel, settingsBtn);
      }
    });
  }

  // Toggle notification panel open/close
  if (bellBtn && notifPanel) {
    bellBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      notifPanel.classList.toggle("hidden");
      if (settingsPanel) settingsPanel.classList.add("hidden"); // mutually exclusive
      if (profilePanel) profilePanel.classList.add("hidden"); // mutually exclusive
      
      // Hide red dot when opened
      if (notifDot) {
        notifDot.classList.remove("visible");
      }

      if (!notifPanel.classList.contains("hidden")) {
        adjustPanelPosition(notifPanel, bellBtn);
      }
    });
  }

  // Toggle profile dropdown panel open/close
  if (profileBtn && profilePanel) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profilePanel.classList.toggle("hidden");
      if (settingsPanel) settingsPanel.classList.add("hidden"); // mutually exclusive
      if (notifPanel) notifPanel.classList.add("hidden"); // mutually exclusive
      if (!profilePanel.classList.contains("hidden")) {
        adjustPanelPosition(profilePanel, profileBtn);
      }
    });
  }

  // Handle View Profile button inside the profile menu
  if (profileViewBtn) {
    profileViewBtn.addEventListener("click", () => {
      const profileTabItem = document.querySelector('.nav-item[data-tab="profile"]');
      if (profileTabItem) {
        profileTabItem.click();
      }
      if (profilePanel) {
        profilePanel.classList.add("hidden");
      }
    });
  }

  // Recalculate positions on window resize if panels are open
  window.addEventListener("resize", () => {
    if (notifPanel && !notifPanel.classList.contains("hidden")) {
      adjustPanelPosition(notifPanel, bellBtn);
    }
    if (settingsPanel && !settingsPanel.classList.contains("hidden")) {
      adjustPanelPosition(settingsPanel, settingsBtn);
    }
    if (profilePanel && !profilePanel.classList.contains("hidden")) {
      adjustPanelPosition(profilePanel, profileBtn);
    }
  });

  // Mark all as read button
  if (markReadBtn && notifDot) {
    markReadBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      notifDot.classList.remove("visible");
    });
  }

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (settingsBtn && settingsPanel && !settingsBtn.contains(e.target) && !settingsPanel.contains(e.target)) {
      settingsPanel.classList.add("hidden");
    }
    if (bellBtn && notifPanel && !bellBtn.contains(e.target) && !notifPanel.contains(e.target)) {
      notifPanel.classList.add("hidden");
    }
    if (profileBtn && profilePanel && !profileBtn.contains(e.target) && !profilePanel.contains(e.target)) {
      profilePanel.classList.add("hidden");
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (settingsPanel) settingsPanel.classList.add("hidden");
      if (notifPanel) notifPanel.classList.add("hidden");
      if (profilePanel) profilePanel.classList.add("hidden");
    }
  });

  // ⌘K / Ctrl+K focuses the search bar
  if (searchInput) {
    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    });
  }
}

function initCustomSelect(selectElementOrId) {
  const select =
    typeof selectElementOrId === "string"
      ? document.getElementById(selectElementOrId)
      : selectElementOrId;
  if (!select) return;

  let container = select.parentElement;
  if (!container || !container.classList.contains("custom-select-container")) {
    container = document.createElement("div");
    container.className = "custom-select-container";

    if (select.id === "subject-selector") {
      container.classList.add("subject-select-container");
    }

    select.parentNode.insertBefore(container, select);
    container.appendChild(select);

    select.style.display = "none";

    const trigger = document.createElement("div");
    trigger.className = "custom-select-trigger";

    const triggerText = document.createElement("span");
    triggerText.className = "custom-select-trigger-text";
    trigger.appendChild(triggerText);

    const chevron = document.createElement("i");
    chevron.setAttribute("data-lucide", "chevron-down");
    chevron.className = "chevron";
    trigger.appendChild(chevron);

    container.appendChild(trigger);

    const optionsContainer = document.createElement("div");
    optionsContainer.className = "custom-select-options";
    container.appendChild(optionsContainer);

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = container.classList.contains("open");
      document.querySelectorAll(".custom-select-container").forEach((c) => {
        c.classList.remove("open");
      });
      if (!isOpen) {
        container.classList.add("open");
      }
    });
  }

  const optionsContainer = container.querySelector(".custom-select-options");
  const triggerText = container.querySelector(".custom-select-trigger-text");

  optionsContainer.innerHTML = "";

  const selectedOption = select.options[select.selectedIndex];
  triggerText.textContent = selectedOption ? selectedOption.textContent : "";

  Array.from(select.options).forEach((opt, idx) => {
    const optBtn = document.createElement("button");
    optBtn.type = "button";
    optBtn.className = "custom-select-option";
    if (opt.selected) {
      optBtn.classList.add("selected");
    }
    optBtn.textContent = opt.textContent;

    if (opt.selected) {
      const checkIcon = document.createElement("i");
      checkIcon.setAttribute("data-lucide", "check");
      checkIcon.className = "check";
      optBtn.appendChild(checkIcon);
    }

    optBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      select.selectedIndex = idx;
      select.dispatchEvent(new Event("change"));
      container.classList.remove("open");
      initCustomSelect(select);
    });

    optionsContainer.appendChild(optBtn);
  });

  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons({
      attrs: {
        class: "lucide",
      },
      nameAttr: "data-lucide",
    });
  }
}

// --- App Initialization Entry Point ---
document.addEventListener("DOMContentLoaded", () => {
  // Load and apply color scheme preference
  const savedScheme = localStorage.getItem("auratracker_scheme") || "dark";
  state.colorScheme = savedScheme;
  document.documentElement.setAttribute("data-scheme", savedScheme);

  // Color Scheme Switch Listener
  if (elements.btnToggleScheme) {
    elements.btnToggleScheme.addEventListener("click", (e) => {
      e.stopPropagation();
      state.colorScheme = state.colorScheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-scheme", state.colorScheme);
      localStorage.setItem("auratracker_scheme", state.colorScheme);

      // Redraw charts if Overview tab is active to apply new color schemes
      const activeTab = document.querySelector(".nav-item.active");
      if (activeTab && activeTab.getAttribute("data-tab") === "overview") {
        renderOverviewTab();
      }

      showToast(
        `Switched to ${state.colorScheme === "dark" ? "Dark" : "Light"} Mode.`,
        "info",
      );
    });
  }

  checkAuthSession();
  runClock();
  setupTheme();
  setupNewHeader();
  setupNavigation();

  setupAuthHandlers();
  setupAttendanceHandlers();
  setupRoutineHandlers();
  setupTodoHandlers();
  setupModalClosers();
  setupProfileEditHandlers();

  // Password Visibility Toggle Handlers
  document.querySelectorAll(".btn-toggle-password").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.getAttribute("type") === "password";
      input.setAttribute("type", isPassword ? "text" : "password");

      if (isPassword) {
        btn.classList.add("showing");
      } else {
        btn.classList.remove("showing");
      }
    });
  });

  // Initialize custom select widgets
  const staticSelectIds = [
    "theme-selector",
    "font-selector",
    "todo-category",
    "todo-urgency",
    "todo-day",
    "routine-type",
    "routine-tag",
    "routine-day",
  ];
  staticSelectIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) initCustomSelect(el);
  });

  // Global click closer for custom dropdowns
  document.addEventListener("click", () => {
    document.querySelectorAll(".custom-select-container").forEach((c) => {
      c.classList.remove("open");
    });
  });

  if (elements.fontSelector) {
    elements.fontSelector.addEventListener("change", (e) => {
      state.selectedFont = e.target.value;
      document.documentElement.setAttribute("data-font", state.selectedFont);
      saveUserScopedData();

      // Redraw charts if Overview tab is active to apply correct fonts/layouts
      const activeTab = document.querySelector(".nav-item.active");
      if (activeTab && activeTab.getAttribute("data-tab") === "overview") {
        renderOverviewTab();
      }
    });
  }

  // Walkthrough Guide Action Handlers
  const wkNext = document.getElementById("walkthrough-btn-next");
  const wkSkip = document.getElementById("walkthrough-btn-skip");
  if (wkNext) wkNext.addEventListener("click", nextWalkthroughStep);
  if (wkSkip) wkSkip.addEventListener("click", endWalkthrough);

  // Setup onboarding & routine import handlers
  setupOnboardingHandlers();
});

// --- Overview Insights Tab Calculations & Renders ---
function calculateMaxStreak() {
  const classNames = getUniqueClassNames();
  if (classNames.length === 0) return 0;

  let max = 0;
  classNames.forEach((className) => {
    const logs = state.attendance[className] || {};
    const streak = calculateClassStreak(className, logs);
    if (streak > max) max = streak;
  });
  return max;
}

function getActiveTasksCount() {
  const completed = state.todos.filter((t) => t.completed).length;
  const total = state.todos.length;
  return { completed, total, active: total - completed };
}

// --- Chart.js Theme Adaptability Helpers ---
function getChartThemeColors() {
  const rootStyle = getComputedStyle(document.documentElement);
  const accent = rootStyle.getPropertyValue("--accent").trim() || "#6366f1";
  const accentHover =
    rootStyle.getPropertyValue("--accent-hover").trim() || "#4f46e5";
  const accentGlow =
    rootStyle.getPropertyValue("--accent-glow").trim() ||
    "rgba(99, 102, 241, 0.2)";
  const textPrimary =
    rootStyle.getPropertyValue("--text-primary").trim() || "#ffffff";
  const textSecondary =
    rootStyle.getPropertyValue("--text-secondary").trim() || "#a3a3c2";
  const cardBorder =
    rootStyle.getPropertyValue("--card-border").trim() ||
    "rgba(255, 255, 255, 0.08)";

  return {
    accent,
    accentHover,
    accentGlow,
    textPrimary,
    textSecondary,
    cardBorder,
  };
}

function getAttendanceTrendData() {
  const dates = [];
  const rates = [];
  const classNames = getUniqueClassNames();

  if (classNames.length === 0) {
    return { labels: [], data: [] };
  }

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d);
  }

  dates.forEach((targetDate) => {
    let presents = 0;
    let absents = 0;
    let lates = 0;

    const targetTime = new Date(targetDate);
    targetTime.setHours(23, 59, 59, 999);

    classNames.forEach((className) => {
      const logs = state.attendance[className] || {};
      const scheduledWeekdays = getClassScheduledWeekdays(className);

      Object.keys(logs).forEach((logKey) => {
        const dateStr = logKey.split('_')[0];
        const logDate = new Date(dateStr);
        if (
          logDate.getTime() <= targetTime.getTime() &&
          scheduledWeekdays.has(logDate.getDay())
        ) {
          const status = logs[logKey];
          if (status === "Present") presents++;
          else if (status === "Absent") absents++;
          else if (status === "Late") lates++;
        }
      });
    });

    const denominator = presents + absents + lates;
    const rate =
      denominator > 0
        ? Math.round(((presents + lates) / denominator) * 100)
        : 0;
    rates.push(rate);
  });

  const labels = dates.map((d) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  );
  return { labels, data: rates };
}

function renderOverviewTrendChart() {
  const canvas = document.getElementById("overview-trend-chart");
  const emptyEl = document.getElementById("overview-trend-empty");
  if (!canvas) return;

  window.overviewCharts = window.overviewCharts || {};
  if (window.overviewCharts.trend) {
    window.overviewCharts.trend.destroy();
    window.overviewCharts.trend = null;
  }

  const { labels, data } = getAttendanceTrendData();

  let hasLogs = false;
  const classNames = getUniqueClassNames();
  classNames.forEach((c) => {
    if (Object.keys(state.attendance[c] || {}).length > 0) hasLogs = true;
  });

  if (labels.length === 0 || !hasLogs) {
    canvas.style.display = "none";
    if (emptyEl) emptyEl.classList.remove("hidden");
    return;
  }

  canvas.style.display = "block";
  if (emptyEl) emptyEl.classList.add("hidden");

  const colors = getChartThemeColors();
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 0, 240);
  gradient.addColorStop(0, colors.accentGlow);
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  window.overviewCharts.trend = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Attendance Rate",
          data: data,
          borderColor: colors.accent,
          borderWidth: 3,
          pointBackgroundColor: colors.accent,
          pointBorderColor: "#fff",
          pointBorderWidth: 0,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBorderWidth: 2,
          tension: 0.35,
          fill: true,
          backgroundColor: gradient,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            color: colors.cardBorder,
            drawBorder: false,
          },
          ticks: {
            color: colors.textSecondary,
            font: { family: "inherit", size: 10 },
          },
        },
        y: {
          min: 0,
          max: 100,
          grid: {
            color: colors.cardBorder,
            drawBorder: false,
          },
          ticks: {
            color: colors.textSecondary,
            font: { family: "inherit", size: 10 },
            callback: (value) => value + "%",
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(18, 20, 30, 0.95)",
          titleColor: "#fff",
          bodyColor: colors.textPrimary,
          borderColor: colors.cardBorder,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context) => `Attendance: ${context.parsed.y}%`,
          },
        },
      },
    },
  });
}

function renderOverviewClassBarsChart() {
  const canvas = document.getElementById("overview-classes-chart");
  const emptyEl = document.getElementById("overview-classes-empty");
  if (!canvas) return;

  window.overviewCharts = window.overviewCharts || {};
  if (window.overviewCharts.classes) {
    window.overviewCharts.classes.destroy();
    window.overviewCharts.classes = null;
  }

  const classNames = getUniqueClassNames();

  if (classNames.length === 0) {
    canvas.style.display = "none";
    if (emptyEl) emptyEl.classList.remove("hidden");
    return;
  }

  canvas.style.display = "block";
  if (emptyEl) emptyEl.classList.add("hidden");

  const labels = [];
  const rates = [];

  classNames.forEach((className) => {
    const logs = state.attendance[className] || {};
    const scheduledWeekdays = getClassScheduledWeekdays(className);

    let presents = 0;
    let absents = 0;
    let lates = 0;

    Object.keys(logs).forEach((logKey) => {
      const status = logs[logKey];
      const dateStr = logKey.split('_')[0];
      const logDate = new Date(dateStr);
      if (isClassScheduledOnDate(className, logDate)) {
        if (status === "Present") presents++;
        else if (status === "Absent") absents++;
        else if (status === "Late") lates++;
      }
    });

    const denominator = presents + absents + lates;
    const rate =
      denominator > 0
        ? Math.round(((presents + lates) / denominator) * 100)
        : 0;

    labels.push(className);
    rates.push(rate);
  });

  const colors = getChartThemeColors();
  const ctx = canvas.getContext("2d");

  window.overviewCharts.classes = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Attendance Rate",
          data: rates,
          backgroundColor: colors.accent,
          hoverBackgroundColor: colors.accentHover,
          borderRadius: 6,
          barThickness: 16,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 0,
          max: 100,
          grid: {
            color: colors.cardBorder,
            drawBorder: false,
          },
          ticks: {
            color: colors.textSecondary,
            font: { family: "inherit", size: 10 },
            callback: (value) => value + "%",
          },
        },
        y: {
          grid: { display: false },
          ticks: {
            color: colors.textPrimary,
            font: { family: "inherit", size: 11, weight: "600" },
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(18, 20, 30, 0.95)",
          borderColor: colors.cardBorder,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (context) => `Attendance Rate: ${context.parsed.x}%`,
          },
        },
      },
    },
  });
}

function renderOverviewTaskDonutChart() {
  const canvas = document.getElementById("overview-tasks-chart");
  const emptyEl = document.getElementById("overview-tasks-empty");
  if (!canvas) return;

  window.overviewCharts = window.overviewCharts || {};
  if (window.overviewCharts.tasks) {
    window.overviewCharts.tasks.destroy();
    window.overviewCharts.tasks = null;
  }

  const { completed, total, active } = getActiveTasksCount();

  if (total === 0) {
    canvas.style.display = "none";
    if (emptyEl) emptyEl.classList.remove("hidden");
    return;
  }

  canvas.style.display = "block";
  if (emptyEl) emptyEl.classList.add("hidden");

  const colors = getChartThemeColors();
  const ctx = canvas.getContext("2d");

  const centerTextPlugin = {
    id: "centerText",
    afterDraw(chart) {
      const {
        ctx,
        chartArea: { left, right, top, bottom, width, height },
      } = chart;
      ctx.save();
      ctx.fillStyle = colors.textPrimary;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "700 24px var(--font-heading, 'Space Grotesk')";

      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
      ctx.fillText(rate + "%", left + width / 2, top + height / 2 - 6);

      ctx.fillStyle = colors.textSecondary;
      ctx.font = "500 11px var(--font-primary, 'Plus Jakarta Sans')";
      ctx.fillText("Completed", left + width / 2, top + height / 2 + 14);
      ctx.restore();
    },
  };

  window.overviewCharts.tasks = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completed", "Pending"],
      datasets: [
        {
          data: [completed, active],
          backgroundColor: [colors.accent, "rgba(255, 255, 255, 0.04)"],
          hoverBackgroundColor: [
            colors.accentHover,
            "rgba(255, 255, 255, 0.08)",
          ],
          borderWidth: 1,
          borderColor: [colors.accent, colors.cardBorder],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "75%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: colors.textSecondary,
            boxWidth: 10,
            font: { family: "inherit", size: 10 },
          },
        },
        tooltip: {
          backgroundColor: "rgba(18, 20, 30, 0.95)",
          borderColor: colors.cardBorder,
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
        },
      },
    },
    plugins: [centerTextPlugin],
  });
}

function renderOverviewHeatmap() {
  const container = document.getElementById("overview-attendance-heatmap");
  if (!container) return;

  container.innerHTML = "";

  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d);
  }

  const classNames = getUniqueClassNames();

  dates.forEach((date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    let loggedStatus = null;
    let loggedClass = null;

    for (let i = 0; i < classNames.length; i++) {
      const className = classNames[i];
      const logs = state.attendance[className] || {};
      if (logs[dateKey]) {
        loggedStatus = logs[dateKey];
        loggedClass = className;
        break;
      }
    }

    const square = document.createElement("div");
    square.className = "heatmap-square";

    const weekdayStr = date.toLocaleDateString("en-US", { weekday: "short" });
    const monthStr = date.toLocaleDateString("en-US", { month: "short" });
    const dayNum = date.getDate();
    const dateDisplayStr = `${weekdayStr}, ${monthStr} ${dayNum}`;

    if (loggedStatus) {
      let statusChar = "";
      if (loggedStatus === "Present") statusChar = "p";
      else if (loggedStatus === "Absent") statusChar = "a";
      else if (loggedStatus === "Late") statusChar = "l";
      else if (loggedStatus === "Excused") statusChar = "e";

      square.classList.add(statusChar);
      square.setAttribute(
        "data-tooltip",
        `${dateDisplayStr}: ${loggedStatus} (${loggedClass})`,
      );
    } else {
      square.setAttribute(
        "data-tooltip",
        `${dateDisplayStr}: No schedule / No logs`,
      );
    }

    container.appendChild(square);
  });
}

function renderOverviewTab() {
  const avg = calculateOverallAttendance();
  const maxStreak = calculateMaxStreak();
  const tasks = getActiveTasksCount();
  const routines = state.routine.length;

  const avgEl = document.getElementById("overview-avg-attendance");
  const streakEl = document.getElementById("overview-max-streak");
  const tasksEl = document.getElementById("overview-active-tasks");
  const routinesEl = document.getElementById("overview-routine-count");

  if (avgEl) avgEl.textContent = `${avg}%`;
  if (streakEl)
    streakEl.textContent = `${maxStreak} Day${maxStreak === 1 ? "" : "s"}`;
  if (tasksEl) tasksEl.textContent = `${tasks.active} Pending`;
  if (routinesEl)
    routinesEl.textContent = `${routines} Event${routines === 1 ? "" : "s"}`;

  renderOverviewTrendChart();
  renderOverviewClassBarsChart();
  renderOverviewTaskDonutChart();
  renderOverviewHeatmap();
}

// --- First-Time User Onboarding Tour ---
let walkthroughStep = 1;
const walkthroughSteps = [
  {
    tab: "overview",
    elementId: "card-overview",
    text: "Welcome to AuraTracker! This is your <strong>Executive Summary Dashboard</strong>. Track overall attendance, streaks, pending tasks, and view interactive charts detailing daily performance.",
  },
  {
    tab: "attendance",
    elementSelector: ".card-attendance",
    text: "The <strong>Attendance Tab</strong> lets you register specific classes and log daily attendance statuses (Present, Absent, Late, Excused) directly on an interactive calendar.",
  },
  {
    tab: "routine",
    elementSelector: ".card-routine",
    text: "Under the <strong>Weekly Routine Tab</strong>, outline your class schedule, workout routines, and study blocks. Toggle between timeline and weekly scope grid views.",
  },
  {
    tab: "todo",
    elementSelector: ".card-todo",
    text: "Use the <strong>Tasks & To-Dos Tab</strong> to maintain prioritized task lists. Assign tasks to specific days and categorize them by work, study, or habits.",
  },
  {
    tab: "header",
    elementSelector: ".top-header",
    text: "Customize your environment instantly! Toggle between <strong>4 glassmorphic themes</strong> and <strong>4 typography font layouts</strong> in the top header selector dropdowns.",
  },
];

function startWalkthrough() {
  walkthroughStep = 1;
  const overlay = document.getElementById("walkthrough-overlay");
  if (overlay) {
    overlay.classList.remove("hidden");
    showWalkthroughStep(1);
  }
}

function showWalkthroughStep(step) {
  const stepConfig = walkthroughSteps[step - 1];
  if (!stepConfig) return;

  // Clear any existing highlights
  document.querySelectorAll(".walkthrough-highlight").forEach((el) => {
    el.classList.remove("walkthrough-highlight");
  });

  // Automate tab navigation
  if (stepConfig.tab !== "header") {
    const tabBtn = document.querySelector(
      `.nav-item[data-tab="${stepConfig.tab}"]`,
    );
    if (tabBtn && !tabBtn.classList.contains("active")) {
      tabBtn.click();
    }
  }

  // Find element to highlight
  let targetEl = null;
  if (stepConfig.elementId) {
    targetEl = document.getElementById(stepConfig.elementId);
  } else if (stepConfig.elementSelector) {
    targetEl = document.querySelector(stepConfig.elementSelector);
  }

  if (targetEl) {
    targetEl.classList.add("walkthrough-highlight");
    targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  // Update guide panel
  const stepNumEl = document.getElementById("walkthrough-step-num");
  const textEl = document.getElementById("walkthrough-text");
  const nextBtn = document.getElementById("walkthrough-btn-next");

  if (stepNumEl) stepNumEl.textContent = step;
  if (textEl) textEl.innerHTML = stepConfig.text;

  if (nextBtn) {
    if (step === walkthroughSteps.length) {
      nextBtn.innerHTML = 'Finish <i data-lucide="check"></i>';
    } else {
      nextBtn.innerHTML = 'Next <i data-lucide="arrow-right"></i>';
    }
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }
}

function nextWalkthroughStep() {
  if (walkthroughStep < walkthroughSteps.length) {
    walkthroughStep++;
    showWalkthroughStep(walkthroughStep);
  } else {
    endWalkthrough();
  }
}

function endWalkthrough() {
  document.querySelectorAll(".walkthrough-highlight").forEach((el) => {
    el.classList.remove("walkthrough-highlight");
  });

  const overlay = document.getElementById("walkthrough-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
  }

  localStorage.removeItem("is_first_signup");
  showToast("Onboarding complete! Your dashboard is ready.", "success");
}

// ================================================
// ONBOARDING WIZARD & ROUTINE IMPORT SYSTEM
// ================================================

let onboardingStep = 1;
let onboardingData = {
  university: "",
  college: "",
  department: "",
  program: "",
  semester: 1,
  academicSession: "",
  section: "",
};
let selectedPdfFile = null;
let previewClasses = [];

const DAY_NAME_TO_NUM = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

const DAY_NAMES_LIST = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// --- Check Onboarding Status ---
async function checkOnboardingStatus() {
  if (sessionUser.username === "Guest") return;

  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/api/onboarding`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data.onboardingComplete === false) {
      showOnboardingOverlay();
    }
  } catch (e) {
    // Silently ignore — onboarding is non-critical
    console.warn("Onboarding check failed:", e);
  }
}

function showOnboardingOverlay() {
  onboardingStep = 1;
  onboardingData = {
    university: "",
    college: "",
    department: "",
    program: "",
    semester: 1,
    academicSession: "",
    section: "",
  };
  selectedPdfFile = null;

  // Reset form inputs
  const uniInput = document.getElementById("onboarding-university");
  const deptInput = document.getElementById("onboarding-department");
  const progSelect = document.getElementById("onboarding-program");
  const sessionInput = document.getElementById("onboarding-session");
  if (uniInput) uniInput.value = "";
  if (deptInput) deptInput.value = "";
  if (progSelect) progSelect.selectedIndex = 0;
  if (sessionInput) sessionInput.value = "";

  // Reset semester pills
  document.querySelectorAll(".semester-pill").forEach((p) => {
    p.classList.remove("active");
  });
  const firstPill = document.querySelector('.semester-pill[data-semester="1"]');
  if (firstPill) firstPill.classList.add("active");

  // Reset PDF state
  const fileInfo = document.getElementById("pdf-file-info");
  const uploadZone = document.getElementById("pdf-upload-zone");
  if (fileInfo) fileInfo.classList.add("hidden");
  if (uploadZone) uploadZone.style.display = "";

  showOnboardingStep(1);
  document.getElementById("onboarding-overlay").classList.remove("hidden");
  lucide.createIcons();
}

function showOnboardingStep(step) {
  onboardingStep = step;
  const totalSteps = 8;

  // Update step content visibility
  document.querySelectorAll(".onboarding-step").forEach((s) => {
    s.classList.remove("active");
  });
  const activeStep = document.querySelector(
    `[data-onboarding-step="${step}"]`,
  );
  if (activeStep) activeStep.classList.add("active");

  // Update dots
  document.querySelectorAll(".step-dot").forEach((dot) => {
    const dotStep = parseInt(dot.getAttribute("data-step"));
    dot.classList.remove("active", "completed");
    if (dotStep === step) {
      dot.classList.add("active");
    } else if (dotStep < step) {
      dot.classList.add("completed");
    }
  });

  // Update progress bar
  const progressFill = document.getElementById("onboarding-progress-fill");
  if (progressFill) {
    progressFill.style.width = `${(step / totalSteps) * 100}%`;
  }

  // Update nav buttons
  const btnBack = document.getElementById("btn-onboarding-back");
  const btnNext = document.getElementById("btn-onboarding-next");
  const btnSkip = document.getElementById("btn-onboarding-skip");

  // Back button: hidden on step 1
  if (btnBack) {
    if (step === 1) {
      btnBack.classList.add("hidden");
    } else {
      btnBack.classList.remove("hidden");
    }
  }

  // Skip button: visible only on step 7
  if (btnSkip) {
    if (step === totalSteps) {
      btnSkip.classList.remove("hidden");
    } else {
      btnSkip.classList.add("hidden");
    }
  }

  // Next button text
  if (btnNext) {
    if (step === totalSteps) {
      btnNext.innerHTML = `<i data-lucide="check"></i> Finish`;
    } else if (step === 1) {
      btnNext.innerHTML = `Get Started <i data-lucide="arrow-right"></i>`;
    } else {
      btnNext.innerHTML = `Next <i data-lucide="arrow-right"></i>`;
    }
  }

  lucide.createIcons();
}

function nextOnboardingStep() {
  const totalSteps = 8;

  // Collect data from current step
  switch (onboardingStep) {
    case 2: {
      const val = document.getElementById("onboarding-university")?.value.trim();
      if (!val) {
        showToast("Please enter your university or college.", "error");
        return;
      }
      onboardingData.university = val;
      onboardingData.college = val; // same field maps to both
      break;
    }
    case 3: {
      const val = document.getElementById("onboarding-department")?.value.trim();
      if (!val) {
        showToast("Please enter your department.", "error");
        return;
      }
      onboardingData.department = val;
      break;
    }
    case 4: {
      const val = document.getElementById("onboarding-program")?.value;
      if (!val) {
        showToast("Please select your program.", "error");
        return;
      }
      onboardingData.program = val;
      break;
    }
    case 5: {
      // Semester is set via pill click handler; already stored
      break;
    }
    case 6: {
      const val = document.getElementById("onboarding-session")?.value.trim();
      if (!val) {
        showToast("Please enter your academic session.", "error");
        return;
      }
      onboardingData.academicSession = val;
      break;
    }
    case 7: {
      const val = document.getElementById("onboarding-section")?.value.trim();
      onboardingData.section = val || "";
      break;
    }
  }

  if (onboardingStep < totalSteps) {
    showOnboardingStep(onboardingStep + 1);
  } else {
    // Step 8 — Finish
    finishOnboarding();
  }
}

function prevOnboardingStep() {
  if (onboardingStep > 1) {
    showOnboardingStep(onboardingStep - 1);
  }
}

async function finishOnboarding() {
  const token = localStorage.getItem("token");
  if (!token) return;

  // Save onboarding profile data
  try {
    const res = await fetch(`${API_URL}/api/onboarding`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(onboardingData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showToast(err.message || "Failed to save profile.", "error");
      return;
    }
  } catch (e) {
    showToast("Network error saving profile.", "error");
    return;
  }

  // Close onboarding overlay
  document.getElementById("onboarding-overlay").classList.add("hidden");
  showToast("Academic profile saved!", "success");

  // If a PDF was selected, trigger import
  if (selectedPdfFile) {
    importRoutinePdf(selectedPdfFile);
  }
}

function skipOnboarding() {
  // Still save profile data (steps 1-6), just skip PDF upload
  selectedPdfFile = null;
  finishOnboarding();
}

// --- Routine Import Preview Logic ---

async function importRoutinePdf(file) {
  const token = localStorage.getItem("token");
  if (!token) return;

  // Show preview overlay in loading state
  const previewOverlay = document.getElementById("routine-preview-overlay");
  const loadingDiv = document.getElementById("routine-preview-loading");
  const tableContainer = document.getElementById(
    "routine-preview-table-container",
  );
  const footer = document.getElementById("routine-preview-footer");

  previewOverlay.classList.remove("hidden");
  loadingDiv.classList.remove("hidden");
  tableContainer.classList.add("hidden");
  footer.style.display = "none";

  try {
    const formData = new FormData();
    formData.append("pdf", file);

    const res = await fetch(`${API_URL}/api/routine/import`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showToast(err.message || "Failed to extract timetable.", "error");
      previewOverlay.classList.add("hidden");
      return;
    }

    const data = await res.json();
    previewClasses = Array.isArray(data.classes)
      ? data.classes
      : Array.isArray(data)
        ? data
        : [];

    if (previewClasses.length === 0) {
      showToast(
        "No classes could be extracted from the PDF. Try adding them manually.",
        "info",
      );
    }

    // Show table
    loadingDiv.classList.add("hidden");
    tableContainer.classList.remove("hidden");
    footer.style.display = "flex";
    renderPreviewTable();
  } catch (e) {
    showToast("Network error during PDF import.", "error");
    previewOverlay.classList.add("hidden");
  }
}

function renderPreviewTable() {
  const tbody = document.getElementById("routine-preview-tbody");
  if (!tbody) return;

  tbody.innerHTML = previewClasses
    .map((cls, index) => {
      const dayOptions = DAY_NAMES_LIST.map(
        (d) =>
          `<option value="${d}" ${cls.day === d ? "selected" : ""}>${d}</option>`,
      ).join("");

      const typeOptions = [
        { label: "Theory",   value: "theory" },
        { label: "Lab",      value: "lab" },
        { label: "Tutorial", value: "tutorial" },
      ]
        .map(
          (t) =>
            `<option value="${t.value}" ${cls.type === t.value ? "selected" : ""}>${t.label}</option>`,
        )
        .join("");

      return `
        <tr data-preview-index="${index}">
          <td>
            <select class="preview-day" data-field="day">
              ${dayOptions}
            </select>
          </td>
          <td>
            <input type="text" class="preview-subject" data-field="title" value="${escapeHtml(cls.title || "")}" placeholder="Subject" />
          </td>
          <td>
            <select class="preview-type" data-field="type">
              ${typeOptions}
            </select>
          </td>
          <td>
            <input type="time" class="preview-start" data-field="startTime" value="${cls.startTime || ""}" />
          </td>
          <td>
            <input type="time" class="preview-end" data-field="endTime" value="${cls.endTime || ""}" />
          </td>
          <td>
            <input type="text" class="preview-faculty" data-field="faculty" value="${escapeHtml(cls.faculty || "")}" placeholder="Faculty" />
          </td>
          <td>
            <input type="text" class="preview-room" data-field="room" value="${escapeHtml(cls.room || "")}" placeholder="Room" />
          </td>
          <td class="preview-row-actions">
            <button class="btn-delete-preview-row" data-delete-index="${index}" title="Remove">
              <i data-lucide="trash-2"></i>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  lucide.createIcons();

  // Bind inline edit change events
  tbody.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("change", (e) => {
      const row = e.target.closest("tr");
      const idx = parseInt(row.getAttribute("data-preview-index"));
      const field = e.target.getAttribute("data-field");
      if (idx >= 0 && field && previewClasses[idx]) {
        previewClasses[idx][field] = e.target.value;
      }
    });
  });

  // Bind delete buttons
  tbody.querySelectorAll(".btn-delete-preview-row").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-delete-index"));
      deletePreviewRow(idx);
    });
  });
}

// Helper to escape HTML in input values
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function addPreviewRow() {
  previewClasses.push({
    day: "Monday",
    title: "",
    type: "theory",
    startTime: "",
    endTime: "",
    faculty: "",
    room: "",
  });
  renderPreviewTable();
}

function deletePreviewRow(index) {
  if (index >= 0 && index < previewClasses.length) {
    previewClasses.splice(index, 1);
    renderPreviewTable();
  }
}

async function confirmRoutineImport() {
  const token = localStorage.getItem("token");
  if (!token) return;

  if (previewClasses.length === 0) {
    showToast("No classes to import. Add at least one class.", "error");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/routine/confirm`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ classes: previewClasses }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showToast(err.message || "Failed to save routine.", "error");
      return;
    }

    // Fetch updated routine from backend
    const routineRes = await fetch(`${API_URL}/api/routine`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (routineRes.ok) {
      const routineData = await routineRes.json();
      // Bug fix: backend returns { routine: { userId, classes: [] } } not a flat array
      const routinePayload = routineData.routine;
      const backendClasses = Array.isArray(routinePayload?.classes)
        ? routinePayload.classes
        : Array.isArray(routinePayload)
          ? routinePayload
          : [];

      // Convert backend format (day names) to frontend format (day integers)
      const convertedClasses = backendClasses.map((cls) => ({
        id: cls.id || cls._id || `imported-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        type: "class",
        day:
          typeof cls.day === "number"
            ? cls.day
            : DAY_NAME_TO_NUM[cls.day] ?? 1,
        title: cls.title || cls.subject || "",
        start: cls.startTime || cls.start || "",
        end: cls.endTime || cls.end || "",
        tag: "study",
        faculty: cls.faculty || "",
        room: cls.room || ""
      }));

      // Merge into existing state (avoid duplicates by id)
      const existingIds = new Set(state.routine.map((r) => r.id));
      convertedClasses.forEach((cls) => {
        if (!existingIds.has(cls.id)) {
          state.routine.push(cls);
          existingIds.add(cls.id);
        }
      });

      saveUserScopedData();
      renderRoutineTimeline();
      renderAttendance();
      renderOverviewTab();
    }

    // Close preview modal
    document.getElementById("routine-preview-overlay").classList.add("hidden");
    showToast("Timetable imported successfully!", "success");
  } catch (e) {
    showToast("Network error confirming import.", "error");
  }
}

function cancelRoutinePreview() {
  previewClasses = [];
  document.getElementById("routine-preview-overlay").classList.add("hidden");
}

// --- Setup All Onboarding & Import Handlers ---

function setupOnboardingHandlers() {
  // Step navigation
  const btnNext = document.getElementById("btn-onboarding-next");
  const btnBack = document.getElementById("btn-onboarding-back");
  const btnSkip = document.getElementById("btn-onboarding-skip");

  if (btnNext) btnNext.addEventListener("click", nextOnboardingStep);
  if (btnBack) btnBack.addEventListener("click", prevOnboardingStep);
  if (btnSkip) btnSkip.addEventListener("click", skipOnboarding);

  // Semester pills
  document.querySelectorAll(".semester-pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll(".semester-pill").forEach((p) => {
        p.classList.remove("active");
      });
      pill.classList.add("active");
      onboardingData.semester = parseInt(
        pill.getAttribute("data-semester"),
        10,
      );
    });
  });

  // PDF Upload Zone — click to browse
  const uploadZone = document.getElementById("pdf-upload-zone");
  const fileInput = document.getElementById("pdf-file-input");

  if (uploadZone && fileInput) {
    uploadZone.addEventListener("click", () => {
      fileInput.click();
    });

    // Drag & Drop events
    uploadZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      uploadZone.classList.add("drag-active");
    });

    uploadZone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      uploadZone.classList.remove("drag-active");
    });

    uploadZone.addEventListener("drop", (e) => {
      e.preventDefault();
      uploadZone.classList.remove("drag-active");
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type === "application/pdf") {
        handlePdfFileSelected(files[0]);
      } else {
        showToast("Please drop a valid PDF file.", "error");
      }
    });

    // File input change
    fileInput.addEventListener("change", (e) => {
      if (e.target.files.length > 0) {
        handlePdfFileSelected(e.target.files[0]);
      }
    });
  }

  // Remove PDF button
  const btnRemovePdf = document.getElementById("btn-remove-pdf");
  if (btnRemovePdf) {
    btnRemovePdf.addEventListener("click", () => {
      selectedPdfFile = null;
      const fileInfo = document.getElementById("pdf-file-info");
      const zone = document.getElementById("pdf-upload-zone");
      if (fileInfo) fileInfo.classList.add("hidden");
      if (zone) zone.style.display = "";
      // Reset file input
      const input = document.getElementById("pdf-file-input");
      if (input) input.value = "";
    });
  }

  // Routine Preview Modal handlers
  const btnConfirm = document.getElementById("btn-confirm-preview");
  const btnCancel = document.getElementById("btn-cancel-preview");
  const btnClose = document.getElementById("btn-close-preview");
  const btnAddRow = document.getElementById("btn-add-preview-row");

  if (btnConfirm) btnConfirm.addEventListener("click", confirmRoutineImport);
  if (btnCancel) btnCancel.addEventListener("click", cancelRoutinePreview);
  if (btnClose) btnClose.addEventListener("click", cancelRoutinePreview);
  if (btnAddRow) btnAddRow.addEventListener("click", addPreviewRow);

  // --- Re-import PDF button in the routine card header ---
  const btnReimport = document.getElementById("btn-import-routine-pdf");
  const reimportInput = document.getElementById("routine-reimport-file-input");

  if (btnReimport && reimportInput) {
    btnReimport.addEventListener("click", () => {
      if (sessionUser && sessionUser.username === "Guest") {
        showToast("Please register an account to use AI PDF import.", "error");
        return;
      }
      reimportInput.value = ""; // reset so same file can be re-selected
      reimportInput.click();
    });

    reimportInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.type !== "application/pdf") {
        showToast("Please select a valid PDF file.", "error");
        return;
      }
      importRoutinePdf(file);
    });
  }
}

function handlePdfFileSelected(file) {
  selectedPdfFile = file;
  const fileInfo = document.getElementById("pdf-file-info");
  const fileName = document.getElementById("pdf-file-name");
  const uploadZone = document.getElementById("pdf-upload-zone");

  if (fileName) fileName.textContent = file.name;
  if (fileInfo) fileInfo.classList.remove("hidden");
  if (uploadZone) uploadZone.style.display = "none";
  lucide.createIcons();
}
// Update Name Form
if (elements.updateNameForm) {
  elements.updateNameForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newName = elements.updateNameInput.value.trim();
    if (!newName) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      const data = await response.json();
      if (data.success) {
        sessionUser.name = newName;
        elements.updateNameModal.classList.add("hidden");
        showToast("Name updated successfully!", "success");
        // Re-render UI and check notifications
        elements.sidebarUserName.textContent = sessionUser.name || sessionUser.username;
        elements.headerUserName.textContent = sessionUser.name || sessionUser.username;
        elements.headerUserBadgeName.textContent = sessionUser.name || sessionUser.username;
        checkNotifications();
      } else {
        showToast(data.message || "Failed to update name.", "error");
      }
    } catch (err) {
      showToast("Server error. Try again later.", "error");
    }
  });
}


/* ==========================================================================
   CUSTOM CLOCK TIME PICKER
   ========================================================================== */
let clockPickerTarget = null;
let clockMode = 'hours'; // 'hours' or 'minutes'
let clockIsAM = true;
let clockSelectedHour = 12;
let clockSelectedMinute = 0;

const clockOverlay = document.getElementById("clock-picker-overlay");
const clockDisplayHours = document.getElementById("clock-display-hours");
const clockDisplayMinutes = document.getElementById("clock-display-minutes");
const clockBtnAm = document.getElementById("clock-btn-am");
const clockBtnPm = document.getElementById("clock-btn-pm");
const clockFace = document.getElementById("clock-face");
const clockHand = document.getElementById("clock-hand");
const clockNumbersContainer = document.getElementById("clock-numbers");

// Intercept clicks on any time input
document.addEventListener('click', (e) => {
  if (e.target.matches('input[type="time"]')) {
    e.preventDefault();
    openClockPicker(e.target);
  }
});
// Also intercept focus to prevent mobile keyboard/native picker
document.addEventListener('focusin', (e) => {
  if (e.target.matches('input[type="time"]')) {
    e.preventDefault();
    e.target.blur();
    openClockPicker(e.target);
  }
});

function openClockPicker(inputEl) {
  clockPickerTarget = inputEl;
  
  // Parse existing time if any
  const val = inputEl.value;
  if (val) {
    let [h, m] = val.split(':').map(Number);
    clockSelectedMinute = m;
    if (h >= 12) {
      clockIsAM = false;
      clockSelectedHour = h === 12 ? 12 : h - 12;
    } else {
      clockIsAM = true;
      clockSelectedHour = h === 0 ? 12 : h;
    }
  } else {
    const now = new Date();
    let h = now.getHours();
    clockSelectedMinute = Math.round(now.getMinutes() / 5) * 5;
    if (clockSelectedMinute === 60) {
      clockSelectedMinute = 0;
      h = (h + 1) % 24;
    }
    if (h >= 12) {
      clockIsAM = false;
      clockSelectedHour = h === 12 ? 12 : h - 12;
    } else {
      clockIsAM = true;
      clockSelectedHour = h === 0 ? 12 : h;
    }
  }

  setClockMode('hours');
  updateClockDigitalDisplay();
  openModal(clockOverlay);
}

function closeClockPicker() {
  closeModal(clockOverlay);
  clockPickerTarget = null;
}

function confirmClockPicker() {
  if (clockPickerTarget) {
    let h24 = clockSelectedHour;
    if (clockIsAM && h24 === 12) h24 = 0;
    else if (!clockIsAM && h24 !== 12) h24 += 12;

    const hh = String(h24).padStart(2, '0');
    const mm = String(clockSelectedMinute).padStart(2, '0');
    
    clockPickerTarget.value = `${hh}:${mm}`;
    // Dispatch input/change events for frameworks or other listeners
    clockPickerTarget.dispatchEvent(new Event('input', { bubbles: true }));
    clockPickerTarget.dispatchEvent(new Event('change', { bubbles: true }));
  }
  closeClockPicker();
}

function setClockMode(mode) {
  clockMode = mode;
  if (mode === 'hours') {
    clockDisplayHours.classList.add('active');
    clockDisplayMinutes.classList.remove('active');
  } else {
    clockDisplayHours.classList.remove('active');
    clockDisplayMinutes.classList.add('active');
  }
  renderClockNumbers();
  updateClockHand();
}

function renderClockNumbers() {
  clockNumbersContainer.innerHTML = '';
  const total = 12;
  const radius = 100; // Distance from center
  const cx = 125;
  const cy = 125;
  
  for (let i = 1; i <= total; i++) {
    const val = clockMode === 'hours' ? i : (i === 12 ? 0 : i * 5);
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    
    const numEl = document.createElement('div');
    numEl.className = 'clock-number';
    numEl.textContent = val === 0 && clockMode === 'minutes' ? '00' : val;
    numEl.style.left = `${x}px`;
    numEl.style.top = `${y}px`;
    
    const isActive = (clockMode === 'hours' && clockSelectedHour === val) || 
                     (clockMode === 'minutes' && clockSelectedMinute === val);
                     
    if (isActive) numEl.classList.add('active');
    
    numEl.addEventListener('click', (e) => {
      e.stopPropagation();
      handleClockSelection(val);
    });
    
    clockNumbersContainer.appendChild(numEl);
  }
}

function handleClockSelection(val) {
  if (clockMode === 'hours') {
    clockSelectedHour = val;
    updateClockDigitalDisplay();
    updateClockHand();
    setTimeout(() => setClockMode('minutes'), 300);
  } else {
    clockSelectedMinute = val;
    updateClockDigitalDisplay();
    updateClockHand();
  }
  renderClockNumbers(); // Re-render to update active class
}

function updateClockHand() {
  let val = clockMode === 'hours' ? clockSelectedHour : clockSelectedMinute / 5;
  if (val === 0) val = 12;
  const angle = val * 30;
  clockHand.style.transform = `translate(-50%, -100%) rotate(${angle}deg)`;
}

function updateClockDigitalDisplay() {
  clockDisplayHours.textContent = clockSelectedHour;
  clockDisplayMinutes.textContent = String(clockSelectedMinute).padStart(2, '0');
  
  if (clockIsAM) {
    clockBtnAm.classList.add('active');
    clockBtnPm.classList.remove('active');
  } else {
    clockBtnAm.classList.remove('active');
    clockBtnPm.classList.add('active');
  }
}

clockDisplayHours.addEventListener('click', () => setClockMode('hours'));
clockDisplayMinutes.addEventListener('click', () => setClockMode('minutes'));

clockBtnAm.addEventListener('click', () => {
  clockIsAM = true;
  updateClockDigitalDisplay();
});
clockBtnPm.addEventListener('click', () => {
  clockIsAM = false;
  updateClockDigitalDisplay();
});

// Setup drag behavior for the clock hand
let isDraggingClock = false;
clockFace.addEventListener('mousedown', (e) => {
  isDraggingClock = true;
  handleClockDrag(e);
});
document.addEventListener('mousemove', (e) => {
  if (isDraggingClock) handleClockDrag(e);
});
document.addEventListener('mouseup', () => {
  if (isDraggingClock) {
    isDraggingClock = false;
    if (clockMode === 'hours') {
      setTimeout(() => setClockMode('minutes'), 300);
    }
  }
});
clockFace.addEventListener('touchstart', (e) => {
  isDraggingClock = true;
  handleClockDrag(e.touches[0]);
}, {passive: true});
document.addEventListener('touchmove', (e) => {
  if (isDraggingClock) {
    handleClockDrag(e.touches[0]);
    e.preventDefault(); // Prevent scrolling while dragging
  }
}, {passive: false});
document.addEventListener('touchend', () => {
  if (isDraggingClock) {
    isDraggingClock = false;
    if (clockMode === 'hours') {
      setTimeout(() => setClockMode('minutes'), 300);
    }
  }
});

function handleClockDrag(e) {
  const rect = clockFace.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const x = e.clientX - cx;
  const y = e.clientY - cy;
  
  let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
  if (angle < 0) angle += 360;
  
  let val = Math.round(angle / 30);
  if (val === 0) val = 12;
  
  if (clockMode === 'hours') {
    clockSelectedHour = val;
  } else {
    clockSelectedMinute = val === 12 ? 0 : val * 5;
  }
  
  updateClockDigitalDisplay();
  updateClockHand();
  renderClockNumbers();
}
