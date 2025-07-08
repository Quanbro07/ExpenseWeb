package com.exproject.backend.user;

import com.exproject.backend.user.dto.UserRequestDTO;
import com.exproject.backend.user.dto.UserResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Đăng kí
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserRequestDTO userRequestDTO) {
        return userService.register(userRequestDTO);
    }

    // Đăng nhâp
    @PostMapping("/login")
    public ResponseEntity<UserResponseDTO> login(@RequestBody UserRequestDTO userRequestDTO) {
        return userService.login(userRequestDTO);
    }

    // Delete User
    @DeleteMapping("/delete")
    public ResponseEntity<UserResponseDTO> deleteUser(@RequestParam Long id) {
        return userService.deleteUser(id);
    }

    // Update User
    @PutMapping("/update")
    public ResponseEntity<UserResponseDTO> updateUser(@RequestParam Long id,@RequestBody UserRequestDTO userRequestDTO) {
        return userService.updateUser(id,userRequestDTO);
    }

    // Get User
    @GetMapping("/get")
    public ResponseEntity<UserResponseDTO> getUser(@RequestParam Long id) {
        return userService.getUser(id);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<UserResponseDTO>> getAllUser() {
        return userService.getAllUser();
    }
}
