package com.exproject.backend.expense.dto;

import com.exproject.backend.expense.expenseInfo.Expense;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseResponseIdDTO {
    private LocalDate expenseDate;
    private LocalDate createDate;
    private Double amount;
    private String description;
    private Long expenseId;

    public ExpenseResponseIdDTO(Expense expense) {
        this.expenseDate = expense.getExpenseDate();
        this.createDate = expense.getCreateDate();
        this.amount = expense.getAmount();
        this.description = expense.getDescription();
        this.expenseId = expense.getId();
    }
}
