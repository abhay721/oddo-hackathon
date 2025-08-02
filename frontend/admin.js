const API = 'http://localhost:5000/api/admin';

async function getAnalytics() {
    const token = localStorage.getItem('authToken');
    const res = await fetch(API + '/analytics', {
        headers: { authorization: 'Bearer ' + token }
    });
    document.getElementById('analytics').innerText = JSON.stringify(await res.json(), null, 2);
}

async function banUser() {
    const userId = document.getElementById('banUserId').value;
    const token = localStorage.getItem('authToken');
    await fetch(`${API}/ban/${userId}`, {
        method: 'POST',
        headers: { authorization: 'Bearer ' + token }
    });
    alert('User banned');
}