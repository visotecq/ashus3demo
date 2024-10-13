import { Navbar, Container, Button ,Nav, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import { useState } from "react";
function SponsorFilter(){

    const [value, setValue] = useState(null);

    const handleChange = (val) => {
        setValue(val)
        console.log(val)
    }


    return (
        <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Sponsors :</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <ToggleButtonGroup type="checkbox"   className="mb-2" value={value} onChange={handleChange}>
            <ToggleButton id="tbg-check-1" value={1} className="sponsor-btn">
            Sponsor 1 
            </ToggleButton>
            <ToggleButton id="tbg-check-2" value={2} className="sponsor-btn">
            Sponsor 2
            </ToggleButton>
            <ToggleButton id="tbg-check-3" value={3} className="sponsor-btn">
            Sponsor 3 
            </ToggleButton>
        </ToggleButtonGroup>
            
          </Nav>
        </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
                <Button variant="primary">Assign Images</Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}

export default SponsorFilter