import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import logo from '../assets/LogoAnimeOdissey.png'
import { Link } from 'react-router-dom'
import { useState } from 'react'

function MyNav() {
  const [hoveredLink, setHoveredLink] = useState(null)
  const [hoveredLogo, setHoveredLogo] = useState(false)

  const baseLinkStyle = {
    color: 'white',
    fontWeight: '600',
    fontSize: '1.15rem',
    padding: '8px 16px',
    borderRadius: '12px',
    textDecoration: 'none',
    transition: 'all 0.25s ease',
    userSelect: 'none',
  }

  const hoveredLinkStyle = {
    color: '#ff00ff',
    background: 'rgba(255, 0, 255, 0.15)',
    boxShadow: '0 0 10px #ff00ffaa',
    transform: 'scale(1.1)',
  }

  const linkStyle = (isHovered) =>
    isHovered ? { ...baseLinkStyle, ...hoveredLinkStyle } : baseLinkStyle

  const logoStyle = {
    width: '180px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: hoveredLogo
      ? '0 0 20px 5px #ff00ffbb, 0 0 30px 10px #ff00ff55'
      : '0 0 5px 1px transparent',
    transform: hoveredLogo ? 'scale(1.15)' : 'scale(1)',
    borderRadius: '12px',
  }

  return (
    <Navbar
      expand="lg"
      variant="dark"
      style={{
        background:
          'linear-gradient(90deg, #2a005f, #7f00ff, #ff00ff, #7f00ff, #2a005f)',
        boxShadow: '0 4px 12px rgba(127,0,255,0.6)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Container
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1200px',
        }}
      >
        <Nav style={{ display: 'flex', gap: '16px' }}>
          <Link
            to="/"
            style={linkStyle(hoveredLink === 'home')}
            onMouseEnter={() => setHoveredLink('home')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            Home
          </Link>
        </Nav>

        <Navbar.Brand
          as={Link}
          to="/"
          onMouseEnter={() => setHoveredLogo(true)}
          onMouseLeave={() => setHoveredLogo(false)}
          style={{ display: 'flex', justifyContent: 'center', flexGrow: 1 }}
        >
          <img src={logo} alt="Logo Anime Odissey" style={logoStyle} />
        </Navbar.Brand>

        <Nav style={{ display: 'flex', gap: '16px' }}>
          <Link
            to="/list"
            style={linkStyle(hoveredLink === 'list')}
            onMouseEnter={() => setHoveredLink('list')}
            onMouseLeave={() => setHoveredLink(null)}
          >
            La mia lista
          </Link>
        </Nav>
      </Container>
    </Navbar>
  )
}

export default MyNav
