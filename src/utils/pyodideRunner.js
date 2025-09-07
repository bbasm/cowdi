let pyodide = null;
let isReady = false;
let loadingPromise = null;

export function isPyodideReady() {
  return isReady;
}

export async function loadPyodideInstance() {
  if (pyodide) return pyodide;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      // First ensure the Pyodide script is loaded
      if (typeof window.loadPyodideScript === "function") {
        await window.loadPyodideScript();
      }

      // Wait a bit for the script to fully initialize
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (typeof window.loadPyodide !== "function") {
        throw new Error("Pyodide failed to load");
      }

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
    } catch (error) {
      console.error("Failed to load Pyodide:", error);
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
}

function getFriendlyError(message) {
  if (message.includes("SyntaxError")) {
    // 🔹 1. Starts with number (most specific)
    if (message.includes("invalid decimal literal")) {
      return "❌ Nama variabel tidak boleh dimulai dengan angka. Gunakan huruf dulu, baru boleh pakai angka.";
    }

    // lesson 2 - empty variable assignment
    if (
      message.includes("invalid syntax") &&
      (message.includes("=") || message.includes("unexpected EOF"))
    ) {
      return "❌ Variabel belum diberi nilai! Coba isi variabel dengan sesuatu.";
    }

    // lesson 1
    if (message.includes("invalid syntax") && message.includes(" ")) {
      return "❌ Python bingung! Sepertinya ada teks yang tidak diberi tanda kutip.";
    }

    // lesson 4
    return "❌ Ada kesalahan penulisan! Coba periksa apakah kamu lupa tanda kurung?";
  }

  if (message.includes("NameError")) {
    // lesson 1
    return "❌ Python tidak mengenali kata ini. Apakah ini variabel atau teks?";
  }

  if (message.includes("IndentationError")) {
    return "❌ Sepertinya ada masalah dengan spasi atau tab. Coba periksa awal baris kodenya!";
  }

  if (message.includes("TypeError")) {
    // lesson 3 - type mixing errors
    if (
      message.includes("can't multiply") ||
      message.includes("unsupported operand") ||
      message.includes("can only concatenate")
    ) {
      return "❌ Python tidak bisa menggabung teks dengan angka! Gunakanlah str() atau f-string.";
    }
    return "❌ Ada masalah dengan tipe data. Periksa apakah kamu menggunakan nama yang tepat.";
  }

  return "⚠️ Ups! Komputer tidak mengerti kodenya. Coba periksa kembali.";
}

export async function runPython(code) {
  try {
    const pyodide = await loadPyodideInstance();

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
    if (error.message.includes("Pyodide failed to load")) {
      return {
        error:
          "❌ Koneksi internet lambat atau bermasalah. Coba refresh halaman ini dan tunggu sebentar.",
        raw: error.message,
      };
    }

    try {
      // Get error output from sys.stderr if pyodide is available
      const pyodide = await loadPyodideInstance();
      const errOutput = await pyodide.runPythonAsync("sys.stdout.getvalue()");
      return {
        error: getFriendlyError(errOutput.trim() || error.message, code),
        raw: errOutput.trim() || error.message,
      };
    } catch (secondError) {
      return {
        error: getFriendlyError(error.message, code),
        raw: error.message,
      };
    }
  }
}
