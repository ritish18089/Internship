package com.carlofy.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("ritish1808@gmail.com", "Carlofy Support");
            helper.setTo(toEmail);
            helper.setSubject("Carlofy - Password Reset OTP");
            
            String htmlContent = String.format(
                "<div style='font-family: sans-serif; max-width: 400px; margin: auto; padding: 30px; border: 1px solid #222; background-color: #000; color: #fff; border-radius: 15px; text-align: center;'>" +
                "<h2 style='color: #bbf7d0; font-style: italic; font-weight: 900; letter-spacing: -0.02em;'>RESET PASSWORD</h2>" +
                "<p style='color: #94a3b8; font-weight: 500;'>Your verification code is below. Enter this code to reset your password.</p>" +
                "<div style='background: #111; padding: 20px; border-radius: 10px; margin: 25px 0; border: 1px solid #333;'>" +
                "<span style='font-size: 32px; letter-spacing: 12px; font-weight: 900; color: #bbf7d0; margin-left: 12px;'>%s</span>" +
                "</div>" +
                "<p style='color: #64748b; font-size: 12px;'>This code will expire in 10 minutes. If you didn't request this, you can safely ignore this email.</p>" +
                "</div>",
                otp
            );

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send OTP email");
        }
    }

    public void sendContactInquiry(String name, String fromEmail, String subject, String messageContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // Send to admin
            helper.setFrom("ritish1808@gmail.com", "Carlofy Support");
            helper.setTo("ritish1808@gmail.com");
            helper.setSubject("New Contact Inquiry: " + subject);
            
            String htmlContent = String.format(
                "<div style='font-family: sans-serif; padding: 20px; border: 1px solid #eee;'>" +
                "<h2>New Performance Inquiry</h2>" +
                "<p><strong>From:</strong> %s (%s)</p>" +
                "<p><strong>Subject:</strong> %s</p>" +
                "<div style='background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;'>%s</div>" +
                "</div>",
                name, fromEmail, subject, messageContent.replace("\n", "<br/>")
            );

            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to send contact email");
        }
    }
}
