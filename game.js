const BOARD_SIZE = 15; // 15x15棋盘
let cellSize; // 动态计算的格子尺寸
let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0)); // 棋盘状态：0空 1黑 2白
let currentPlayer = 1; // 当前玩家（1黑先下）
let history = []; // 落子历史
let boardElement = document.getElementById('board');

// 初始化棋盘
function initBoard() {
    boardElement.innerHTML = '';
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            // 先添加所有cell再统一计算尺寸（避免渲染前获取宽度不准）
            boardElement.appendChild(cell); // 先添加元素但不设置位置

        // 所有cell创建完成后统一设置位置
        if(i === BOARD_SIZE - 1 && j === BOARD_SIZE - 1) {
            const firstCell = boardElement.querySelector('.cell');
            cellSize = parseFloat(getComputedStyle(firstCell).width);
            // 遍历所有cell设置正确位置
            boardElement.querySelectorAll('.cell').forEach((cell, index) => {
                const i = Math.floor(index / BOARD_SIZE);
                const j = index % BOARD_SIZE;
                cell.style.left = `${j * cellSize}px`;
                cell.style.top = `${i * cellSize}px`;
            });
        }
            cell.dataset.x = i;
            cell.dataset.y = j;
            cell.addEventListener('click', onCellClick);
            boardElement.appendChild(cell);
        }
    }
}

// 落子处理
function onCellClick(e) {
    let x = parseInt(e.target.dataset.x);
    let y = parseInt(e.target.dataset.y);
    if (board[x][y] !== 0) return; // 已有棋子

    // 记录历史
    history.push({x, y, player: currentPlayer});
    // 更新棋盘状态
    board[x][y] = currentPlayer;
    // 绘制棋子
    let chess = document.createElement('div');
    chess.className = `chess ${currentPlayer === 1 ? 'black' : 'white'}`;
    // 根据动态格子尺寸计算棋子位置
    chess.style.left = `${y * cellSize + cellSize * 0.1}px`;
    chess.style.top = `${x * cellSize + cellSize * 0.1}px`;
    boardElement.appendChild(chess);

    // 检查胜负
    if (checkWin(x, y)) {
        setTimeout(() => {
            //弹出alert，确认后restartGame
            const winner = currentPlayer === 1 ? "黑棋" : "白棋";
            if (confirm(`${winner}获胜！是否重新开始游戏？`)) {
                restartGame();
            }
        }, 10);
        return;
    }


    // 切换玩家
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

// 窗口调整时重新初始化棋盘
window.addEventListener('resize', initBoard);

// 重新开始游戏
function restartGame() {
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    history = [];
    currentPlayer = 1;
    initBoard();
}

// 胜负判断（检查当前落子位置是否形成五子连珠）
function checkWin(x, y) {
    const directions = [[1,0], [0,1], [1,1], [1,-1]]; // 四个方向：上下 左右 斜右下 斜左下
    for (let [dx, dy] of directions) {
        let count = 1;
        // 正向检查
        for (let i = 1; i < 5; i++) {
            let nx = x + dx * i;
            let ny = y + dy * i;
            if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) break;
            if (board[nx][ny] === currentPlayer) count++;
            else break;
        }
        // 反向检查
        for (let i = 1; i < 5; i++) {
            let nx = x - dx * i;
            let ny = y - dy * i;
            if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) break;
            if (board[nx][ny] === currentPlayer) count++;
            else break;
        }
        if (count >= 5) return true;
    }
    return false;
}

// 悔棋功能
document.getElementById('undo').addEventListener('click', () => {
    if (history.length === 0) return;
    let last = history.pop();
    board[last.x][last.y] = 0;
    // 移除最后一个棋子（假设棋子按顺序添加，直接移除最后一个子元素）
    boardElement.removeChild(boardElement.lastChild);
    currentPlayer = last.player; // 恢复当前玩家
});

// 初始加载时初始化棋盘
initBoard();

// 重新开始
document.getElementById('restart').addEventListener('click', () => {
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    history = [];
    currentPlayer = 1;
    initBoard();
});

// 初始化游戏
initBoard();