import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import { CheckCircle, Cancel, ArrowBack } from '@mui/icons-material';

const Profile = () => {
    const [profile, setProfile] = useState({});
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [returnedBooks, setReturnedBooks] = useState([]);
    const [totalBorrowedCount, setTotalBorrowedCount] = useState(0);
    const [totalReturnedCount, setTotalReturnedCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Authorization token missing. Please sign in.');
            return;
        }

        axios.get('http://localhost:8080/api/user/profile', {
            headers: { Authorization: `Bearer ${token}` },
        }).then((response) => {
            setProfile(response.data);

            axios.get(`http://localhost:8080/api/user/${response.data.id}/borrowed-books`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then((res) => {
                const borrowed = res.data.filter(book =>
                    book.transactions?.some(transaction => !transaction.returnDate)
                );

                const returned = res.data.filter(book =>
                    book.transactions?.some(transaction =>
                        transaction.returnDate && transaction.user?.id === response.data.id
                    )
                );

                setBorrowedBooks(borrowed);
                setReturnedBooks(returned);
                setTotalBorrowedCount(res.data.length);

                const returnedCount = res.data.reduce((count, book) => {
                    if (book.transactions) {
                        book.transactions.forEach(transaction => {
                            if (transaction.returnDate && transaction.user?.id === response.data.id) {
                                count++;
                            }
                        });
                    }
                    return count;
                }, 0);

                setTotalReturnedCount(returnedCount);
            }).catch((error) => console.error('Error fetching borrowed books:', error));
        }).catch((error) => console.error('Error fetching profile:', error));
    }, []);

    const handleReturnBook = (transactionId, bookId) => {
        const token = localStorage.getItem('token');
        axios.post(`http://localhost:8080/api/user/${profile.id}/return/${bookId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(() => {
            const updatedBorrowedBooks = borrowedBooks.flatMap(book =>
                book.transactions
                    ?.filter(t => t.transactionId !== transactionId)
                    .length > 0
                    ? { ...book, transactions: book.transactions.filter(t => t.transactionId !== transactionId) }
                    : []
            );

            const returnedBook = borrowedBooks.find(book =>
                book.transactions?.some(t => t.transactionId === transactionId)
            );

            if (returnedBook) {
                const updatedReturnedBook = {
                    ...returnedBook,
                    transactions: returnedBook.transactions.map(t =>
                        t.transactionId === transactionId
                            ? { ...t, returnDate: new Date().toISOString().split('T')[0] }
                            : t
                    )
                };

                setReturnedBooks((prevReturned) => [...prevReturned, updatedReturnedBook]);
                setTotalReturnedCount(prevCount => prevCount + 1);

            }

            setBorrowedBooks(updatedBorrowedBooks);
            setTotalBorrowedCount(prevCount => prevCount);
            alert('Book returned successfully!');
            window.location.reload();
        }).catch((error) => console.error('Error returning book:', error));
    };

    return (
        <div>
            <Navbar />
            <div className="profile-container">
                <Card sx={{ maxWidth: 600, margin: '20px auto', padding: '20px', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: '#fff', boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 'bold' }}>Profile</Typography>
                        <Typography variant="h6">👤 Username: {profile.username}</Typography>
                        <Typography variant="h6">📧 Email: {profile.email}</Typography>
                        <Typography variant="h6">🏠 Address: {profile.address || 'N/A'}</Typography>
                        <Typography variant="h6">📚 Books Borrowed (All Time): {totalBorrowedCount}</Typography>
                        <Typography variant="h6">✅ Books Returned (Your Returns): {totalReturnedCount}</Typography>
                    </CardContent>
                </Card>

                {/* Borrowed Books Table */}
                <TableContainer component={Paper} className="table-container" sx={{ maxWidth: 900, margin: '20px auto', borderRadius: '12px', boxShadow: 3 }}>
                    <Typography variant="h5" sx={{ margin: '10px 0', textAlign: 'center' }}>📖 Borrowed Books (Pending Return)</Typography>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#E3F2FD' }}>
                            <TableRow>
                                <TableCell>Transaction ID</TableCell>
                                <TableCell>Book Title</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Borrow Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {borrowedBooks.length > 0 ? (
                                borrowedBooks.flatMap((book) =>
                                    book.transactions
                                        ?.filter(transaction => !transaction.returnDate)
                                        .map((transaction) => (
                                            <TableRow key={transaction.transactionId}>
                                                <TableCell>{transaction.transactionId}</TableCell>
                                                <TableCell>{book.title}</TableCell>
                                                <TableCell>{book.author}</TableCell>
                                                <TableCell>{transaction.issueDate || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        onClick={() => handleReturnBook(transaction.transactionId, book.bookId)}
                                                        variant="contained"
                                                        color="error"
                                                        startIcon={<ArrowBack />}
                                                    >
                                                        Return
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )) || []
                                )
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">🎯 No pending books to return.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Returned Books Table */}
                <TableContainer component={Paper} className="table-container" sx={{ maxWidth: 900, margin: '20px auto', borderRadius: '12px', boxShadow: 3 }}>
                    <Typography variant="h5" sx={{ margin: '10px 0', textAlign: 'center' }}>📚 Returned Books (Your Returns)</Typography>
                    <Table>
                        <TableHead sx={{ backgroundColor: '#E8F5E9' }}>
                            <TableRow>
                                <TableCell>Transaction ID</TableCell>
                                <TableCell>Book Title</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Borrow Date</TableCell>
                                <TableCell>Return Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {returnedBooks.length > 0 ? (
                                returnedBooks.flatMap((book) =>
                                    book.transactions
                                        .filter(transaction => transaction.user?.id === profile.id)
                                        .map((transaction) => (
                                            <TableRow key={transaction.transactionId}>
                                                <TableCell>{transaction.transactionId}</TableCell>
                                                <TableCell>{book.title}</TableCell>
                                                <TableCell>{book.author}</TableCell>
                                                <TableCell>{transaction.issueDate || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <Chip label="Returned" color="success" icon={<CheckCircle />} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">❌ No returned books available.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default Profile;