import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { GET_ME } from '../utils/queries'; 
import { REMOVE_BOOK } from '../utils/mutations'; 
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  // Use useQuery to fetch user data
  const { loading, data } = useQuery(GET_ME);
  
  // Use useMutation to execute REMOVE_BOOK mutation
  const [removeBook] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      // Update the cache after removing the book if needed
      const { me } = cache.readQuery({ query: GET_ME });
      cache.writeQuery({
        query: GET_ME,
        data: { me: { ...me, savedBooks: me.savedBooks.filter(book => book.bookId !== removeBook.bookId) } },
      });
    }
  });

  // Check if data is available
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  const userData = data.me; // Directly use data from useQuery

  // Create function to delete the book
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await removeBook({
        variables: { bookId },
      });

      // Upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors.join(', ')}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
