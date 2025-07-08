package com.exproject.backend.dailyExpenseSetting.dto;

import com.exproject.backend.dailyExpenseSetting.dailyExpenseSettingInfo.DailyExpenseSetting;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyExpenseSettingResponseDTO {
    private Double dailyAmount;
    private String description;

    public DailyExpenseSettingResponseDTO(DailyExpenseSetting dailyExpenseSetting) {
        this.dailyAmount = dailyExpenseSetting.getDailyAmount();
        this.description = dailyExpenseSetting.getDescription();
    }
}
