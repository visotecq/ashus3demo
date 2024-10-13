import React,{useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import AWS from 'aws-sdk'


window.Buffer = window.Buffer || require("buffer").Buffer;
function App() {
  const S3_BUCKET ='uploadimagesfromuser';
  const REGION ='us-east-1';
  


const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET},
  region: REGION,
})



  const [progress , setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleUpload = (e) => {
      setSelectedFile(e.target.files[0]);
  }

  const handleSubmit = (e) => {
      e.preventDefault();
      const params = {
          Body: selectedFile,
          Bucket: S3_BUCKET,
          Key: selectedFile.name
      };

      myBucket.putObject(params)
          .on('httpUploadProgress', (evt) => {
              setProgress(Math.round((evt.loaded / evt.total) * 100))
          })
          .send((err) => {
              if (err) console.log(err)
          })
  }







  return (
    <>
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Default file input example {progress}%</Form.Label>
        <Form.Control type="file" onChange={handleUpload} />
      </Form.Group>
        <Form.Control type='submit' name='Submit'/>
      </Form>
    </>
  );
}

export default App;
