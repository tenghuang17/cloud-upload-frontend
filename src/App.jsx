import { useState } from 'react'
function App() {  // 定義的一個元件（component） 函式 = 元件
  const [file, setFile] = useState(null); //呼叫useState後回傳 [狀態變數, 修改它的函式]
  // file variable : 目前選到的檔案（狀態值）(初始null)  setFile自取 觸發畫面更新

  return (   // using JSX to describe UI
    <div style={{ padding: "50px" }}> 
      <h1>Upload to S3</h1>  

      <input          // 一個標籤   一個 React element
        type="file"   //  HTML:attribute  JSX:prop (property，屬性)
        onChange={(e) => setFile(e.target.files[0])}
        //   選檔 ->onChange 觸發 ->React捕捉change事件 ->React呼叫箭頭函式
        //   e:event object整個事件 被作為參數送進函式 -> 執行函式   沒有e=沒參數
      /> 
      
      <button 
        style={{ display: "block", marginTop: "10px" }} 
        onClick={() => console.log("Upload Clicked")}
      >
        Upload
      </button>

      <pre id="output"></pre> 暫時放輸出的容器（之後會把它改成用 state 控制）
    </div>
  );
}
export default App