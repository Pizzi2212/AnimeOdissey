import { Card, Button, Col, Row, Container } from 'react-bootstrap'
import { FaHeart } from 'react-icons/fa'
import { useFavorites } from '../context/FavoriteProvider'
import { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'

function List() {
  const { favorites, removeFavorite } = useFavorites()
  const [showModal, setShowModal] = useState(false)
  const [selectedAnime, setSelectedAnime] = useState(null)
  const [scores, setScores] = useState({})

  useEffect(() => {
    const savedScores = localStorage.getItem('animeScores')
    if (savedScores) {
      setScores(JSON.parse(savedScores))
    }
  }, [])

  useEffect(() => {
    if (Object.keys(scores).length > 0) {
      localStorage.setItem('animeScores', JSON.stringify(scores))
    }
  }, [scores])

  const handleShowModal = (anime) => {
    setSelectedAnime(anime)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedAnime(null)
  }

  const handleScoreChange = (event) => {
    if (selectedAnime) {
      setScores((prevScores) => ({
        ...prevScores,
        [selectedAnime.mal_id]: event.target.value,
      }))
    }
  }

  const handleRemoveFavorite = (anime) => {
    removeFavorite(anime)
  }

  return (
    <div>
      <Container className="mt-5">
        <h2 className="text-center text-light">I tuoi Anime</h2>
        <Row xs={1} sm={2} md={3} lg={4} className="g-4 mt-4">
          {favorites.length > 0 ? (
            favorites.map((anime) => (
              <Col key={anime.mal_id}>
                <Card
                  className="h-100 w-100 border-0 shadow-lg anime-card"
                  style={{
                    borderRadius: '20px',
                    backgroundColor: '#1e1e2f',
                    color: 'white',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                  }}
                >
                  <Card.Img
                    variant="top"
                    src={anime.images.jpg.image_url}
                    alt={anime.title}
                    style={{
                      objectFit: 'cover',
                      borderTopLeftRadius: '20px',
                      borderTopRightRadius: '20px',
                      height: '400px',
                    }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="mb-3 text-white fs-5">
                      {anime.title} {anime.year ? `(${anime.year})` : ''}
                    </Card.Title>

                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <Button
                        variant="outline-light"
                        onClick={() => handleShowModal(anime)}
                        style={{ fontWeight: 'bold' }}
                      >
                        Voto:{' '}
                        <span className="badge bg-primary ms-2">
                          {scores[anime.mal_id] || '1'}
                        </span>
                      </Button>

                      <Button
                        variant="outline-danger"
                        onClick={() => handleRemoveFavorite(anime)}
                        className="ms-2"
                      >
                        <FaHeart className="me-1" /> Rimuovi
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <h5 className="text-center text-light">
              Non hai ancora aggiunto anime ai preferiti.
            </h5>
          )}
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Vota: {selectedAnime?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Inserisci il tuo voto (1 - 10):</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="10"
                value={scores[selectedAnime?.mal_id] || ''}
                onChange={handleScoreChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default List
