package com.example.demo.dto;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class MarginTradeLimitDailyTest {
    
    @Test
    void testGetterAndSetter() {
        MarginTradeLimitDaily dto = new MarginTradeLimitDaily();
        LocalDateTime now = LocalDateTime.now();
        
        dto.setId(1L);
        dto.setSecAccNo("ACC001");
        dto.setSecAccNo9Digit("123456789");
        dto.setSecAccName("Test Account");
        dto.setMarginFlag("Y");
        dto.setCreatedTime(now);
        dto.setCreatedBy("SYSTEM");
        dto.setLastModifiedBy("SYSTEM");
        dto.setLastModifiedTime(now);
        
        assertEquals(1L, dto.getId());
        assertEquals("ACC001", dto.getSecAccNo());
        assertEquals("123456789", dto.getSecAccNo9Digit());
        assertEquals("Test Account", dto.getSecAccName());
        assertEquals("Y", dto.getMarginFlag());
        assertEquals(now, dto.getCreatedTime());
        assertEquals("SYSTEM", dto.getCreatedBy());
        assertEquals("SYSTEM", dto.getLastModifiedBy());
        assertEquals(now, dto.getLastModifiedTime());
    }
    
    @Test
    void testEqualsAndHashCode() {
        MarginTradeLimitDaily dto1 = new MarginTradeLimitDaily();
        dto1.setId(1L);
        dto1.setSecAccNo("ACC001");
        
        MarginTradeLimitDaily dto2 = new MarginTradeLimitDaily();
        dto2.setId(1L);
        dto2.setSecAccNo("ACC001");
        
        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }
} 