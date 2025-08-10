import React, { useEffect, useRef, useState } from "react";

const AnimatedTurtleCanvas = ({ animationData, exerciseId, isExecuting, onAnimationComplete }) => {
  const canvasRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const turtleImageRef = useRef(null);
  const animationCancelRef = useRef(null);

  useEffect(() => {
    // Load turtle image
    const img = new Image();
    img.src = '/assets/kura.png';
    turtleImageRef.current = img;
  }, []);

  // Handle execution cancellation
  useEffect(() => {
    if (!isExecuting && animationCancelRef.current) {
      animationCancelRef.current();
      setIsAnimating(false);
      setCurrentStep(0);
      
      // Clear the canvas immediately
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  }, [isExecuting]);

  useEffect(() => {
    if (!animationData || !canvasRef.current) {
      console.log("AnimatedTurtleCanvas: No animation data or canvas ref");
      return;
    }

    console.log("AnimatedTurtleCanvas: Starting with data:", animationData);
    
    // Reset state for new animation
    setIsAnimating(false);
    setCurrentStep(0);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { commands, bounds } = animationData;

    if (!commands || !bounds) {
      console.error(
        "AnimatedTurtleCanvas: Missing commands or bounds in animation data"
      );
      return;
    }

    console.log("Commands:", commands.length, "Bounds:", bounds);

    // Set up canvas
    canvas.width = 400;
    canvas.height = 400;

    // Calculate scale to fit drawing in canvas
    const padding = 20;
    const safeWidth = Math.max(bounds.width, 1);
    const safeHeight = Math.max(bounds.height, 1);
    const scaleX = (canvas.width - 2 * padding) / safeWidth;
    const scaleY = (canvas.height - 2 * padding) / safeHeight;
    const scale = Math.min(scaleX, scaleY, 2); // Max scale of 2

    // Center the drawing
    const offsetX =
      canvas.width / 2 - (bounds.min_x + bounds.width / 2) * scale;
    const offsetY =
      canvas.height / 2 + (bounds.min_y + bounds.height / 2) * scale;

    // Transform coordinates
    const transformX = (x) => x * scale + offsetX;
    const transformY = (y) => -y * scale + offsetY; // Flip Y coordinate

    const startAnimation = () => {
      console.log("Starting animation with", commands.length, "commands");
      setIsAnimating(true);
      setCurrentStep(1); // Start with step 1, not 0
      let currentX = 0;
      let currentY = 0;
      let currentAngle = 90;
      let stepIndex = 0;
      let isCancelled = false;
      
      // Set up cancellation
      animationCancelRef.current = () => {
        isCancelled = true;
      };
      
      // Check if this is a high-repetition exercise that should go fast
      const isHighRepetition = exerciseId === 'python-correct-7-3' || commands.length > 20;

      const drawStep = () => {
        if (isCancelled) {
          return;
        }
        
        if (stepIndex >= commands.length) {
          setIsAnimating(false);
          animationCancelRef.current = null;
          if (onAnimationComplete) {
            onAnimationComplete();
          }
          return;
        }

        const command = commands[stepIndex];

        if (command.type === "move" || command.type === "goto") {
          const startX = transformX(command.from.x);
          const startY = transformY(command.from.y);
          const endX = transformX(command.to.x);
          const endY = transformY(command.to.y);

          // Animation for line drawing
          const steps = Math.max(20, Math.abs(command.distance || 50) / 2);
          let animStep = 0;

          const animateLine = () => {
            if (isCancelled) {
              return;
            }
            
            // Clear and redraw everything up to current point
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw all completed lines
            for (let i = 0; i < stepIndex; i++) {
              const prevCmd = commands[i];
              if (
                (prevCmd.type === "move" || prevCmd.type === "goto") &&
                prevCmd.pen_down
              ) {
                ctx.strokeStyle = getColor(prevCmd.color);
                ctx.lineWidth = prevCmd.width;
                ctx.lineCap = "round";
                ctx.beginPath();
                ctx.moveTo(
                  transformX(prevCmd.from.x),
                  transformY(prevCmd.from.y)
                );
                ctx.lineTo(transformX(prevCmd.to.x), transformY(prevCmd.to.y));
                ctx.stroke();
              }
            }

            if (command.pen_down) {
              const progress = animStep / steps;
              const currentLineX = startX + (endX - startX) * progress;
              const currentLineY = startY + (endY - startY) * progress;

              ctx.strokeStyle = getColor(command.color);
              ctx.lineWidth = command.width;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(startX, startY);
              ctx.lineTo(currentLineX, currentLineY);
              ctx.stroke();

              currentX =
                command.from.x + (command.to.x - command.from.x) * progress;
              currentY =
                command.from.y + (command.to.y - command.from.y) * progress;
            } else {
              currentX =
                command.from.x +
                (command.to.x - command.from.x) * (animStep / steps);
              currentY =
                command.from.y +
                (command.to.y - command.from.y) * (animStep / steps);
            }

            // Draw turtle
            drawTurtle(
              ctx,
              transformX(currentX),
              transformY(currentY),
              currentAngle
            );

            animStep++;

            if (animStep <= steps) {
              if (!isCancelled) {
                setTimeout(animateLine, isHighRepetition ? 5 : 20); // Much faster frame rate for high-repetition
              }
            } else {
              currentX = command.to.x;
              currentY = command.to.y;
              currentAngle = command.to.angle;
              stepIndex++;
              setCurrentStep(stepIndex + 1); // Update to next step number
              if (!isCancelled) {
                setTimeout(drawStep, isHighRepetition ? 10 : 100); // Much shorter pause for high-repetition
              }
            }
          };

          animateLine();
        } else if (command.type === "rotate") {
          // Simple rotation - just update angle
          currentAngle = command.to_angle;

          // Redraw with new angle
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw all completed lines
          for (let i = 0; i < stepIndex; i++) {
            const prevCmd = commands[i];
            if (
              (prevCmd.type === "move" || prevCmd.type === "goto") &&
              prevCmd.pen_down
            ) {
              ctx.strokeStyle = getColor(prevCmd.color);
              ctx.lineWidth = prevCmd.width;
              ctx.lineCap = "round";
              ctx.beginPath();
              ctx.moveTo(
                transformX(prevCmd.from.x),
                transformY(prevCmd.from.y)
              );
              ctx.lineTo(transformX(prevCmd.to.x), transformY(prevCmd.to.y));
              ctx.stroke();
            }
          }

          drawTurtle(
            ctx,
            transformX(currentX),
            transformY(currentY),
            currentAngle
          );

          stepIndex++;
          setCurrentStep(stepIndex + 1); // Update to next step number
          if (!isCancelled) {
            setTimeout(drawStep, isHighRepetition ? 20 : 200); // Much shorter pause for rotation in high-repetition
          }
        }
      };

      drawStep();
    };

    // Start animation after a short delay
    setTimeout(() => {
      console.log("About to start animation");
      startAnimation();
    }, 500);
  }, [animationData]);

  const drawTurtle = (ctx, x, y, angle) => {
    const turtleImage = turtleImageRef.current;
    
    if (!turtleImage || !turtleImage.complete) {
      // Fallback to original turtle shape if image not loaded
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(((angle - 90) * Math.PI) / 180);

      const size = 16;
      ctx.fillStyle = "#4a9";
      ctx.beginPath();
      ctx.ellipse(0, 0, size / 3, size / 4, 0, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "#2a7";
      ctx.beginPath();
      ctx.moveTo(0, -size / 4);
      ctx.lineTo(-size / 6, size / 6);
      ctx.lineTo(size / 6, size / 6);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
      return;
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(((-angle + 90) * Math.PI) / 180); // Rotate so turtle head faces movement direction

    const size = 32; // Make turtle bigger
    ctx.drawImage(
      turtleImage,
      -size / 2, // Center horizontally
      -size / 2, // Center vertically
      size,
      size
    );

    ctx.restore();
  };

  const getColor = (color) => {
    const colorMap = {
      black: "#000000",
      red: "#ff0000",
      blue: "#0000ff",
      green: "#008000",
      yellow: "#ffff00",
      purple: "#800080",
      orange: "#ffa500",
    };
    return colorMap[color] || color;
  };

  if (!animationData) {
    return (
      <div className="bg-white mt-4 p-3 rounded-md border border-gray-300 flex justify-center items-center h-64">
        <p className="text-gray-500">No turtle drawing to display</p>
      </div>
    );
  }

  return (
    <div className="bg-white mt-4 p-3 rounded-md border border-gray-300">
      <div className="flex justify-center mb-2">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
      {isAnimating && animationData.commands.length >= 3 && (
        <p className="text-center text-sm text-blue-600 font-source">
          🐢 Turtle is drawing... Step {currentStep} of{" "}
          {animationData.commands.length}
        </p>
      )}
      {isAnimating && animationData.commands.length < 3 && (
        <p className="text-center text-sm text-blue-600 font-source">
          🐢 Turtle is drawing...
        </p>
      )}
    </div>
  );
};

export default AnimatedTurtleCanvas;
