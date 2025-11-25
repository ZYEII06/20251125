let spriteSheet;      // 預設的圖片精靈 (combine.png)
let moveSheet;        // 移動圖片精靈 (move.png)
let jumpSheet;        // 跳躍圖片精靈 (jumpp.png)

let animation = [];       // 預設動畫的影格
let moveAnimation = [];   // 移動動畫的影格
let jumpAnimation = [];   // 跳躍動畫的影格

const defaultNumFrames = 9;   // combine.png 的影格數
const moveNumFrames = 9;      // move.png 的影格數
const jumpNumFrames = 6;      // jumpp.png 的影格數

let defaultFrameWidth;        // combine.png 單一影格的寬度
let moveFrameWidth;           // move.png 單一影格的寬度
let jumpFrameWidth;           // jumpp.png 單一影格的寬度

// 追蹤動畫狀態
let isMovingRight = false; // 右鍵是否被按下
let isJumping = false;     // 上鍵是否正在執行跳躍序列

// 追蹤角色位置
let charX;                 // 角色 X 座標 (保持中央)
let charY;                 // 角色 Y 座標 (繪製位置)
let groundY;               // 角色地面 Y 座標 (初始靜止位置)

// 跳躍控制參數
const jumpHeight = 100;    // 跳躍的最大高度
let jumpCounter = 0;       // 跳躍計數器
const jumpDuration = 15;   // 跳躍總持續時間（約等於 1.5 秒，因為 frameRate=10）

function preload() {
  spriteSheet = loadImage('1/123456789/combine.png');
  moveSheet = loadImage('1/left right/move.png'); 
  jumpSheet = loadImage('1/jump/jumpp.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(10); 

  // 初始化地面和角色位置
  charX = width / 2;
  groundY = height / 2; 
  charY = groundY;

  // --- 處理預設圖片精靈 (combine.png) ---
  defaultFrameWidth = spriteSheet.width / defaultNumFrames;
  for (let i = 0; i < defaultNumFrames; i++) {
    let frame = spriteSheet.get(i * defaultFrameWidth, 0, defaultFrameWidth, spriteSheet.height);
    animation.push(frame);
  }

  // --- 處理移動圖片精靈 (move.png) ---
  moveFrameWidth = moveSheet.width / moveNumFrames; 
  for (let i = 0; i < moveNumFrames; i++) {
    let frame = moveSheet.get(i * moveFrameWidth, 0, moveFrameWidth, moveSheet.height);
    moveAnimation.push(frame);
  }

  // --- 處理跳躍圖片精靈 (jumpp.png) ---
  jumpFrameWidth = jumpSheet.width / jumpNumFrames; 
  for (let i = 0; i < jumpNumFrames; i++) {
    let frame = jumpSheet.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpSheet.height);
    jumpAnimation.push(frame);
  }
}

function draw() {
  background('#a8dadc');
  
  let currentAnimation;
  let currentFrameWidth;
  let currentSheetHeight;
  
  // --- 處理單次跳躍的位移邏輯 ---
  if (isJumping) {
    // 透過餘弦波函數 (cos) 實現從 groundY 向上再向下的平滑跳躍
    let t = map(jumpCounter, 0, jumpDuration, 0, PI);
    let displacement = -sin(t) * jumpHeight; // 使用負號表示向上移動
    charY = groundY + displacement;
    
    // 遞增計數器
    jumpCounter++;

    // 檢查跳躍是否結束
    if (jumpCounter > jumpDuration) {
      isJumping = false;
      jumpCounter = 0;
      charY = groundY; // 確保回到地面位置
    }
  }


  // --- 動畫優先級判斷邏輯 ---
  if (isJumping) {
    // 優先級 1: 正在跳躍中
    currentAnimation = jumpAnimation;
    currentFrameWidth = jumpFrameWidth;
    currentSheetHeight = jumpSheet.height;
  } else if (isMovingRight && !keyIsDown(LEFT_ARROW)) { 
    // 優先級 2: 正在移動 (右鍵按下，且左鍵未按)
    currentAnimation = moveAnimation;
    currentFrameWidth = moveFrameWidth;
    currentSheetHeight = moveSheet.height;
  } else {
    // 預設狀態: 既沒在跳躍，也沒在移動 (或左鍵正在按下時)
    currentAnimation = animation;
    currentFrameWidth = defaultFrameWidth;
    currentSheetHeight = spriteSheet.height;
  }

  // 顯示動畫
  // 角色繪製的中心點位置是 (charX, charY)
  image(
    currentAnimation[frameCount % currentAnimation.length], 
    charX - currentFrameWidth / 2, 
    charY - currentSheetHeight / 2
  );
  
  // 由於您要求「沒有按下下鍵鍵盤時，就恢復顯示 spite sheet」，
  // 但由於我們沒有給下鍵動作指定動畫，且 `isJumping` 和 `isMovingRight` 狀態已覆蓋所有情況，
  // 這裡下鍵的按鍵狀態不會影響當前顯示的動畫，它總是會滿足一個條件。
  // 如果要嚴格遵守「沒有按下下鍵時恢復」，則需要在這個動畫判斷區塊加入對下鍵狀態的檢查。
  // 但這會使邏輯更為複雜，故沿用邏輯優先級，下鍵不影響動畫。
}


// --- 鍵盤控制函式 (處理狀態) ---

function keyPressed() {
  // 處理右鍵 (動畫狀態)
  if (keyCode === RIGHT_ARROW) {
    isMovingRight = true;
  }
  
  // 處理上鍵 (觸發單次跳躍序列)
  // 只有當前不在跳躍時，才能再次跳躍
  if (keyCode === UP_ARROW && !isJumping) {
    isJumping = true;
    jumpCounter = 0; // 重設計數器
  }
  
  // 處理下鍵
  if (keyCode === DOWN_ARROW) {
    // 根據您的需求，下鍵不進行位移，也不影響動畫切換，故這裡留空
  }
}

function keyReleased() {
  // 處理右鍵釋放
  if (keyCode === RIGHT_ARROW) {
    isMovingRight = false;
  }
  
  // 處理上鍵釋放 (跳躍是單次序列，不需要在放開時取消，除非強制中斷)
  
  // 處理下鍵釋放
  // 此處不影響動畫狀態，因為下鍵不控制特定的動畫。
}


function windowResized() {
  // 當視窗大小改變時，調整畫布大小並更新角色 X, Y, groundY
  resizeCanvas(windowWidth, windowHeight);
  // 更新地面和角色位置
  charX = width / 2;
  groundY = height / 2;
  // 確保角色在 resize 後回到地面
  if (!isJumping) {
    charY = groundY;
  }
}