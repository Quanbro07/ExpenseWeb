package com.exproject.backend.balance.balanceDTO;

import com.exproject.backend.balance.balanceInfo.Balance;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BalanceResponseWithUserIdDTO {
    private Long userId;
    private Double currentBalance;
    private Double salary;
    private Double monthlyLimitedExpense;
    private Double monthlyExpense;
    private LocalDate update_at;

    public BalanceResponseWithUserIdDTO(Balance balance) {
        this.userId = balance.getUser().getId();
        this.currentBalance = balance.getCurrentBalance();
        this.salary = balance.getSalary();
        this.monthlyLimitedExpense = balance.getMonthlyLimitedExpense();
        this.monthlyExpense = balance.getMonthlyExpense();
        this.update_at = balance.getUpdate_at();
    }
}
