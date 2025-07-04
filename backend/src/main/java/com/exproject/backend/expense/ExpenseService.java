package com.exproject.backend.expense;

import com.exproject.backend.balance.BalanceRepository;
import com.exproject.backend.balance.balanceInfo.Balance;
import com.exproject.backend.dailyExpenseSetting.DailyExpenseSettingRepository;
import com.exproject.backend.dailyExpenseSetting.dailyExpenseSettingInfo.DailyExpenseSetting;
import com.exproject.backend.expense.dto.ExpenseRequestDTO;
import com.exproject.backend.expense.dto.ExpenseResponseDTO;
import com.exproject.backend.expense.expenseInfo.Expense;
import com.exproject.backend.user.UserRepository;
import com.exproject.backend.user.UserService;
import com.exproject.backend.user.userInfo.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final DailyExpenseSettingRepository dailyExpenseSettingRepository;
    private final BalanceRepository balanceRepository;
    private final UserRepository userRepository;

    @Autowired
    public ExpenseService(ExpenseRepository expenseRepository,
                          DailyExpenseSettingRepository dailyExpenseSettingRepository,
                          UserRepository userRepository,
                          BalanceRepository balanceRepository) {
        this.expenseRepository = expenseRepository;
        this.dailyExpenseSettingRepository = dailyExpenseSettingRepository;
        this.balanceRepository = balanceRepository;
        this.userRepository = userRepository;
    }

    // Tạo mới expense dựa trên DailyExpenseSetting cho tât cả User Mỗi ngày
    // *TEST: Moi 1p
    // *Real: 1 ngay
    @Transactional
    public void makeNewExpense() {
        System.out.println("[ADD NEW EXPENSE]");
        List<DailyExpenseSetting> dailyExpenseSettingList = dailyExpenseSettingRepository.findAll();
        List<Expense> expenseList = new ArrayList<>();
        LocalDate today = LocalDate.now();

        for(DailyExpenseSetting dailyExpenseSetting : dailyExpenseSettingList) {
            Long userId = dailyExpenseSetting.getUser().getId();

            Optional<Expense> existExpense = expenseRepository.findByUserIdAndExpenseDate(userId,today);

            if(existExpense.isPresent()) {
                continue;
            }

            Expense newExpense = new Expense(dailyExpenseSetting);

            expenseList.add(newExpense);
        }

        expenseRepository.saveAll(expenseList);

    }

    // Create New Expense
    public Expense createNewExpense(ExpenseRequestDTO expenseRequestDTO) {

        Long userId = expenseRequestDTO.getUserId();
        LocalDate today = LocalDate.now();

        // Check coi exist Expense co tồn tại ko
        Optional<Expense> existExpense =
                expenseRepository.findByUserIdAndExpenseDate(userId, expenseRequestDTO.getExpenseDate());

        // Có return luôn
        if(existExpense.isPresent()) {
           return existExpense.get();
        }

        // Ko Tạo mới rồi return new Expense
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Expense newExpense = new Expense(expenseRequestDTO,user);
        // Check coi new Expense có đang ở quá khứ ko
        LocalDate expenseDate = newExpense.getExpenseDate();
        if(expenseDate.isBefore(today)) {
            Balance existBalance = balanceRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Balance not found"));

            // Tru đi currentBalance
            existBalance.setCurrentBalance(existBalance.getCurrentBalance() - newExpense.getAmount());

            // Nếu cùng month cùng year thì cộng vào Monthly Expense
            if(expenseDate.getMonth().equals(today.getMonth()) && expenseDate.getYear() == today.getYear()) {
                existBalance.setMonthlyExpense(existBalance.getMonthlyExpense() + newExpense.getAmount());
            }

            balanceRepository.save(existBalance);
        }

        return expenseRepository.save(newExpense);
    }

    // Update Expense
    @Transactional
    public ResponseEntity<ExpenseResponseDTO> updateExpense(ExpenseRequestDTO expenseRequestDTO) {
        Long userId = expenseRequestDTO.getUserId();

        // Check ngày Expense đó có tồn tại chưa
        Optional<Expense> existExpense =
                expenseRepository.findByUserIdAndExpenseDate(userId,expenseRequestDTO.getExpenseDate());

        // Nếu chưa thì tạo
        if(!existExpense.isPresent()) {

            Expense createExpense = createNewExpense(expenseRequestDTO);

            ExpenseResponseDTO expenseResponseDTO = new ExpenseResponseDTO(createExpense);

            return new ResponseEntity<>(expenseResponseDTO,HttpStatus.CREATED);
        }

        Expense expense = existExpense.get();

        Double oldAmount = expense.getAmount();
        Double newAmount = expenseRequestDTO.getAmount();

        // Check xem expense đã được apply vào Balance chưa
        Boolean isApplied = expense.getIsApplied();

        if(isApplied) {
            Balance existBalance = balanceRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Balance not found"));

            Double delta = newAmount - oldAmount;

            // Trừ thêm delta cho Current Balance
            existBalance.setCurrentBalance(existBalance.getCurrentBalance()-delta);
            // Công đi delta cho Monthly Expense
            existBalance.setMonthlyExpense(existBalance.getMonthlyExpense()+delta);
            balanceRepository.save(existBalance);
        }

        // Update Expense
        expense.setAmount(newAmount);
        expense.setExpenseDate(expenseRequestDTO.getExpenseDate());
        expense.setDescription(expenseRequestDTO.getDescription());

        expenseRepository.save(expense);

        ExpenseResponseDTO expenseResponseDTO = new ExpenseResponseDTO(expense);

        return new ResponseEntity<>(expenseResponseDTO, HttpStatus.OK);
    }

    // Find All ExpenseByUserId
    public ResponseEntity<List<ExpenseResponseDTO>> getAllExpenseByUserId(Long userId) {
        List<Expense> expenseList = expenseRepository.findAllByUserId(userId);
        List<ExpenseResponseDTO> expenseResponseDTOList = new ArrayList<>();

        for(Expense expense : expenseList) {
            ExpenseResponseDTO expenseResponseDTO = new ExpenseResponseDTO(expense);
            expenseResponseDTOList.add(expenseResponseDTO);
        }

        return new ResponseEntity<>(expenseResponseDTOList, HttpStatus.OK);
    }

    // Create Expense trả về
    public ResponseEntity<ExpenseResponseDTO> createExpense(ExpenseRequestDTO expenseRequestDTO) {
        Long userId = expenseRequestDTO.getUserId();
        LocalDate today = LocalDate.now();

        // Check coi exist Expense co tồn tại ko
        Optional<Expense> existExpense =
                expenseRepository.findByUserIdAndExpenseDate(userId, expenseRequestDTO.getExpenseDate());

        // Có return luôn
        if(existExpense.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Expense already exists");
        }

        // Ko Tạo mới rồi return new Expense
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Expense newExpense = new Expense(expenseRequestDTO,user);

        // Check coi new Expense có đang ở quá khứ ko
        LocalDate expenseDate = newExpense.getExpenseDate();
        if(expenseDate.isBefore(today)) {
            Balance existBalance = balanceRepository.findByUserId(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Balance not found"));

            // Tru đi currentBalance
            existBalance.setCurrentBalance(existBalance.getCurrentBalance() - newExpense.getAmount());

            // Nếu cùng month cùng year thì cộng vào Monthly Expense
            if(expenseDate.getMonth().equals(today.getMonth()) && expenseDate.getYear() == today.getYear()) {
                existBalance.setMonthlyExpense(existBalance.getMonthlyExpense() + newExpense.getAmount());
            }

            balanceRepository.save(existBalance);
        }
        expenseRepository.save(newExpense);

        ExpenseResponseDTO expenseResponseDTO = new ExpenseResponseDTO(newExpense);

        return new ResponseEntity<>(expenseResponseDTO, HttpStatus.CREATED);
    }
}
