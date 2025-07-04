package com.exproject.backend.balance;

import com.exproject.backend.balance.balanceInfo.Balance;
import com.exproject.backend.user.userInfo.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BalanceRepository extends JpaRepository<Balance, Long> {
    Optional<Balance> findById(long id);
    Optional<Balance> findByUserId(long userId);
    List<Balance> findAll();

    long user(User user);
}
