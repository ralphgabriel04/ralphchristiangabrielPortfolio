(function () {
  'use strict';

  var btnNo = document.getElementById('btnNo');
  var btnYes = document.getElementById('btnYes');
  var messageEl = document.getElementById('dodgeMessage');

  if (!btnNo || !btnYes) return;

  // Etat
  var dodgeCount = 0;
  var maxDodges = 20;
  var shrinkFactor = 0.93;
  var minScale = 0.3;
  var currentScale = 1.0;
  var yesScale = 1.0;
  var isDodging = false;

  // Messages droles en francais
  var messages = [
    'Tu es sure ? 🤔',
    'Essaie encore 😏',
    'Haha, non !',
    'Tu ne peux pas m\'attraper ! 😜',
    'Le "Oui" est juste la... 👉',
    'Abandonne ! 😘',
    'C\'est pas possible !',
    'Encore rate ! 😂',
    'Je suis trop rapide pour toi !',
    'Allez, dis Oui ! ❤️',
    'Tu vas y arriver ? Non. 😂',
    'Presque ! ...ou pas 🙃',
    'Le destin a choisi : Oui ! ✨',
    'Resistance futile ! 💪',
    'Mon coeur dit Oui pour toi ❤️',
    'Trop lente ! 🐢',
    'C\'etait proche ! ...pas du tout 😄',
    'Dis juste Oui, c\'est plus simple 💕',
    'Le bouton Non ne veut pas de toi 😅',
    'Derniere chance avant qu\'il disparaisse...'
  ];

  function getRandomMessage() {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  function showMessage(text) {
    messageEl.textContent = text;
    messageEl.classList.add('visible');
  }

  function getRandomPosition() {
    var margin = 20;
    var btnWidth = Math.max(btnNo.offsetWidth, 60);
    var btnHeight = Math.max(btnNo.offsetHeight, 40);
    var maxX = window.innerWidth - btnWidth - margin;
    var maxY = window.innerHeight - btnHeight - margin;
    var x = Math.max(margin, Math.random() * maxX);
    var y = Math.max(margin, Math.random() * maxY);
    return { x: x, y: y };
  }

  function dodgeButton() {
    if (isDodging || dodgeCount >= maxDodges) return;
    isDodging = true;
    dodgeCount++;

    // Deplacer a une position aleatoire
    var pos = getRandomPosition();
    btnNo.style.position = 'fixed';
    btnNo.style.left = pos.x + 'px';
    btnNo.style.top = pos.y + 'px';
    btnNo.style.zIndex = '9999';
    btnNo.style.transition = 'left 0.25s ease-out, top 0.25s ease-out, transform 0.25s ease-out, opacity 0.3s ease';
    btnNo.style.margin = '0';

    // Retrecir
    currentScale = Math.max(minScale, currentScale * shrinkFactor);
    btnNo.style.transform = 'scale(' + currentScale.toFixed(3) + ')';

    // Afficher un message drole
    showMessage(getRandomMessage());

    // Grossir le bouton Oui
    yesScale = Math.min(1.5, yesScale + 0.025);
    btnYes.style.transform = 'scale(' + yesScale.toFixed(3) + ')';
    btnYes.style.transition = 'transform 0.3s ease';
    btnYes.classList.add('pulsing');
    setTimeout(function () {
      btnYes.classList.remove('pulsing');
    }, 500);

    // Disparition progressive
    if (dodgeCount >= maxDodges) {
      btnNo.style.opacity = '0';
      btnNo.style.pointerEvents = 'none';
      showMessage('Le bouton "Non" a disparu... Il ne reste que "Oui" ! ❤️');
    } else if (dodgeCount >= maxDodges - 5) {
      var fadeProgress = (dodgeCount - (maxDodges - 5)) / 5;
      btnNo.style.opacity = String(1 - fadeProgress * 0.7);
    }

    // Anti-spam: petit cooldown
    setTimeout(function () {
      isDodging = false;
    }, 200);
  }

  // --- Evenements desktop ---

  // Hover direct
  btnNo.addEventListener('mouseover', function (e) {
    e.preventDefault();
    dodgeButton();
  });

  // Detection de proximite (dodge avant meme le hover)
  document.addEventListener('mousemove', function (e) {
    if (dodgeCount >= maxDodges || dodgeCount === 0) return;
    if (btnNo.style.position !== 'fixed') return;

    var rect = btnNo.getBoundingClientRect();
    var centerX = rect.left + rect.width / 2;
    var centerY = rect.top + rect.height / 2;
    var dx = e.clientX - centerX;
    var dy = e.clientY - centerY;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 80) {
      dodgeButton();
    }
  });

  // --- Evenements mobile ---

  btnNo.addEventListener('touchstart', function (e) {
    e.preventDefault();
    dodgeButton();
  }, { passive: false });

  // --- Securite anti-triche ---

  // Empecher le clic
  btnNo.addEventListener('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    dodgeButton();
    return false;
  });

  // Empecher l'activation clavier (Tab + Enter / Space)
  btnNo.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      dodgeButton();
    }
  });

  // Empecher le focus
  btnNo.addEventListener('focus', function () {
    dodgeButton();
    btnNo.blur();
  });

  // Empecher la soumission du formulaire avec "Non" via la touche Entree
  var form = document.getElementById('valentineForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      // Verifier que c'est bien le bouton Oui qui soumet
      var submitter = e.submitter;
      if (submitter && submitter.value === 'no') {
        e.preventDefault();
        dodgeButton();
      }
    });
  }

})();
