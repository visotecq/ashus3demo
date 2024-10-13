import React,{useState,useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form,Container,Row,Col,Card} from 'react-bootstrap';
import AWS from 'aws-sdk';

window.Buffer = window.Buffer || require("buffer").Buffer;
function App() {
 

  const S3_BUCKET ='uploadimagesfromuser';
  const REGION ='us-east-1';
  

  AWS.config.update({
    accessKeyId: 'AKIAU67XKWU4M6HRWSCL',
    secretAccessKey: '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'
})

const myBucket = new AWS.S3({
  params: { Bucket: S3_BUCKET},
  region: REGION,
})
const myBucketList = new AWS.S3({
  params: { Bucket: S3_BUCKET, Delimiter:'/'},
  region: REGION,
})


  const [listFiles, setListFiles] = useState([]);

  useEffect(() => {
    myBucketList.listObjects((err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        setListFiles(data.Contents);
        //  console.log(data.Contents);
      }
    });
  }, []);



  
console.log(listFiles)
const s3_url = 'https://uploadimagesfromuser.s3.amazonaws.com/';
const pics = listFiles.map((item)=>
<Col sm={true}>
    <Card style={{ width: '18rem' }}>
    <Card.Img variant="top" src={s3_url+item.Key} height={'200rem'}/>
    <Card.Body>
      <Card.Title>Pic Courtesy 
      
      </Card.Title>
      <Card.Text>
        Photographer Name
      </Card.Text>
     
    </Card.Body>
  </Card>
  </Col>
 
)
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
    <Container style={{ marginTop:'40px' }} >
      <Row>
        <Col sm={true}>
        </Col>
        <Col sm={true}>
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Default file input example {progress}%</Form.Label>
              <Form.Control type="file" onChange={handleUpload} />
            </Form.Group>
              <Form.Control type='submit' name='Submit'/>
        </Form>
        </Col>
        <Col sm={true}>
        </Col>
      </Row>
    </Container>

    <Container style={{ marginTop:'80px' }}>
      <Row>
        {pics}
      </Row>
    </Container>
   
    </>
  );
}

export default App;
