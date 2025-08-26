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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

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
            // User Config
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
                    .userName("Nguyen")
                    .email("nguyenga12352035@gmail.com")
                    .password("nguyenbro7")
                    .role(UserRole.User)
                    .build();

            User user4 = User.builder()
                    .userName("Trong")
                    .email("trongga112320@gmail.com")
                    .password("trongbro7")
                    .role(UserRole.Admin)
                    .build();

            if(userRepository.count() == 0) {
                userRepository.saveAll(List.of(user1,user2,user3,user4));
            }

            // Daily Expense
            DailyExpenseSetting dailyExpense1 = new DailyExpenseSetting(
                    200000.0,
                    "Daily expense user_1"
                    ,user1
            );

            DailyExpenseSetting dailyExpense2 = new DailyExpenseSetting(
                    200000.0,
                    "Daily expense user_2"
                    ,user2
            );

            DailyExpenseSetting dailyExpense3 = new DailyExpenseSetting(
                    500000.0,
                    "Daily expense user_3"
                    ,user3
            );

            if(dailyExpenseSettingRepository.count() == 0) {
                dailyExpenseSettingRepository.saveAll(List.of(dailyExpense1,dailyExpense2,dailyExpense3));
            }

            // Expense & Expense Category Config

            List<User> users = List.of(user1, user2, user3);
            // lưu tổng chi tiêu của từng user
            Map<User, Double> monthlyTotals = new HashMap<>();
            for (User user : users) {
                // ví dụ mỗi user chi khác nhau một chút
                double baseAmount = switch (user.getUserName()) {
                    case "Quân" -> 150000.0;
                    case "Khoa" -> 200000.0;
                    case "Nguyen" -> 300000.0;
                    default -> 100000.0;
                };

                double monthlySum = 0.0;

                for (int i = 0; i < 30; i++) {
                    LocalDate expenseDate = LocalDate.now().minusDays(i);

                    // random dao động từ -50k đến +50k
                    int fluctuation = ThreadLocalRandom.current().nextInt(-50, 51) * 1000;
                    double expenseAmount = baseAmount + fluctuation;

                    if (expenseAmount < 0) expenseAmount = 0;

                    Expense expense = new Expense(
                            expenseAmount,
                            expenseDate.withDayOfMonth(1), // tháng
                            expenseDate,                   // ngày
                            "Chi tiêu ngày " + expenseDate + " của " + user.getUserName(),
                            Boolean.TRUE,
                            user
                    );

                    expenseRepository.save(expense);
                    monthlySum += expenseAmount;

                    double food = expenseAmount * 0.5;
                    double shopping = expenseAmount * 0.3;
                    double education = expenseAmount * 0.2;

                    ExpenseCategory catFood = new ExpenseCategory(food, ExpenseCategoryEnum.FoodAndDrink, expense);
                    ExpenseCategory catShopping = new ExpenseCategory(shopping, ExpenseCategoryEnum.Shopping, expense);
                    ExpenseCategory catEducation = new ExpenseCategory(education, ExpenseCategoryEnum.Education, expense);

                    expenseCategoryRepository.saveAll(List.of(catFood, catShopping, catEducation));
                }

            monthlyTotals.put(user, monthlySum);
            }

            // Balance config khớp monthlyExpense
            if (balanceRepository.count() == 0) {
                Balance balance1 = new Balance(
                        1000000.0,
                        10000000.0,
                        5000000.0,
                        monthlyTotals.get(user1), // khớp với Expense user1
                        LocalDate.of(2025, 7, 1),
                        user1
                );

                Balance balance2 = new Balance(
                        8000000.0,
                        15000000.0,
                        7000000.0,
                        monthlyTotals.get(user2), // khớp với Expense user2
                        LocalDate.of(2025, 7, 1),
                        user2
                );

                Balance balance3 = new Balance(
                        50000000.0,
                        25000000.0,
                        80000000.0,
                        monthlyTotals.get(user3), // khớp với Expense user3
                        LocalDate.of(2025, 7, 1),
                        user3
                );

                balanceRepository.saveAll(List.of(balance1, balance2, balance3));
            }
        };
    }
}
