"use client";

import * as fabric from "fabric";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    const canvasContainer = canvasContainerRef.current;
    const newCanvas = new fabric.Canvas("canvas", {
      width: canvasContainer?.offsetWidth,
      height: canvasContainer?.offsetHeight,
    });

    const brush = new fabric.PencilBrush(newCanvas);
    brush.width = 5;
    brush.color = "#000";

    newCanvas.freeDrawingBrush = brush;
    newCanvas.isDrawingMode = true;

    newCanvas.backgroundColor = "#fff";

    setCanvas(newCanvas);

    return () => {
      newCanvas.dispose();
    };
  }, []);

  const changeToBrush = () => {
    if (canvas) {
      const brush = new fabric.PencilBrush(canvas);
      brush.width = canvas.freeDrawingBrush?.width || 5;
      brush.color = "#000";
      canvas.freeDrawingBrush = brush;
    }
  };

  const changeToEraser = () => {
    if (canvas) {
      const eraser = new fabric.PencilBrush(canvas);
      eraser.width = canvas.freeDrawingBrush?.width || 5;
      eraser.color = "#fff";
      canvas.freeDrawingBrush = eraser;
    }
  };

  const changeBrushWidth = (value: string) => {
    if (canvas?.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = Number(value);
    }
  };

  const uploadCanvas = async () => {
    if (canvas) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";

      input.onchange = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files[0]) {
          const file = target.files[0];
          const reader = new FileReader();

          reader.onload = (e) => {
            const dataURL = e.target?.result as string;
            console.log(dataURL);
          };

          reader.readAsDataURL(file);
        }
      };

      input.click();
    }
  };

  const downloadCanvas = () => {
    if (canvas) {
      const dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
        multiplier: 1,
      });
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "canvas-image.png";
      link.click();
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div
        className="w-full h-80 relative border-2 border-black"
        ref={canvasContainerRef}
      >
        <canvas id="canvas" className="relative" />
      </div>
      <div className="w-full h-80 absolute bg-red-50 -z-10" />
      <button onClick={changeToBrush}>브러쉬</button>
      <button onClick={changeToEraser}>지우개</button>
      <input
        type="range"
        min={1}
        max={50}
        defaultValue={5}
        onChange={(e) => changeBrushWidth(e.target.value)}
      />
      <button onClick={uploadCanvas}>업로드</button>
      <button onClick={downloadCanvas}>다운로드</button>
    </div>
  );
}
