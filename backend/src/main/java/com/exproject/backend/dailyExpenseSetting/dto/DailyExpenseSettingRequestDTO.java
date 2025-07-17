package com.exproject.backend.dailyExpenseSetting.dto;

import com.exproject.backend.user.userInfo.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyExpenseSettingRequestDTO {
    private Double dailyAmount;
    private String description;
    private Long userId;

    public DailyExpenseSettingRequestDTO(User user) {
        this.dailyAmount = 0.0;
        this.description = "Daily Expense";
        this.userId = user.getId();
    }
}
