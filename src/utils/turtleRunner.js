let pyodide = null;
let isReady = false;
let loadingPromise = null;

export function isTurtleReady() {
  return isReady;
}

export async function loadTurtleInstance() {
  if (pyodide) return pyodide;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      // First ensure the Pyodide script is loaded
      if (typeof window.loadPyodideScript === 'function') {
        await window.loadPyodideScript();
      }
      
      // Wait a bit for the script to fully initialize
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (typeof window.loadPyodide !== 'function') {
        throw new Error('Pyodide failed to load');
      }

      pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/",
      });

  // Install turtle support
  await pyodide.runPythonAsync(`
    import sys
    from io import StringIO
    import js
    import math
    
    # Create a simple turtle implementation
    class SimpleTurtle:
        def __init__(self):
            self.x = 0
            self.y = 0
            self.angle = 90  # facing up
            self.pen_down = True
            self.pen_color = 'black'
            self.pen_width = 1
            self.lines = []
            self.speed_value = 5
            self.commands = []  # Store all drawing commands for animation
            
        def forward(self, distance):
            old_x, old_y = self.x, self.y
            new_x = self.x + distance * math.cos(math.radians(self.angle))
            new_y = self.y + distance * math.sin(math.radians(self.angle))
            
            # Record command for animation
            self.commands.append({
                'type': 'move',
                'from': {'x': old_x, 'y': old_y, 'angle': self.angle},
                'to': {'x': new_x, 'y': new_y, 'angle': self.angle},
                'pen_down': self.pen_down,
                'color': self.pen_color,
                'width': self.pen_width,
                'distance': distance
            })
            
            self.x, self.y = new_x, new_y
            if self.pen_down:
                self.lines.append({
                    'x1': old_x, 'y1': old_y,
                    'x2': self.x, 'y2': self.y,
                    'color': self.pen_color,
                    'width': self.pen_width
                })
                
        def backward(self, distance):
            self.forward(-distance)
            
        def left(self, angle):
            old_angle = self.angle
            self.angle += angle
            # Record rotation command
            self.commands.append({
                'type': 'rotate',
                'from_angle': old_angle,
                'to_angle': self.angle,
                'position': {'x': self.x, 'y': self.y}
            })
            
        def right(self, angle):
            old_angle = self.angle
            self.angle -= angle
            # Record rotation command
            self.commands.append({
                'type': 'rotate',
                'from_angle': old_angle,
                'to_angle': self.angle,
                'position': {'x': self.x, 'y': self.y}
            })
            
        def penup(self):
            self.pen_down = False
            
        def pendown(self):
            self.pen_down = True
            
        def pencolor(self, color):
            self.pen_color = color
            
        def pensize(self, width):
            self.pen_width = width
            
        def speed(self, speed):
            self.speed_value = speed
            
        def goto(self, x, y):
            old_x, old_y = self.x, self.y
            
            # Record goto command
            self.commands.append({
                'type': 'goto',
                'from': {'x': old_x, 'y': old_y, 'angle': self.angle},
                'to': {'x': x, 'y': y, 'angle': self.angle},
                'pen_down': self.pen_down,
                'color': self.pen_color,
                'width': self.pen_width
            })
            
            self.x, self.y = x, y
            if self.pen_down:
                self.lines.append({
                    'x1': old_x, 'y1': old_y,
                    'x2': self.x, 'y2': self.y,
                    'color': self.pen_color,
                    'width': self.pen_width
                })
                
        def circle(self, radius, extent=360):
            # Approximate circle with line segments
            steps = max(12, int(abs(extent) / 15))
            step_angle = extent / steps
            step_distance = 2 * math.pi * abs(radius) * abs(step_angle) / 360
            
            for _ in range(steps):
                self.forward(step_distance)
                self.left(step_angle)
                
        def validate_lesson5_requirements(self):
            # Check if user completed all lesson 5 requirements:
            # 1. Jalan 100 langkah (forward with distance around 100)
            # 2. Belok kanan (right turn)
            # 3. Ganti warna jadi merah (pencolor red)
            # 4. Jalan lagi 100 langkah (another forward with distance around 100)
            
            forward_moves = []
            right_turns = []
            red_color_found = False
            
            # Collect all forward moves and right turns
            for cmd in self.commands:
                if cmd['type'] == 'move':
                    distance = abs(cmd.get('distance', 0))
                    if distance >= 50:  # Any significant forward movement
                        forward_moves.append({
                            'distance': distance,
                            'index': len(forward_moves)
                        })
                        
                elif cmd['type'] == 'rotate':
                    # Check for right turn (negative angle change)
                    angle_diff = cmd['to_angle'] - cmd['from_angle']
                    # Normalize angle difference to -180 to 180 range
                    while angle_diff > 180:
                        angle_diff -= 360
                    while angle_diff < -180:
                        angle_diff += 360
                    
                    # Right turn is negative angle (clockwise)
                    if angle_diff < -30:  # At least 30 degrees right turn
                        right_turns.append(True)
            
            # Check for red color in any line or command
            for line in self.lines:
                if line['color'] in ['red', '#ff0000', '#FF0000', 'Red', 'RED']:
                    red_color_found = True
                    break
            
            # Check requirements more flexibly
            has_forward_100_1 = len(forward_moves) >= 1 and any(70 <= move['distance'] <= 130 for move in forward_moves[:1])
            has_right_turn = len(right_turns) >= 1
            has_red_color = red_color_found
            has_forward_100_2 = len(forward_moves) >= 2 and any(70 <= move['distance'] <= 130 for move in forward_moves[1:])
                    
            return {
                'valid': has_forward_100_1 and has_right_turn and has_red_color and has_forward_100_2,
                'checks': {
                    'forward_100_1': has_forward_100_1,
                    'right_turn': has_right_turn,
                    'red_color': has_red_color,
                    'forward_100_2': has_forward_100_2
                }
            }
                
        def get_canvas_data(self):
            if not self.commands:
                return None
                
            # Calculate bounds from commands
            all_x = [0]  # Start with origin
            all_y = [0]
            
            for cmd in self.commands:
                if cmd['type'] in ['move', 'goto']:
                    all_x.extend([cmd['from']['x'], cmd['to']['x']])
                    all_y.extend([cmd['from']['y'], cmd['to']['y']])
                elif cmd['type'] == 'rotate':
                    all_x.append(cmd['position']['x'])
                    all_y.append(cmd['position']['y'])
            
            if not all_x or (max(all_x) - min(all_x) == 0 and max(all_y) - min(all_y) == 0):
                # Single point or no movement, create small bounds
                margin = 50
                bounds = {
                    'min_x': -margin, 'max_x': margin,
                    'min_y': -margin, 'max_y': margin,
                    'width': 2 * margin, 'height': 2 * margin
                }
            else:
                margin = 30
                min_x, max_x = min(all_x) - margin, max(all_x) + margin
                min_y, max_y = min(all_y) - margin, max(all_y) + margin
                bounds = {
                    'min_x': min_x, 'max_x': max_x,
                    'min_y': min_y, 'max_y': max_y,
                    'width': max_x - min_x, 'height': max_y - min_y
                }
            
            # Return animation data with validation as JSON string
            import json
            validation = self.validate_lesson5_requirements()
            return json.dumps({
                'commands': self.commands,
                'bounds': bounds,
                'final_lines': self.lines,
                'validation': validation
            })

    # Global turtle instance
    _turtle = SimpleTurtle()
    
    # Turtle module functions
    def Turtle():
        return _turtle
        
    def forward(distance):
        _turtle.forward(distance)
        
    def backward(distance):
        _turtle.backward(distance)
        
    def left(angle):
        _turtle.left(angle)
        
    def right(angle):
        _turtle.right(angle)
        
    def penup():
        _turtle.penup()
        
    def pendown():
        _turtle.pendown()
        
    def pencolor(color):
        _turtle.pencolor(color)
        
    def pensize(width):
        _turtle.pensize(width)
        
    def speed(speed):
        _turtle.speed(speed)
        
    def goto(x, y):
        _turtle.goto(x, y)
        
    def circle(radius, extent=360):
        _turtle.circle(radius, extent)
        
    def done():
        pass  # No-op for compatibility
        
    def exitonclick():
        pass  # No-op for compatibility
        
    # Create turtle namespace
    import types
    turtle = types.ModuleType('turtle')
    turtle.Turtle = Turtle
    turtle.forward = forward
    turtle.backward = backward
    turtle.left = left
    turtle.right = right
    turtle.penup = penup
    turtle.pendown = pendown
    turtle.pencolor = pencolor
    turtle.pensize = pensize
    turtle.speed = speed
    turtle.goto = goto
    turtle.circle = circle
    turtle.done = done
    turtle.exitonclick = exitonclick
    
    sys.modules['turtle'] = turtle
    
    sys.stdout = sys.stderr = StringIO()
  `);

      isReady = true;
      return pyodide;
    } catch (error) {
      console.error('Failed to load Pyodide for turtle:', error);
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
}

function getFriendlyError(message) {
  // Check for turtle-specific errors first
  if (message.includes("turtle") || message.includes("Turtle")) {
    if (message.includes("NameError") && message.includes("turtle")) {
      return "❌ Kamu belum import turtle! Pastikan ada baris 'from turtle import *' di awal kode.";
    }
    if (message.includes("AttributeError") && (message.includes("forward") || message.includes("left") || message.includes("right"))) {
      return "❌ Pastikan kamu sudah bikin turtle dulu dengan 'kura = turtle.Turtle()' sebelum menggunakan perintah gerak.";
    }
    if (message.includes("TypeError") && message.includes("missing") && message.includes("argument")) {
      return "❌ Perintah turtle ini butuh angka! Contoh: kura.forward(100) atau kura.left(90).";
    }
    if (message.includes("ValueError") && message.includes("invalid literal")) {
      return "❌ Angka yang kamu masukkan tidak valid. Pastikan pakai angka seperti 100, bukan huruf.";
    }
    return "❌ Ada masalah dengan kode turtle. Cek lagi perintah yang kamu tulis!";
  }

  // Keep original Python error messages unchanged
  if (message.includes("SyntaxError")) {
    if (message.includes("invalid decimal literal")) {
      return "❌ Nama variabel tidak boleh dimulai dengan angka. Gunakan huruf dulu, baru boleh pakai angka.";
    }
    if (message.includes("invalid syntax") && message.includes(" ")) {
      return "❌ Nama variabel tidak boleh ada spasi. Coba ganti dengan garis bawah (_) atau gabungkan katanya.";
    }
    return "❌ Ada yang salah dengan cara kamu menulis kode. Coba cek tanda kutip atau tanda baca lainnya.";
  }

  if (message.includes("NameError")) {
    return "❌ Komputer bingung karena ada kata yang tidak dikenal. Mungkin kamu lupa menaruh tanda kutip?";
  }

  if (message.includes("IndentationError")) {
    return "❌ Sepertinya ada masalah dengan spasi atau tab. Coba periksa awal baris kodenya!";
  }

  if (message.includes("TypeError")) {
    return "❌ Coba cek nama yang kamu pakai. Apakah kamu menimpa perintah penting?";
  }

  return "⚠️ Ups! Komputer tidak mengerti kodenya. Coba periksa kembali.";
}

export async function runTurtle(code) {
  try {
    const pyodide = await loadTurtleInstance();
    await pyodide.runPythonAsync(`
      import sys
      from io import StringIO
      sys.stdout = sys.stderr = StringIO()
      _turtle.lines = []  # Reset drawing
      _turtle.commands = []  # Reset commands
      _turtle.x = 0
      _turtle.y = 0
      _turtle.angle = 90
      _turtle.pen_down = True
      _turtle.pen_color = 'black'
      _turtle.pen_width = 1
    `);

    // Run the turtle code
    await pyodide.runPythonAsync(code);

    // Get text output
    const output = await pyodide.runPythonAsync("sys.stdout.getvalue()");
    
    // Get canvas data
    const canvasDataRaw = await pyodide.runPythonAsync("_turtle.get_canvas_data()");
    
    let canvasData = null;
    if (canvasDataRaw) {
      try {
        canvasData = JSON.parse(canvasDataRaw);
      } catch (e) {
        console.error("Failed to parse canvas data:", e);
        canvasData = null;
      }
    }

    return { 
      output: output.trim(),
      canvasData: canvasData
    };
  } catch (error) {
    if (error.message.includes('Pyodide failed to load')) {
      return {
        error: "❌ Koneksi internet lambat atau bermasalah. Coba refresh halaman ini dan tunggu sebentar.",
        raw: error.message,
      };
    }

    try {
      // Get error output from sys.stderr if pyodide is available
      const pyodide = await loadTurtleInstance();
      const errOutput = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      return {
        error: getFriendlyError(errOutput.trim() || error.message),
        raw: errOutput.trim() || error.message,
      };
    } catch (secondError) {
      return {
        error: getFriendlyError(error.message),
        raw: error.message,
      };
    }
  }
}