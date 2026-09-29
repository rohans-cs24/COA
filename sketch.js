// ============================================================
// MAZE COMPARISON
// BFS vs A*
// ============================================================


// ============================================================
// MAZE
// ============================================================

const maze = [
  "### ############",
  "# #     #      #",
  "# # ### # ### ##",
  "# #   #     #  #",
  "#   # ##### # ##",
  "# # # #   # # ##",
  "# # ### #  ##  #",
  "# #   # ##  # ##",
  "# ### # # # ####",
  "# #   # # #    #",
  "# # ### # # ## #",
  "# #     # #  # #",
  "# ####### ## # #",
  "# #    #   # # #",
  "#   ##   # # # #",
  "############ ###"
];


const SIZE = 16;

const CELL = 40;

const MAZE_WIDTH =
  SIZE * CELL;

const MAZE_HEIGHT =
  SIZE * CELL;


// ============================================================
// LAYOUT
// ============================================================

// Left maze
const LEFT_X = 0;

// Center comparison panel
const CENTER_WIDTH = 260;

const CENTER_X =
  MAZE_WIDTH;

const CENTER_RIGHT =
  CENTER_X + CENTER_WIDTH;

// Right maze
const RIGHT_X =
  CENTER_RIGHT;


// Total canvas width
const CANVAS_WIDTH =
  MAZE_WIDTH +
  CENTER_WIDTH +
  MAZE_WIDTH;

const CANVAS_HEIGHT =
  MAZE_HEIGHT;


// ============================================================
// SOURCE / GOAL
// ============================================================

const source = {
  r: 0,
  c: 3
};

const goal = {
  r: 15,
  c: 12
};


// ============================================================
// ALGORITHM SPEED
// ============================================================

// Smaller = faster visual exploration

const SEARCH_SPEED = 45;


// ============================================================
// BOT MOVEMENT
// ============================================================

const MOVE_TIME = 350;


// ============================================================
// BFS STATE
// ============================================================

let bfsQueue = [];

let bfsVisited = new Set();

let bfsParent = new Map();

let bfsExplored = [];

let bfsPath = [];

let bfsSearchRunning = false;

let bfsFinished = false;

let bfsFound = false;

let bfsSearchStartTime = 0;

let bfsTime = null;


// ============================================================
// BFS BOT
// ============================================================

let bfsBot = {
  r: source.r,
  c: source.c
};

let bfsBotVisual = {
  x: source.c,
  y: source.r
};

let bfsBotPathIndex = 0;

let bfsBotMoving = false;

let bfsBotStarted = false;


// ============================================================
// BFS BOT MOVEMENT
// ============================================================

let bfsMoveStartX = 0;
let bfsMoveStartY = 0;

let bfsMoveTargetX = 0;
let bfsMoveTargetY = 0;

let bfsMoveStartTime = 0;


// ============================================================
// A* STATE
// ============================================================

let aStarOpen = [];

let aStarVisited = new Set();

let aStarClosed = new Set();

let aStarParent = new Map();

let aStarG = new Map();

let aStarF = new Map();

let aStarExplored = [];

let aStarPath = [];

let aStarSearchRunning = false;

let aStarFinished = false;

let aStarFound = false;

let aStarSearchStartTime = 0;

let aStarTime = null;


// ============================================================
// A* BOT
// ============================================================

let aStarBot = {
  r: source.r,
  c: source.c
};

let aStarBotVisual = {
  x: source.c,
  y: source.r
};

let aStarBotPathIndex = 0;

let aStarBotMoving = false;

let aStarBotStarted = false;


// ============================================================
// A* BOT MOVEMENT
// ============================================================

let aStarMoveStartX = 0;
let aStarMoveStartY = 0;

let aStarMoveTargetX = 0;
let aStarMoveTargetY = 0;

let aStarMoveStartTime = 0;


// ============================================================
// START / RESET BUTTON
// ============================================================

let startButton;

let simulationRunning = false;


// ============================================================
// TIMERS
// ============================================================

let searchTimer = null;


// ============================================================
// SETUP
// ============================================================

function setup() {

  createCanvas(
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  noStroke();


  // ==========================================================
  // START BUTTON
  // ==========================================================

  startButton =
    createButton("START");

  startButton.position(
    CENTER_X + 85,
    height + 20
  );

  startButton.mousePressed(
    startSimulation
  );
}


// ============================================================
// DRAW
// ============================================================

function draw() {

  background(
    25,
    28,
    35
  );


  // ==========================================================
  // LEFT MAZE BACKGROUND
  // ==========================================================

  fill(
    40,
    44,
    52
  );

  rect(
    LEFT_X,
    0,
    MAZE_WIDTH,
    MAZE_HEIGHT
  );


  // ==========================================================
  // CENTER PANEL
  // ==========================================================

  fill(
    30,
    33,
    41
  );

  rect(
    CENTER_X,
    0,
    CENTER_WIDTH,
    MAZE_HEIGHT
  );


  // ==========================================================
  // RIGHT MAZE BACKGROUND
  // ==========================================================

  fill(
    40,
    44,
    52
  );

  rect(
    RIGHT_X,
    0,
    MAZE_WIDTH,
    MAZE_HEIGHT
  );


  // ==========================================================
  // DIVIDERS
  // ==========================================================

  stroke(
    70,
    75,
    85
  );

  strokeWeight(2);


  line(
    CENTER_X,
    0,
    CENTER_X,
    height
  );


  line(
    CENTER_RIGHT,
    0,
    CENTER_RIGHT,
    height
  );


  noStroke();


  // ==========================================================
  // LEFT BFS MAZE
  // ==========================================================

  drawMaze(
    LEFT_X
  );


  // BFS exploration

  drawBFSExploration();


  // BFS path

  drawBFSPath();


  // Source

  drawSource(
    LEFT_X
  );


  // Goal

  drawGoal(
    LEFT_X
  );


  // BFS bot

  updateBFSBot();

  drawBot(
    bfsBotVisual.x * CELL + LEFT_X + CELL / 2,
    bfsBotVisual.y * CELL + CELL / 2
  );


  // ==========================================================
  // RIGHT A* MAZE
  // ==========================================================

  drawMaze(
    RIGHT_X
  );


  // A* exploration

  drawAStarExploration();


  // A* path

  drawAStarPath();


  // Source

  drawSource(
    RIGHT_X
  );


  // Goal

  drawGoal(
    RIGHT_X
  );


  // A* bot

  updateAStarBot();

  drawBot(
    aStarBotVisual.x * CELL +
      RIGHT_X +
      CELL / 2,

    aStarBotVisual.y * CELL +
      CELL / 2
  );


  // ==========================================================
  // CENTER COMPARISON
  // ==========================================================

  drawComparison();
}


// ============================================================
// DRAW MAZE
// ============================================================

function drawMaze(
  offsetX
) {

  for (
    let row = 0;
    row < SIZE;
    row++
  ) {

    for (
      let col = 0;
      col < SIZE;
      col++
    ) {

      let x =
        offsetX +
        col * CELL;

      let y =
        row * CELL;


      // Wall

      if (
        maze[row][col] === "#"
      ) {

        fill(
          235,
          50,
          65
        );

      } else {

        fill(255);
      }


      rect(
        x,
        y,
        CELL,
        CELL
      );
    }
  }
}


// ============================================================
// SOURCE
// ============================================================

function drawSource(
  offsetX
) {

  fill(
    0,
    200,
    90
  );


  circle(
    offsetX +
      source.c * CELL +
      CELL / 2,

    source.r * CELL +
      CELL / 2,

    CELL * 0.58
  );
}


// ============================================================
// GOAL
// ============================================================

function drawGoal(
  offsetX
) {

  fill(
    255,
    60,
    70
  );


  circle(
    offsetX +
      goal.c * CELL +
      CELL / 2,

    goal.r * CELL +
      CELL / 2,

    CELL * 0.58
  );
}


// ============================================================
// BFS EXPLORATION
// ============================================================

function drawBFSExploration() {

  for (
    let i = 0;
    i < bfsExplored.length;
    i++
  ) {

    let cell =
      bfsExplored[i];


    if (
      cell.r === source.r &&
      cell.c === source.c
    ) {
      continue;
    }


    if (
      cell.r === goal.r &&
      cell.c === goal.c
    ) {
      continue;
    }


    fill(
      100,
      180,
      255
    );


    rect(
      cell.c * CELL,
      cell.r * CELL,
      CELL,
      CELL
    );
  }
}


// ============================================================
// BFS PATH
// ============================================================

function drawBFSPath() {

  if (
    !bfsFound
  ) {
    return;
  }


  for (
    let cell of bfsPath
  ) {

    if (
      cell.r === source.r &&
      cell.c === source.c
    ) {
      continue;
    }


    if (
      cell.r === goal.r &&
      cell.c === goal.c
    ) {
      continue;
    }


    fill(
      255,
      210,
      50
    );


    rect(
      cell.c * CELL,
      cell.r * CELL,
      CELL,
      CELL
    );
  }
}


// ============================================================
// A* EXPLORATION
// ============================================================

function drawAStarExploration() {

  for (
    let i = 0;
    i < aStarExplored.length;
    i++
  ) {

    let cell =
      aStarExplored[i];


    if (
      cell.r === source.r &&
      cell.c === source.c
    ) {
      continue;
    }


    if (
      cell.r === goal.r &&
      cell.c === goal.c
    ) {
      continue;
    }


    fill(
      150,
      120,
      255
    );


    rect(
      RIGHT_X +
        cell.c * CELL,

      cell.r * CELL,

      CELL,
      CELL
    );
  }
}


// ============================================================
// A* PATH
// ============================================================

function drawAStarPath() {

  if (
    !aStarFound
  ) {
    return;
  }


  for (
    let cell of aStarPath
  ) {

    if (
      cell.r === source.r &&
      cell.c === source.c
    ) {
      continue;
    }


    if (
      cell.r === goal.r &&
      cell.c === goal.c
    ) {
      continue;
    }


    fill(
      255,
      210,
      50
    );


    rect(
      RIGHT_X +
        cell.c * CELL,

      cell.r * CELL,

      CELL,
      CELL
    );
  }
}


// ============================================================
// DRAW BOT
// ============================================================

function drawBot(
  x,
  y
) {

  push();


  // ==========================================================
  // HEAD
  // ==========================================================

  fill(
    224,
    172,
    125
  );

  circle(
    x,
    y,
    CELL * 0.68
  );


  // ==========================================================
  // HAIR
  // ==========================================================

  fill(
    35,
    25,
    20
  );

  arc(
    x,
    y - 3,
    CELL * 0.68,
    CELL * 0.62,
    PI,
    TWO_PI
  );


  // ==========================================================
  // EYES
  // ==========================================================

  fill(30);

  ellipse(
    x - 7,
    y - 4,
    7,
    4
  );

  ellipse(
    x + 7,
    y - 4,
    7,
    4
  );


  // ==========================================================
  // NOSE
  // ==========================================================

  stroke(
    120,
    80,
    60
  );

  strokeWeight(1);

  line(
    x,
    y,
    x - 2,
    y + 5
  );


  // ==========================================================
  // SMILE
  // ==========================================================

  noFill();

  stroke(40);

  strokeWeight(2);

  arc(
    x,
    y + 5,
    12,
    8,
    0,
    PI
  );


  // ==========================================================
  // BODY
  // ==========================================================

  noStroke();

  fill(
    40,
    90,
    150
  );

  rect(
    x - 11,
    y + 14,
    22,
    8,
    5
  );


  pop();
}


// ============================================================
// START SIMULATION
// ============================================================

function startSimulation() {

  // If already running, reset

  if (
    simulationRunning
  ) {

    resetSimulation();

    return;
  }


  simulationRunning = true;


  startButton.html(
    "RESET"
  );


  // Reset all states

  initializeSimulation();


  // Start both algorithms

  startBFS();

  startAStar();


  // Run search steps

  searchTimer =
    setInterval(
      runSearchStep,
      SEARCH_SPEED
    );
}


// ============================================================
// INITIALIZE SIMULATION
// ============================================================

function initializeSimulation() {

  // ==========================================================
  // BFS RESET
  // ==========================================================

  bfsQueue = [];

  bfsVisited.clear();

  bfsParent.clear();

  bfsExplored = [];

  bfsPath = [];

  bfsSearchRunning = false;

  bfsFinished = false;

  bfsFound = false;

  bfsTime = null;


  bfsBot.r =
    source.r;

  bfsBot.c =
    source.c;


  bfsBotVisual.x =
    source.c;

  bfsBotVisual.y =
    source.r;


  bfsBotPathIndex = 0;

  bfsBotMoving = false;

  bfsBotStarted = false;


  // ==========================================================
  // A* RESET
  // ==========================================================

  aStarOpen = [];

  aStarVisited.clear();

  aStarClosed.clear();

  aStarParent.clear();

  aStarG.clear();

  aStarF.clear();

  aStarExplored = [];

  aStarPath = [];

  aStarSearchRunning = false;

  aStarFinished = false;

  aStarFound = false;

  aStarTime = null;


  aStarBot.r =
    source.r;

  aStarBot.c =
    source.c;


  aStarBotVisual.x =
    source.c;

  aStarBotVisual.y =
    source.r;


  aStarBotPathIndex = 0;

  aStarBotMoving = false;

  aStarBotStarted = false;
}


// ============================================================
// START BFS
// ============================================================

function startBFS() {

  bfsQueue.push({

    r: source.r,

    c: source.c

  });


  bfsVisited.add(
    getKey(source)
  );


  bfsSearchStartTime =
    millis();


  bfsSearchRunning = true;
}


// ============================================================
// BFS STEP
// ============================================================

function bfsStep() {

  if (
    !bfsSearchRunning
  ) {

    return;
  }


  // No nodes left

  if (
    bfsQueue.length === 0
  ) {

    bfsSearchRunning = false;

    bfsFinished = true;

    return;
  }


  // ==========================================================
  // DEQUEUE
  // ==========================================================

  let current =
    bfsQueue.shift();


  bfsExplored.push(
    current
  );


  // ==========================================================
  // GOAL FOUND
  // ==========================================================

  if (
    current.r === goal.r &&
    current.c === goal.c
  ) {

    bfsTime =
      millis() -
      bfsSearchStartTime;


    bfsFound = true;

    bfsSearchRunning = false;

    bfsFinished = true;


    buildBFSPath(
      current
    );


    // Start bot immediately

    startBFSBot();


    return;
  }


  // ==========================================================
  // DIRECTIONS
  // ==========================================================

  const moves = [

    {
      r: 0,
      c: 1
    },

    {
      r: 1,
      c: 0
    },

    {
      r: 0,
      c: -1
    },

    {
      r: -1,
      c: 0
    }

  ];


  // ==========================================================
  // NEIGHBORS
  // ==========================================================

  for (
    let move of moves
  ) {

    let newRow =
      current.r +
      move.r;

    let newCol =
      current.c +
      move.c;


    // Outside maze

    if (
      newRow < 0 ||
      newRow >= SIZE ||
      newCol < 0 ||
      newCol >= SIZE
    ) {

      continue;
    }


    // Wall

    if (
      maze[newRow][newCol] === "#"
    ) {

      continue;
    }


    let neighbor = {

      r: newRow,

      c: newCol

    };


    let key =
      getKey(
        neighbor
      );


    // Already visited

    if (
      bfsVisited.has(key)
    ) {

      continue;
    }


    bfsVisited.add(key);


    bfsParent.set(
      key,
      current
    );


    bfsQueue.push(
      neighbor
    );
  }
}


// ============================================================
// BUILD BFS PATH
// ============================================================

function buildBFSPath(
  endCell
) {

  bfsPath = [];

  let current =
    endCell;


  while (
    current !== undefined
  ) {

    bfsPath.push(
      current
    );


    current =
      bfsParent.get(
        getKey(current)
      );
  }


  bfsPath.reverse();
}


// ============================================================
// START BFS BOT
// ============================================================

function startBFSBot() {

  if (
    bfsBotStarted
  ) {

    return;
  }


  bfsBotStarted = true;

  bfsBotPathIndex = 0;


  moveNextBFSBot();
}


// ============================================================
// MOVE BFS BOT
// ============================================================

function moveNextBFSBot() {

  if (
    bfsBotPathIndex >=
    bfsPath.length - 1
  ) {

    bfsBotMoving = false;

    return;
  }


  let nextCell =
    bfsPath[
      bfsBotPathIndex + 1
    ];


  bfsBotMoving = true;


  bfsMoveStartX =
    bfsBot.c;

  bfsMoveStartY =
    bfsBot.r;


  bfsMoveTargetX =
    nextCell.c;

  bfsMoveTargetY =
    nextCell.r;


  bfsMoveStartTime =
    millis();


  bfsBot.r =
    nextCell.r;

  bfsBot.c =
    nextCell.c;


  bfsBotPathIndex++;
}


// ============================================================
// UPDATE BFS BOT
// ============================================================

function updateBFSBot() {

  if (
    !bfsBotMoving
  ) {

    return;
  }


  let elapsed =
    millis() -
    bfsMoveStartTime;


  let progress =
    constrain(
      elapsed / MOVE_TIME,
      0,
      1
    );


  let smooth =
    easeInOut(progress);


  bfsBotVisual.x =
    lerp(
      bfsMoveStartX,
      bfsMoveTargetX,
      smooth
    );


  bfsBotVisual.y =
    lerp(
      bfsMoveStartY,
      bfsMoveTargetY,
      smooth
    );


  if (
    progress >= 1
  ) {

    bfsBotVisual.x =
      bfsMoveTargetX;

    bfsBotVisual.y =
      bfsMoveTargetY;


    bfsBotMoving = false;


    setTimeout(
      moveNextBFSBot,
      20
    );
  }
}


// ============================================================
// START A*
// ============================================================

function startAStar() {

  let startKey =
    getKey(source);


  aStarG.set(
    startKey,
    0
  );


  aStarF.set(
    startKey,
    heuristic(
      source,
      goal
    )
  );


  aStarOpen.push({
    r: source.r,
    c: source.c,
    f: heuristic(
      source,
      goal
    )
  });


  aStarSearchStartTime =
    millis();


  aStarSearchRunning = true;
}


// ============================================================
// A* STEP
// ============================================================

function aStarStep() {

  if (
    !aStarSearchRunning
  ) {

    return;
  }


  // ==========================================================
  // NO PATH
  // ==========================================================

  if (
    aStarOpen.length === 0
  ) {

    aStarSearchRunning = false;

    aStarFinished = true;

    return;
  }


  // ==========================================================
  // SORT OPEN LIST
  // ==========================================================

  aStarOpen.sort(
    function (a, b) {

      return a.f - b.f;

    }
  );


  // ==========================================================
  // GET LOWEST F
  // ==========================================================

  let current =
    aStarOpen.shift();


  let currentKey =
    getKey(current);


  // Ignore duplicate closed nodes

  if (
    aStarClosed.has(
      currentKey
    )
  ) {

    return;
  }


  // ==========================================================
  // CLOSE NODE
  // ==========================================================

  aStarClosed.add(
    currentKey
  );


  aStarExplored.push(
    current
  );


  // ==========================================================
  // GOAL FOUND
  // ==========================================================

  if (
    current.r === goal.r &&
    current.c === goal.c
  ) {

    aStarTime =
      millis() -
      aStarSearchStartTime;


    aStarFound = true;

    aStarSearchRunning = false;

    aStarFinished = true;


    buildAStarPath(
      current
    );


    // Start bot immediately

    startAStarBot();


    return;
  }


  // ==========================================================
  // DIRECTIONS
  // ==========================================================

  const moves = [

    {
      r: 0,
      c: 1
    },

    {
      r: 1,
      c: 0
    },

    {
      r: 0,
      c: -1
    },

    {
      r: -1,
      c: 0
    }

  ];


  // ==========================================================
  // NEIGHBORS
  // ==========================================================

  for (
    let move of moves
  ) {

    let newRow =
      current.r +
      move.r;

    let newCol =
      current.c +
      move.c;


    // Outside maze

    if (
      newRow < 0 ||
      newRow >= SIZE ||
      newCol < 0 ||
      newCol >= SIZE
    ) {

      continue;
    }


    // Wall

    if (
      maze[newRow][newCol] === "#"
    ) {

      continue;
    }


    let neighbor = {

      r: newRow,

      c: newCol

    };


    let key =
      getKey(
        neighbor
      );


    // Closed

    if (
      aStarClosed.has(key)
    ) {

      continue;
    }


    // ========================================================
    // CALCULATE G
    // ========================================================

    let currentG =
      aStarG.get(
        currentKey
      );


    let tentativeG =
      currentG + 1;


    let oldG =
      aStarG.get(
        key
      );


    // ========================================================
    // BETTER PATH
    // ========================================================

    if (
      oldG === undefined ||
      tentativeG < oldG
    ) {

      aStarParent.set(
        key,
        current
      );


      aStarG.set(
        key,
        tentativeG
      );


      let f =
        tentativeG +
        heuristic(
          neighbor,
          goal
        );


      aStarF.set(
        key,
        f
      );


      aStarOpen.push({

        r: newRow,

        c: newCol,

        f: f

      });


      aStarVisited.add(
        key
      );
    }
  }
}


// ============================================================
// HEURISTIC
// ============================================================

function heuristic(
  a,
  b
) {

  return (
    Math.abs(
      a.r - b.r
    ) +

    Math.abs(
      a.c - b.c
    )
  );
}


// ============================================================
// BUILD A* PATH
// ============================================================

function buildAStarPath(
  endCell
) {

  aStarPath = [];

  let current =
    endCell;


  while (
    current !== undefined
  ) {

    aStarPath.push(
      current
    );


    current =
      aStarParent.get(
        getKey(current)
      );
  }


  aStarPath.reverse();
}


// ============================================================
// START A* BOT
// ============================================================

function startAStarBot() {

  if (
    aStarBotStarted
  ) {

    return;
  }


  aStarBotStarted = true;

  aStarBotPathIndex = 0;


  moveNextAStarBot();
}


// ============================================================
// MOVE A* BOT
// ============================================================

function moveNextAStarBot() {

  if (
    aStarBotPathIndex >=
    aStarPath.length - 1
  ) {

    aStarBotMoving = false;

    return;
  }


  let nextCell =
    aStarPath[
      aStarBotPathIndex + 1
    ];


  aStarBotMoving = true;


  aStarMoveStartX =
    aStarBot.c;

  aStarMoveStartY =
    aStarBot.r;


  aStarMoveTargetX =
    nextCell.c;

  aStarMoveTargetY =
    nextCell.r;


  aStarMoveStartTime =
    millis();


  aStarBot.r =
    nextCell.r;

  aStarBot.c =
    nextCell.c;


  aStarBotPathIndex++;
}


// ============================================================
// UPDATE A* BOT
// ============================================================

function updateAStarBot() {

  if (
    !aStarBotMoving
  ) {

    return;
  }


  let elapsed =
    millis() -
    aStarMoveStartTime;


  let progress =
    constrain(
      elapsed / MOVE_TIME,
      0,
      1
    );


  let smooth =
    easeInOut(progress);


  aStarBotVisual.x =
    lerp(
      aStarMoveStartX,
      aStarMoveTargetX,
      smooth
    );


  aStarBotVisual.y =
    lerp(
      aStarMoveStartY,
      aStarMoveTargetY,
      smooth
    );


  if (
    progress >= 1
  ) {

    aStarBotVisual.x =
      aStarMoveTargetX;

    aStarBotVisual.y =
      aStarMoveTargetY;


    aStarBotMoving = false;


    setTimeout(
      moveNextAStarBot,
      20
    );
  }
}


// ============================================================
// SEARCH LOOP
// ============================================================

function runSearchStep() {

  // ==========================================================
  // BFS
  // ==========================================================

  if (
    bfsSearchRunning
  ) {

    bfsStep();
  }


  // ==========================================================
  // A*
  // ==========================================================

  if (
    aStarSearchRunning
  ) {

    aStarStep();
  }


  // ==========================================================
  // BOTH SEARCHES FINISHED
  // ==========================================================

  if (
    !bfsSearchRunning &&
    !aStarSearchRunning
  ) {

    if (
      searchTimer !== null
    ) {

      clearInterval(
        searchTimer
      );

      searchTimer = null;
    }
  }
}


// ============================================================
// COMPARISON TABLE
// ============================================================

function drawComparison() {

  const centerX =
    CENTER_X +
    CENTER_WIDTH / 2;


  // ==========================================================
  // TITLE
  // ==========================================================

  fill(255);

  textAlign(
    CENTER,
    CENTER
  );

  textSize(25);

  text(
    "COMPARISON",
    centerX,
    55
  );


  // ==========================================================
  // TABLE
  // ==========================================================

  const tableX =
    CENTER_X + 20;

  const tableY =
    110;

  const tableW =
    CENTER_WIDTH - 40;

  const rowH =
    75;


  // ==========================================================
  // HEADER
  // ==========================================================

  fill(
    50,
    54,
    64
  );

  rect(
    tableX,
    tableY,
    tableW,
    rowH
  );


  fill(
    150,
    150,
    160
  );

  textSize(17);

  text(
    "ALGORITHM",
    tableX + 60,
    tableY + 25
  );


  text(
    "TIME",
    tableX + 190,
    tableY + 25
  );


  // ==========================================================
  // BFS ROW
  // ==========================================================

  fill(
    40,
    44,
    52
  );

  rect(
    tableX,
    tableY + rowH,
    tableW,
    rowH
  );


  fill(255);

  textSize(20);

  text(
    "BFS",
    tableX + 60,
    tableY + rowH + 37
  );


  drawTimeValue(
    bfsTime,
    tableX + 190,
    tableY + rowH + 37,
    bfsSearchRunning
  );


  // ==========================================================
  // A* ROW
  // ==========================================================

  fill(
    40,
    44,
    52
  );

  rect(
    tableX,
    tableY + rowH * 2,
    tableW,
    rowH
  );


  fill(255);

  textSize(20);

  text(
    "A*",
    tableX + 60,
    tableY + rowH * 2 + 37
  );


  drawTimeValue(
    aStarTime,
    tableX + 190,
    tableY + rowH * 2 + 37,
    aStarSearchRunning
  );


  // ==========================================================
  // STATUS
  // ==========================================================

  let statusY =
    390;


  fill(
    150,
    150,
    160
  );

  textSize(16);

  text(
    "SEARCH STATUS",
    centerX,
    statusY
  );


  // BFS status

  fill(255);

  textSize(18);

  text(
    getStatus(
      bfsSearchRunning,
      bfsFound
    ),
    centerX,
    statusY + 40
  );


  // A* status

  text(
    getStatus(
      aStarSearchRunning,
      aStarFound
    ),
    centerX,
    statusY + 75
  );


  // ==========================================================
  // LEGEND
  // ==========================================================

  fill(
    100,
    180,
    255
  );

  rect(
    centerX - 85,
    520,
    18,
    18
  );


  fill(255);

  textAlign(
    LEFT,
    CENTER
  );

  textSize(14);

  text(
    "Explored",
    centerX - 60,
    529
  );


  fill(
    255,
    210,
    50
  );

  rect(
    centerX - 85,
    555,
    18,
    18
  );


  fill(255);

  text(
    "Shortest path",
    centerX - 60,
    564
  );


  textAlign(
    CENTER,
    CENTER
  );
}


// ============================================================
// TIME VALUE
// ============================================================

function drawTimeValue(
  time,
  x,
  y,
  running
) {

  fill(255);

  textSize(18);


  if (
    time !== null
  ) {

    text(
      time.toFixed(1) + " ms",
      x,
      y
    );

    return;
  }


  if (
    running
  ) {

    text(
      "...",
      x,
      y
    );

    return;
  }


  text(
    "-",
    x,
    y
  );
}


// ============================================================
// STATUS
// ============================================================

function getStatus(
  running,
  found
) {

  if (
    found
  ) {

    return "FOUND";
  }


  if (
    running
  ) {

    return "SEARCHING...";
  }


  return "WAITING";
}


// ============================================================
// RESET SIMULATION
// ============================================================

function resetSimulation() {

  if (
    searchTimer !== null
  ) {

    clearInterval(
      searchTimer
    );

    searchTimer = null;
  }


  simulationRunning = false;


  startButton.html(
    "START"
  );


  // ==========================================================
  // RESET BFS
  // ==========================================================

  bfsQueue = [];

  bfsVisited.clear();

  bfsParent.clear();

  bfsExplored = [];

  bfsPath = [];

  bfsSearchRunning = false;

  bfsFinished = false;

  bfsFound = false;

  bfsTime = null;


  bfsBot.r = source.r;

  bfsBot.c = source.c;

  bfsBotVisual.x = source.c;

  bfsBotVisual.y = source.r;

  bfsBotPathIndex = 0;

  bfsBotMoving = false;

  bfsBotStarted = false;


  // ==========================================================
  // RESET A*
  // ==========================================================

  aStarOpen = [];

  aStarVisited.clear();

  aStarClosed.clear();

  aStarParent.clear();

  aStarG.clear();

  aStarF.clear();

  aStarExplored = [];

  aStarPath = [];

  aStarSearchRunning = false;

  aStarFinished = false;

  aStarFound = false;

  aStarTime = null;


  aStarBot.r = source.r;

  aStarBot.c = source.c;

  aStarBotVisual.x = source.c;

  aStarBotVisual.y = source.r;

  aStarBotPathIndex = 0;

  aStarBotMoving = false;

  aStarBotStarted = false;
}


// ============================================================
// EASE IN / OUT
// ============================================================

function easeInOut(t) {

  return t < 0.5

    ? 2 * t * t

    : 1 -
      Math.pow(
        -2 * t + 2,
        2
      ) / 2;
}


// ============================================================
// CELL KEY
// ============================================================

function getKey(
  cell
) {

  return (
    `${cell.r},${cell.c}`
  );
}