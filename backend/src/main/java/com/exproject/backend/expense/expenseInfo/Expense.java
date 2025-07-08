package com.exproject.backend.expense.expenseInfo;

import com.exproject.backend.dailyExpenseSetting.dailyExpenseSettingInfo.DailyExpenseSetting;
import com.exproject.backend.expense.dto.ExpenseRequestDTO;
import com.exproject.backend.expenseCategory.expenseCategoryInfo.ExpenseCategory;
import com.exproject.backend.user.userInfo.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "expense_table")
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate expenseDate; // Ngày chi tiêu
    @CreatedDate
    private LocalDate createDate; // Ngày được tạo ra
    @LastModifiedDate
    private LocalDate updateDate; // Ngày được tạo ra

    private Double amount;
    private String description;
    private Boolean isApplied = false;

    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id")
    private User user;

    @OneToMany(mappedBy = "expense", cascade = CascadeType.ALL)
    List<ExpenseCategory> expenseCategoryList;

    public Expense(DailyExpenseSetting dailyExpenseSetting) {
        LocalDate today = LocalDate.now();
        this.expenseDate = today;
        this.createDate = today;
        this.amount = dailyExpenseSetting.getDailyAmount();
        this.user = dailyExpenseSetting.getUser();
        this.description = dailyExpenseSetting.getDescription();
    }

    public Expense(ExpenseRequestDTO expenseRequestDTO,User user) {
        LocalDate today = LocalDate.now();

        this.expenseDate = expenseRequestDTO.getExpenseDate();
        this.createDate = today;

        this.amount = expenseRequestDTO.getAmount();
        this.description = expenseRequestDTO.getDescription();

        this.user = user;
    }

    public Expense(Double amount, LocalDate createDate, LocalDate expenseDate,
                   String description,Boolean isApplied, User user) {
        this.amount = amount;
        this.createDate = createDate;
        this.expenseDate = expenseDate;
        this.description = description;
        this.isApplied = isApplied;
        this.user = user;
    }
}
