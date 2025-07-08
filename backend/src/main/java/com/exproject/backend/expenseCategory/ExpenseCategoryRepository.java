package com.exproject.backend.expenseCategory;

import com.exproject.backend.expenseCategory.expenseCategoryInfo.ExpenseCategory;
import com.exproject.backend.expenseCategory.expenseCategoryInfo.ExpenseCategoryEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, Long> {
    Optional<ExpenseCategory> findByExpenseCategoryAndExpenseId(ExpenseCategoryEnum expenseCategory, Long expenseId);

    @Query("""
        SELECT exc FROM ExpenseCategory exc
        WHERE exc.expense.user.id = :userId
            AND (:category IS NULL OR exc.expenseCategory = :category)
            AND exc.expense.expenseDate >= :fromDate
            AND exc.expense.expenseDate <= :toDate
    """)
    List<ExpenseCategory> findAllByFilteredCategories(
            @Param("userId") Long userId,
            @Param("category") ExpenseCategoryEnum category,
            @Param("fromDate") LocalDate fromDate,
            @Param("toDate") LocalDate toDate);
}
