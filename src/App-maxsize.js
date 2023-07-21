import html2pdf from "html2pdf.js";
import "./App.css";

function App() {
  const handlePrint = async () => {
    const opt = {
      margin: [0, 0],
      filename: "myfile.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { dpi: 192, letterRendering: true },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    const pages = document.getElementById("pdf").children;
    var worker = html2pdf();

    for (let i = 0; i < pages.length; i++) {
      worker = worker
        .set(opt)
        .from(pages[i])
        .toPdf()
        .get("pdf")
        .then((pdf) => {
          if (i < pages.length - 1) {
            pdf.addPage();
          }
        });
    }
    worker.save();
  };

  const generatePdf = () => {
    return new Array(200).fill({}).map((item, index) => (
      <div className="avoid-break" style={{ paddingBottom: "0" }}>
        这是第{index}句话,
        {"啦啦啦啦啦啦啦".repeat(index)}
      </div>
    ));
  };

  return (
    <div className="App">
      <button onClick={handlePrint}>打印</button>
      <div style={{ position: "absolute", top: "-100000000px" }}>
        <div id="pdf">
          <div id="pdf1">{generatePdf()}</div>
          <div id="pdf2">{generatePdf()}</div>
          <div id="pdf3">{generatePdf()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
