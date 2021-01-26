package io.saidlaarab.authenticationserver.services;

import io.saidlaarab.authenticationserver.entities.Otp;
import io.saidlaarab.authenticationserver.entities.User;
import io.saidlaarab.authenticationserver.repositories.OtpRepository;
import io.saidlaarab.authenticationserver.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

@Service
@Transactional
public class UserService {
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    // add new user to the DB:
    public void addUser(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    // authenticate the user and send an OTP to him
    public void auth(User user){

        String username = user.getUsername();
        String password = user.getPassword();
        // look for the user in the DB
        Optional<User> db_user = userRepository.findUserByUsername(username);

        if(db_user.isPresent()){
            User valid_user = db_user.get();
            if(passwordEncoder.matches(password, valid_user.getPassword())){
                renewOtp(valid_user);
            }else{
                throw new BadCredentialsException("Invalid Password");
            }

        }else{
            throw new BadCredentialsException("No user matches the given username");
        }
    }

    private void renewOtp(User user){
        String code = GenerateCodeUtil.generateCode();
        String username = user.getUsername();
        Optional<Otp> db_opt = otpRepository.findOtpByUsername(username);

        Otp otp;
        if(db_opt.isPresent()){
            otp = db_opt.get();
        }else{
            otp = new Otp();
            otp.setUsername(user.getUsername());
        }
        otp.setCode(code);
        otpRepository.save(otp);
    }

    public boolean check(Otp otp){

        String username = otp.getUsername();
        String otp_code = otp.getCode();

        Optional<Otp> valid_otp = otpRepository.findOtpByUsername(username);
        if(valid_otp.isPresent()){
            String valid_code = valid_otp.get().getCode();
            if(otp_code.equals(valid_code)){
                return true;
            }
        }
        return false;
    }
}
