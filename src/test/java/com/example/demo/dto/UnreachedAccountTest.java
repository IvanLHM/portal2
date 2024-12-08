package com.example.demo.dto;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class UnreachedAccountTest {
    
    @Test
    void testGetterAndSetter() {
        UnreachedAccount dto = new UnreachedAccount();
        LocalDateTime now = LocalDateTime.now();
        
        dto.setId(1L);
        dto.setAccountNo("ACC001");
        dto.setReasonId(1L);
        dto.setReasonDescription("Test Reason");
        dto.setCreatedTime(now);
        dto.setCreatedBy("SYSTEM");
        dto.setLastModifiedBy("SYSTEM");
        dto.setLastModifiedTime(now);
        
        assertEquals(1L, dto.getId());
        assertEquals("ACC001", dto.getAccountNo());
        assertEquals(1L, dto.getReasonId());
        assertEquals("Test Reason", dto.getReasonDescription());
        assertEquals(now, dto.getCreatedTime());
        assertEquals("SYSTEM", dto.getCreatedBy());
        assertEquals("SYSTEM", dto.getLastModifiedBy());
        assertEquals(now, dto.getLastModifiedTime());
    }
    
    @Test
    void testEqualsAndHashCode() {
        UnreachedAccount dto1 = new UnreachedAccount();
        dto1.setId(1L);
        dto1.setAccountNo("ACC001");
        
        UnreachedAccount dto2 = new UnreachedAccount();
        dto2.setId(1L);
        dto2.setAccountNo("ACC001");
        
        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }
} 