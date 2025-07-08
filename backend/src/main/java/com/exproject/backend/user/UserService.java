package com.exproject.backend.user;

import com.exproject.backend.user.dto.UserRequestDTO;
import com.exproject.backend.user.dto.UserResponseDTO;
import com.exproject.backend.user.userInfo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register User
    public ResponseEntity<UserResponseDTO> register(UserRequestDTO userRequestDTO) {
        Optional<User> existUser = userRepository.findByEmail(userRequestDTO.getEmail());

        if(existUser.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }

        // Tạo User Mới
        User newUser = User.builder()
                .userName(userRequestDTO.getUserName())
                .email(userRequestDTO.getEmail())
                .password(userRequestDTO.getPassword())
                .role(userRequestDTO.getRole())
                .build();

        // Lưu Vào Repository
        userRepository.save(newUser);

        // Tao Response trả về
        UserResponseDTO userResponseDTO = new UserResponseDTO(newUser);

        return new ResponseEntity<>(userResponseDTO, HttpStatus.CREATED);
    }

    // Login User
    public ResponseEntity<UserResponseDTO> login(UserRequestDTO userRequestDTO) {
        User existUser = userRepository.findByEmail(userRequestDTO.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Email Not Found"));

        // Check mật khẩu
        if(!existUser.getPassword().equals(userRequestDTO.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong password");
        }

        UserResponseDTO userResponseDTO = new UserResponseDTO(existUser);

        return new ResponseEntity<>(userResponseDTO, HttpStatus.OK);
    }

    // Delete User
    public ResponseEntity<UserResponseDTO> deleteUser(Long id) {
        User existUser = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"User Not Found"));

        userRepository.delete(existUser);

        UserResponseDTO userResponseDTO = new UserResponseDTO(existUser);

        return new ResponseEntity<>(userResponseDTO, HttpStatus.OK);
    }

    // Get User
    public ResponseEntity<UserResponseDTO> getUser(Long id) {
        User existUser = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Id Not Found"));

        UserResponseDTO userResponseDTO = new UserResponseDTO(existUser);

        return new ResponseEntity<>(userResponseDTO, HttpStatus.OK);
    }

    // Update User
    @Transactional
    public ResponseEntity<UserResponseDTO> updateUser(Long id, UserRequestDTO userRequestDTO) {
        User existUser = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Id Not Found"));

        existUser.setUserName(userRequestDTO.getUserName());
        existUser.setEmail(userRequestDTO.getEmail());
        existUser.setRole(userRequestDTO.getRole());
        userRepository.save(existUser);

        UserResponseDTO userResponseDTO = new UserResponseDTO(existUser);

        return new ResponseEntity<>(userResponseDTO, HttpStatus.OK);
    }

    // Get All User
    public ResponseEntity<List<UserResponseDTO>> getAllUser() {
        List<User> existUser = userRepository.findAll();
        List<UserResponseDTO> userResponseDTOList = new ArrayList<>();

        for(User user : existUser) {
            UserResponseDTO userResponseDTO = new UserResponseDTO(user);
            userResponseDTOList.add(userResponseDTO);
        }

        return new ResponseEntity<>(userResponseDTOList, HttpStatus.OK);
    }
}
