import React,{useState,useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form,Container,Row,Col,Card} from 'react-bootstrap';
import AWS from 'aws-sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

window.Buffer = window.Buffer || require("buffer").Buffer;
function App() {
 

  const S3_BUCKET ='uploadimagesfromuser';
  const REGION ='us-east-1';
  const s3_url = 'https://uploadimagesfromuser.s3.amazonaws.com/';

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


  const handleDownload = (image_name) => {
    // const myBucketImageDown = new AWS.S3({
    //   params: { Bucket: S3_BUCKET, Key:image_name},
    //   region: REGION
    // })
    // myBucketImageDown.getObject((err, data) => {
    //   if (err) {
    //     console.log(err, err.stack);
    //   } else {
    //     console.log(data.Body.toString())
    //   }
    // });
    var url = s3_url+image_name;
    fetch(url,{mode:'cors',cache:'no-cache'})
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.download = image_name || "downloaded-file";
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error("Error fetching the file:", error);
    });
  }


  
console.log(listFiles)

const pics = listFiles.map((item)=>
<Col sm={true}>
    <Card style={{ width: '18rem' }}>
    <Card.Img variant="top" src={s3_url+item.Key} height={'200rem'} />
    <Card.Body>
      <Card.Title>Pic Courtesy 
      <span style={{ float:'right' }}>
       <a href='javascript:void(0)' onClick={() => handleDownload(item.Key)} ><FontAwesomeIcon icon={faDownload} /></a> 
       </span>

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
      setSelectedFile(e.target);
     // console.log(e.target.files)
      const fileList = e.target.files
   //   const files = []
      const filePath = (fileList[0].webkitRelativePath)
      var dirName = filePath.split('/')
      dirName = dirName[0]+'/'
      
      console.log(dirName)

      const myBucketCreateFolder = new AWS.S3({
        params: { Bucket: S3_BUCKET, Key:dirName,Body:'body does not matter'},
        region: REGION,
      })

      myBucketCreateFolder.putObject().promise();


      for (var i = 0; i < fileList.length; i++) {
        const file = fileList.item(i)
     //   files.push(file)
          const params = {
            Body: file,
            Bucket: S3_BUCKET,
            Key: dirName+file.name
        };

        myBucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                setProgress(Math.round((evt.loaded / evt.total) * 100))
            })
            .send((err) => {
                if (err) console.log(err)
            })
      }
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
              update_listing()
          })
          .send((err) => {
              if (err) console.log(err)
          })
  }

function update_listing(){
    myBucketList.listObjects((err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        setListFiles(data.Contents);
        //  console.log(data.Contents);
      }
    });
}





  return (
    <>
    <Container style={{ marginTop:'40px' }} >
      <Row>
        <Col sm={true}>
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Default file input example {progress}%</Form.Label>
              <Form.Control type="file" onChange={handleUpload}  required/>
            </Form.Group>
              <Form.Control type='submit' value='Add File' name="add_files"/>
        </Form>
        </Col>
        <Col sm={true}>
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Default file input example {progress}%</Form.Label>
              <Form.Control type="file" onChange={handleUpload} directory="" webkitdirectory="" required/>
            </Form.Group>
              <Form.Control type='submit' value='Add Folder' name="add_folder"/>
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
