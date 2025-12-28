// Default credentials (for demo purposes)
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

// Show alert message
function showAlert(message, type = 'danger') {
    const alertDiv = document.getElementById('alertMessage');
    const alertText = document.getElementById('alertText');
    
    // Check if elements exist
    if (!alertDiv || !alertText) {
        console.error('Alert elements not found in DOM');
        alert(message); // Fallback to native alert
        return;
    }
    
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertText.textContent = message;
    alertDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        alertDiv.style.display = 'none';
    }, 5000);
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Toggle Password Visibility
    const togglePasswordBtn = document.getElementById('togglePassword');
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eyeIcon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.classList.remove('bi-eye');
                eyeIcon.classList.add('bi-eye-slash');
            } else {
                passwordInput.type = 'password';
                eyeIcon.classList.remove('bi-eye-slash');
                eyeIcon.classList.add('bi-eye');
            }
        });
    }

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Clear previous validation
            document.getElementById('username').classList.remove('is-invalid');
            document.getElementById('password').classList.remove('is-invalid');
            
            // Validate
            if (!username) {
                document.getElementById('username').classList.add('is-invalid');
                showAlert('Please enter your username', 'danger');
                return;
            }
            
            if (!password) {
                document.getElementById('password').classList.add('is-invalid');
                showAlert('Please enter your password', 'danger');
                return;
            }
            
            // Check credentials
            if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
                // Store login state
                if (rememberMe) {
                    localStorage.setItem('rememberedUser', username);
                }
                
                // Store session
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('username', username);
                sessionStorage.setItem('loginTime', new Date().toISOString());
                
                showAlert('Login successful! Redirecting...', 'success');
                
                // Redirect to dashboard after 1 second
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                document.getElementById('username').classList.add('is-invalid');
                document.getElementById('password').classList.add('is-invalid');
                showAlert('Invalid username or password. Try: admin / admin123', 'danger');
            }
        });
    }

    // Forgot Password Form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('resetEmail').value;
            const resetMessage = document.getElementById('resetMessage');
            
            if (!email) {
                resetMessage.className = 'alert alert-danger';
                resetMessage.textContent = 'Please enter your email address';
                resetMessage.style.display = 'block';
                return;
            }
            
            // Simulate sending reset email
            resetMessage.className = 'alert alert-success';
            resetMessage.textContent = 'Password reset link has been sent to ' + email;
            resetMessage.style.display = 'block';
            
            // Reset form
            forgotPasswordForm.reset();
            
            // Close modal after 2 seconds
            setTimeout(() => {
                const modal = document.getElementById('forgotPasswordModal');
                if (modal && typeof bootstrap !== 'undefined') {
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    if (bsModal) {
                        bsModal.hide();
                    }
                }
                resetMessage.style.display = 'none';
            }, 2000);
        });
    }

    // Sign Up Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const username = document.getElementById('signupUsername').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            const signupMessage = document.getElementById('signupMessage');
            
            // Validate
            if (!name || !email || !username || !password || !confirmPassword) {
                signupMessage.className = 'alert alert-danger';
                signupMessage.textContent = 'Please fill in all fields';
                signupMessage.style.display = 'block';
                return;
            }
            
            if (password !== confirmPassword) {
                signupMessage.className = 'alert alert-danger';
                signupMessage.textContent = 'Passwords do not match';
                signupMessage.style.display = 'block';
                return;
            }
            
            if (password.length < 6) {
                signupMessage.className = 'alert alert-danger';
                signupMessage.textContent = 'Password must be at least 6 characters';
                signupMessage.style.display = 'block';
                return;
            }
            
            if (!agreeTerms) {
                signupMessage.className = 'alert alert-danger';
                signupMessage.textContent = 'Please agree to the Terms & Conditions';
                signupMessage.style.display = 'block';
                return;
            }
            
            // Simulate successful registration
            signupMessage.className = 'alert alert-success';
            signupMessage.textContent = 'Account created successfully! Please login.';
            signupMessage.style.display = 'block';
            
            // Reset form
            signupForm.reset();
            
            // Close modal and show login page after 2 seconds
            setTimeout(() => {
                const modal = document.getElementById('signupModal');
                if (modal && typeof bootstrap !== 'undefined') {
                    const bsModal = bootstrap.Modal.getInstance(modal);
                    if (bsModal) {
                        bsModal.hide();
                    }
                }
                signupMessage.style.display = 'none';
                showAlert('Account created! You can now login with your credentials.', 'success');
            }, 2000);
        });
    }

    // Check if user is remembered
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
    
    // Check if already logged in
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        window.location.href = 'dashboard.html';
    }

    // Input validation on blur
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('blur', function() {
            if (this.value) {
                this.classList.remove('is-invalid');
            }
        });
    }

    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            if (this.value) {
                this.classList.remove('is-invalid');
            }
        });
    }

    // Show demo credentials hint after page loads
    setTimeout(() => {
        showAlert('Demo credentials: Username: admin | Password: admin123', 'info');
    }, 1000);
});