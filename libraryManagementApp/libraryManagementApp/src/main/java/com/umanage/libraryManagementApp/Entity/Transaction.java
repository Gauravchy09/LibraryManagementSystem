package com.umanage.libraryManagementApp.Entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int transactionId;

    @ManyToOne
    @JoinColumn(name = "user_id")  // Fixed field name
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id")  // Fixed field name
    private Book book;

    private LocalDate issueDate;  // Fixed typo from issuDate
    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    private Status status;
}
