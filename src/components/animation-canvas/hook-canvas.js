/* based off of https://css-tricks.com/using-requestanimationframe-with-react-hooks/ */
import React from 'react';

const useAnimationFrame = callback => {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();
  
  const animate = time => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime)
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }
  
  React.useEffect(() => {
    console.log('e')
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // intentionally left out dependencey, make sure the effect runs only once
}


const HookCanvas = ({onStageClick, canvasWidth, canvasHeight, contextRef}) => {
  const [count, setCount] = React.useState(0)
  
  useAnimationFrame(deltaTime => {
    // Pass on a function to the setter of the state
    // to make sure we always have the latest state
    setCount(prevCount => (prevCount + deltaTime * 0.01) % 100)
  })
    
  return (
    <canvas
      onClick={onStageClick}
      width={canvasWidth}
      height={canvasHeight}
      ref={node =>
        node ? contextRef(node.getContext('2d')) : null
      }
    />
  );
}

export default HookCanvas;