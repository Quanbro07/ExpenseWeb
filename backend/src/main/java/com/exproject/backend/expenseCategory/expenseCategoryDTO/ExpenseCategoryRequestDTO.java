package com.exproject.backend.expenseCategory.expenseCategoryDTO;

import com.exproject.backend.expenseCategory.expenseCategoryInfo.ExpenseCategoryEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseCategoryRequestDTO {
    private Double amount;
    private ExpenseCategoryEnum expenseCategory;
    private Long expenseId;
}
