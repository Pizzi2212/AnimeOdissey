import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import logo from '../assets/LogoAnimeOdissey.png'
import { Link } from 'react-router-dom'

function MyNav() {
  return (
    <Navbar expand="lg" bg="dark" variant="dark">
      <Container className="d-flex align-items-center">
        <Nav className="flex-grow-1 fs-3">
          <Nav.Link href="#home">Home</Nav.Link>
        </Nav>

        <Navbar.Brand className="mx-auto">
          <img src={logo} width="180px" alt="Logo Anime Odissey" />
        </Navbar.Brand>

        <Nav className="flex-grow-1 justify-content-end fs-3">
          <Nav.Link href="#lista">La mia lista</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default MyNav
