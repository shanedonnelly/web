
playButton = document.getElementById('overlay-button');
if (!checkToken()){
    playButton.innerHTML = 'Se connecter pour jouer';
}
else {
    playButton.innerHTML = 'Attente serveur';
}