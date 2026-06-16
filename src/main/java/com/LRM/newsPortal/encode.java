package com.LRM.newsPortal;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class encode {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        System.out.println("admin123:  " + encoder.encode("admin123"));
        System.out.println("editor123: " + encoder.encode("editor123"));
        System.out.println("user123:   " + encoder.encode("user123"));
    }
}
