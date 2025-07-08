package com.exproject.backend.balance;

import com.exproject.backend.balance.balanceDTO.BalanceRequestDTO;
import com.exproject.backend.balance.balanceDTO.BalanceResponseDTO;
import com.exproject.backend.balance.balanceDTO.BalanceResponseWithUserIdDTO;
import com.exproject.backend.balance.balanceInfo.Balance;
import com.exproject.backend.expense.ExpenseRepository;
import com.exproject.backend.expense.expenseInfo.Expense;
import com.exproject.backend.user.UserRepository;
import com.exproject.backend.user.userInfo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BalanceService {
    private final BalanceRepository balanceRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    @Autowired
    public BalanceService(BalanceRepository balanceRepository, UserRepository userRepository,
                          ExpenseRepository expenseRepository) {
        this.balanceRepository = balanceRepository;
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
    }

    // Create Balance
    public ResponseEntity<BalanceResponseDTO> create(BalanceRequestDTO balanceRequestDTO) {

        // Tìm User
        User existUser = userRepository.findById(balanceRequestDTO.getUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"User Not Found"));

        //Tìm Balance
        Optional<Balance> existBalance = balanceRepository.findByUserId(balanceRequestDTO.getUserId());

        // User đã có balance mà còn gọi create balance
        if(existBalance.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,"Balance Already Exists");
        }

        Balance balance = Balance.builder()
                .currentBalance(balanceRequestDTO.getCurrentBalance())
                .salary(balanceRequestDTO.getSalary())
                .monthlyLimitedExpense(balanceRequestDTO.getMonthlyLimitedExpense())
                .monthlyExpense(0D)
                .update_at(balanceRequestDTO.getUpdate_at())
                .build();

        balance.setUser(existUser);

        balanceRepository.save(balance);

        BalanceResponseDTO balanceResponseDTO = new BalanceResponseDTO(balance);

        return new ResponseEntity<>(balanceResponseDTO, HttpStatus.CREATED);
    }

    // Update
    @Transactional
    public ResponseEntity<BalanceResponseDTO> update(Long id, BalanceRequestDTO balanceRequestDTO) {
        Balance existBalance = balanceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Balance Not Found"));

        // Update Exist Balance
        existBalance.setCurrentBalance(balanceRequestDTO.getCurrentBalance());
        existBalance.setSalary(balanceRequestDTO.getSalary());
        existBalance.setMonthlyLimitedExpense(balanceRequestDTO.getMonthlyLimitedExpense());
        existBalance.setUpdate_at(balanceRequestDTO.getUpdate_at());
        existBalance.setUser(existBalance.getUser());

        balanceRepository.save(existBalance);

        BalanceResponseDTO balanceResponseDTO = new BalanceResponseDTO(existBalance);

        return new ResponseEntity<>(balanceResponseDTO, HttpStatus.OK);

    }

    // Get Balance
    public ResponseEntity<BalanceResponseDTO> getBalance(Long userId) {
        Balance existBalance = balanceRepository.findByUserId(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Balance Not Found"));

        BalanceResponseDTO balanceResponseDTO = new BalanceResponseDTO(existBalance);

        return new ResponseEntity<>(balanceResponseDTO, HttpStatus.OK);
    }

    // Get All Balance
    public ResponseEntity<List<BalanceResponseWithUserIdDTO>> getAllBalance() {
        List<Balance> balances = balanceRepository.findAll();
        List<BalanceResponseWithUserIdDTO> balanceResponseWithUserIdDTOList = new ArrayList<>();

        for(Balance balance : balances) {
            BalanceResponseWithUserIdDTO balanceResponseWithUserIdDTO =
                    new BalanceResponseWithUserIdDTO(balance);
            balanceResponseWithUserIdDTOList.add(balanceResponseWithUserIdDTO);
        }

        return new ResponseEntity<>(balanceResponseWithUserIdDTOList, HttpStatus.OK);
    }

    // Cộng tiền vào currentBalance khi tới ngày nhan salary
    // *TEST: mỗi 5p
    // *RealTime: mỗi tháng
    public void addSalary() {
        System.out.println("[ADD SALARY]");
        List<Balance> balanceList = balanceRepository.findAll();

        for(Balance balance : balanceList) {
            balance.setCurrentBalance(balance.getSalary()+balance.getCurrentBalance());
            // Set Monthly Expense trở lại mỗi tháng
            balance.setMonthlyExpense(0D);

        }
        balanceRepository.saveAll(balanceList);
    }

    // Cập nhật Balance theo từng ngày dựa vào expense hôm qua
    // Trừ balance
    // Công thêm vào Monthly Expense
    // *TEST: mỗi 1p
    // *RealTime: mỗi ngày
    public void manageBalanceDaily() {
        System.out.println("[MANAGE DAILY]");
        LocalDate yesterday = LocalDate.now().minusDays(1);

        List<Expense> expenseList = expenseRepository.findAllByExpenseDate(yesterday);

        for(Expense expense : expenseList) {
            // Đã applied thì pass
            if(expense.getIsApplied()) {
                continue;
            }

            Long userId = expense.getUser().getId();

            Optional<Balance> existBalance = balanceRepository.findByUserId(userId);

            // Ko có User thì pass
            if(!existBalance.isPresent()) {
                continue;
            }

            Balance balance = existBalance.get();

            Double sumExpense = expense.getAmount()+balance.getMonthlyExpense();
            balance.setMonthlyExpense(sumExpense);

            Double subtract = balance.getCurrentBalance()-expense.getAmount();
            balance.setCurrentBalance(subtract);

            expense.setIsApplied(true);

            balanceRepository.save(balance);
            expenseRepository.save(expense);
        }
    }


}
