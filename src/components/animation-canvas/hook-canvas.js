import React, { Component } from 'react';

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
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once
}

// export default class HookCanvas extends Component {
//   shouldComponentUpdate(nextProps) {
//     if(nextProps.canvasWidth !== this.props.canvasWidth || nextProps.canvasHeight !== this.props.canvasHeight){
//       return true;
//     }
//     return false;
//   }

//   render() {
//     // console.log('R: HookCanvas');
//     return (
//       <canvas
//         onClick={this.props.onStageClick}
//         width={this.props.canvasWidth}
//         height={this.props.canvasHeight}
//         ref={node =>
//           node ? this.props.contextRef(node.getContext('2d')) : null
//         }
//       />
//     );
//   }
// }

const HookCanvas = () => {
  const [count, setCount] = React.useState(0)
  
  useAnimationFrame(deltaTime => {
    // Pass on a function to the setter of the state
    // to make sure we always have the latest state
    setCount(prevCount => (prevCount + deltaTime * 0.01) % 100)
  })
    
  return (
    <canvas
      onClick={this.props.onStageClick}
      width={this.props.canvasWidth}
      height={this.props.canvasHeight}
      ref={node =>
        node ? this.props.contextRef(node.getContext('2d')) : null
      }
    />
  );
}

export default HookCanvas;