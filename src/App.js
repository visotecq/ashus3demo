import React,{useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import S3 from 'react-aws-s3';

function App() {
 
const config = {
    bucketName: 'upluploadimagesfromuser',
    dirName: 'nov-24', /* optional */
    region: 'us-east-1',
}

const ReactS3Client = new S3(config);
/*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

/* This is optional */
const newFileName = 'test-file';

const [file, setFile] = useState()
function handleUpload(e) {
  setFile(e.target.files[0])

    }

function handleSubmit(e){
    e.preventDefault();
    console.log(file)

    ReactS3Client
    .uploadFile(file, file.name)
    .then(data => console.log(data))
    .catch(err => console.error(err))
}
    
 
  /**
   * {
   *   Response: {
   *     bucket: "myBucket",
   *     key: "image/test-image.jpg",
   *     location: "https://myBucket.s3.amazonaws.com/media/test-file.jpg"
   *   }
   * }
   */





  return (
    <>
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Default file input example</Form.Label>
        <Form.Control type="file" onChange={handleUpload} />
      </Form.Group>
        <Form.Control type='submit' name='Submit'/>
      </Form>
    </>
  );
}

export default App;
