package com.exproject.backend.user.dto;

import com.exproject.backend.user.userInfo.User;
import com.exproject.backend.user.userInfo.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long id;
    private String userName;
    private String email;
    private UserRole role;

    public UserResponseDTO(User user) {
        this.id = user.getId();
        this.userName = user.getUserName();
        this.email = user.getEmail();
        this.role = user.getRole();
    }
}
