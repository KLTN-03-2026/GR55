package com.backend.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String emailGuiDi;

    public void guiEmail(String den, String tieuDe, String noiDung) {
        SimpleMailMessage tinNhan = new SimpleMailMessage();
        tinNhan.setFrom(emailGuiDi);
        tinNhan.setTo(den);
        tinNhan.setSubject(tieuDe);
        tinNhan.setText(noiDung);
        mailSender.send(tinNhan);
    }
}
