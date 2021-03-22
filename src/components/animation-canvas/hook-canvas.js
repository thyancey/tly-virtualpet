import React, { useEffect } from 'react';

const HookCanvas = ({ onStageClick, canvasWidth, canvasHeight, drawCommands, drawProps, tick }) => {
  const [canvasRef, setCanvasRef] = React.useState(0);
  
  useEffect(() => {
    if(canvasRef){
      drawCommands.forEach(dC => {
        dC(canvasRef, { ...drawProps, tick: tick });
      });
    }
  }, [ tick, canvasRef, drawCommands, drawProps ]);

  return (
    <canvas
      onClick={onStageClick}
      width={canvasWidth}
      height={canvasHeight}
      ref={node =>
        node ? setCanvasRef(node.getContext('2d')) : null
      }
    />
  );
}

export default HookCanvas;