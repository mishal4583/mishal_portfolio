'use client';
import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), { ssr: false });

export default function SplineViewer({ scene, style }) {
  return (
    <Spline
      scene={scene || 'https://prod.spline.design/q4G36xD47B82i7Q6/scene.splinecode'}
      style={{ width: '100%', height: '100%', display: 'block', ...style }}
    />
  );
}
