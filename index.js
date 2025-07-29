const rows=20;
const cols=20;
let grid=[];
const gridElement=document.getElementById("grid");
let mouseDown=false;

function createGrid() {
  gridElement.innerHTML="";
  grid=[];
  for(let i=0; i<rows;i++) {
    const row=[];
    for (let j=0;j<cols;j++) {
      const cell=document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row=i;
      cell.dataset.col=j;
      if (i===0 && j===0) cell.classList.add("start");
      if (i===rows-1 && j===cols-1) cell.classList.add("end");
      cell.addEventListener("mousedown",(e)=>{
        e.preventDefault();
        mouseDown = true;
        toggleWall(cell);
      });
      cell.addEventListener("mouseover",()=>{
        if (mouseDown) toggleWall(cell);
      });
      cell.addEventListener("touchstart",(e)=>{
        e.preventDefault();
        toggleWall(cell);
      },{ passive:false});
      gridElement.appendChild(cell);
      row.push({element:cell,isWall:false,visited:false,parent:null});
    }
    grid.push(row);
  }
}
document.body.addEventListener("mouseup",()=>(mouseDown = false));
document.body.addEventListener("touchend",()=>(mouseDown = false));
document.body.addEventListener("touchcancel",()=>(mouseDown = false));
function toggleWall(cell) {
  const row=+cell.dataset.row;
  const col=+cell.dataset.col;
  if (cell.classList.contains("start") || cell.classList.contains("end")) return;
  cell.classList.toggle("wall");
  grid[row][col].isWall=!grid[row][col].isWall;
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function startDijkstra() {
  const visited = new Set();
  const queue = [[0, 0]];
  const directions = [
                       [0, 1],
                       [1, 0],
                       [-1, 0],
                       [0, -1],
                     ];
  while (queue.length>0) {
    const [r,c]=queue.shift();
    const node=grid[r][c];
    if (node.visited || node.isWall) continue;
    node.visited=true;
    if (!node.element.classList.contains("start") && !node.element.classList.contains("end"))
      node.element.classList.add("visited");
    await sleep(10);
    if (r===rows-1 && c===cols-1) {
      reconstructPath();
      return;
    }

    for (const [dr,dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 && nr < rows &&
        nc >= 0 && nc < cols &&
        !grid[nr][nc].visited &&
        !grid[nr][nc].isWall
      ) {
        if (!grid[nr][nc].parent) grid[nr][nc].parent = [r, c];
        queue.push([nr, nc]);
      }
    }
  }
}

async function reconstructPath() {
  let r = rows - 1;
  let c = cols - 1;
  while (grid[r][c].parent) {
    const [pr, pc] = grid[r][c].parent;
    if (!grid[pr][pc].element.classList.contains("start"))
      grid[pr][pc].element.classList.add("path");
    [r, c] = [pr, pc];
    await sleep(30);
  }
}

function clearGrid() {
  createGrid();
}

createGrid();
