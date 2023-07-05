let player;

function login() {
    let player = document.getElementById('player').value
    localStorage.setItem('player', player)
    window.location.href = 'game.html'
}

function load_name() {
    player = localStorage.getItem('player')
    document.getElementById('player').innerHTML = player
}