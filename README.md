使用`htmlpdf.js`批量将`html`页面转为`pdf`，打包成`zip`下载。`htmlpdf.js`是结合`html2canvas`和`jsPDF`实现的。

首先先安装包
```
npm install --save html2pdf.js
```

基本页面
```
import html2pdf from "html2pdf.js";
function App() {
    const handleExportPdf = () => {
        // 导出pdf
    }
    const generatePdfHtml = () => {
        return new Array(100).fill({}).map((item, index) => (
            <div style={{ paddingBottom: "10px" }}>
                这是第{index}句话,
                {`这是第${index}句话`.repeat(index)}
            </div>
        ));
    };
    return (
        <div className="App">
            <button onClick={handleExportPdf}>导出</button>
            <div style={{ position: "absolute", top: "-100000px" }}>
                // 要转为pdf的页面
                <div id="pdf1">{generatePdfHtml()}</div>
                <div id="pdf2">{generatePdfHtml()}</div>
                <div id="pdf3">{generatePdfHtml()}</div>
            </div>
        </div>
    );
}

```
这里需要注意的是，要转为`pdf`的元素不能设置`position`，否则导出的`pdf`是空白的。所以这里把定位设置到它的父元素上。

我们先来实现单个`pdf`的导出，如果没有额外的配置要求，可以采用基本用法
```
const handleExportPdf = () => {
    var element = document.getElementById('pdf1');
    html2pdf(element);
}
```
如果需要进行额外的配置，则如下：
```
const handleExportPdf = () => {
    var element = document.getElementById('pdf1');
    const opt = {
        margin: 0, 
        filename: "file.pdf",
        pagebreak: {mode: ['avoid-all', 'css', 'legacy']},
        image: { type: "jpeg", quality: 1 },
        enableLinks: true,
        html2canvas: { scale: 2, useCORS: true, allowTaint: false},
        jsPDF: { },
    };
    html2pdf(element, opt);
}
```
各参数含义如下:
* `margin`：默认是0，`pdf`的页边距，它采用的是`jsPDF`的单位（`"pt" (points), "mm" , "cm", "in"`，默认是`"mm"`），值可以是数字或`[vMargin, hMargin]`或`[top, left, bottom, right]`。
* `filename`：默认是`file.pdf`，导出`pdf`的文件名。
* `pagebreak`：控制`pdf`的分页行为，参数如下：
    * `mode`：默认是`["css", "legacy"]`，值为字符串或者数组，有以下几种模式：
        * `avoid-all`：自动添加分页符，以避免将任何元素分割到多个页面。
        * `css`：根据`CSS`的`break-before`、`break-after`和`break-inside`属性添加分页符。
        * `legacy`：在使用`html2pdf__page-break`类的元素后面添加分页符，这个属性即将被废弃。
    * `before`：默认为空数组，值为字符或数组，通过`css`选择器来判断在哪些元素前面添加分页符，比如`id`选择器、类选择器、标签选择器获取`*`来选择所有的元素。
    * `after`：默认为空数组，值为字符或数组，通过`css`选择器来判断在哪些元素后面添加分页符，与`before`类似。
    * `avoid`：默认为空数组，值为字符或数组，通过`css`选择器来避免在哪些元素上面添加分页符，与`before`类似。
        ```
        // 避免在所有的元素上添加分页符，在 #page2el 元素前添加分页符
        html2pdf().set({
            pagebreak: { mode: 'avoid-all', before: '#page2el' }
        });

        // 支持所有模式，不指定元素
        html2pdf().set({
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        });

        // 采用默认模式，指定具体元素
        html2pdf().set({
            pagebreak: { before: '.beforeClass', after: ['#after1', '#after2'], avoid: 'img' }
        });
        ```
* image：默认值为`{type: 'jpeg', quality: 0.95}`，生成pdf的图片的配置，有以下两个属性：
    * type：图片类型，`HTMLCanvasElement`仅支持`png`、`jpeg`、`webp(仅chrome支持)`。
    * quality：图片质量，值为0-1，仅对`jpeg`、`webp`生效。
* enableLinks：默认为`true`，如果启用，PDF 超链接将自动添加到所有锚标记之上。
* html2canvas：`scale`用来设置导出图片的缩放比例，可控制清晰度。`useCORS`这个属性可以用来启用或禁用对`CORS`的支持，`allowTaint`这个属性允许启用或禁用对跨域图像的支持，不开启这两个属性的话，非本地图片不能显示。全部配置可见[`html2canvas`](https://html2canvas.hertzen.com/configuration)
* jsPDF：配置可见[`jsPDF`](http://rawgit.com/MrRio/jsPDF/master/docs/jsPDF.html)

接下来来实现打包逻辑，先安装我们需要使用的插件
```
npm install jszip file-saver --save
```
打包代码如下：
```
const handleExportPdf = () => {
    const workerList = [];
    const zip = new JSZip();
    const opt = {
      margin: 0, 
      filename: "file.pdf",
      pagebreak: {mode: ['avoid-all', 'css', 'legacy']},
      image: { type: "jpeg", quality: 1 },
      enableLinks: true,
      html2canvas: { scale: 2, useCORS: true, allowTaint: false},
      jsPDF: { },
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
    })
};
```