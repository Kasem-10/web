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

    // 2. Tic Tac Toe (unchanged, clean)
    function ticTacToeGame(area) {
      let board = Array(9).fill('');
      let turn = 'X';
      let gameOver = false;
      area.innerHTML = `
        <h2 class="text-2xl mb-2">Tic Tac Toe</h2>
        <div id="ttt-board" class="grid grid-cols-3 gap-2"></div>
        <p id="ttt-msg" class="mt-2 font-bold"></p>
      `;
      function drawBoard() {
        const b = document.getElementById('ttt-board');
        b.innerHTML = '';
        board.forEach((cell, i) => {
          const btn = document.createElement('button');
          btn.textContent = cell;
          btn.className = 'w-16 h-16 text-xl font-bold rounded-lg bg-white text-black';
          btn.disabled = !!cell || gameOver;
          btn.onclick = () => {
            if (gameOver) return;
            board[i] = turn;
            turn = turn === 'X' ? 'O' : 'X';
            drawBoard();
            checkWin();
          };
          b.appendChild(btn);
        });
      }
      function checkWin() {
        const lines = [
          [0,1,2],[3,4,5],[6,7,8],
          [0,3,6],[1,4,7],[2,5,8],
          [0,4,8],[2,4,6]
        ];
        for (const [a,b,c] of lines) {
          if (board[a] && board[a] === board[b] && board[b] === board[c]) {
            gameOver = true;
            document.getElementById('ttt-msg').textContent = `${board[a]} wins!`;
            return;
          }
        }
        if (!board.includes('')) {
          gameOver = true;
          document.getElementById('ttt-msg').textContent = "It's a draw!";
        }
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

    // 5. Rock Paper Scissors with images
    function rockPaperScissorsGame(area) {
      const choices = ['rock', 'paper', 'scissors'];
      const images = {
        rock: '🪨',
        paper: '📄',
        scissors: '✂️',
      };
      let playerScore = 0;
      let compScore = 0;
      area.innerHTML = `
        <h2 class="text-2xl mb-2">Rock Paper Scissors</h2>
        <p>Score: You <span id="rps-player-score">0</span> - Computer <span id="rps-comp-score">0</span></p>
        <div class="flex justify-center gap-6 mt-4">
          <button class="rps-img" data-choice="rock" title="Rock">${images.rock}</button>
          <button class="rps-img" data-choice="paper" title="Paper">${images.paper}</button>
          <button class="rps-img" data-choice="scissors" title="Scissors">${images.scissors}</button>
        </div>
        <p class="mt-6 text-center text-xl" id="rps-result"></p>
      `;

      const buttons = area.querySelectorAll('.rps-img');
      const result = document.getElementById('rps-result');
      const playerScoreEl = document.getElementById('rps-player-score');
      const compScoreEl = document.getElementById('rps-comp-score');

      buttons.forEach(btn => {
        btn.onclick = () => {
          const playerChoice = btn.dataset.choice;
          const compChoice = choices[Math.floor(Math.random() * choices.length)];
          let res = '';

          if (playerChoice === compChoice) {
            res = `It's a draw! Both chose ${playerChoice}`;
          } else if (
            (playerChoice === 'rock' && compChoice === 'scissors') ||
            (playerChoice === 'paper' && compChoice === 'rock') ||
            (playerChoice === 'scissors' && compChoice === 'paper')
          ) {
            res = `You win! ${playerChoice} beats ${compChoice}`;
            playerScore++;
          } else {
            res = `You lose! ${compChoice} beats ${playerChoice}`;
            compScore++;
          }
          playerScoreEl.textContent = playerScore;
          compScoreEl.textContent = compScore;
          result.textContent = res;
        };
      });
    }

    // 6. Space Defender - simple canvas shooter with multiple bullets & movement
    function spaceDefenderGame(area) {
      area.innerHTML = `
        <h2 class="text-2xl mb-2">Space Defender</h2>
        <canvas id="space-canvas" width="400" height="300" class="bg-black rounded-lg block mx-auto"></canvas>
        <p class="mt-2 text-center text-white" id="space-msg">Use arrow keys to move, space to shoot.</p>
        <p class="mt-1 text-center text-white">Score: <span id="space-score">0</span> | Lives: <span id="space-lives">3</span></p>
      `;
      const canvas = document.getElementById('space-canvas');
      const ctx = canvas.getContext('2d');
      const width = canvas.width;
      const height = canvas.height;

      let player = { x: width / 2 - 15, y: height - 40, width: 30, height: 30, speed: 5 };
      let bullets = [];
      let enemies = [];
      let score = 0;
      let lives = 3;
      let leftPressed = false;
      let rightPressed = false;
      let spacePressed = false;
      let enemySpawnTimer = 0;

      function drawPlayer() {
        ctx.fillStyle = '#0ff';
        ctx.fillRect(player.x, player.y, player.width, player.height);
      }
      function drawBullets() {
        ctx.fillStyle = '#ff0';
        bullets.forEach(b => ctx.fillRect(b.x, b.y, 5, 10));
      }
      function drawEnemies() {
        ctx.fillStyle = '#f00';
        enemies.forEach(e => ctx.fillRect(e.x, e.y, 30, 30));
      }
      function update() {
        if (leftPressed && player.x > 0) player.x -= player.speed;
        if (rightPressed && player.x + player.width < width) player.x += player.speed;

        bullets.forEach((b, i) => {
          b.y -= 7;
          if (b.y < 0) bullets.splice(i, 1);
        });

        enemies.forEach((e, i) => {
          e.y += 2;
          if (e.y > height) {
            enemies.splice(i, 1);
            lives--;
            updateLives();
            if (lives <= 0) gameOver();
          }
        });

        // Check collisions
        bullets.forEach((b, bi) => {
          enemies.forEach((e, ei) => {
            if (
              b.x < e.x + e.width &&
              b.x + 5 > e.x &&
              b.y < e.y + e.height &&
              b.y + 10 > e.y
            ) {
              bullets.splice(bi, 1);
              enemies.splice(ei, 1);
              score++;
              updateScore();
            }
          });
        });

        // Spawn enemies
        enemySpawnTimer++;
        if (enemySpawnTimer > 50) {
          enemies.push({ x: Math.random() * (width - 30), y: -30, width: 30, height: 30 });
          enemySpawnTimer = 0;
        }
      }

      function draw() {
        ctx.clearRect(0, 0, width, height);
        drawPlayer();
        drawBullets();
        drawEnemies();
      }

      function updateScore() {
        document.getElementById('space-score').textContent = score;
      }
      function updateLives() {
        document.getElementById('space-lives').textContent = lives;
      }
      function gameOver() {
        alert(`Game Over! Your score: ${score}`);
        window.location.reload();
      }

      function gameLoop() {
        update();
        draw();
        if (lives > 0) {
          requestAnimationFrame(gameLoop);
        }
      }

      document.onkeydown = e => {
        if (e.code === 'ArrowLeft') leftPressed = true;
        if (e.code === 'ArrowRight') rightPressed = true;
        if (e.code === 'Space') {
          if (!spacePressed) {
            bullets.push({ x: player.x + player.width / 2 - 2.5, y: player.y });
            spacePressed = true;
          }
        }
      };
      document.onkeyup = e => {
        if (e.code === 'ArrowLeft') leftPressed = false;
        if (e.code === 'ArrowRight') rightPressed = false;
        if (e.code === 'Space') spacePressed = false;
      };

      updateScore();
      updateLives();
      gameLoop();
    }