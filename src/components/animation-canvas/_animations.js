
export const getAnimation = animationLabel => {
  return A[animationLabel] || null;
}

const A = {
  SpinSquare: (ctx, width, height, props) => {
    ctx.save();
    ctx.beginPath();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(width / 2, height / 2);
    ctx.rotate((props.angle * Math.PI) / 180);
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
    ctx.rotate((-props.angle * Math.PI) / 45);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(
      -width / 4,
      -height / 4,
      width / 2,
      height / 2
    );
    ctx.restore();
  }
}
