import { Card, Button, Col, Row, Container } from 'react-bootstrap'
import { FaHeart } from 'react-icons/fa'
import { useFavorites } from '../context/FavoriteProvider'
import { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'

function List() {
  const { favorites, removeFavorite } = useFavorites()
  const [showModalVote, setShowModalVote] = useState(false)
  const [showModalComment, setShowModalComment] = useState(false)
  const [selectedAnime, setSelectedAnime] = useState(null)
  const [scores, setScores] = useState({})
  const [comments, setComments] = useState({})
  const [expandedComments, setExpandedComments] = useState({})

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

  useEffect(() => {
    const savedComments = localStorage.getItem('animeComments')
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    }
  }, [])

  useEffect(() => {
    if (Object.keys(comments).length > 0) {
      localStorage.setItem('animeComments', JSON.stringify(comments))
    }
  }, [comments])

  const handleShowModalVote = (anime) => {
    setSelectedAnime(anime)
    setShowModalVote(true)
  }

  const handleCloseModalVote = () => {
    setShowModalVote(false)
    setSelectedAnime(null)
  }
  const handleShowModalComment = (anime) => {
    setSelectedAnime(anime)
    setShowModalComment(true)
  }

  const handleCloseModalComment = () => {
    setShowModalComment(false)
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
  const handleCommentChange = (event) => {
    if (selectedAnime) {
      setComments((prevScores) => ({
        ...prevScores,
        [selectedAnime.mal_id]: event.target.value,
      }))
    }
  }

  const handleRemoveFavorite = (anime) => {
    removeFavorite(anime)
  }

  const toggleCommentExpansion = (id) => {
    setExpandedComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
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

                    <div
                      className="mb-2 p-2"
                      style={{
                        backgroundColor: '#2a2a3f',
                        borderRadius: '10px',
                        maxHeight: expandedComments[anime.mal_id]
                          ? '200px'
                          : '60px',
                        overflowY: 'auto',
                        fontSize: '0.9rem',
                      }}
                    >
                      <strong>Commento:</strong>
                      <div>{comments[anime.mal_id] || 'Nessun commento'}</div>
                      {comments[anime.mal_id] &&
                        comments[anime.mal_id].length > 60 && (
                          <Button
                            variant="link"
                            className="text-primary p-0 mt-1"
                            style={{ fontSize: '0.8rem' }}
                            onClick={() => toggleCommentExpansion(anime.mal_id)}
                          >
                            {expandedComments[anime.mal_id]
                              ? 'Mostra meno'
                              : 'Leggi di più'}
                          </Button>
                        )}
                    </div>
                    <Button
                      className="mb-2"
                      variant="outline-light"
                      onClick={() => handleShowModalComment(anime)}
                      style={{ fontWeight: 'bold' }}
                    >
                      ✏️ Modifica commento
                    </Button>

                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <Button
                        variant="outline-light"
                        onClick={() => handleShowModalVote(anime)}
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

      <Modal show={showModalVote} onHide={handleCloseModalVote} centered>
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
          <Button variant="secondary" onClick={handleCloseModalVote}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModalComment} onHide={handleCloseModalComment} centered>
        <Modal.Header closeButton>
          <Modal.Title>Commenta: {selectedAnime?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Inserisci il tuo commento:</Form.Label>
              <Form.Control
                type="text"
                value={comments[selectedAnime?.mal_id] || ''}
                onChange={handleCommentChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalComment}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default List
