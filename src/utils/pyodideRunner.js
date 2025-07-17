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

function getFriendlyError(message) {
  if (message.includes("SyntaxError") && message.includes("invalid syntax")) {
    return "❌ Ada yang salah dengan cara kamu menulis kode. Coba cek tanda kutip atau tanda baca lainnya.";
  }
  if (message.includes("NameError")) {
    return "❌ Komputer bingung karena ada kata yang tidak dikenal. Mungkin kamu lupa menaruh tanda kutip?";
  }
  if (message.includes("IndentationError")) {
    return "❌ Sepertinya ada masalah dengan spasi atau tab. Coba periksa awal baris kodenya!";
  }
  if (message.includes("TypeError")) {
    return "❌ Ada yang salah dengan tipe data yang kamu pakai. Misalnya, kamu mungkin mencoba menjumlahkan angka dan tulisan.";
  }
  return "⚠️ Ups! Komputer tidak mengerti kodenya. Coba periksa kembali.";
}

export async function runPython(code) {
  const pyodide = await loadPyodideInstance();

  try {
    await pyodide.runPythonAsync(`
      import sys
      from io import StringIO
      sys.stdout = sys.stderr = StringIO()
    `);

    // Try running the code
    await pyodide.runPythonAsync(code);

    // Get new output
    const output = await pyodide.runPythonAsync("sys.stdout.getvalue()");

    return { output: output.trim() }; // Trim to remove trailing \n
  } catch (error) {
    // Get error output from sys.stderr
    const errOutput = await pyodide.runPythonAsync("sys.stdout.getvalue()");
    return {
      error: getFriendlyError(errOutput.trim() || error.message),
      raw: errOutput.trim() || error.message,
    };
  }
}
