'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ImageSegmenter, FilesetResolver } from '@mediapipe/tasks-vision';

export type SceneType = 'NEON_DISTRICT' | 'ZEN_GARDEN' | 'PRO_STUDIO' | 'MAIN_STAGE' | 'NEBULA' | 'TOKYO' | 'MARS' | 'GLITCH';

interface Props {
  backgroundUrl: string;
  isLive?: boolean;
  sceneType?: SceneType;
}

export default function VirtualStageCamera({ backgroundUrl, isLive = true, sceneType = 'NEON_DISTRICT' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [segmenter, setSegmenter] = useState<ImageSegmenter | null>(null);

  // Initialize AI Background Removal
  useEffect(() => {
    async function initAI() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        const segmenterInstance = await ImageSegmenter.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite",
            delegate: "CPU"
          },
          runningMode: "VIDEO",
          outputCategoryMask: true,
          outputConfidenceMasks: false
        });
        setSegmenter(segmenterInstance);
      } catch (e) {
        console.error("AI Initialization failed:", e);
      }
    }
    initAI();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    const bgImage = new Image();
    bgImage.src = backgroundUrl;

    // Offscreen canvas for masking
    const offscreenCanvas = document.createElement('canvas');
    const offCtx = offscreenCanvas.getContext('2d')!;

    const render = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // 1. Prepare offscreen canvas
        if (offscreenCanvas.width !== video.videoWidth) {
          offscreenCanvas.width = video.videoWidth;
          offscreenCanvas.height = video.videoHeight;
        }

        // 2. Draw Background on main canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

        if (segmenter) {
          const startTimeMs = performance.now();
          const result = segmenter.segmentForVideo(video, startTimeMs);
          const mask = result.categoryMask?.getAsFloat32Array();

          if (mask) {
            // Draw original video to offscreen
            offCtx.drawImage(video, 0, 0);
            const imageData = offCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
            
            // Apply Mask (category 1 is person)
            for (let i = 0; i < mask.length; i++) {
              if (mask[i] === 0) { // 0 is background
                imageData.data[i * 4 + 3] = 0; // Transparent
              }
            }
            offCtx.putImageData(imageData, 0, 0);

            // 3. Compose on main canvas
            const scale = (canvas.height * 0.85) / video.videoHeight;
            const width = video.videoWidth * scale;
            const height = canvas.height * 0.85;
            const x = (canvas.width - width) / 2;
            const y = canvas.height - height;

            ctx.save();
            ctx.shadowBlur = 15;
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.drawImage(offscreenCanvas, x, y, width, height);
            ctx.restore();
          }
        } else {
          // Fallback while loading or if AI fails
          const scale = 0.5;
          const w = video.videoWidth * scale;
          const h = video.videoHeight * scale;
          ctx.drawImage(video, (canvas.width - w) / 2, canvas.height - h, w, h);
        }

        // 4. Lighting Overlays
        ctx.save();
        if (sceneType === 'NEON_DISTRICT') {
          ctx.fillStyle = 'rgba(255, 0, 255, 0.05)'; // Purple tint
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.filter = 'contrast(1.2) saturate(1.4)';
        } else if (sceneType === 'ZEN_GARDEN') {
          const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.05)');
          grad.addColorStop(1, 'rgba(212, 175, 55, 0.1)'); // Gold
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else if (sceneType === 'MAIN_STAGE') {
          ctx.filter = 'brightness(1.1) contrast(1.1)';
          ctx.fillStyle = 'rgba(255,255,255,0.03)';
          ctx.beginPath();
          ctx.moveTo(0,0); ctx.lineTo(200, 0); ctx.lineTo(canvas.width, canvas.height); ctx.lineTo(canvas.width - 200, canvas.height);
          ctx.fill();
        } else if (sceneType === 'NEBULA') {
          ctx.fillStyle = 'rgba(147, 51, 234, 0.08)'; // Purple 600
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.filter = 'saturate(1.2) contrast(1.1)';
        } else if (sceneType === 'TOKYO') {
          ctx.fillStyle = 'rgba(236, 72, 153, 0.05)'; // Pink 500
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.filter = 'contrast(1.3) brightness(0.9)';
        } else if (sceneType === 'MARS') {
          ctx.fillStyle = 'rgba(249, 115, 22, 0.1)'; // Orange 500
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.filter = 'sepia(0.3) contrast(1.1)';
        } else if (sceneType === 'GLITCH') {
          ctx.filter = 'grayscale(0.5) contrast(1.4) brightness(1.2)';
        }
        ctx.restore();

        // 5. HUD
        if (isLive) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.8)'; // Red-500
          ctx.beginPath();
          ctx.arc(40, 40, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.font = 'bold 12px Inter';
          ctx.fillStyle = 'white';
          ctx.textAlign = 'left';
          ctx.fillText('LIVE BROADCAST', 55, 45);
        }
      }
      animationFrame = requestAnimationFrame(render);
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(stream => {
        video.srcObject = stream;
        video.play();
        render();
      })
      .catch(err => console.error(err));

    return () => {
      cancelAnimationFrame(animationFrame);
      if (video.srcObject) {
        (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [backgroundUrl, isLive, segmenter]);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden rounded shadow-inner">
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas 
        ref={canvasRef} 
        width={1280} 
        height={720} 
        className="w-full h-full object-cover"
      />
      {!segmenter && (
         <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4">
               <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
               <span className="text-[10px] font-bold text-white uppercase tracking-widest">Initializing Stage AI...</span>
            </div>
         </div>
      )}
    </div>
  );
}


