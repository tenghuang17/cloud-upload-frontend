import { useState } from 'react'
  
const BACKEND_URL = "https://cloud-upload-backend.onrender.com/get_URL";

function App() {  // 定義的一個元件（component） 函式 = 元件
  const [file, setFile] = useState(null); //呼叫useState後回傳 [狀態變數, 修改它的函式]
  // file variable : 目前選到的檔案（狀態值）(初始null) setFile自取名 會觸發畫面更新
  const [urlResult, seturlResult] = useState("");
  const [uploadResult, setuploadResult] = useState("");

  async function getSignedUrl(file){
    const res = await fetch(BACKEND_URL, {
      method: "POST",   // res 代表整個http response
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || "application/octet-stream"
      })
    });
    // const formData = new FormData();
    // formData.append("file", file);
    // const res = await fetch(BACKEND_URL, {
    //   method: "POST",
    //   body: formData      //不要自己加 Content-Type，瀏覽器會自動加 boundary
    // });
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
    const uploadUrl = signed.presigned_url;
    seturlResult(
      `presigned url: ${uploadUrl}\nexpired in: 120 seconds\n`
    );
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream"
      },
      body: file
    });
    if (!putRes.ok) {
      alert("Upload failed: " + putRes.status);
      return;
    }
    setuploadResult(
      `Upload success!\nS3 Key: ${signed.key}\nPublic URL (if your bucket allows): https://your-bucket.s3.amazonaws.com/${signed.key}`
    ); // pre 只能顯示字串 不能顯示物件 
    const notiRes = await fetch(" https://cloud-upload-backend.onrender.com/upload_success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filename: file.name,     // 或你存到 S3 的 key
        //key: s3Key,              // 如果有加資料夾就放這裡
        bucket: "upload-demo-nick"
      })
    })
    console.log(notiRes)
  }                                             


  return (            // using JSX describe UI
    <div style={{ padding: "50px" }}> 
      <h1>Upload to S3</h1>  
      <input          // a tag ,  a React element
        type="file"   //  HTML:attribute  JSX:prop (property，屬性)
        onChange={(e) => setFile(e.target.files[0])}
        //   選檔 ->onChange 觸發 ->React捕捉change事件 ->React呼叫箭頭函式
        //   e:event object整個事件 被作為參數送進函式 -> 執行函式   沒有e=沒參數
      /> 
      <button 
        style={{ display: "block", marginTop: "10px" }} 
        onClick={handleUpload}
      >
        Start! 
      </button>
      <pre>{urlResult}</pre> 
      <pre>{uploadResult}</pre>
    </div>
  );
}
export default App