package com.exproject.backend.balance.balanceDTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BalanceResponseMonthlyStatusDTO {
    private Double monthlyLimitedExpense;
    private Double monthlyExpense;
    private boolean isExceeded;
    private Double exceedAmount;
    private Double percentageUsed;
}
