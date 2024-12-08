package com.example.demo.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MarginReportDTOTest {
    
    @Test
    void testGetterAndSetter() {
        MarginReportDTO dto = new MarginReportDTO();
        
        dto.setSecAccNo("ACC001");
        dto.setSecAccName("Test Account");
        dto.setUserNo("USER001");
        dto.setTelNo("12345678");
        
        assertEquals("ACC001", dto.getSecAccNo());
        assertEquals("Test Account", dto.getSecAccName());
        assertEquals("USER001", dto.getUserNo());
        assertEquals("12345678", dto.getTelNo());
    }
    
    @Test
    void testEqualsAndHashCode() {
        MarginReportDTO dto1 = new MarginReportDTO();
        dto1.setSecAccNo("ACC001");
        dto1.setSecAccName("Test Account");
        
        MarginReportDTO dto2 = new MarginReportDTO();
        dto2.setSecAccNo("ACC001");
        dto2.setSecAccName("Test Account");
        
        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }
} 