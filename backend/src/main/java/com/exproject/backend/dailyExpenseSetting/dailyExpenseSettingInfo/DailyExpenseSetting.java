package com.exproject.backend.dailyExpenseSetting.dailyExpenseSettingInfo;

import com.exproject.backend.user.userInfo.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "daily_expense_table",uniqueConstraints = {
        @UniqueConstraint(columnNames = "user_id")
})
public class DailyExpenseSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double dailyAmount;
    private String description;

    @OneToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private User user;

    public DailyExpenseSetting(Double dailyAmount, String description, User user) {
        this.dailyAmount = dailyAmount;
        this.description = description;
        this.user = user;
    }
}
