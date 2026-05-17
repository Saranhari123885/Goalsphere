package com.goalsphere.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityRoleTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(roles = "EMPLOYEE")
    void testEmployeeAccess() throws Exception {
        mockMvc.perform(get("/api/reports/export"))
               .andExpect(status().isOk()); // Assuming reports are accessible, otherwise adjust based on MethodSecurity
    }

    @Test
    void testUnauthenticatedAccess() throws Exception {
        mockMvc.perform(get("/api/reports/export"))
               .andExpect(status().isForbidden());
    }
}
