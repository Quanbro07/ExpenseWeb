package com.exproject.backend.expense;

import com.exproject.backend.expense.dto.ExpenseRequestDTO;
import com.exproject.backend.expense.dto.ExpenseResponseDTO;
import com.exproject.backend.expense.dto.ExpenseResponseIdDTO;
import com.exproject.backend.expense.expenseInfo.Expense;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/v1/expense")
public class ExpenseController {
    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @PostMapping("/create")
    public ResponseEntity<ExpenseResponseDTO> createExpense(
            @RequestBody ExpenseRequestDTO expenseRequestDTO) {

        return expenseService.createExpense(expenseRequestDTO);
    }


    @PutMapping("/update")
    public ResponseEntity<ExpenseResponseDTO> updateExpense(
            @RequestBody ExpenseRequestDTO expenseRequestDTO) {

        return expenseService.updateExpense(expenseRequestDTO);
    }

    // Lấy 1 Expense của User
    @GetMapping("/get")
    public ResponseEntity<ExpenseResponseDTO> getExpense(
            @RequestParam Long userId,
            @RequestParam LocalDate expenseDate) {
        return expenseService.getExpense(userId,expenseDate);
    }

    // Lay Tất cả Expense của User
    @GetMapping("/getAll")
    public ResponseEntity<List<ExpenseResponseDTO>> getAllExpenseByUserId(@RequestParam Long userId) {
        return expenseService.getAllExpenseByUserId(userId);
    }
}
