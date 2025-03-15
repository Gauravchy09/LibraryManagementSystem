import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const TransactionTable = () => {
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions when the component is mounted
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Assuming the API endpoint is something like "/api/transactions/user/{userId}"
        const response = await axios.get('/api/transactions/user/3');  // Example userId
        setTransactions(response.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    fetchTransactions();
  }, []);  // Empty dependency array ensures this runs once on mount

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
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
          {transactions.map((transaction) => (
            <TableRow key={transaction.transactionId}>
              <TableCell>{transaction.transactionId}</TableCell>
              <TableCell>{transaction.userId}</TableCell>
              <TableCell>{transaction.username}</TableCell>
              <TableCell>{transaction.email}</TableCell>
              <TableCell>{transaction.bookId}</TableCell>
              <TableCell>{transaction.issueDate}</TableCell>
              <TableCell>{transaction.returnDate || 'Not Returned'}</TableCell>
              <TableCell>{transaction.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;
