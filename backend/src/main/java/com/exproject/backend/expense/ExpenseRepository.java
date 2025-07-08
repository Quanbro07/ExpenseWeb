package com.exproject.backend.expense;

import com.exproject.backend.expense.expenseInfo.Expense;
import com.exproject.backend.user.userInfo.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    Optional<Expense> findByUserIdAndCreateDate(Long userId,LocalDate createDate);
    Optional<Expense> findByUserIdAndExpenseDate(Long userId,LocalDate expenseDate);
    Optional<Expense> findById(Long id);

    List<Expense> findAllByUserId(Long userId);
    List<Expense> findAllByExpenseDate(LocalDate expenseDate);
}
