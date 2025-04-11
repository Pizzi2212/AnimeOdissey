import { Form, Button, InputGroup, Card, Col, Row } from 'react-bootstrap'
import { useState } from 'react'
import wallpaper from '../assets/wallpaper.gif'

function Home() {
  const [search, setSearch] = useState('')
  const [animeData, setAnimeData] = useState([])

  const handleSearch = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${search}`)
      const data = await response.json()
      setAnimeData(data.data)
      console.log(data)
    } catch (error) {
      console.error('Errore nella fetch:', error)
    }
  }

  return (
    <div>
      <Form onSubmit={handleSearch} className="my-4 w-75 mx-auto">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Cerca anime..."
            value={search}
            onChange={(value) => setSearch(value.target.value)}
          />
          <Button type="submit" variant="primary">
            Cerca
          </Button>
        </InputGroup>
      </Form>

      <div className="anime-results">
        {animeData.length > 0 ? (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {animeData.map((anime) => (
              <Col key={anime.mal_id}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{anime.title}</Card.Title>
                    <Card.Text>
                      {anime.synopsis
                        ? anime.synopsis.slice(0, 100) + '...'
                        : 'No description available.'}
                    </Card.Text>
                    <Button variant="primary" href={anime.url} target="_blank">
                      Dettagli
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p>Nessun anime trovato.</p>
        )}
      </div>
    </div>
  )
}

export default Home
