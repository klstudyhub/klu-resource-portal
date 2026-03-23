// DYNAMIC TOAST GENERATOR
function showToast(message, type = 'success') {
  // 1. Create or find the toast container
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // 2. Create the toast element
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // 3. Define the icon based on the type (success or error)
  const icon = type === 'success' ? '✓' : '✕';

  // 4. Build the internal HTML structure
  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-message">${message}</div>
    <div class="toast-progress"></div>
  `;

  // 5. Add to the page
  container.appendChild(toast);

  // 6. Handle automatic removal after 3 seconds to match CSS progress bar
  setTimeout(() => {
    toast.classList.add('hiding');
    // Wait for the exit animation to finish before removing from the DOM completely
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 3000); 
}

// UPDATED NEXT FUNCTION (Terms check)
function next(){
  if(!agree.checked){
    showToast("Please agree to the terms and conditions.", "error");
    return;
  }
  signupBox.classList.add("hidden");
  formBox.classList.remove("hidden");
}

// UPDATED SIGNUP FUNCTION
async function signup(){
  if(!sid.value || !spass.value) {
    showToast("Please fill in all fields.", "error");
    return;
  }

  await client.from("users").insert([{
    id_no: sid.value,
    password: spass.value,
    branch: branch.value,
    role: "user",
    status: "pending"
  }]);

  showToast("Account request sent. Wait for admin approval.", "success");
  
  // Reset form and UI
  sid.value = "";
  spass.value = "";
  agree.checked = false;
  setTimeout(() => backToLogin(), 1500);
}

// UPDATED LOGIN FUNCTION
async function login(){
  if(!id.value || !pass.value) {
    showToast("Please enter your Student ID and Password.", "error");
    return;
  }

  const { data } = await client
    .from("users")
    .select("*")
    .eq("id_no", id.value)
    .eq("password", pass.value)
    .single();

  // Invalid login handling
  if(!data){
    showToast("Invalid Student ID or Password.", "error");
    return;
  }

  // Unapproved user handling
  if(data.status !== "approved"){
    showToast("Your account has not been approved yet.", "error");
    return;
  }

  // Success handling
  showToast("Login successful. Redirecting...", "success");
  localStorage.setItem("user", JSON.stringify(data));

  setTimeout(() => {
    if(data.role === "admin"){
      window.location = "admin.html";
    } else {
      window.location = "dashboard.html";
    }
  }, 1000); // 1-second delay so the user sees the success toast
}
