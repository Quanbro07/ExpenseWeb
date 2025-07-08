package com.exproject.backend.user.dto;

import com.exproject.backend.user.userInfo.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDTO {
    private String userName;
    private String email;
    private String password;
    private UserRole Role;
}
