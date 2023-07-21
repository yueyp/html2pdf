import { useEffect } from "react";
import html2pdf from "html2pdf.js";
import "./App.css";

function App() {
  const handlePrint = () => {
    const element = document.getElementById("pdf1");

    const opt = {
      margin: [10, 10],
      filename: "1.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true, allowTaint: false },
      jsPDF: {},
    };
    html2pdf(element, opt);
  };

  const generatePdf = () => {
    return new Array(100).fill({}).map((item, index) => (
      <div className="avoid-break" style={{ paddingBottom: "10px" }}>
        这是第{index}句话,
        {"啦啦啦啦啦啦啦".repeat(index)}
      </div>
    ));
  };

  // useEffect(() => {
  //   // 将图片转为base64格式
  //   const getBase64 = async (imgUrl) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.open("get", imgUrl, true);
  //     xhr.responseType = "blob";
  //     xhr.onload = function () {
  //       if (xhr.status === 200) {
  //         const oFileReader = new FileReader();
  //         oFileReader.onloadend = function (e) {
  //           let base64 = e.target.result;
  //           let imgD = document.getElementById("img1");
  //           imgD.src = base64;
  //         };
  //         oFileReader.readAsDataURL(xhr.response);
  //       }
  //     };
  //     xhr.send();
  //   };

  //   getBase64("https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF");
  // }, []);
  
  return (
    <div className="App">
      <button onClick={handlePrint}>打印</button>
      <div style={{ position: "absolute", top: "-100000px" }}>
        <div id="pdf1">
          {generatePdf()}
          <img
            id="img1"
            src="https://t7.baidu.com/it/u=1595072465,3644073269&fm=193&f=GIF"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default App;
