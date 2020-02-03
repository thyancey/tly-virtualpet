export const getAnimation = animationLabel => {
  return A[animationLabel] || null;
}

const A = {
  SpinSquare: (ctx, bounds, pos, props) => {
    ctx.save();
    ctx.beginPath();
    ctx.clearRect(0, 0, bounds[0], bounds[1]);
    ctx.translate(bounds[0] / 2, bounds[1] / 2);
    ctx.rotate((props.tick * Math.PI) / 180);
    ctx.fillStyle = '#4397AC';
    ctx.fillRect(
      -bounds[0] / 4,
      -bounds[1] / 4,
      bounds[0] / 2,
      bounds[1] / 2
    );
    ctx.restore();
  },
  SpinSquare2: (ctx, bounds, pos, props) => {
    ctx.save();
    ctx.beginPath();
    ctx.clearRect(0, 0, bounds[0], bounds[1]);
    ctx.translate(bounds[0] / 2, bounds[1] / 2);
    ctx.rotate((-props.tick * Math.PI) / 45);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(
      -bounds[0] / 4,
      -bounds[1] / 4,
      bounds[0] / 2,
      bounds[1] / 2
    );
    ctx.restore();
  },
  Sprite_Still: (ctx, bounds, pos, props) => {
    if(!props.sprite) return;

    const cCoords = getStillCellCoords(props.spriteInfo, props.spriteInfo.frame);

    let coords = [0, 0];
    if(pos && pos.length === 2){
      coords = pos;
    }

    const s = props.spriteInfo.scale || 1;
    const x = coords[0];
    const y = coords[1];
    const sW = cCoords.w * s;
    const sH = cCoords.h * s;

    ctx.save();
    ctx.clearRect(0, 0, bounds[0], bounds[1]);
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
  Sprite_Animated: (ctx, bounds, pos, props) => {
    if(!props.sprite) return;
    
    const frame = props.spriteInfo.frame;
    const frames = props.spriteInfo.frames;
    let idx;
    if(frame !== undefined){
      idx = frame;
    }else{
      const frameSkip = props.spriteInfo.speed || 20;
      idx = Math.floor(props.tick / frameSkip)
    }
    const cCoords = getCellCoords(props.spriteInfo, idx);

    let coords = [0, 0];
    if(pos && pos.length === 2){
      coords = pos;
    }

    const s = props.spriteInfo.scale || 1;
    const x = coords[0];
    const y = coords[1];
    const sW = cCoords.w * s;
    const sH = cCoords.h * s;

    ctx.save();
    ctx.clearRect(0, 0, bounds[0], bounds[1]);
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
  const frame = sheetData.frame;

  let idx;
  if(frame !== undefined){
    idx = frame;
  }else{
    const fl = frames[1] - frames[0] + 1;
    idx = (i % fl) + frames[0]; 
  
    if(sheetData.dir === -1){
      idx = (fl - 1) - idx;
    }
  }

  const c = sheetData.grid[0];

  return {
    x: (idx % c) * sheetData.cells[0],
    y: Math.floor(idx / c) * sheetData.cells[1],
    w: sheetData.cells[0],
    h: sheetData.cells[1]
  }
}