import { useState } from 'react'
  
const BACKEND_URL = "https://cloud-upload-backend-docker.onrender.com";

function App() {  // 定義的一個元件（component） 函式 = 元件
  const [file, setFile] = useState(null); //呼叫useState後回傳 [狀態變數, 修改它的函式]
  //     file  : current selected file (state) (初始null) setFile自取名 會觸發畫面更新
  const [urlResult, seturlResult] = useState("");
  const [uploadResult, setuploadResult] = useState("");
  
  function handleFileChange(e) {
    const file = e.target.files[0]; //file(function scope)跟外面state的file不衝突
    if (!file) return;
    // check size
    const maxSize = 50 * 1024;
    if (file.size > maxSize) {
      alert("檔案大小不可超過 50KB");
      return;
    }
    setFile(file);
  }

  function encryptXOR_UTF8(text, key) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text); 
    const keyData = encoder.encode(key);

    const result = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      result[i] = data[i] ^ keyData[i % keyData.length];
    }

    return btoa(String.fromCharCode(...result));
  }

  async function getSignedUrl(file){
    const res = await fetch(BACKEND_URL, {  
      method: "POST",   // res : whole http response
      headers: {     // 就算後端沒有讀request.headers.get()也要加 
        "Content-Type": "application/json"  //不然request.get_json 會噴錯               
      },                        // 因為flask不知道這是不是 JSON
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || "application/octet-stream"
      })
    });
    // const formData = new FormData();
    // formData.append("file", file);
    // const res = await fetch(BACKEND_URL, {
    //   method: "POST",
    //   body: formData      //不自己加 Content-Type，瀏覽器會自動加 boundary
    // });
    if (!res.ok){
      throw new Error("Failed: " + res.status)
    }
    return res.json();   //  return : http response 的 body  
  }


  async function handleUpload(){   // function 裡用 await => async function
    console.log("handleUpload called");
    if(!file){                     
      alert("please select the file first");
      return ;
    }
    const signed = await getSignedUrl(file);   //signed: json object  (like dictionary)
    const uploadUrl = signed.presigned_url;
    const s3_key = signed.key;
    seturlResult(
      `presigned url: ${uploadUrl}\nexpired in: 120 seconds\n`
    );
    //encrypt file content
    const content = await file.text();
    const encrypted = encryptXOR_UTF8(content, "abc123");
    const encryptedBlob = new Blob([encrypted], { type: "text/plain"}); // 內容包裝成Blob
    //  Blob : “前端中的檔案內容”，但不一定有檔名

    // put -> s3
    const putRes = await fetch(uploadUrl, {  
      method: "PUT",
      headers: {
        "Content-Type": file.type || "application/octet-stream"
      },
      body: encryptedBlob
    });
    if (!putRes.ok) {
      alert("Upload failed: " + putRes.status);
      return;
    }
    setuploadResult(
      `Upload success!\nS3 Key: ${s3_key}\nPublic URL (if your bucket allows): https://your-bucket.s3.amazonaws.com/${signed.key}`
    );

    // 通知後端 上傳s3成功   後端收到通知後才傳message to SQS
    const notiRes = await fetch(" https://cloud-upload-backend.onrender.com/upload_success", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({   
        key: s3_key,               // 存到 S3 的 key
        bucket: "upload-demo-nick"
      })
    })
    console.log(notiRes.body)
  }                                             


  return (            // using JSX describe UI
    <div style={{ padding: "50px" }}> 
      <h1>Upload to S3</h1>  
      <input          // a tag ,  a React element
        type="file"   //  HTML:attribute  JSX:prop (property，屬性)
        accept=".txt"
        onChange={handleFileChange}
        //onChange={(e) => setFile(e.target.files[0])}
        //   選檔 ->onChange 觸發 ->React捕捉change事件 ->React呼叫箭頭函式
        //   e:event object整個事件 被作為參數送進函式 -> 執行函式   沒有e=沒參數
      />
      <div style={{ marginTop: "10px", color: "#bbb", fontSize: "0.9rem" }}>
        <small>📄 allow file type：<strong>.txt</strong> file</small><br />
        <small>📏 檔案限制：<strong>50 KB</strong></small>
      </div> 

      <button 
        style={{ display: "block", marginTop: "10px" }} 
        onClick={handleUpload}
      >
        Encrypt & Upload ! 
      </button>
      <pre>{urlResult}</pre> 
      <pre>{uploadResult}</pre>
    </div>
  );
}
export default App