export const getAnimation = animationLabel => {
  return A[animationLabel] || null;
}

const A = {
  SpinSquare: (ctx, width, height, props) => {
    ctx.save();
    ctx.beginPath();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);
    ctx.rotate((props.tick * Math.PI) / 180);
    ctx.fillStyle = '#4397AC';
    ctx.fillRect(
      -width / 4,
      -height / 4,
      width / 2,
      height / 2
    );
    ctx.restore();
  },
  SpinSquare2: (ctx, width, height, props) => {
    ctx.save();
    ctx.beginPath();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);
    ctx.rotate((-props.tick * Math.PI) / 45);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(
      -width / 4,
      -height / 4,
      width / 2,
      height / 2
    );
    ctx.restore();
  },
  Sprite_Still: (ctx, width, height, props) => {
    if(!props.sprite) return;

    const cCoords = getStillCellCoords(props.spriteInfo, props.spriteInfo.frame);

    const s = props.spriteInfo.scale || 1;
    const x = 0;
    const y = 0;
    const sW = cCoords.w * s;
    const sH = cCoords.h * s;

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(
      props.sprite, 
      cCoords.x, 
      cCoords.y, 
      cCoords.w, 
      cCoords.h, 
      x, 
      y, 
      sW, 
      sH);
    ctx.restore();
  },
  Sprite_Animated: (ctx, width, height, props) => {
    if(!props.sprite) return;

    const frames = props.spriteInfo.frames;
    const frameSkip = props.spriteInfo.speed || 20;

    //- need to work on this, but try to control the nam
    const idx = Math.floor(props.tick / frameSkip)
    const cCoords = getCellCoords(props.spriteInfo, idx);

    const s = props.spriteInfo.scale || 1;
    const x = 0;
    const y = 0;
    const sW = cCoords.w * s;
    const sH = cCoords.h * s;

    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(
      props.sprite, 
      cCoords.x, 
      cCoords.y, 
      cCoords.w, 
      cCoords.h, 
      x, 
      y, 
      sW, 
      sH);
    ctx.restore();
  }
}

const getStillCellCoords = (sheetData, i) => {
  const c = sheetData.grid[0];
  const r = sheetData.grid[1];
  return {
    x: (i % c) * sheetData.cells[0],
    y: (Math.floor(i / r) % r) * sheetData.cells[1],
    w: sheetData.cells[0],
    h: sheetData.cells[1]
  }
}

const getCellCoords = (sheetData, i) => {
  const frames = sheetData.frames;

  const fl = frames[1] - frames[0] + 1;
  let idx = (i % fl) + frames[0]; 

  if(sheetData.dir === -1){
    idx = (fl - 1) - idx;
  }

  const c = sheetData.grid[0];
  const r = sheetData.grid[1];

  return {
    x: (idx % c) * sheetData.cells[0],
    y: Math.floor(idx / c) * sheetData.cells[1],
    w: sheetData.cells[0],
    h: sheetData.cells[1]
  }
}