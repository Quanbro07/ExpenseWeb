package com.exproject.backend.expense.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseRequestDTO {
    private LocalDate expenseDate;
    private Double amount;
    private String description;
    private Long userId;
}
