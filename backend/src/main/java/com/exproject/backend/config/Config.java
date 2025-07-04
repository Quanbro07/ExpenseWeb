package com.exproject.backend.config;

import com.exproject.backend.balance.BalanceRepository;
import com.exproject.backend.balance.balanceInfo.Balance;
import com.exproject.backend.dailyExpenseSetting.DailyExpenseSettingRepository;
import com.exproject.backend.dailyExpenseSetting.dailyExpenseSettingInfo.DailyExpenseSetting;
import com.exproject.backend.expense.ExpenseRepository;
import com.exproject.backend.expense.expenseInfo.Expense;
import com.exproject.backend.expenseCategory.ExpenseCategoryRepository;
import com.exproject.backend.expenseCategory.expenseCategoryInfo.ExpenseCategory;
import com.exproject.backend.expenseCategory.expenseCategoryInfo.ExpenseCategoryEnum;
import com.exproject.backend.user.UserRepository;
import com.exproject.backend.user.userInfo.User;
import com.exproject.backend.user.userInfo.UserRole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Configuration
@Order(2)
@Transactional
public class Config {

    @Bean
    CommandLineRunner CommandLineRunner(BalanceRepository balanceRepository,
                                        UserRepository userRepository,
                                        ExpenseRepository expenseRepository,
                                        DailyExpenseSettingRepository dailyExpenseSettingRepository,
                                        ExpenseCategoryRepository expenseCategoryRepository) {
        return args -> {
            // User
            User user1 = User.builder()
                    .userName("Quân")
                    .email("quanbro7612006@gmail.com")
                    .password("quanbro7")
                    .role(UserRole.User)
                    .build();

            User user2 = User.builder()
                    .userName("Khoa")
                    .email("khoaga612006@gmail.com")
                    .password("khoabro7")
                    .role(UserRole.User)
                    .build();

            User user3 = User.builder()
                    .userName("Trong")
                    .email("trongga112320@gmail.com")
                    .password("trongbro7")
                    .role(UserRole.Admin)
                    .build();

            userRepository.saveAll(List.of(user1,user2,user3));

            // Balance
            Balance balance1 = new Balance(1000000.0,
                    10000000.0,
                    3000000.0,
                    1000000.0,
                    LocalDate.of(2025,7,1),
                    user1);

            Balance balance2 = new Balance(8000000.0,
                    15000000.0,
                    5000000.0,
                    2000000.0,
                    LocalDate.of(2025,7,1),
                    user2);

            Balance balance3 = new Balance(50000000.0,
                    50000000.0,
                    10000000.0,
                    5000000.0,
                    LocalDate.of(2025,7,1),
                    user3);

            balanceRepository.saveAll(List.of(balance1, balance2, balance3));

            // Daily Expense
            DailyExpenseSetting dailyExpense1 = new DailyExpenseSetting(
                    200000.0,
                    "Daily expense user_1"
                    ,user1
            );

            DailyExpenseSetting dailyExpense2 = new DailyExpenseSetting(
                    100000.0,
                    "Daily expense user_2"
                    ,user2
            );

            DailyExpenseSetting dailyExpense3 = new DailyExpenseSetting(
                    500000.0,
                    "Daily expense user_3"
                    ,user3
            );

            dailyExpenseSettingRepository.saveAll(List.of(dailyExpense1,dailyExpense2,dailyExpense3));

            // Expense
            Expense expense1 = new Expense(
                    150000.0,
                    LocalDate.of(2025,7,1),
                    LocalDate.now().minusDays(1),
                    "Tiêu xài ổn áp user_1",
                    Boolean.FALSE,
                    user1
            );

            Expense expense2 = new Expense(
                    200000.0,
                    LocalDate.of(2025,7,1),
                    LocalDate.now().minusDays(1),
                    "Tiêu xài ổn áp user_2",
                    Boolean.FALSE,
                    user2
            );

            Expense expense3 = new Expense(
                    500000.0,
                    LocalDate.of(2025,7,1),
                    LocalDate.now().minusDays(1),
                    "Tiêu xài hoang phí user_3",
                    Boolean.FALSE,
                    user3
            );

            Expense expense4 = new Expense(
                    500000.0,
                    LocalDate.of(2025,6,30),
                    LocalDate.of(2025,7,1),
                    "Tiêu xài hoang phí user_3",
                    Boolean.TRUE,
                    user3
            );

            expenseRepository.saveAll(List.of(expense1,expense2,expense3,expense4));

            // Expense Category
            ExpenseCategory expenseCategory1 = new ExpenseCategory(
                    100000.0,
                    ExpenseCategoryEnum.FoodAndDrink,
                    expense1
            );

            ExpenseCategory expenseCategory2 = new ExpenseCategory(
                    50000.0,
                    ExpenseCategoryEnum.Shopping,
                    expense1
            );

            ExpenseCategory expenseCategory3 = new ExpenseCategory(
                    100000.0,
                    ExpenseCategoryEnum.Shopping,
                    expense2
            );

            ExpenseCategory expenseCategory4 = new ExpenseCategory(
                    100000.0,
                    ExpenseCategoryEnum.Education,
                    expense2
            );

            ExpenseCategory expenseCategory5 = new ExpenseCategory(
                    500000.0,
                    ExpenseCategoryEnum.FoodAndDrink,
                    expense3
            );

            ExpenseCategory expenseCategory6 = new ExpenseCategory(
                    500000.0,
                    ExpenseCategoryEnum.Shopping,
                    expense3
            );

            expenseCategoryRepository.saveAll(List.of(
                    expenseCategory1,expenseCategory2,expenseCategory3,expenseCategory4,
                    expenseCategory5,expenseCategory6));

        };
    }
}
