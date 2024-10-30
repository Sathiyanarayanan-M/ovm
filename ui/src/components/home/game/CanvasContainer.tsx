"use client";
import { CANVAS_HEIGHT, CANVAS_WIDTH, DEFAULT_COLOR } from "@/constants/game";
import { debounce } from "@/utils/common";
import React from "react";
import Tools from "./Tools";
import { socket } from "@/tools/socket";
import { selectRound } from "@/lib/features/rounds/roundsSlice";
import { selectPlayerId } from "@/lib/features/player/playerSlice";
import { useAppSelector } from "@/lib/hooks";

const CanvasContainer = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const contextRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const canvasTool = React.useRef({
    color: DEFAULT_COLOR,
  });
  const round = useAppSelector(selectRound);
  const playerId = useAppSelector(selectPlayerId);
  const isArtist = round.artist === playerId;

  const [isDrawing, setIsDrawing] = React.useState(false);
  const [selectedTool, setSelectedTool] = React.useState<ToolsType>("pen");

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      const context = canvas.getContext("2d");
      if (context) {
        context.lineCap = "round";
        context.strokeStyle = canvasTool.current.color;
        context.lineWidth = 5;
        contextRef.current = context;
      }
      socket.on("drawing", drawRemote);
      socket.on("tool-change", toolRemote);
    }
    return () => {
      socket.off("drawing", drawRemote);
      socket.off("tool-change", toolRemote);
    };
  }, []);

  React.useEffect(() => {
    if (canvasRef.current && contextRef.current) {
      contextRef.current.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }, [round.artist]);

  const startDrawing = ({ nativeEvent }: CanvasMouseHandler) => {
    if (contextRef.current && isArtist) {
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
      socket.emit("drawing", { cr: "s", offsetX, offsetY });
    }
  };

  const finishDrawing = () => {
    if (contextRef.current && isArtist) {
      contextRef.current.closePath();
      socket.emit("drawing", { cr: "f" });
      setIsDrawing(false);
    }
  };

  const draw = ({ nativeEvent }: CanvasMouseHandler) => {
    if (!isDrawing || !contextRef.current || !isArtist) return;
    const { offsetX, offsetY } = nativeEvent;
    socket.emit("drawing", { cr: "d", offsetX, offsetY });
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const toolRemote = (tool: string) => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = tool;
    }
  };

  const drawRemote = ({ cr, offsetX, offsetY }: DrawingData) => {
    if (contextRef.current) {
      if (cr === "s") {
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
      } else if (cr === "d") {
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
      } else if (cr === "f") {
        contextRef.current.closePath();
      }
    }
  };

  const handleToolChange = (selectedTool: ToolsType) => {
    setSelectedTool(selectedTool);
    if (contextRef.current) {
      if (selectedTool === "pen") {
        socket.emit("tool-change", canvasTool.current.color);
        contextRef.current.strokeStyle = canvasTool.current.color;
      } else {
        socket.emit("tool-change", "white");
        contextRef.current.strokeStyle = "white";
      }
    }
  };

  const handleChangeColor = (value: string) => {
    debounce((val: string) => {
      canvasTool.current.color = val;
      if (selectedTool !== "eraser" && contextRef.current) {
        contextRef.current.strokeStyle = val;
        socket.emit("tool-change", val);
      }
    })(value);
  };

  return (
    <div className="">
      <canvas
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseMove={draw}
        ref={canvasRef}
        width={598}
        height={412}
        className="bg-white"
      />
      <Tools
        handleToolChange={handleToolChange}
        handleChangeColor={handleChangeColor}
        selectedTool={selectedTool}
        defaultColor={canvasTool.current.color}
        isDisabled={!isArtist}
      />
    </div>
  );
};

export default CanvasContainer;
