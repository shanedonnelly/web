

// Assuming your form has the id 'myForm'
const form = document.getElementById('connexionForm');

form.addEventListener('submit', function(event) {
  // Prevent the form from being submitted normally
  event.preventDefault();

  // Get the username and password from the form
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Send a POST request with the username and password
  fetch('/authentification/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.result) {
      // Redirect to the home page
      window.location.href = '/profile.html';
    } else {
      // Display an error message
      const error = document.getElementById('error');
      error.textContent = 'Invalid username or password';
    }
  });
});