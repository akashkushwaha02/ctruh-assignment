import React, { useState, useRef, useEffect } from "react";
import { ChromePicker } from "react-color";
import "./ctruh.css";

function Ctruh() {
  const canvasRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState("red");
  const [digitColor, setDigitColor] = useState("white");
  const [digit, setDigit] = useState("00");
  const [zoomedDigit, setZoomedDigit] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(500);
  const [canvasHeight, setCanvasHeight] = useState(500);
  let zoomedDigitCanvas;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = "bold 100px sans-serif";
    ctx.fillStyle = digitColor;
    ctx.textAlign = "center";
    ctx.fillText(digit, canvasWidth / 2, canvasHeight / 2);
    if (zoomedDigit) {
      const zoomCtx = zoomedDigit.getContext("2d");
      zoomCtx.fillStyle = backgroundColor;
      zoomCtx.fillRect(0, 0, 100, 100);
      zoomCtx.font = "bold 50px sans-serif";
      zoomCtx.fillStyle = digitColor;
      zoomCtx.textAlign = "center";
      zoomCtx.fillText(digit, 50, 60);
    }
  }, [
    backgroundColor,
    digitColor,
    digit,
    zoomedDigit,
    canvasWidth,
    canvasHeight,
  ]);

  const handleBackgroundColorChange = (color) => {
    setBackgroundColor(color.hex);
  };

  const handleDigitColorChange = (color) => {
    setDigitColor(color.hex);
  };

  const handleDigitChange = (event) => {
    const newDigit = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");
    setDigit(newDigit);
  };

  const handleCanvasClick = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const digitImageData = canvasRef.current
      .getContext("2d")
      .getImageData(x - 10, y - 10, 20, 20);
    zoomedDigitCanvas = document.createElement("canvas");
    zoomedDigitCanvas.width = 100;
    zoomedDigitCanvas.height = 100;
    zoomedDigitCanvas.style.position = "absolute";
    zoomedDigitCanvas.style.left = `${event.clientX + 20}px`;
    zoomedDigitCanvas.style.top = `${event.clientY - 50}px`;
    document.body.appendChild(zoomedDigitCanvas);
    setZoomedDigit(zoomedDigitCanvas);
  };

  const handleCanvasMouseMove = (event) => {
    if (digit && zoomedDigit == null) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newZoomedDigit = document.createElement("canvas");
      newZoomedDigit.width = 100;
      newZoomedDigit.height = 100;
      newZoomedDigit.style.position = "absolute";
      newZoomedDigit.style.zIndex = 1000;
      newZoomedDigit.style.display = "none";
      document.body.appendChild(newZoomedDigit);
      const zoomCtx = newZoomedDigit.getContext("2d");
      zoomCtx.fillStyle = backgroundColor;
      zoomCtx.fillRect(0, 0, 100, 100);
      zoomCtx.font = "bold 50px sans-serif";
      zoomCtx.fillStyle = digitColor;
      zoomCtx.textAlign = "center";
      zoomCtx.fillText(digit, 50, 60);
      newZoomedDigit.style.left = `${event.clientX + 20}px`;
      newZoomedDigit.style.top = `${event.clientY - 50}px`;
      newZoomedDigit.style.display = "block";
      setZoomedDigit(newZoomedDigit);
    } else if (zoomedDigit) {
      zoomedDigit.style.left = `${event.clientX + 20}px`;
      zoomedDigit.style.top = `${event.clientY - 50}px`;
    }
  };

  const handleCanvasMouseLeave = () => {
    if (zoomedDigit) {
      setZoomedDigit(null);
      zoomedDigit.remove();
    }
  };

  const handlePaletteChange = (event) => {
    const value = event.target.value;
    setBackgroundColor(value);
  };

  const handleCanvasWidthChange = (event) => {
    const value = parseInt(event.target.value);
    setCanvasWidth(value);
  };

  const handleCanvasHeightChange = (event) => {
    const value = parseInt(event.target.value);
    setCanvasHeight(value);
  };

  return (
    <div className="App">
      <h1>Ctruh Canvas App</h1>

      <hr />
      <div className="x-y-axis">
        <div>
          <label className="color-picker-label " htmlFor="canvas-width-input">
            Width:
          </label>
          <input
            id="canvas-width-input"
            type="number"
            value={canvasWidth}
            onChange={handleCanvasWidthChange}
          />
        </div>
        <div>
          <label className="color-picker-label " htmlFor="canvas-height-input">
            Height:
          </label>
          <input
            id="canvas-height-input"
            type="number"
            value={canvasHeight}
            onChange={handleCanvasHeightChange}
          />
        </div>
      </div>

      <div className="">
        {" "}
        <label className="color-picker-label ">
          Click to change the digit:
        </label>
        <button className="button" onClick={handleDigitChange}>
          Change Digit
        </button>
      </div>
      <div className="Color-parent">
        <div>
          <label className="color-picker-label ">Background Color:</label>
          <ChromePicker
            className="color-picker"
            color={backgroundColor}
            onChangeComplete={handleBackgroundColorChange}
          />
        </div>
        <div>
          <label className="color-picker-label ">Digit Color:</label>
          <ChromePicker
            className="color-picker"
            color={digitColor}
            onChangeComplete={handleDigitColorChange}
          />
        </div>
      </div>

      <div className="dropdown">
        <label className="dropdown-label">Palette:</label>
        <select className="dropdown-select" onChange={handlePaletteChange}>
          <option value="#FFFFFF">White</option>
          <option value="#FF0000" selected>
            Red
          </option>
          <option value="#00FF00">Green</option>
          <option value="#0000FF">Blue</option>
        </select>
      </div>

      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        onMouseLeave={handleCanvasMouseLeave}
      />
    </div>
  );
}

export default Ctruh;
