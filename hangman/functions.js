    function startGame(game) {
      const area = document.getElementById('game-area');
      area.innerHTML = `<p class="text-center text-xl">Loading <strong>${game}</strong>...</p>`;
      setTimeout(() => {
        if (game === 'hangman') hangmanGame(area);
        else if (game === 'ticTacToe') ticTacToeGame(area);
        else if (game === 'memory') memoryGame(area);
        else if (game === 'guessNumber') guessNumberGame(area);
        else if (game === 'rockPaperScissors') rockPaperScissorsGame(area);
        else if (game === 'spaceDefender') spaceDefenderGame(area);
      }, 200);
    }

    // 1. Hangman with real hangman drawing
    function hangmanGame(area) {
      const words = [
        { word: 'elephant', hint: 'A large gray animal with a trunk' },
        { word: 'volcano', hint: 'A mountain that erupts' },
        { word: 'javascript', hint: 'A programming language' }
      ];
      const choice = words[Math.floor(Math.random() * words.length)];
      const word = choice.word;
      const hint = choice.hint;
      let guessed = Array(word.length).fill('_');
      let attempts = 8;
      let used = [];

      // Setup HTML
      area.innerHTML = `
        <h2 class="text-2xl mb-2">Hangman</h2>
        <canvas id="hangman-canvas" width="200" height="250"></canvas>
        <p class="italic mb-2">Hint: ${hint}</p>
        <p id="hangman-word" class="text-3xl mb-2 tracking-widest">${guessed.join(' ')}</p>
        <p>Attempts left: <span id="hangman-attempts">${attempts}</span></p>
        <input id="hangman-input" maxlength="1" class="text-black px-2 w-12 mt-2" autofocus />
        <button class="game-button mt-2" id="hangman-guess-btn">Guess</button>
        <p>Used letters: <span id="hangman-used"></span></p>
        <p id="hangman-msg" class="mt-2 font-bold"></p>
      `;

      const canvas = document.getElementById('hangman-canvas');
      const ctx = canvas.getContext('2d');
      const input = document.getElementById('hangman-input');
      const guessBtn = document.getElementById('hangman-guess-btn');

      function drawHangman(attemptsLeft) {
        ctx.clearRect(0, 0, 200, 250);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;

        // Base
        ctx.beginPath();
        ctx.moveTo(10, 230);
        ctx.lineTo(190, 230);
        ctx.stroke();

        // Pole
        ctx.beginPath();
        ctx.moveTo(50, 230);
        ctx.lineTo(50, 20);
        ctx.lineTo(140, 20);
        ctx.lineTo(140, 40);
        ctx.stroke();

        // Draw parts based on wrong attempts (8 attempts total)
        let parts = 8 - attemptsLeft;
        if (parts > 0) {
          // Head
          ctx.beginPath();
          ctx.arc(140, 60, 20, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (parts > 1) {
          // Body
          ctx.beginPath();
          ctx.moveTo(140, 80);
          ctx.lineTo(140, 140);
          ctx.stroke();
        }
        if (parts > 2) {
          // Left arm
          ctx.beginPath();
          ctx.moveTo(140, 100);
          ctx.lineTo(110, 120);
          ctx.stroke();
        }
        if (parts > 3) {
          // Right arm
          ctx.beginPath();
          ctx.moveTo(140, 100);
          ctx.lineTo(170, 120);
          ctx.stroke();
        }
        if (parts > 4) {
          // Left leg
          ctx.beginPath();
          ctx.moveTo(140, 140);
          ctx.lineTo(110, 180);
          ctx.stroke();
        }
        if (parts > 5) {
          // Right leg
          ctx.beginPath();
          ctx.moveTo(140, 140);
          ctx.lineTo(170, 180);
          ctx.stroke();
        }
        if (parts > 6) {
          // Left eye
          ctx.beginPath();
          ctx.moveTo(130, 55);
          ctx.lineTo(135, 60);
          ctx.moveTo(135, 55);
          ctx.lineTo(130, 60);
          ctx.stroke();
        }
        if (parts > 7) {
          // Right eye
          ctx.beginPath();
          ctx.moveTo(145, 55);
          ctx.lineTo(150, 60);
          ctx.moveTo(150, 55);
          ctx.lineTo(145, 60);
          ctx.stroke();
        }
      }

      drawHangman(attempts);

      function makeGuess() {
        const letter = input.value.toLowerCase();
        input.value = '';
        if (!letter.match(/^[a-z]$/)) return;
        if (used.includes(letter)) return;
        used.push(letter);
        let found = false;
        for (let i = 0; i < word.length; i++) {
          if (word[i] === letter) {
            guessed[i] = letter;
            found = true;
          }
        }
        if (!found) attempts--;
        document.getElementById('hangman-word').textContent = guessed.join(' ');
        document.getElementById('hangman-attempts').textContent = attempts;
        document.getElementById('hangman-used').textContent = used.join(', ');
        drawHangman(attempts);

        if (guessed.join('') === word) {
          document.getElementById('hangman-msg').textContent = '🎉 You win!';
          input.disabled = true;
          guessBtn.disabled = true;
        } else if (attempts === 0) {
          document.getElementById('hangman-msg').textContent = `💀 Game over! The word was: ${word}`;
          input.disabled = true;
          guessBtn.disabled = true;
        }
      }

      guessBtn.onclick = makeGuess;
      input.addEventListener('keyup', e => { if (e.key === 'Enter') makeGuess(); });
    }
function ticTacToeGame(area) {
  let board = Array(9).fill('');
  let turn = 'X';
  let gameOver = false;

  area.innerHTML = `
    <h2 class="ttt-title">Tic Tac Toe</h2>
    <div id="ttt-board" class="ttt-board"></div>
    <p id="ttt-status" class="ttt-status"></p>
    <button id="ttt-restart" class="ttt-restart">Neustart</button>
  `;

  const boardElement = area.querySelector('#ttt-board');
  const statusElement = area.querySelector('#ttt-status');
  const restartButton = area.querySelector('#ttt-restart');

  restartButton.onclick = () => {
    board = Array(9).fill('');
    turn = 'X';
    gameOver = false;
    statusElement.textContent = '';
    restartButton.style.display = 'none';
    drawBoard();
  };

  function drawBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, i) => {
      const btn = document.createElement('button');
      btn.className = 'ttt-cell';
      btn.textContent = cell;
      btn.disabled = !!cell || gameOver;
      btn.onclick = () => makeMove(i);
      boardElement.appendChild(btn);
    });
    if (!gameOver) {
      statusElement.textContent = `Am Zug: ${turn}`;
    }
  }

  function makeMove(index) {
    if (gameOver || board[index]) return;
    board[index] = turn;
    if (checkWin()) {
      statusElement.textContent = `${turn} gewinnt! 🎉`;
      gameOver = true;
      restartButton.style.display = 'inline-block';
    } else if (board.every(cell => cell)) {
      statusElement.textContent = "Unentschieden!";
      gameOver = true;
      restartButton.style.display = 'inline-block';
    } else {
      turn = turn === 'X' ? 'O' : 'X';
      drawBoard();
    }
  }

  function checkWin() {
    const winLines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    return winLines.some(([a, b, c]) =>
      board[a] && board[a] === board[b] && board[b] === board[c]
    );
  }

  drawBoard();
}



    // 3. Memory Match 16 cards
    function memoryGame(area) {
      const symbols = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
      let cards = [...symbols, ...symbols];
      cards = cards.sort(() => Math.random() - 0.5);
      let first = null;
      let second = null;
      let lock = false;
      let matches = 0;
      area.innerHTML = `
        <h2 class="text-2xl mb-4">Memory Match</h2>
        <div id="memory-board" class="grid grid-cols-4 gap-4 max-w-md mx-auto"></div>
        <p id="memory-msg" class="mt-4 font-bold text-center"></p>
      `;
      const board = document.getElementById('memory-board');

      cards.forEach((sym, i) => {
        const btn = document.createElement('button');
        btn.textContent = '❓';
        btn.className = 'bg-white text-4xl rounded-xl aspect-square flex items-center justify-center cursor-pointer';
        btn.onclick = () => {
          if(lock || btn.textContent !== '❓' || btn === first) return;
          btn.textContent = sym;
          if(!first) {
            first = btn;
          } else {
            second = btn;
            lock = true;
            if(first.textContent === second.textContent) {
              matches++;
              first = null;
              second = null;
              lock = false;
              if(matches === symbols.length) {
                document.getElementById('memory-msg').textContent = '🎉 You found all matches!';
              }
            } else {
              setTimeout(() => {
                first.textContent = '❓';
                second.textContent = '❓';
                first = null;
                second = null;
                lock = false;
              }, 1000);
            }
          }
        };
        board.appendChild(btn);
      });
    }

    // 4. Guess Number (1 to 100)
    function guessNumberGame(area) {
      const number = Math.floor(Math.random() * 100) + 1;
      let attempts = 0;
      area.innerHTML = `
        <h2 class="text-2xl mb-2">Guess Number (1-100)</h2>
        <input id="guess-input" type="number" min="1" max="100" class="text-black p-2 rounded w-24" />
        <button class="game-button ml-2" id="guess-btn">Guess</button>
        <p id="guess-msg" class="mt-4 font-bold"></p>
        <p id="guess-attempts"></p>
      `;
      const input = document.getElementById('guess-input');
      const btn = document.getElementById('guess-btn');
      const msg = document.getElementById('guess-msg');
      const attemptsEl = document.getElementById('guess-attempts');

      btn.onclick = () => {
        const guess = Number(input.value);
        if (!guess || guess < 1 || guess > 100) {
          msg.textContent = '⚠️ Enter a number between 1 and 100.';
          return;
        }
        attempts++;
        if (guess === number) {
          msg.textContent = `🎉 Correct! You guessed it in ${attempts} tries.`;
          btn.disabled = true;
          input.disabled = true;
        } else if (guess < number) {
          msg.textContent = '📈 Too low!';
        } else {
          msg.textContent = '📉 Too high!';
        }
        attemptsEl.textContent = `Attempts: ${attempts}`;
        input.value = '';
        input.focus();
      };
      input.addEventListener('keyup', e => { if (e.key === 'Enter') btn.click(); });
    }

(() => {
  // ... existing code for other games ...

  // === ROCK PAPER SCISSORS LOGIC ===
  const rpsChoices = document.querySelectorAll('.rps-choice');
  const rpsResult = document.getElementById('rps-result');
  const rpsRestart = document.getElementById('rps-restart');

  function computerRPSChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    return choices[Math.floor(Math.random() * 3)];
  }

  function determineRPSWinner(user, computer) {
    if(user === computer) return 'Unentschieden!';
    if(
      (user === 'rock' && computer === 'scissors') ||
      (user === 'paper' && computer === 'rock') ||
      (user === 'scissors' && computer === 'paper')
    ) return 'Du gewinnst! 🎉';
    return 'Computer gewinnt!';
  }

  function playRPS(userChoice) {
    const compChoice = computerRPSChoice();
    rpsResult.textContent = `Du: ${userChoice.charAt(0).toUpperCase() + userChoice.slice(1)} - Computer: ${compChoice.charAt(0).toUpperCase() + compChoice.slice(1)}. ${determineRPSWinner(userChoice, compChoice)}`;
    rpsChoices.forEach(c => c.style.pointerEvents = 'none');
  }

  rpsChoices.forEach(choice => {
    choice.addEventListener('click', () => {
      playRPS(choice.dataset.choice);
    });
    choice.addEventListener('keydown', e => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playRPS(choice.dataset.choice);
      }
    });
  });

  rpsRestart.addEventListener('click', () => {
    rpsResult.textContent = '';
    rpsChoices.forEach(c => c.style.pointerEvents = 'auto');
  });

});
