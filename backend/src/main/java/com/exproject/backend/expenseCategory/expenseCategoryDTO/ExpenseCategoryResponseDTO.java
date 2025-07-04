package com.exproject.backend.expenseCategory.expenseCategoryDTO;

import com.exproject.backend.expense.expenseInfo.Expense;
import com.exproject.backend.expenseCategory.expenseCategoryInfo.ExpenseCategory;
import com.exproject.backend.expenseCategory.expenseCategoryInfo.ExpenseCategoryEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseCategoryResponseDTO {
    private Double amount;
    private ExpenseCategoryEnum expenseCategory;

    public ExpenseCategoryResponseDTO(ExpenseCategory expenseCategory) {
        this.amount = expenseCategory.getAmount();
        this.expenseCategory = expenseCategory.getExpenseCategory();
    }
}
