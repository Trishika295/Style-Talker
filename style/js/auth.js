function isLoggedIn() {
  return localStorage.getItem("user") !== null;
}


function getCurrentPage() {
  return window.location.href.split('/').pop() || 'index.html';
}
function signIn() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  
  if (!emailInput || !passwordInput) {
    alert("Form fields not found");
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ');

  localStorage.setItem("user", JSON.stringify({
    name: nameFromEmail,
    email: email,
    loginTime: new Date().toISOString()
  }));
  
  window.location.href = "index.html";
}

function createAccount(event) {
  event.preventDefault();
  const name = document.getElementById("name")?.value?.trim();
  const email = document.getElementById("email")?.value?.trim();
  const password = document.getElementById("password")?.value?.trim();

  if (!name || !email || !password) {
    alert("Please fill in all fields");
    return;
  }

 
  console.log("Creating account:", { name, email, password });  

  localStorage.setItem("user", JSON.stringify({
    name: name,
    email: email,
    registrationTime: new Date().toISOString()
  }));
  
  window.location.href = "index.html";
}

function signOut() {
  if (confirm("Are you sure you want to sign out?")) {
    localStorage.removeItem("user");
    window.location.href = "login.html";
  }
}

function checkAuth() {
  const currentPage = getCurrentPage();
  const isLoggedInUser = isLoggedIn();
  
  if ((currentPage === 'index.html' || currentPage === 'chatbot.html') && !isLoggedInUser) {
    window.location.href = "login.html";
    return;
  }
  
  if ((currentPage === 'login.html' || currentPage === 'register.html') && isLoggedInUser) {
    window.location.href = "index.html";
    return;
  }
}