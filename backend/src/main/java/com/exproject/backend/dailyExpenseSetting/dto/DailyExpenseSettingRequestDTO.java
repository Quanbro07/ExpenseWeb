package com.exproject.backend.dailyExpenseSetting.dto;

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
}
