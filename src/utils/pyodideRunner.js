let pyodide = null;
let isReady = false;

export function isPyodideReady() {
  return isReady;
}

export async function loadPyodideInstance() {
  if (pyodide) return pyodide;

  pyodide = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/",
  });

  await pyodide.runPythonAsync(`
    import sys
    from io import StringIO
    sys.stdout = sys.stderr = StringIO()
  `);

  isReady = true;
  return pyodide;
}

function getFriendlyError(message) {
  if (message.includes("SyntaxError")) {
    // 🔹 1. Starts with number (most specific)
    if (message.includes("invalid decimal literal")) {
      return "❌ Nama variabel tidak boleh dimulai dengan angka. Gunakan huruf dulu, baru boleh pakai angka.";
    }

    // 🔹 2. Variable name with space
    if (message.includes("invalid syntax") && message.includes(" ")) {
      return "❌ Nama variabel tidak boleh ada spasi. Coba ganti dengan garis bawah (_) atau gabungkan katanya.";
    }

    // 🔹 3. General syntax fallback
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