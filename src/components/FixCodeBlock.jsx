import { useState } from "react";

const CodeBlock = ({ subtitle, codeSnippets = [] }) => {
  const { starterCode = "" } = codeSnippets[0] || {};
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");

  const runCode = () => {
    try {
      const capturedOutput = eval(code); // ⚠️ later switch to a sandbox
      setOutput(capturedOutput ?? ""); 
    } catch (err) {
      setOutput(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">{subtitle}</h2>
      <textarea
        className="bg-yellow-100 w-full p-2 rounded font-mono"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={4}
      />
      <div className="flex gap-4 mt-2">
        <button onClick={runCode} className="bg-[#91CADB] px-4 py-1 rounded">Jalankan</button>
        <button onClick={() => setCode(starterCode)} className="text-sm text-blue-500">↺ Reset</button>
      </div>
      {output && (
        <pre className="bg-white border mt-2 p-2 rounded">{output}</pre>
      )}
    </div>
  );
};

export default CodeBlock;
