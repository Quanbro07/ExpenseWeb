package com.exproject.backend.dailyExpenseSetting;

import com.exproject.backend.dailyExpenseSetting.dailyExpenseSettingInfo.DailyExpenseSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DailyExpenseSettingRepository extends JpaRepository<DailyExpenseSetting, Long> {
    Optional<DailyExpenseSetting> findByUserId(Long userId);
}
