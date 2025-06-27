// /src/utils/pyodideRunner.js

let pyodide = null;

export async function loadPyodideInstance() {
  if (pyodide) return pyodide;

  pyodide = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/",
  });

  // Setup stdout capture
  await pyodide.runPythonAsync(`
    import sys
    from io import StringIO

    sys.stdout = sys.stderr = StringIO()
  `);

  return pyodide;
}

export async function runPython(code) {
  try {
    const pyodide = await loadPyodideInstance();

    // Run the user code
    await pyodide.runPythonAsync(code);

    // Get stdout output
    const output = pyodide.runPython("sys.stdout.getvalue()");

    // Clear buffer for next time
    pyodide.runPython("sys.stdout.truncate(0); sys.stdout.seek(0)");

    return { output };
  } catch (error) {
    return { error: error.message };
  }
}
