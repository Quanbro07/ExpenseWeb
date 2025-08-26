package com.exproject.backend.user.userInfo;

import com.exproject.backend.balance.balanceInfo.Balance;
import com.exproject.backend.dailyExpenseSetting.dailyExpenseSettingInfo.DailyExpenseSetting;
import com.exproject.backend.expense.expenseInfo.Expense;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "user_table")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name")
    private String userName;

    @Column(name = "user_email")
    private String email;

    @Column(name = "user_password")
    private String password;

    @Column(name = "user_role")
    private UserRole role;

    @Column(name = "user_gender") // Added gender column
    private int gender;

    @Column(name = "is_active_status", columnDefinition = "boolean default true") // Explicit mapping
    @Builder.Default
    private boolean isActive = true;

    // Explicit getter and setter for isActive to ensure JPA recognizes it
    public boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private Balance balance;

    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private DailyExpenseSetting dailyExpense;

    // Lấy Daily Expense Amount
    public Double getDailyExpenseAmount() {
        return (dailyExpense != null) ? dailyExpense.getDailyAmount() : 0.0;
    }

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL,fetch = FetchType.LAZY)
    private List<Expense> expenses;
}
