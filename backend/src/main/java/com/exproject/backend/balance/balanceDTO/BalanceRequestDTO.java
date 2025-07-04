package com.exproject.backend.balance.balanceDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BalanceRequestDTO {
    private Double currentBalance;
    private Double salary;
    private Double monthlyLimitedExpense;
    private LocalDate update_at;
    private Long userId;
}
