import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col, Spinner } from 'react-bootstrap';
import { GET_ME } from '../utils/queries';
import { SAVE_BOOK, REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [saveBook] = useMutation(SAVE_BOOK, {
    update(cache, { data: { saveBook } }) {
      const { me } = cache.readQuery({ query: GET_ME });
      cache.writeQuery({
        query: GET_ME,
        data: { me: { ...me, savedBooks: [...me.savedBooks, saveBook] } },
      });
    },
  });

  const [removeBook] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      const { me } = cache.readQuery({ query: GET_ME });
      cache.writeQuery({
        query: GET_ME,
        data: { me: { ...me, savedBooks: me.savedBooks.filter(book => book.bookId !== removeBook.bookId) } },
      });
    },
  });

  const { loading, data } = useQuery(GET_ME);

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  const userData = data?.me;

  const handleSaveBook = async (bookData) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveBook({
        variables: {
          input: {
            authors: bookData.authors,
            description: bookData.description,
            title: bookData.title,
            bookId: bookData.bookId,
            image: bookData.image,
            link: bookData.link || '',
          },
        },
      });
      console.log('Book saved:', data);
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId },
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Container fluid className="text-light bg-dark p-5">
        <h1>Viewing saved books!</h1>
      </Container>
      <Container>
        <h2 className='pt-5'>
          {userData?.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData?.savedBooks?.map((book) => (
            <Col md="4" key={book.bookId}>
              <Card border='dark'>
                {book.image && (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <a
                    href={book.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary mt-2">
                    View on Google Play
                  </a>
                  <Button className='btn-block btn-danger mt-2' onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
