
document.getElementById('profile-pic-select').addEventListener('change', function() {
    if (this.value) {
        console.log('value', this.value);
        document.getElementById('choice-list').value = 'none';
    }
});

document.getElementById('choice-list').addEventListener('change', function() {
    if (this.value !== 'none') {
        console.log('value', this.value);
        document.getElementById('profile-pic-select').value = '';
    }
});

document.getElementById('logout-button').addEventListener('click', function() {
    fetch(`/authentification/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('response', data);
        if (data.result) {
            window.location.replace('connexion.html');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
