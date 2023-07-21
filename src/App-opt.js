import html2pdf from "html2pdf.js";
import "./App.css";

function App() {
  const handlePrint = () => {
    const element = document.getElementById("pdf1");

    const opt = {
      margin: [10, 10], // jsPDF的默认单位是mm，所以这里代表页边距为10mm
      filename: "1.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { },
    };
    html2pdf(element, opt);
  };

  const generatePdf = () => {
    return new Array(10).fill({}).map((item, index) => (
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
        <div id="pdf1">
          {generatePdf()}
        </div>
      </div>
    </div>
  );
}

export default App;
