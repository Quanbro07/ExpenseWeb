package com.exproject.backend.expense;

import com.exproject.backend.expense.dto.ExpenseRequestDTO;
import com.exproject.backend.expense.dto.ExpenseResponseDTO;
import com.exproject.backend.expense.expenseInfo.Expense;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/get")
    public ResponseEntity<List<ExpenseResponseDTO>> getAllExpenseByUserId(@RequestParam Long userId) {
        return expenseService.getAllExpenseByUserId(userId);
    }
}
