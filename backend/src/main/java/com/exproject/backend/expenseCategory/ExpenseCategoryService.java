package com.exproject.backend.expenseCategory;

import com.exproject.backend.balance.BalanceRepository;
import com.exproject.backend.balance.balanceInfo.Balance;
import com.exproject.backend.expense.ExpenseRepository;
import com.exproject.backend.expense.dto.ExpenseRequestDTO;
import com.exproject.backend.expense.dto.ExpenseResponseDTO;
import com.exproject.backend.expense.expenseInfo.Expense;
import com.exproject.backend.expenseCategory.expenseCategoryDTO.ExpenseCategoryRequestDTO;
import com.exproject.backend.expenseCategory.expenseCategoryDTO.ExpenseCategoryResponseDTO;
import com.exproject.backend.expenseCategory.expenseCategoryInfo.ExpenseCategory;
import com.exproject.backend.expenseCategory.expenseCategoryInfo.ExpenseCategoryEnum;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseCategoryService {
    private final ExpenseCategoryRepository expenseCategoryRepository;
    private final ExpenseRepository expenseRepository;
    private final BalanceRepository balanceRepository;

    @Autowired
    public ExpenseCategoryService(ExpenseCategoryRepository expenseCategoryRepository,
                                  ExpenseRepository expenseRepository,
                                  BalanceRepository balanceRepository) {
        this.expenseCategoryRepository = expenseCategoryRepository;
        this.expenseRepository = expenseRepository;
        this.balanceRepository = balanceRepository;
    }

    // *Create Categories
    public ResponseEntity<ExpenseCategoryResponseDTO> createExpenseCategory(
            ExpenseCategoryRequestDTO expenseCategoryRequestDTO) {

        Long expenseId = expenseCategoryRequestDTO.getExpenseId();

        Expense existExpense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense Not Found"));

        // Check xem Category này tồn tại chưa
        Optional<ExpenseCategory> existExpenseCategory =
                expenseCategoryRepository.findByExpenseCategoryAndExpenseId(
                        expenseCategoryRequestDTO.getExpenseCategory(), expenseId);

        // Nếu Category này tồn tại pass
        if (existExpenseCategory.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Expense Category Already Exists");
        }

        ExpenseCategory newExpenseCategory = ExpenseCategory.builder()
                .amount(expenseCategoryRequestDTO.getAmount())
                .expenseCategory(expenseCategoryRequestDTO.getExpenseCategory())
                .expense(existExpense)
                .build();

        // + Công them vào Expense
        existExpense.setAmount(newExpenseCategory.getAmount() + existExpense.getAmount());

        expenseCategoryRepository.save(newExpenseCategory);
        expenseRepository.save(existExpense);

        // Check xem Expense đã được apply chưa
        // Rồi thì phải chỉnh sửa Balance
        if(Boolean.TRUE.equals(existExpense.getIsApplied())) {
            try {
                // Thêm kiểm tra null cho existExpense.getUser() ở đây
                if (existExpense.getUser() == null) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User not found for expense");
                }
                Balance existBalance = balanceRepository.findByUserId(existExpense.getUser().getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Balance Not Found"));

                LocalDate expenseDate = existExpense.getExpenseDate();
                LocalDate today = LocalDate.now();

                existBalance.setCurrentBalance(existBalance.getCurrentBalance() - newExpenseCategory.getAmount());

                // Cùng Month Củng Year mới + vào MonthlyExpense
                if(expenseDate.getMonth().equals(today.getMonth()) &&
                        expenseDate.getYear() == today.getYear()) {
                    existBalance.setMonthlyExpense(existBalance.getMonthlyExpense() + newExpenseCategory.getAmount());
                }

                balanceRepository.save(existBalance);
            } catch (ResponseStatusException e) {
                // Log the exception and re-throw, or handle gracefully
                System.err.println("Error updating balance in createExpenseCategory: " + e.getMessage());
                throw e; // Re-throw to propagate the original status code
            } catch (Exception e) {
                System.err.println("Unexpected error updating balance in createExpenseCategory: " + e.getMessage());
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating balance after expense category created", e);
            }
        }

        // Tạo Response
        ExpenseCategoryResponseDTO expenseCategoryResponseDTO = new
                ExpenseCategoryResponseDTO(newExpenseCategory);

        return new ResponseEntity<>(expenseCategoryResponseDTO, HttpStatus.CREATED);
    }

    // *Update Expense Category
    public ResponseEntity<ExpenseCategoryResponseDTO> updateExpenseCategory(
            ExpenseCategoryRequestDTO expenseCategoryRequestDTO) {

        // Tìm xem đã có expenseCategory đó chưa
        Optional<ExpenseCategory> existExpenseCategory =
                expenseCategoryRepository.findByExpenseCategoryAndExpenseId(
                        expenseCategoryRequestDTO.getExpenseCategory(),
                        expenseCategoryRequestDTO.getExpenseId());

        // Nếu không tồn tại => Tạo cái mới
        if (!existExpenseCategory.isPresent()) {
            return createExpenseCategory(expenseCategoryRequestDTO);
        }

        ExpenseCategory existingExpenseCategory = existExpenseCategory.get();

        Double oldAmount = existingExpenseCategory.getAmount();
        Double newAmount = (expenseCategoryRequestDTO.getAmount() != null) ?
                expenseCategoryRequestDTO.getAmount() : 0.0;



        Expense existExpense = expenseRepository.findById(expenseCategoryRequestDTO.getExpenseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expense Not Found"));

        // Nếu update Expense Category đã đươc applied
        if(Boolean.TRUE.equals(existExpense.getIsApplied())) {
            try {
                if (existExpense.getUser() == null) {
                    throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User not found for expense");
                }
                LocalDate today = LocalDate.now();
                LocalDate expenseDate = existExpense.getExpenseDate();
                Double delta = newAmount - oldAmount;

                Balance existBalance = balanceRepository.findByUserId(existExpense.getUser().getId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Balance Not Found"));

                // Set lai balance
                existBalance.setCurrentBalance(existBalance.getCurrentBalance() - delta);

                // Nếu quá khứ vẫn trong trong Expense Monthly
                if (expenseDate.getMonth().equals(today.getMonth()) &&
                        expenseDate.getYear() == today.getYear()) {
                    existBalance.setMonthlyExpense(existBalance.getMonthlyExpense() + delta);
                }

                balanceRepository.save(existBalance);
            } catch (ResponseStatusException e) {
                System.err.println("Error updating balance in updateExpenseCategory: " + e.getMessage());
                throw e;
            } catch (Exception e) {
                System.err.println("Unexpected error updating balance in updateExpenseCategory: " + e.getMessage());
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error updating balance after expense category updated", e);
            }
        }

        // Nếu có rồi update và update Expense
        existingExpenseCategory.setAmount(newAmount);
        existExpense.setAmount(existExpense.getAmount() + newAmount - oldAmount);

        expenseCategoryRepository.save(existingExpenseCategory);
        expenseRepository.save(existExpense);

        ExpenseCategoryResponseDTO expenseCategoryResponseDTO =
                new ExpenseCategoryResponseDTO(existingExpenseCategory);

        return new ResponseEntity<>(expenseCategoryResponseDTO, HttpStatus.OK);
    }

    // Tìm các expense category từ from - to
    public ResponseEntity<List<ExpenseCategoryResponseDTO>> getAllExpenseCategory(
        Long userId,
        ExpenseCategoryEnum category,
        LocalDate fromDate,
        LocalDate toDate) {

        if(fromDate == null) {
            fromDate = LocalDate.of(1900,1,1);
        }
        if(toDate == null) {
            toDate = LocalDate.now().plusYears(100);
        }

            List<ExpenseCategory> expenseCategoryList =
                    expenseCategoryRepository.findAllByFilteredCategories(userId,
                    category,fromDate,toDate);

            List<ExpenseCategoryResponseDTO> expenseCategoryResponseDTOList = new ArrayList<>();

            for (ExpenseCategory expenseCategory : expenseCategoryList) {
                ExpenseCategoryResponseDTO expenseCategoryResponseDTO =
                        new ExpenseCategoryResponseDTO(expenseCategory);

                expenseCategoryResponseDTOList.add(expenseCategoryResponseDTO);
            }

            return new ResponseEntity<>(expenseCategoryResponseDTOList, HttpStatus.OK);
    }
}
