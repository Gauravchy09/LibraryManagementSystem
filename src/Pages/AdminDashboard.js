import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Stack, Chip, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Delete, Edit, AddCircle } from '@mui/icons-material';
import { alignProperty } from '@mui/material/styles/cssUtils';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentView, setCurrentView] = useState('users');
  const [showAddBook, setShowAddBook] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true); 
  const [newBook, setNewBook] = useState({
    title: '', author: '', genre: '', publisher: '', isbn: '', publishedYear: '', totalCopies: '', availableCopies: ''
  });
  const [editingBookId, setEditingBookId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
  const [transactionSearchQuery, setTransactionSearchQuery] = useState('');

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Set loggedIn state to false to reflect that the user is logged out
    setLoggedIn(false);
  
    // Redirect to login page
    window.location.href = '/signin';  // Update with your actual login path
  };
  

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${backendUrl}/api/admin/transactions`, { headers });
        setTransactions(res.data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, []);

  const handleSearchChange = (e) => {
    setTransactionSearchQuery(e.target.value);
  };

  const filteredTransactions = transactions.filter((transaction) =>
  (transaction.user?.username?.toLowerCase().includes(transactionSearchQuery.toLowerCase()) ||
    transaction.book?.bookId?.toString().includes(transactionSearchQuery))
  );


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [usersRes, booksRes, transactionsRes, categoriesRes] = await Promise.all([
          axios.get(`${backendUrl}/api/admin/user`, { headers }),
          axios.get(`${backendUrl}/api/admin/books`, { headers }),
          axios.get(`${backendUrl}/api/admin/transactions`, { headers }),
          axios.get(`${backendUrl}/api/admin/categories`, { headers })
        ]);

        setUsers(usersRes.data);
        setBooks(booksRes.data);
        setTransactions(transactionsRes.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`${backendUrl}/api/admin/user/delete/${userId}`, { headers });
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      await axios.delete(`${backendUrl}/api/admin/book/delete/${bookId}`, { headers });
      setBooks(books.filter(book => book.bookId !== bookId));
      alert('Book deleted successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleAddOrUpdateBook = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      if (editingBookId) {
        await axios.put(`${backendUrl}/api/admin/book/update/${editingBookId}`, newBook, { headers });
        alert('Book updated successfully!');
        window.location.reload();
      } else {
        await axios.post(`${backendUrl}/api/admin/book/add`, newBook, { headers });
        alert('Book added successfully!');
        window.location.reload();
      }
      setShowAddBook(false);
      setNewBook({ title: '', author: '', genre: '', publisher: '', isbn: '', publishedYear: '', totalCopies: '', availableCopies: '' });
      setEditingBookId(null);
    } catch (error) {
      console.error('Error adding/updating book:', error);
    }
  };

  const handleEditBook = (book) => {
    setNewBook({
      title: book.title,
      author: book.author,
      genre: book.genre,
      publisher: book.publisher,
      isbn: book.isbn,
      publishedYear: book.publishedYear,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies
    });
    setEditingBookId(book.bookId);
    setShowAddBook(true);
  };

  const renderUsers = () => (
    <div>
      <TextField
        label="Search Users (Username or Email)"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 2, marginTop: 2 }}
      />
      <TableContainer component={Paper} sx={{ maxWidth: 900, margin: '20px auto', borderRadius: '12px', boxShadow: 3 }}>
        <Typography variant="h5" sx={{ margin: '10px 0', textAlign: 'center' }}>👥 Users</Typography>
        <Table>
          <TableHead sx={{ backgroundColor: '#E3F2FD' }}>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.filter(user =>
              user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
              user.email.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(user => (
              // Only show logged-in admin
              user.role !== 'admin' ? (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : null
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  const renderBooks = () => (
    <div>
      {/* Search Input */}
      <TextField
        label="Search by Title, Author, or Genre"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ margin: '20px 0' }}
      />

      <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: '20px auto', borderRadius: '12px', boxShadow: 3 }}>
        <Typography variant="h5" sx={{ margin: '10px 0', textAlign: 'center' }}>📚 Books</Typography>
        <Table>
          <TableHead sx={{ backgroundColor: '#E8F5E9' }}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>ISBN</TableCell>
              <TableCell>Published Year</TableCell>
              <TableCell>Total Copies</TableCell>
              <TableCell>Available Copies</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBooks.map(book => (
              <TableRow key={book.bookId}>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.publishedYear}</TableCell>
                <TableCell>{book.totalCopies}</TableCell>
                <TableCell>{book.availableCopies}</TableCell>
                <TableCell>{book.genre}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => handleDeleteBook(book.bookId)}>Delete</Button>
                    <Button variant="outlined" color="primary" startIcon={<Edit />} onClick={() => handleEditBook(book)}>Edit</Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Book Section */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircle />}
        sx={{ display: 'block', margin: '20px auto' }}
        onClick={() => setShowAddBook(true)}
      >
        Add Book
      </Button>
    </div>
  );


  const renderTransactions = () => (
    <div>
      <TextField
        label="Search Transactions (Username or Book ID)"
        variant="outlined"
        fullWidth
        value={transactionSearchQuery}
        onChange={handleSearchChange}
        sx={{ marginBottom: 2, marginTop: 2 }}
      />
      <TableContainer component={Paper} sx={{ maxWidth: 900, margin: '20px auto', borderRadius: '12px', boxShadow: 3 }}>
        <Typography variant="h5" sx={{ margin: '10px 0', textAlign: 'center' }}>💼 Transactions</Typography>
        <Table>
          <TableHead sx={{ backgroundColor: '#FFEBEE' }}>
            <TableRow>
              <TableCell>Transaction ID</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Book ID</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Return Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.transactionId}>
                <TableCell>{transaction.transactionId}</TableCell>
                <TableCell>{transaction.user ? transaction.user.id : 'N/A'}</TableCell>
                <TableCell>{transaction.user ? transaction.user.username : 'N/A'}</TableCell>
                <TableCell>{transaction.user ? transaction.user.email : 'N/A'}</TableCell>
                <TableCell>{transaction.book.bookId ? transaction.book.bookId : 'N/A'}</TableCell>
                <TableCell>{transaction.issueDate ? new Date(transaction.issueDate).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{transaction.returnDate ? new Date(transaction.returnDate).toLocaleDateString() : 'N/A'}</TableCell>
                <TableCell>{transaction.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  const renderCategories = () => (
    <div>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>📝 Categories</Typography>
      <Stack direction="row" spacing={1}>
        {categories.map((category) => (
          <Chip key={category.id} label={category.name} color="primary" />
        ))}
      </Stack>
    </div>
  );

  return (
    <Card sx={{ maxWidth: 1200, margin: '40px auto', padding: 2 }}>
      <h1 style={{textAlign:'left',paddingLeft:'2rem'}}  className="logo">Library<span className="highlight">MS</span></h1>
      <CardContent>
        <Typography variant="h4" sx={{ marginBottom: 2 }}>📚 Admin Dashboard</Typography>
        <Stack direction="row" spacing={2} sx={{ marginBottom: 3 }}>
          <Button variant="contained" color={currentView === 'users' ? 'primary' : 'secondary'} onClick={() => setCurrentView('users')}>Users</Button>
          <Button variant="contained" color={currentView === 'books' ? 'primary' : 'secondary'} onClick={() => setCurrentView('books')}>Books</Button>
          <Button variant="contained" color={currentView === 'transactions' ? 'primary' : 'secondary'} onClick={() => setCurrentView('transactions')}>Transactions</Button>
          <Button variant="contained" color={currentView === 'categories' ? 'primary' : 'secondary'} onClick={() => setCurrentView('categories')}>Categories</Button>
          <Button
            variant="contained"
            color={loggedIn ? 'primary' : 'secondary'}
            onClick={handleLogout}
            sx={{ marginLeft: 'auto', display: 'block', marginTop: 2 }}
          >
            Logout
          </Button>
        </Stack>

        {currentView === 'users' && renderUsers()}
        {currentView === 'books' && renderBooks()}
        {currentView === 'transactions' && renderTransactions()}
        {currentView === 'categories' && renderCategories()}

        {/* Add/Edit Book Dialog */}
        <Dialog open={showAddBook} onClose={() => setShowAddBook(false)}>
          <DialogTitle>{editingBookId ? 'Edit Book' : 'Add Book'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              fullWidth
              variant="outlined"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Author"
              fullWidth
              variant="outlined"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Genre"
              fullWidth
              variant="outlined"
              value={newBook.genre}
              onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Publisher"
              fullWidth
              variant="outlined"
              value={newBook.publisher}
              onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="ISBN"
              fullWidth
              variant="outlined"
              value={newBook.isbn}
              onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Published Year"
              fullWidth
              variant="outlined"
              value={newBook.publishedYear}
              onChange={(e) => setNewBook({ ...newBook, publishedYear: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Total Copies"
              fullWidth
              variant="outlined"
              value={newBook.totalCopies}
              onChange={(e) => setNewBook({ ...newBook, totalCopies: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Available Copies"
              fullWidth
              variant="outlined"
              value={newBook.availableCopies}
              onChange={(e) => setNewBook({ ...newBook, availableCopies: e.target.value })}
              sx={{ marginBottom: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddBook(false)} color="secondary">Cancel</Button>
            <Button onClick={handleAddOrUpdateBook} color="primary">{editingBookId ? 'Update' : 'Add'} Book</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
