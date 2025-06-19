const BOARD_SIZE = 15; // 15x15棋盘
let CELL_SIZE; // 动态计算格子尺寸（根据实际布局调整）
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
            // 动态获取格子尺寸（基于CSS计算值）
        CELL_SIZE = document.querySelector('.cell')?.offsetWidth || 40;
        cell.style.left = `${j * CELL_SIZE}px`;
        cell.style.top = `${i * CELL_SIZE}px`;
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
    chess.style.left = `${y * CELL_SIZE + 4}px`;
    chess.style.top = `${x * CELL_SIZE + 4}px`;
    boardElement.appendChild(chess);

    // 检查胜负
    if (checkWin(x, y)) {
        setTimeout(() => {
            alert(`玩家${currentPlayer === 1 ? '黑棋' : '白棋'}胜利！`);
            // 胜利后自动重新开始
            document.getElementById('restart').click();
        }, 10);
        return;
    }

    // 切换玩家
    currentPlayer = currentPlayer === 1 ? 2 : 1;
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

// 重新开始
document.getElementById('restart').addEventListener('click', () => {
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0));
    history = [];
    currentPlayer = 1;
    initBoard();
});

// 初始化游戏
initBoard();