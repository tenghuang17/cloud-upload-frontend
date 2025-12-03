import { useState } from 'react'
function App() {  // 定義的一個元件（component） 函式 = 元件
  const [file, setFile] = useState(null); //呼叫useState後回傳 [狀態變數, 修改它的函式]
  // file variable : 目前選到的檔案（狀態值）(初始null) setFile自取名 會觸發畫面更新
  const [result, setResult] = useState("");


  async function getSignedUrl(file){
    const res = await fetch("http://localhost:5000/get_URL", {
      method: "POST",   // res 代表整個http response
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer abc123"
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || "application/octet-stream"
      })
    });
    if (!res.ok){
      throw new Error("Failed: " + res.status)
    }
    return res.json();   //  讀出 http response 的 body and return 
  }


  async function handleUpload(){   // function 裡用 await => async function
    console.log("handleUpload called");
    if(!file){                     
      alert("please select the file first");
      return ;
    }
    const signed = await getSignedUrl(file);     // signed json object  (like dictionary)
    setResult(JSON.stringify(signed, null, 2));  // pre 只能顯示字串 不能顯示物件 
  }                                             


  return (            // using JSX describe UI
    <div style={{ padding: "50px" }}> 
      <h1>Upload to S3</h1>  

      <input          // 一個標籤 、React element
        type="file"   //  HTML:attribute  JSX:prop (property，屬性)
        onChange={(e) => setFile(e.target.files[0])}
        //   選檔 ->onChange 觸發 ->React捕捉change事件 ->React呼叫箭頭函式
        //   e:event object整個事件 被作為參數送進函式 -> 執行函式   沒有e=沒參數
      /> 
      
      <button 
        style={{ display: "block", marginTop: "10px" }} 
        onClick={handleUpload}
      >
        Get signed URL 
      </button>

      <pre>{result}</pre> 
    </div>
  );
}
export default App