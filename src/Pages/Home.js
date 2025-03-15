import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 
import './home.css';
import Navbar from "../components/common/Navbar";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Select, MenuItem, Typography, Box, Alert } from '@mui/material';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('title');
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Authorization token missing. Please sign in.");
      return;
    }

    const decodedToken = jwtDecode(token);

    axios.get(`http://localhost:8080/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
      setUserId(response.data.id);
      setUserName(response.data.username || "User");
    })
    .catch((error) => {
      console.error("Error fetching user details:", error);
      setError('Failed to fetch user profile.');
    });

    axios.get(`http://localhost:8080/api/user/books/available`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      setBooks(response.data);
      setFilteredBooks(response.data);
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
      setError('Failed to fetch available books.');
    });
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredBooks(books);
      return;
    }
    const results = books.filter((book) =>
      typeof book[searchCategory] === 'string' 
        ? book[searchCategory]?.toLowerCase().includes(searchTerm.toLowerCase())
        : String(book[searchCategory]).includes(searchTerm)
    );
    setFilteredBooks(results);
  };

  const handleShowAllBooks = () => setFilteredBooks(books);

  const handleBorrow = (bookId) => {
    axios.post(`http://localhost:8080/api/user/${userId}/borrow/${bookId}`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then(() => {
      setBooks((prevBooks) =>
        prevBooks.map(book =>
          book.bookId === bookId
            ? { ...book, availableCopies: book.availableCopies - 1 }
            : book
        )
      );
      setFilteredBooks((prevBooks) =>
        prevBooks.map(book =>
          book.bookId === bookId
            ? { ...book, availableCopies: book.availableCopies - 1 }
            : book
        )
      );
      alert(`✅ Successfully borrowed book with ID: ${bookId}`);
    })
    .catch((error) => {
      console.error("Error borrowing book:", error);
      alert("❌ Failed to borrow book. Please try again.");
    });
  };

  return (
    <div>
      <Navbar />

      <Box className="home-container" sx={{ padding: '40px', backgroundColor: '#f9f9f9' }}>
        {error && (
          <Alert severity="error" sx={{ marginBottom: '20px' }}>
            {error}
          </Alert>
        )}

        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            marginBottom: '30px',
            fontWeight: 'bold',
            color: '#1565C0'
          }}
        >
          Welcome, {userName}! To My Library Management System
        </Typography>

        <Box className="search-container" sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          marginBottom: '30px',
          padding: '20px',
          border: '2px solid #1976D2',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          backgroundColor: '#ffffff'
        }}>
          <TextField
            label={`Search by ${searchCategory}`}
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: '350px' }}
          />

          <Select
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            sx={{ width: '200px' }}
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="genre">Genre</MenuItem>
            <MenuItem value="publishedYear">Year</MenuItem>
          </Select>

          <Button
            variant="contained"
            color="primary"
            onClick={handleSearch}
            sx={{
              height: '56px',
              width: '150px',
              fontWeight: 'bold',
              borderRadius: '12px',
              backgroundColor: '#1565C0'
            }}
          >
            Search
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleShowAllBooks}
            sx={{
              height: '56px',
              width: '150px',
              fontWeight: 'bold',
              borderRadius: '12px'
            }}
          >
            Show All Books
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ marginTop: '30px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Available Copies</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.bookId}>
                  <TableCell>{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.publishedYear}</TableCell>
                  <TableCell>{book.availableCopies}</TableCell>
                  <TableCell>
                    {book.availableCopies > 0 && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBorrow(book.bookId)}
                      >
                        Borrow
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default Home;
