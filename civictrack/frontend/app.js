const API = 'http://localhost:5000/api/issues';

document.getElementById('issueForm').onsubmit = async function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const issue = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        location: {
            lat: parseFloat(formData.get('lat')),
            lng: parseFloat(formData.get('lng')),
            address: formData.get('address'),
        },
        reporter: {
            anonymous: formData.get('anonymous') ? true : false,
            name: formData.get('anonymous') ? '' : prompt('Enter your name (leave blank for anonymous):'),
            email: formData.get('anonymous') ? '' : prompt('Enter your email (leave blank for anonymous):')
        },
        photos: []
    };

    const files = form.querySelector('input[name="photos"]').files;
    if (files.length > 0) {
        for (let i = 0; i < Math.min(files.length, 35); i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = function(ev) {
                issue.photos.push(ev.target.result);
                if (issue.photos.length === files.length || issue.photos.length === 35) {
                    sendIssue(issue);
                }
            };
            reader.readAsDataURL(file);
        }
    } else {
        sendIssue(issue);
    }
};

function sendIssue(issue) {
    fetch(API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(issue)
    })
    .then(res => res.json())
    .then(data => {
        alert('Issue reported successfully!');
        document.getElementById('issueForm').reset();
        loadIssues();
    })
    .catch(err => alert('Error reporting issue: ' + err));
}

function loadIssues() {
    const lat = 0;
    const lng = 0;
    const radius = document.getElementById('distanceFilter').value;

    fetch(`${API}/nearby?lat=${lat}&lng=${lng}&radius=${radius}`)
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
    const radius = document.getElementById('distanceFilter').value;

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
            Status: <span>${issue.status}</span><br>
            <button onclick="flagIssue('${issue._id}')">Flag as Spam</button>
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

function flagIssue(id) {
    fetch(`${API}/${id}/flag`, {method: 'POST'})
        .then(res => res.json())
        .then(() => {
            alert('Issue flagged!');
            loadIssues();
        });
}

function renderMap(issues) {
    const map = document.getElementById('map');
    map.innerHTML = '';
    issues.filter(i => !i.flagged).forEach(issue => {
        const pin = document.createElement('div');
        pin.style.position = 'absolute';
        pin.style.left = `${20 + Math.random()*80}%`;
        pin.style.top = `${20 + Math.random()*80}%`;
        pin.style.width = '18px';
        pin.style.height = '18px';
        pin.style.background = '#0082ca';
        pin.style.borderRadius = '50%';
        pin.title = issue.title;
        map.appendChild(pin);
    });
}

window.onload = loadIssues;