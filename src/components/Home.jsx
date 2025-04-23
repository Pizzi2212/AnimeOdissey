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
import logo from '../assets/LogoAnimeOdissey.png'
import { FaSearch } from 'react-icons/fa'

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
          `https://api.jikan.moe/v4/top/anime?limit=24&page=1`
        )
        const data = await response.json()

        const sortedByRank = data.data.sort((a, b) => a.rank - b.rank)

        setAnimeData(sortedByRank)
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
        `https://api.jikan.moe/v4/top/anime?limit=24&page=${page}`
      )
      const data = await response.json()

      const sortedByRank = data.data.sort((a, b) => a.rank - b.rank)

      setAnimeData((prev) => [...prev, ...sortedByRank])
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
      console.log(data)

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
      <Form onSubmit={handleSearch} className="my-5 w-75 mx-auto">
        <InputGroup
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            border: '2px solid #7f00ff',
            boxShadow: '0 0 10px #7f00ff55, 0 0 20px #ff00ff33',
            background:
              'linear-gradient(135deg, rgba(31,31,31,0.9), rgba(20,20,20,0.9))',
            backdropFilter: 'blur(6px)',
          }}
        >
          <Form.Control
            type="text"
            placeholder="Cerca anime..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              backgroundColor: 'transparent',
              color: 'white',
              border: 'none',
              fontWeight: '600',
              fontSize: '1.05rem',
              padding: '0.9rem',
              fontFamily: "'Orbitron', sans-serif",
              textShadow: '0 0 3px #ff00ff44',
            }}
            className="custom-placeholder"
          />

          <Button
            type="submit"
            className="px-4"
            style={{
              backgroundColor: '#ff00ff',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '1rem',
              fontFamily: "'Orbitron', sans-serif",
              boxShadow: '0 0 8px #ff00ff55',
            }}
          >
            <FaSearch className="me-2" />
            CERCA
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
                    className="w-100 h-100 border-0 shadow-lg"
                    style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = 'scale(1.02)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = 'scale(1)')
                    }
                  >
                    <Card.Img
                      variant="top"
                      src={anime.images.jpg.image_url}
                      alt={anime.title}
                      style={{
                        objectFit: 'cover',
                        height: '400px',
                      }}
                    />

                    <Card.Body
                      className="d-flex flex-column"
                      style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0.95)), url(${
                          anime.trailer?.images?.maximum_image_url ||
                          anime.images.jpg.image_url
                        })`,

                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        color: 'white',
                        backdropFilter: 'blur(6px)',
                        WebkitBackdropFilter: 'blur(6px)',
                        borderBottomLeftRadius: '20px',
                        borderBottomRightRadius: '20px',
                        padding: '1.5rem',
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                      }}
                    >
                      <Card.Title className="fs-5 fw-bold text-center mb-3">
                        {anime.title} {anime.year ? `(${anime.year})` : ''}
                      </Card.Title>

                      <h6 className="text-center mb-2">📊 MAL Rank</h6>
                      <div className="d-flex align-items-center justify-content-center mb-3">
                        <p className="fs-5 mb-0">
                          {anime.rank ? `#${anime.rank}` : 'N/A'}
                        </p>
                        <p className="fs-6 ms-3 d-flex align-items-center mb-0">
                          <CiStar size={20} className="me-1" /> {anime.score}
                        </p>
                      </div>

                      <Card.Text
                        style={{
                          fontSize: '0.85rem',
                          maxHeight: '120px',
                          overflowY: 'auto',
                        }}
                      >
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
                                color: '#0d6efd',
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

                      <div className="mt-auto d-flex justify-content-end">
                        <Button
                          variant={
                            isFavorite(anime) ? 'danger' : 'outline-danger'
                          }
                          onClick={() => addFavorite(anime)}
                          className="rounded-circle"
                          style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
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
