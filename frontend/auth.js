const API = 'http://localhost:5000/api/auth';

document.getElementById('loginBtn').onclick = () => {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('reportSection').style.display = 'none';
    document.getElementById('mapview').style.display = 'none';
};
document.getElementById('logoutBtn').onclick = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    location.reload();
};
document.getElementById('adminBtn').onclick = () => {
    window.location = "admin.html";
};

document.getElementById('loginSubmit').onclick = async (e) => {
    e.preventDefault();
    const form = document.getElementById('authForm');
    const email = form.email.value;
    const password = form.password.value;
    const res = await fetch(API + "/login", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    });
    const data = await res.json();
    if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.user.role);
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('reportSection').style.display = 'block';
        document.getElementById('mapview').style.display = 'block';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline-block';
        if(data.user.role === 'admin') document.getElementById('adminBtn').style.display = 'inline-block';
        window.onload();
    } else {
        alert(data.error || "Login failed");
    }
};
document.getElementById('registerSubmit').onclick = async (e) => {
    e.preventDefault();
    const form = document.getElementById('authForm');
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    const res = await fetch(API + "/register", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name, email, password})
    });
    const data = await res.json();
    if (data.message) {
        alert("Registered! Please login.");
    } else {
        alert(data.error || "Registration failed");
    }
};

window.onload = () => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    if (token) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('reportSection').style.display = 'block';
        document.getElementById('mapview').style.display = 'block';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('logoutBtn').style.display = 'inline-block';
        if (role === 'admin') document.getElementById('adminBtn').style.display = 'inline-block';
    } else {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('reportSection').style.display = 'none';
        document.getElementById('mapview').style.display = 'none';
        document.getElementById('loginBtn').style.display = 'inline-block';
        document.getElementById('logoutBtn').style.display = 'none';
        document.getElementById('adminBtn').style.display = 'none';
    }
};