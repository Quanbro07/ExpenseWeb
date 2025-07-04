package com.exproject.backend.balance.balanceInfo;

import com.exproject.backend.user.userInfo.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "balance_table")
public class Balance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double currentBalance;
    private Double salary;
    private Double monthlyLimitedExpense;
    private Double monthlyExpense = 0.0;
    private LocalDate update_at;


    @OneToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id",unique = true)
    private User user;

    public Balance(Double currentBalance, Double salary,Double monthlyLimitedExpense,Double monthlyExpense,
                   LocalDate update_at, User user) {
        this.currentBalance = currentBalance;
        this.salary = salary;
        this.monthlyLimitedExpense = monthlyLimitedExpense;
        this.monthlyExpense = monthlyExpense;
        this.update_at = update_at;
        this.user = user;
    }
}
