export const getAnimation = animationLabel => {
  return A[animationLabel] || null;
}

const A = {
  DebugDraw: (ctx, bounds, coords, props) => {
    ctx.save();
    ctx.beginPath();
    const CIRCLE_SIZE = 20;

    // console.log('doing ', coords[0])
    ctx.arc(coords[0], coords[1], CIRCLE_SIZE, 0, 2 * Math.PI);
    // ctx.arc(0, 0, CIRCLE_SIZE, 0, 2 * Math.PI);
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#000000';

    ctx.stroke();
    
    ctx.restore();
  },
  SpinSquare: (ctx, bounds, pos, direction, props) => {
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
  SpinSquare2: (ctx, bounds, pos, direction, props) => {
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
  Sprite_Still: (ctx, bounds, pos, direction, props) => {
    if(!props.sprite) return;

    const cCoords = getStillCellCoords(props.spriteInfo, props.spriteInfo.frame);

    let coords = [0, 0];
    if(pos && pos.length === 2){
      coords = pos;
    }

    const s = (props.spriteInfo.scale || 1) * (global.spriteScale || 1);
    const x = coords[0];
    const y = coords[1];
    const sW = cCoords.w * s;
    const sH = cCoords.h * s;

    ctx.save();
    ctx.clearRect(0, 0, bounds[0], bounds[1]);
    if(direction === -1){
      ctx.translate(sW, 0);
    }
    ctx.scale(direction, 1);
    ctx.drawImage(
      props.sprite, 
      cCoords.x, 
      cCoords.y, 
      cCoords.w, 
      cCoords.h, 
      x * direction, 
      y, 
      sW, 
      sH);
    ctx.restore();
  },
  Sprite_Animated: (ctx, bounds, pos, direction, props) => {
    if(!props.sprite) return;
    
    const frame = props.spriteInfo.frame;
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

    const s = (props.spriteInfo.scale || 1) * (global.spriteScale || 1);
    const x = coords[0];
    const y = coords[1];
    const sW = cCoords.w * s;
    const sH = cCoords.h * s;

    
    // console.log('sprite is ', props.spriteInfo.frame, idx);

    ctx.save();
    ctx.clearRect(0, 0, bounds[0], bounds[1]);
    if(direction === -1){
      ctx.translate(sW, 0);
    }
    ctx.scale(direction, 1);
    ctx.drawImage(
      props.sprite, 
      cCoords.x, 
      cCoords.y, 
      cCoords.w, 
      cCoords.h, 
      x * direction, 
      y, 
      sW, 
      sH);

      // console.log('overlay sprite', props.overlaySprite)
    props.overlaySprite && ctx.drawImage(
        props.overlaySprite, 
        cCoords.x, 
        cCoords.y, 
        cCoords.w, 
        cCoords.h, 
        x * direction, 
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

  let fIdx;
  if(frame !== undefined){
    fIdx = frame;
  }else{
    fIdx = frames[i % frames.length]; 
    if(sheetData.dir === -1){
      //- TODO, is this right?
      fIdx = (frames.length - 1) - fIdx;
    }
  }

  const c = sheetData.grid[0];

  return {
    x: (fIdx % c) * sheetData.cells[0],
    y: Math.floor(fIdx / c) * sheetData.cells[1],
    w: sheetData.cells[0],
    h: sheetData.cells[1]
  }
}