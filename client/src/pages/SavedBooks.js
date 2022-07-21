import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { REMOVE_BOOK } from "../utils/mutations";
import { GET_ME } from "../utils/queries";
import {
  Jumbotron,
  Container,
  CardColumns,
  Card,
  Button,
} from "react-bootstrap";

// import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";

const SavedBooks = () => {
  const { loading, error, data } = useQuery(GET_ME);
  const [removeBook] = useMutation(REMOVE_BOOK);
  // create function that accepts the book's mongo _id value as param and deletes the book from the database
  const handleDeleteBook = async (bookId) => {
    try {
      // console.log(bookId);
      const response = await removeBook({ variables: { bookId } });

      if (!response) {
        throw new Error("something went wrong!");
      }

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // if data isn't here yet, say so
  if (loading) {
    return <h2>LOADING...</h2>;
  }
  if (error) return <h2>Error! {error.message}</h2>;

  const userData = data.me || [];

  if (userData) {
    return (
      <>
        <Jumbotron fluid className="text-light bg-dark">
          <Container>
            <h1>Viewing saved books!</h1>
          </Container>
        </Jumbotron>
        <Container>
          <h2>
            {userData.bookCount > 0
              ? `Viewing ${userData.bookCount} saved ${
                  userData.bookCount === 1 ? "book" : "books"
                }:`
              : "You have no saved books!"}
          </h2>
          <CardColumns>
            {userData.savedBooks.map((book) => {
              return (
                <Card key={book.bookId} border="dark">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button
                      className="btn-block btn-danger"
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              );
            })}
          </CardColumns>

          {error && (
            <div className="col-12 my-3 bg-danger text-white p-3">
              {error.message}
            </div>
          )}
        </Container>
      </>
    );
  }
};

export default SavedBooks;
