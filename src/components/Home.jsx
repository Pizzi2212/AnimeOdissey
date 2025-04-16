import {
  Form,
  Button,
  InputGroup,
  Card,
  Col,
  Row,
  Container,
  Spinner,
} from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useFavorites } from '../context/FavoriteProvider'
import { CiStar } from 'react-icons/ci'
import axios from 'axios'

function Home() {
  const [search, setSearch] = useState('')
  const [animeData, setAnimeData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const { favorites, addFavorite } = useFavorites()
  const [expanded, setExpanded] = useState({})

  useEffect(() => {
    const fetchInitialAnime = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://api.jikan.moe/v4/anime?order_by=score&sort=desc&limit=24&page=1`
        )
        const data = await response.json()

        setAnimeData(data.data)
        setPage(2)
      } catch (error) {
        console.error('Errore nel caricamento iniziale:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInitialAnime()
  }, [])

  const loadMoreAnime = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?order_by=title&sort=asc&limit=24&page=${page}`
      )
      const data = await response.json()
      setAnimeData((prev) => [...prev, ...data.data])
      setPage((prev) => prev + 1)
    } catch (error) {
      console.error('Errore nel caricamento aggiuntivo:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${search}`)
      const data = await response.json()
      // console.log(data)

      const filteredResults = data.data.filter((anime) =>
        anime.title.toLowerCase().includes(search.toLowerCase())
      )

      setAnimeData(filteredResults)
    } catch (error) {
      console.error('Errore nella fetch:', error)
    } finally {
      setLoading(false)
    }
  }

  const isFavorite = (anime) =>
    favorites.some((fav) => fav.mal_id === anime.mal_id)

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
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
          <Container className="mt-5">
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {animeData.map((anime) => (
                <Col key={anime.mal_id}>
                  <Card
                    className="w-100 h-100 border-1"
                    style={{
                      borderRadius: '20px',
                      height: expanded ? '100%' : '400px',
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
                      <Card.Title>
                        {anime.title} {anime.year ? '(' + anime.year + ')' : ''}
                      </Card.Title>
                      <div className="d-flex justify-content-between">
                        <p className="fs-4">
                          {anime.rank ? '(' + anime.rank + '°' + ')' : ''}
                        </p>
                        <div className="d-flex flex-column">
                          <p className="fs-5">
                            <CiStar size={20} /> {anime.score}
                          </p>
                        </div>
                      </div>

                      <Card.Text style={{ fontSize: '0.9rem', color: '#555' }}>
                        {anime.synopsis ? (
                          <>
                            {expanded[anime.mal_id]
                              ? anime.synopsis
                              : anime.synopsis.slice(0, 100) + '...'}
                            <button
                              onClick={() => toggleExpand(anime.mal_id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#007bff',
                                cursor: 'pointer',
                                paddingLeft: '5px',
                              }}
                            >
                              {expanded[anime.mal_id]
                                ? 'Leggi meno'
                                : 'Leggi di più'}
                            </button>
                          </>
                        ) : (
                          'Descrizione non disponibile.'
                        )}
                      </Card.Text>

                      <div className="mt-auto d-flex justify-content-between align-items-center">
                        <Button
                          variant={
                            isFavorite(anime) ? 'danger' : 'outline-danger'
                          }
                          className="ms-2"
                          onClick={() => addFavorite(anime)}
                        >
                          {isFavorite(anime) ? <FaHeart /> : <FaRegHeart />}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <div className="text-center mt-4">
              <Button
                onClick={loadMoreAnime}
                disabled={loading}
                className="px-4 py-2 rounded-pill fw-semibold shadow border-0"
                style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  transition: 'all 0.3s ease-in-out',
                }}
                onMouseEnter={(e) =>
                  (e.target.style.background =
                    'linear-gradient(135deg, #5a67d8, #6b46c1)')
                }
                onMouseLeave={(e) =>
                  (e.target.style.background =
                    'linear-gradient(135deg, #667eea, #764ba2)')
                }
              >
                {loading ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                      style={{ color: 'white' }}
                    />
                    Caricamento...
                  </>
                ) : (
                  '⬇️ Carica altri'
                )}
              </Button>
            </div>
          </Container>
        ) : (
          <h5 className="text-center text-light">
            Naviga cercando i tuoi anime preferiti
          </h5>
        )}
      </div>
    </div>
  )
}

export default Home
