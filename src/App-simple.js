import html2pdf from "html2pdf.js";
import "./App.css";

function App() {
  const handlePrint = () => {
    const element = document.getElementById("pdf1");
    html2pdf(element);
  };

  const generatePdf = () => {
    return new Array(100).fill({}).map((item, index) => (
      <div className="avoid-break" style={{ paddingBottom: "10px" }}>
        这是第{index}句话,
        {"啦啦啦啦啦啦啦".repeat(index)}
      </div>
    ));
  };

  return (
    <div className="App">
      <button onClick={handlePrint}>打印</button>
      <div style={{ position: "absolute", top: "-100000px" }}>
        <div id="pdf1">{generatePdf()}</div>
      </div>
    </div>
  );
}

export default App;
