import { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { Container, Col, Form, Button, Card, Row, Spinner } from 'react-bootstrap';
import Auth from '../utils/auth';
import { SAVE_BOOK } from '../utils/mutations';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const [saveBook] = useMutation(SAVE_BOOK);

  // Debounced fetchBooks function
  const fetchBooks = useCallback(
    async (input) => {
      if (!input) return;

      setLoading(true);
      try {
        const response = await searchGoogleBooks(input);
        if (response.status === 429) {
          // Handle 429 Too Many Requests
          alert('Too many requests. Please try again later.');
          return;
        }

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const { items } = data;

        if (!items || items.length === 0) {
          throw new Error('No books found');
        }

        const bookData = items.map((book) => ({
          bookId: book.id,
          authors: book.volumeInfo.authors || ['No author to display'],
          title: book.volumeInfo.title || 'No title available.',
          description: book.volumeInfo.description || 'No description available.',
          image: book.volumeInfo.imageLinks?.thumbnail || '',
          link: book.volumeInfo.infoLink || '',
        }));

        setSearchedBooks(bookData);
        setSearchInput(''); // Clear search input
      } catch (err) {
        console.error('Error occurred in fetchBooks:', err);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Debounce mechanism
    const debounceDelay = 1000; // 1 second delay
    clearTimeout(window.fetchTimeout);
    window.fetchTimeout = setTimeout(() => {
      fetchBooks(searchInput);
    }, debounceDelay);
  };

  const handleSaveBook = async (bookData) => {
    try {
      const { data } = await saveBook({
        variables: { book: { ...bookData, googlePlayLink: bookData.link } },
      });
      console.log('Book saved:', data);
      setSavedBookIds([...savedBookIds, bookData.bookId]);
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg' disabled={loading}>
                  {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Submit Search'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card border='dark'>
                {book.image && (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                      className='btn-block btn-info'
                      onClick={() => handleSaveBook(book)}>
                      {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                        ? 'This book has already been saved!'
                        : 'Save this Book!'}
                    </Button>
                  )}
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-2">
                    View on Google Play
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
