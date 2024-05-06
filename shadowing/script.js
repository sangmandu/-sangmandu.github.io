let currentWeek = 6;
let currentStage = 0;

const scriptContainer = document.getElementById('scriptContainer');

function loadScript() {
  const scriptPath = `data/${currentWeek}-${currentStage}.txt`;
  
  fetch(scriptPath)
    .then(response => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error('Script not found');
      }
    })
    .then(text => {
      displayScript(text);
    })
    .catch(error => {
      scriptContainer.innerHTML = '준비중입니다.';
    });
}

function displayScript(text) {
  const lines = text.split('\n');
  const scriptHTML = lines.map(line => {
    return line.replace(/____/g, '<span class="blank"></span>');
  }).join('<br>');
  
  scriptContainer.innerHTML = scriptHTML;
  
  const blanks = scriptContainer.getElementsByClassName('blank');
  for (let i = 0; i < blanks.length; i++) {
    blanks[i].addEventListener('click', async function() {
      if (this.classList.contains('revealed')) {
        this.textContent = '';
        this.classList.remove('revealed');
      } else {
        const word = await getWordFromStage0(i);
        this.textContent = word;
        this.classList.add('revealed');
      }
    });
  }
}

function getWordFromStage0(index) {
  const stage0Path = `data/${currentWeek}-0.txt`;
  
  return fetch(stage0Path)
    .then(response => response.text())
    .then(text => {
      const words = text.split(/____/g);
      return words[index].trim();
    });
}

document.getElementById('weekInput').addEventListener('change', function() {
  currentWeek = parseInt(this.value);
  currentStage = 0;
  loadScript();
});

document.getElementById('stageInput').addEventListener('change', function() {
  currentStage = parseInt(this.value);
  loadScript();
});

document.getElementById('prevWeek').addEventListener('click', function() {
  if (currentWeek > 1) {
    currentWeek--;
    currentStage = 0;
    document.getElementById('weekInput').value = currentWeek;
    loadScript();
  }
});

document.getElementById('nextWeek').addEventListener('click', function() {
  if (currentWeek < 11) {
    currentWeek++;
    currentStage = 0;
    document.getElementById('weekInput').value = currentWeek;
    loadScript();
  }
});

document.getElementById('prevStage').addEventListener('click', function() {
  if (currentStage > 0) {
    currentStage--;
    document.getElementById('stageInput').value = currentStage;
    loadScript();
  }
});

document.getElementById('nextStage').addEventListener('click', function() {
  if (currentStage < 9) {
    currentStage++;
    document.getElementById('stageInput').value = currentStage;
    loadScript();
  }
});

loadScript();