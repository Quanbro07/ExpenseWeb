package com.exproject.backend.dailyExpenseSetting;

import com.exproject.backend.dailyExpenseSetting.dailyExpenseSettingInfo.DailyExpenseSetting;
import com.exproject.backend.dailyExpenseSetting.dto.DailyExpenseSettingRequestDTO;
import com.exproject.backend.dailyExpenseSetting.dto.DailyExpenseSettingResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/dailyExpense")
public class DailyExpenseSettingController {
    private final DailyExpenseSettingService dailyExpenseSettingService;

    @Autowired
    public DailyExpenseSettingController(DailyExpenseSettingService dailyExpenseSettingService) {
        this.dailyExpenseSettingService = dailyExpenseSettingService;
    }

    // Create
    @PostMapping("/create")
    public ResponseEntity<DailyExpenseSettingResponseDTO> create(
            @RequestBody DailyExpenseSettingRequestDTO dailyExpenseSettingRequestDTO) {

        return dailyExpenseSettingService.createDailyExpenseSetting(dailyExpenseSettingRequestDTO);
    }

    // Update
    @PutMapping("/update")
    public ResponseEntity<DailyExpenseSettingResponseDTO> update(
            @RequestBody DailyExpenseSettingRequestDTO dailyExpenseSettingRequestDTO) {

        return dailyExpenseSettingService.updateDailyExpenseSetting(dailyExpenseSettingRequestDTO);
    }




}
