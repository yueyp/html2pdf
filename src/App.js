import html2pdf from "html2pdf.js";
import JSZip from "jszip";
import FileSaver from "file-saver";
import "./App.css";

function App() {
  const handleExportPdf = () => {
    const workerList = [];
    const zip = new JSZip();
    const opt = {
      margin: 0,
      filename: "file.pdf",
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
      image: { type: "jpeg", quality: 1 },
      enableLinks: true,
      html2canvas: { scale: 2, useCORS: true, allowTaint: false },
      jsPDF: {},
    };

    for (let i = 0; i < 3; i++) {
      const element = document.getElementById(`pdf${i + 1}`);
      workerList.push(html2pdf().set(opt).from(element).outputPdf("blob"));
    }

    Promise.all([...workerList]).then((res) => {
      res.map((v, i) => {
        zip.file(`pdf${i + 1}.pdf`, v, { binary: true });
      });
      zip
        .generateAsync({ type: "blob" })
        .then((content) => {
          FileSaver.saveAs(content, "pdfzip");
        })
        .catch((e) => {
          console.log(e, "压缩失败");
        });
    });
  };

  const generatePdfHtml = () => {
    return new Array(100).fill({}).map((item, index) => (
      <div className="avoid-break" style={{ paddingBottom: "10px" }}>
        这是第{index}句话,
        {`这是第${index}句话`.repeat(index)}
      </div>
    ));
  };

  return (
    <div className="App">
      <button onClick={handleExportPdf}>打印</button>
      <div style={{ position: "absolute", top: "-100000px" }}>
        <div id="pdf1">{generatePdfHtml()}</div>
        <div id="pdf2">{generatePdfHtml()}</div>
        <div id="pdf3">{generatePdfHtml()}</div>
      </div>
    </div>
  );
}

export default App;
