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
  SpriteTest: (ctx, width, height, props) => {
    if(!props.sprite) return;
    const sheetData = {
      cell: [ 250, 250],
      grid: [ 2, 2 ]
    }

    //- need to work on this, but try to control the nam
    const frameSkip = props.spriteSpeed || 20;
    const idx = Math.floor(props.tick / frameSkip)

    const cCoords = getCellCoords(sheetData, idx);

    const s = 1;
    const x = 0;
    const y = 0;
    const sW = cCoords.w * s;
    const sH = cCoords.h * s;

    ctx.save();
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


const getCellCoords = (sheetData, idx) => {
  const c = sheetData.grid[0];
  const r = sheetData.grid[1];

  return {
    x: (idx % c) * sheetData.cell[0],
    y: (Math.floor(idx / r) % r) * sheetData.cell[1],
    w: sheetData.cell[0],
    h: sheetData.cell[1]
  }
}