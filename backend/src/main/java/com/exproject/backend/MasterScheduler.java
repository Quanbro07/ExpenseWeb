package com.exproject.backend;

import com.exproject.backend.balance.BalanceService;
import com.exproject.backend.expense.ExpenseService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class MasterScheduler {
    private final ExpenseService expenseService;
    private final BalanceService balanceService;

    public MasterScheduler(ExpenseService expenseService, BalanceService balanceService) {
        this.expenseService = expenseService;
        this.balanceService = balanceService;
    }

    @Scheduled(cron = "0 */3 * * * *")
    public void runSchedules() {
        LocalDate today = LocalDate.now();
        System.out.println("[MASTER JOB START] " + today);

        runAllSchedules(today);
    }

    public void runAllSchedules(LocalDate today) {
        // Tạo Expense mỗi ngày
        expenseService.makeNewExpense();
        // Chỉnh sửa Balance dựa vào Expense mỗi ngày
        balanceService.manageBalanceDaily();

        // Nếu ngày đầu trong tháng add salary
        if(today.getDayOfMonth() == 1) {
            balanceService.addSalary();
        }
    }
}
