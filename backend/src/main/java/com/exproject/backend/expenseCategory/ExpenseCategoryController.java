package com.exproject.backend.expenseCategory;

import com.exproject.backend.expense.dto.ExpenseRequestDTO;
import com.exproject.backend.expenseCategory.expenseCategoryDTO.ExpenseCategoryRequestDTO;
import com.exproject.backend.expenseCategory.expenseCategoryDTO.ExpenseCategoryResponseDTO;
import com.exproject.backend.expenseCategory.expenseCategoryInfo.ExpenseCategory;
import com.exproject.backend.expenseCategory.expenseCategoryInfo.ExpenseCategoryEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("api/v1/expense-category")
public class ExpenseCategoryController {
    private final ExpenseCategoryService expenseCategoryService;

    @Autowired
    public ExpenseCategoryController(ExpenseCategoryService expenseCategoryService) {
        this.expenseCategoryService = expenseCategoryService;
    }

    @PostMapping("/create")
    public ResponseEntity<ExpenseCategoryResponseDTO> createExpenseCategory(
            @RequestBody ExpenseCategoryRequestDTO expenseCategoryRequestDTO) {

        return expenseCategoryService.createExpenseCategory(expenseCategoryRequestDTO);
    }

    @PutMapping("/update")
    public ResponseEntity<ExpenseCategoryResponseDTO> updateExpenseCategory(
            @RequestBody ExpenseCategoryRequestDTO expenseCategoryRequestDTO) {

        return expenseCategoryService.updateExpenseCategory(expenseCategoryRequestDTO);
    }

    @GetMapping("/get")
    public ResponseEntity<List<ExpenseCategoryResponseDTO>> getAllExpenseCategory(
            @RequestParam Long userId,
            @RequestParam (required = false) ExpenseCategoryEnum category,
            @RequestParam (required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate fromDate,
            @RequestParam (required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDate toDate
    ) {
        System.out.println(fromDate + " - " + toDate);
        return expenseCategoryService.getAllExpenseCategory(userId,category,fromDate,toDate);
    }
}
