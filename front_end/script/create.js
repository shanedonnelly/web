const IP = 'localhost';
const PORT = '3000';
const LSPORT = '5501';


document.getElementById('creationForm').addEventListener('submit', function(event) {
  
    const errorButton = document.getElementById("errorButton");
    event.preventDefault(); // Prevent the default form submission
    const username = document.getElementById('username').value;
    const password = document.getElementById('psw1').value;
    const repeatPassword = document.getElementById('psw2').value;
    if (errorButton) {
      console.log('remove error');
      errorButton.remove();
    }
    

    // Check if the passwords match
    if (password !== repeatPassword) {
        informError('Passwords do not match');
    }
    else {
        // If the passwords match, send the create request
        if (errorButton) {
          console.log('remove error');
          errorButton.remove();
        }
        sendCreate(username, password);
    }
  });
  
  function sendCreate(username, password) {
    // Create the data object
    const data = {
      username: username,
      password: password,
    };
    console.log(data);
    // fetch(`http://${IP}:${PORT}/authentification/create`, {
    fetch(`/authentification/create`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('response', data);
      if (data.result) {
        // If the result is true, inform and connect
        informAndConnect();
      } else {
        // If the result is false, inform error
        informError('User already exists');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  function informAndConnect() {
    const successMessage = document.createElement('div');
    successMessage.id = 'successButton';
    successMessage.style.backgroundColor = 'green';
    successMessage.style.color = 'white';
    successMessage.textContent = 'User created successfully';

    const sendButton = document.getElementById("submitCreate");
    sendButton.parentNode.insertBefore(successMessage, sendButton);
    setTimeout(() => {
      window.location.href = `/profile.html`;
    }, 2000);
  }

  function informError(error) {
    const errorMessage = document.createElement('div');
    errorMessage.id = 'errorButton';
    errorMessage.style.backgroundColor = 'red';
    errorMessage.style.color = 'white';
    errorMessage.textContent = error;

    const sendButton = document.getElementById("submitCreate");
    sendButton.parentNode.insertBefore(errorMessage, sendButton);
  }

