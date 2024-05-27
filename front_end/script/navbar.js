const profileElement = document.getElementById('profile');
const connexionElement = document.getElementById('connexion');
profileElement.style.display = 'none';

// Check if a token exists
function checkToken(){
  return document.cookie.includes('username');
}

if (checkToken()){
  console.log('token exists');
  connexionElement.style.display = 'none';
  profileElement.style.display = 'block';
;}