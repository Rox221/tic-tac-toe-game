document.addEventListener("DOMContentLoaded", () => {
  const modeBtn = document.getElementById('modeBtn');
  const modeDropdown = document.getElementById('dropdownContent');
  let selectedMode;
  
  modeBtn.addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent event from reaching document click listener

    // Toggle the dropdown content
    modeDropdown.style.display = modeDropdown.style.display === 'block' ? 'none' : 'block';
  });

  modeDropdown.addEventListener('click', function (event) {
    // Check if the clicked element is a link inside the dropdown content
    if (event.target.tagName === 'A') {
       selectedMode = event.target.getAttribute('data-mode');
      


      // Close the dropdown after a short delay
      setTimeout(function () {
        modeDropdown.style.display = 'none';
      }, 300);
    }
  });
  
  // Close the dropdown when clicking outside the button or dropdown content
 document.addEventListener('click', function (event) {
    if (!modeBtn.contains(event.target) && !modeDropdown.contains(event.target)) {
      modeDropdown.style.display = 'none';
    }
  });
  
 
         
  function selectSymbol(symbol) {
  currentPlayerSymbol = symbol;
}
  
  
 const board = document.getElementById("board");
 const cells = document.querySelectorAll('.cell');
 let currentPlayerSymbol = "X";
 let isFirstMove = true;
  

cells.forEach(cell => {
    cell.addEventListener("click", () => handleCellClick(cell));
  });

function handleCellClick(cell) {
    if (!cell.textContent) {
      cell.textContent = currentPlayerSymbol;
      cell.classList.add(currentPlayerSymbol === 'X' ? 'symbol-x' : 'symbol-o'); //Add class names
  
  if (currentPlayerSymbol === 'X') {
      cell.style.color = '#ff2800'; // Red color for 'X'
    } else {
      cell.style.color = '#005a92'; // Blue color for 'O'
    }
      if (checkWinner()) {
  setTimeout(() => {
     displayMessageBox(`Player ${currentPlayerSymbol} wins!`);
     restartGame();}, 800);
      }
      else{
        currentPlayerSymbol = currentPlayerSymbol === "X" ? "O" : "X";
        if (currentPlayerSymbol === "O") {
          setTimeout(() => makeComputerMove(), 500);
        }
      }
    }
  }

function makeComputerMove() {
  const emptyCells = [...cells].filter(cell => !cell.textContent);

  // Check for a winning move or blocking move
  for (const cell of emptyCells) {
    cell.textContent = currentPlayerSymbol;

    if (checkWinner() === currentPlayerSymbol) {
      setTimeout(() => {
        displayMessageBox(`Computer wins!`);
        restartGame();
      }, 800);
      return;
    }

    cell.textContent = ""; // Reset the cell for the next iteration
  }

  // Check for a tie
  if (emptyCells.length === 0) {
    displayMessageBox("It's a tie!");
    restartGame();
    return;
  }

  // Make a random move
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const computerMove = emptyCells[randomIndex];
  computerMove.textContent = currentPlayerSymbol;
  computerMove.classList.add('symbol-o'); // Add class for styling
  currentPlayerSymbol = currentPlayerSymbol === 'X' ? 'O' : 'X'; // Update symbol after move
  
  // Delay before checking for a winner
  setTimeout(() => {
    if (checkWinner()) {
      displayMessageBox("Computer wins!");
      restartGame();
    } else if (emptyCells.length === 0) {
      displayMessageBox("It's a tie!");
      restartGame();
    }
  }, 500);
}

function checkWinner() {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (
      cells[i * 3].textContent !== "" &&
      cells[i * 3].textContent === cells[i * 3 + 1].textContent &&
      cells[i * 3 + 1].textContent === cells[i * 3 + 2].textContent
    ) {
      drawWinningLine([cells[i * 3], cells[i * 3 + 1], cells[i * 3 + 2]]); 
      return cells[i * 3].textContent;
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (
      cells[i].textContent !== "" &&
      cells[i].textContent === cells[i + 3].textContent &&
      cells[i + 3].textContent === cells[i + 6].textContent
    ) {
      drawWinningLine([cells[i], cells[i + 3], cells[i + 6]]); // Draw the winning line
      
      return cells[i].textContent;
    }
  }

  // Check diagonals
  if (
    cells[0].textContent !== "" &&
    cells[0].textContent === cells[4].textContent &&
    cells[4].textContent === cells[8].textContent
  ) {
    drawWinningLine([cells[0], cells[4], cells[8]]); // Draw the winning line
   
    return cells[0].textContent;
  }

  if (
    cells[2].textContent !== "" &&
    cells[2].textContent === cells[4].textContent &&
    cells[4].textContent === cells[6].textContent
  ) {
    drawWinningLine([cells[2], cells[4], cells[6]]); // Draw the winning line
 
    return cells[2].textContent;
  }
  return null;
}

  
function drawWinningLine(cells) {
  const line = document.createElement('div');
  line.classList.add('winning-line');
  document.body.appendChild(line);

  const firstCellRect = cells[0].getBoundingClientRect();
  const lastCellRect = cells[cells.length - 1].getBoundingClientRect();

  const startX = firstCellRect.left + firstCellRect.width / 2;
  const startY = firstCellRect.top + firstCellRect.height / 2;
  const endX = lastCellRect.left + lastCellRect.width / 2;
  const endY = lastCellRect.top + lastCellRect.height / 2;

  const dx = endX - startX;
  const dy = endY - startY;

  line.style.width = `${Math.sqrt(dx ** 2 + dy ** 2)}px`;
  line.style.height = '3px';  // line thickness
  line.style.position = 'absolute';
  line.style.top = `${startY - 1.5}px`; // Offset for line thickness
  line.style.left = `${startX}px`;
  line.style.background = '#000';  // line color
  line.style.transformOrigin = '0 0';
  line.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
}

const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const closeBtn = document.getElementById('closeBtn');

closeBtn.addEventListener('click', function () {
    messageBox.style.display = 'none';
    restartGame();
  });

function displayMessageBox(message) {
    messageText.textContent = message;
    messageBox.style.display = 'block';
}

const restartBtn = document.querySelector('.restart-btn-container button');
  restartBtn.addEventListener('click', restartGame);

function restartGame() {
  cells.forEach(cell => {
    cell.textContent = ''; // Clear the cell content
    cell.classList.remove('x', 'o' ,'winning-cell'); // Remove X and O classes
    cell.style.color = ''; 
  });
  // Remove the winning line element
  const winningLine = document.querySelector('.winning-line');
  if (winningLine) {
    winningLine.remove();
  }
  
  currentPlayerSymbol = 'X';
}

//Hide the about paragraph 
  const aboutBtn = document.getElementById("aboutBtn");
  const aboutParagraph = document.getElementById("aboutParagraph");

  aboutParagraph.style.display = 'none'; // Set the initial state to hidden

  aboutBtn.addEventListener("click", function () {
    // Toggle the visibility of the paragraph
    aboutParagraph.style.display = (aboutParagraph.style.display === 'none') ? 'block' : 'none';
  });

  
});
