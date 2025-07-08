package com.exproject.backend.balance;

import com.exproject.backend.balance.balanceDTO.BalanceRequestDTO;
import com.exproject.backend.balance.balanceDTO.BalanceResponseDTO;
import com.exproject.backend.balance.balanceDTO.BalanceResponseWithUserIdDTO;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/balance")
public class BalanceController {
    private final BalanceService balanceService;

    @Autowired
    public BalanceController(BalanceService balanceService) {
        this.balanceService = balanceService;
    }

    // Create Balance
    @PostMapping("/create")
    public ResponseEntity<BalanceResponseDTO> create(@RequestBody BalanceRequestDTO balanceRequestDTO) {
        return balanceService.create(balanceRequestDTO);
    }

    // Update Balance
    @PutMapping("/update")
    public ResponseEntity<BalanceResponseDTO> update(@RequestParam Long id,@RequestBody BalanceRequestDTO balanceRequestDTO) {
        return balanceService.update(id,balanceRequestDTO);
    }

    // Get Balance
    @GetMapping("/get")
    public ResponseEntity<BalanceResponseDTO> get(@RequestParam Long userId) {
        return balanceService.getBalance(userId);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<BalanceResponseWithUserIdDTO>> getAll() {
        return balanceService.getAllBalance();
    }
}
