package com.exproject.backend.dailyExpenseSetting;

import com.exproject.backend.dailyExpenseSetting.dailyExpenseSettingInfo.DailyExpenseSetting;
import com.exproject.backend.dailyExpenseSetting.dto.DailyExpenseSettingRequestDTO;
import com.exproject.backend.dailyExpenseSetting.dto.DailyExpenseSettingResponseDTO;
import com.exproject.backend.user.UserRepository;
import com.exproject.backend.user.userInfo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class DailyExpenseSettingService {
    private final DailyExpenseSettingRepository dailyExpenseSettingRepository;
    private final UserRepository userRepository;

    @Autowired
    public DailyExpenseSettingService(DailyExpenseSettingRepository dailyExpenseSettingRepository, UserRepository userRepository) {
        this.dailyExpenseSettingRepository = dailyExpenseSettingRepository;
        this.userRepository = userRepository;
    }

    // Tạo daily Expense
    public ResponseEntity<DailyExpenseSettingResponseDTO> createDailyExpenseSetting(
            DailyExpenseSettingRequestDTO dailyExpenseSettingRequestDTO) {


        Optional<DailyExpenseSetting> dailyExpenseSettingOptional =
                dailyExpenseSettingRepository.findByUserId(dailyExpenseSettingRequestDTO.getUserId());

        if (dailyExpenseSettingOptional.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Daily expense setting already exists");
        }

        User existUser = userRepository.findById(dailyExpenseSettingRequestDTO.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        // Tạo Daily Expense Setting
        DailyExpenseSetting dailyExpenseSetting = DailyExpenseSetting.builder()
                .dailyAmount(dailyExpenseSettingRequestDTO.getDailyAmount())
                .description(dailyExpenseSettingRequestDTO.getDescription())
                .user(existUser)
                .build();

        dailyExpenseSettingRepository.save(dailyExpenseSetting);

        DailyExpenseSettingResponseDTO responseDTO = new
                DailyExpenseSettingResponseDTO(dailyExpenseSetting);

        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    // Update Expense Daily
    public ResponseEntity<DailyExpenseSettingResponseDTO> updateDailyExpenseSetting(
            DailyExpenseSettingRequestDTO dailyExpenseSettingRequestDTO) {
        // Check Daily Expense của User Id đó có tồn tại chưa
        DailyExpenseSetting existDailyExpenseSetting =
                dailyExpenseSettingRepository.findByUserId(dailyExpenseSettingRequestDTO.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Daily expense setting not found"));


        // Update
        existDailyExpenseSetting.setDailyAmount(dailyExpenseSettingRequestDTO.getDailyAmount());
        existDailyExpenseSetting.setDescription(dailyExpenseSettingRequestDTO.getDescription());

        // Lưu
        dailyExpenseSettingRepository.save(existDailyExpenseSetting);

        // Tạo Response DTO
        DailyExpenseSettingResponseDTO dailyExpenseSettingResponseDTO = new
                DailyExpenseSettingResponseDTO(existDailyExpenseSetting);

        return new ResponseEntity<>(dailyExpenseSettingResponseDTO, HttpStatus.OK);
    }
}
