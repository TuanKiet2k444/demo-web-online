// Hiện popup đăng nhập
function showLoginPopup() {
  document.getElementById('loginPopup').style.display = 'flex';
  document.getElementById('loginPopupContent').style.display = 'flex';
  document.getElementById('registerPopupContent').style.display = 'none';
  clearLoginStatus();
}
function hideLoginPopup() {
  document.getElementById('loginPopup').style.display = 'none';
  clearLoginStatus();
}
function clearLoginStatus() {
  const status = document.getElementById('loginStatusMsg');
  if (status) {
    status.innerHTML = '';
    status.style.display = 'none';
  }
}
function showLoginStatus(success, msg) {
  const status = document.getElementById('loginStatusMsg');
  if (!status) return;
  if (success) {
    status.innerHTML = `
      <span class="status-icon status-success">&#10004;</span>
      <span class="status-text-success">${msg || "Login successfully!"}</span>
    `;
    status.style.display = 'flex';
  } else {
    status.innerHTML = `
      <span class="status-icon status-error">&#10006;</span>
      <span class="status-text-error">${msg || "Incorrect email or password!"}</span>
    `;
    status.style.display = 'flex';
  }
}
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('loginUsername').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;
  if (!username || !password) {
    showLoginStatus(false, "Please enter email and password!");
    return;
  }
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  const user = users.find(u => u.email === username);
  if (user && user.password === password) {
    showLoginStatus(true, "Login successfully!");
    localStorage.setItem("currentUser", JSON.stringify(user));
    setTimeout(() => {
      hideLoginPopup();
      updateHeaderUser();
    }, 1200);
  } else {
    showLoginStatus(false, "Incorrect email or password!");
    setTimeout(() => clearLoginStatus(), 1500);
  }
}

// ==== ĐĂNG KÝ ====
function showRegisterPopup() {
  document.getElementById('loginPopup').style.display = 'flex';
  document.getElementById('registerPopupContent').style.display = 'flex';
  document.getElementById('loginPopupContent').style.display = 'none';
  clearRegisterStatus();
}
function hideRegisterPopup() {
  document.getElementById('loginPopup').style.display = 'none';
  clearRegisterStatus();
}
function clearRegisterStatus() {
  const status = document.getElementById('registerStatusMsg');
  if (status) {
    status.innerHTML = '';
    status.style.display = 'none';
  }
}
function showRegisterStatus(success, msg) {
  const status = document.getElementById('registerStatusMsg');
  if (!status) return;
  if (success) {
    status.innerHTML = `
      <span class="status-icon status-success">&#10004;</span>
      <span class="status-text-success">${msg || "Register successfully!"}</span>
    `;
    status.style.display = 'flex';
  } else {
    status.innerHTML = `
      <span class="status-icon status-error">&#10006;</span>
      <span class="status-text-error">${msg || "Register failed!"}</span>
    `;
    status.style.display = 'flex';
  }
}
function handleRegister(event) {
  event.preventDefault();
  // Lấy thông tin từ form
  const firstName = document.getElementById('registerFirstName').value.trim();
  const lastName = document.getElementById('registerLastName').value.trim();
  const email = document.getElementById('registerEmail').value.trim().toLowerCase();
  const password = document.getElementById('registerPassword').value;
  const password2 = document.getElementById('registerPassword2').value;

  // Kiểm tra dữ liệu
  if (!firstName || !lastName || !email || !password || !password2) {
    showRegisterStatus(false, "Please fill all fields!");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showRegisterStatus(false, "Invalid email address!");
    return;
  }
  if (password.length < 6) {
    showRegisterStatus(false, "Password must be at least 6 characters!");
    return;
  }
  if (password !== password2) {
    showRegisterStatus(false, "Passwords do not match!");
    return;
  }
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.find(u => u.email === email)) {
    showRegisterStatus(false, "Email already exists!");
    return;
  }
  // Lưu user mới với đủ thông tin
  const newUser = { firstName, lastName, email, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  showRegisterStatus(true, "Register successfully!");
  setTimeout(() => {
    switchToLogin();
    document.getElementById('loginUsername').value = email;
  }, 1200);
}

// ==== CHUYỂN GIỮA LOGIN/REGISTER POPUP ====
function switchToRegister(e) {
  if (e) e.preventDefault();
  showRegisterPopup();
}
function switchToLogin(e) {
  if (e) e.preventDefault();
  showLoginPopup();
}

// ==== HEADER: Hiện thông tin user đã đăng nhập ====
function updateHeaderUser() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const actions = document.getElementById('headerActions');
  const userDiv = document.getElementById('headerUser');
  const usernameSpan = document.getElementById('headerUsername');
  if (currentUser && (currentUser.firstName || currentUser.email)) {
    actions.style.display = 'none';
    userDiv.style.display = 'flex';
    usernameSpan.textContent = currentUser.firstName
      ? (currentUser.firstName + (currentUser.lastName ? ' ' + currentUser.lastName : ''))
      : currentUser.email;
  } else {
    actions.style.display = 'flex';
    userDiv.style.display = 'none';
    usernameSpan.textContent = '';
  }
}
// Đăng xuất
function logout() {
  localStorage.removeItem("currentUser");
  updateHeaderUser();
}

// ==== ĐÓNG POPUP KHI CLICK RA NGOÀI ====
window.addEventListener('DOMContentLoaded', function() {
  updateHeaderUser();
  const popupBg = document.getElementById('loginPopupBg');
  if (popupBg) {
    popupBg.onclick = function(e) {
      if (e.target === this) hideLoginPopup(), hideRegisterPopup();
    };
  }
});