let pyodide = null;
let isReady = false;

export function isTurtleReady() {
  return isReady;
}

export async function loadTurtleInstance() {
  if (pyodide) return pyodide;

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
            
        def forward(self, distance):
            old_x, old_y = self.x, self.y
            self.x += distance * math.cos(math.radians(self.angle))
            self.y += distance * math.sin(math.radians(self.angle))
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
            self.angle += angle
            
        def right(self, angle):
            self.angle -= angle
            
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
                
        def get_canvas_data(self):
            if not self.lines:
                return None
                
            # Calculate bounds
            all_x = [line['x1'] for line in self.lines] + [line['x2'] for line in self.lines]
            all_y = [line['y1'] for line in self.lines] + [line['y2'] for line in self.lines]
            
            if not all_x:
                return None
                
            margin = 20
            min_x, max_x = min(all_x) - margin, max(all_x) + margin
            min_y, max_y = min(all_y) - margin, max(all_y) + margin
            width = max_x - min_x
            height = max_y - min_y
            
            # Create SVG
            svg_lines = []
            svg_lines.append(f'<svg width="400" height="400" viewBox="{min_x} {-max_y} {width} {height}" xmlns="http://www.w3.org/2000/svg">')
            svg_lines.append('<rect width="100%" height="100%" fill="white"/>')
            
            # Draw grid
            step = 50
            for x in range(int(min_x // step) * step, int(max_x // step + 1) * step, step):
                svg_lines.append(f'<line x1="{x}" y1="{-max_y}" x2="{x}" y2="{-min_y}" stroke="#f0f0f0" stroke-width="0.5"/>')
            for y in range(int(min_y // step) * step, int(max_y // step + 1) * step, step):
                svg_lines.append(f'<line x1="{min_x}" y1="{-y}" x2="{max_x}" y2="{-y}" stroke="#f0f0f0" stroke-width="0.5"/>')
            
            # Draw turtle lines (flip Y coordinate for correct orientation)
            for line in self.lines:
                color = line['color']
                if color == 'black':
                    color = '#000000'
                elif color == 'red':
                    color = '#ff0000'
                elif color == 'blue':
                    color = '#0000ff'
                elif color == 'green':
                    color = '#008000'
                
                svg_lines.append(f'<line x1="{line["x1"]}" y1="{-line["y1"]}" x2="{line["x2"]}" y2="{-line["y2"]}" stroke="{color}" stroke-width="{line["width"]}" stroke-linecap="round"/>')
            
            svg_lines.append('</svg>')
            svg_content = '\\n'.join(svg_lines)
            
            # Convert SVG to base64
            import base64
            svg_base64 = base64.b64encode(svg_content.encode('utf-8')).decode('utf-8')
            return svg_base64

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
}

function getFriendlyError(message) {
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
  const pyodide = await loadTurtleInstance();

  try {
    await pyodide.runPythonAsync(`
      import sys
      from io import StringIO
      sys.stdout = sys.stderr = StringIO()
      _turtle.lines = []  # Reset drawing
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
    const canvasData = await pyodide.runPythonAsync("_turtle.get_canvas_data()");

    return { 
      output: output.trim(),
      canvasData: canvasData
    };
  } catch (error) {
    const errOutput = await pyodide.runPythonAsync("sys.stdout.getvalue()");
    return {
      error: getFriendlyError(errOutput.trim() || error.message),
      raw: errOutput.trim() || error.message,
    };
  }
}