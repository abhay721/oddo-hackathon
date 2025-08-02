const API_ISSUES = 'http://localhost:5000/api/issues';

document.getElementById('getLocationBtn').onclick = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            document.getElementById('lat').value = pos.coords.latitude;
            document.getElementById('lng').value = pos.coords.longitude;
        });
    } else {
        alert('Geolocation is not supported.');
    }
};

document.getElementById('issueForm').onsubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    formData.set('anonymous', document.getElementById('anonymous').checked);

    const token = localStorage.getItem('authToken');
    if (!token) return alert('You must be logged in to report issues.');

    await fetch(API_ISSUES, {
        method: 'POST',
        headers: { 'authorization': 'Bearer ' + token },
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        alert('Issue reported successfully!');
        document.getElementById('issueForm').reset();
        loadIssues();
    })
    .catch(err => alert('Error reporting issue: ' + err));
};

function loadIssues() {
    const lat = document.getElementById('lat').value || 0;
    const lng = document.getElementById('lng').value || 0;
    const radius = document.getElementById('distanceFilter').value;

    fetch(`${API_ISSUES}/nearby?lat=${lat}&lng=${lng}&radius=${radius}`)
    .then(res => res.json())
    .then(issues => {
        renderIssues(issues);
        renderMap(issues);
    });
}

document.getElementById('refreshBtn').onclick = loadIssues;

function renderIssues(issues) {
    const status = document.getElementById('statusFilter').value;
    const category = document.getElementById('categoryFilter').value;

    const filtered = issues.filter(issue =>
        (!status || issue.status === status) &&
        (!category || issue.category === category) &&
        (!issue.flagged)
    );

    const list = document.getElementById('issuesList');
    list.innerHTML = '';
    filtered.forEach(issue => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${issue.title}</strong> (${issue.category})<br>
            <small>${issue.location.address}</small><br>
            Status: <span>${issue.status}</span>
            ${localStorage.getItem('authToken') ? `<button onclick="flagIssue('${issue._id}')">Flag as Spam</button>` : ''}
            <details>
                <summary>Status Log</summary>
                <ul>
                    ${issue.statusLogs.map(log => `<li>${log.status} at ${new Date(log.timestamp).toLocaleString()} (${log.note || ""})</li>`).join('')}
                </ul>
            </details>
            ${issue.photos && issue.photos.length ? `<div>${issue.photos.map(p => `<img src="${p}" width="80">`).join('')}</div>` : ''}
        `;
        list.appendChild(li);
    });
}

window.flagIssue = function(id) {
    const token = localStorage.getItem('authToken');
    fetch(`${API_ISSUES}/${id}/flag`, {
        method: 'POST',
        headers: { 'authorization': 'Bearer ' + token }
    })
    .then(res => res.json())
    .then(() => {
        alert('Issue flagged!');
        loadIssues();
    });
};

let map;
function renderMap(issues) {
    if (!map) {
        map = L.map('map').setView([20, 80], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    }
    map.eachLayer(layer => { if (layer instanceof L.Marker) map.removeLayer(layer); });

    issues.filter(i => !i.flagged).forEach(issue => {
        L.marker([issue.location.lat, issue.location.lng])
            .addTo(map)
            .bindPopup(`<b>${issue.title}</b><br>${issue.category}<br>${issue.location.address}`);
    });
}

window.onload = loadIssues;