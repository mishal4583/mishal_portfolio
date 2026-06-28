'use client';

import Spline from '@splinetool/react-spline';

export default function SplineBackground() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 0, // Ensure it's behind other content
      overflow: 'hidden', // Prevent scrollbars if content overflows
    }}>
      {/* The Spline component renders your 3D scene */}
      <Spline scene="https://prod.spline.design/q4G36xD47B82i7Q6/scene.splinecode" 
 />
    </div>
  );
}