package com.exproject.backend.expenseCategory.expenseCategoryInfo;

import com.exproject.backend.expense.expenseInfo.Expense;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "expense_category_table")
public class ExpenseCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ExpenseCategoryEnum expenseCategory;

    private Double amount;

    @ManyToOne
    @JoinColumn(name = "expense_id",referencedColumnName = "id")
    private Expense expense;

    public ExpenseCategory(Double amount, ExpenseCategoryEnum expenseCategory, Expense expense) {
        this.amount = amount;
        this.expenseCategory = expenseCategory;
        this.expense = expense;
    }
}
