package com.example.demo.dto;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class UndeliverRecDailyTest {
    
    @Test
    void testGetterAndSetter() {
        UndeliverRecDaily dto = new UndeliverRecDaily();
        LocalDateTime now = LocalDateTime.now();
        
        dto.setId(1L);
        dto.setMobileNumber("12345678");
        dto.setDeliveryTime(now);
        dto.setTerminationTime(now);
        dto.setCreatedTime(now);
        dto.setCreatedBy("SYSTEM");
        dto.setLastModifiedBy("SYSTEM");
        dto.setLastModifiedTime(now);
        
        assertEquals(1L, dto.getId());
        assertEquals("12345678", dto.getMobileNumber());
        assertEquals(now, dto.getDeliveryTime());
        assertEquals(now, dto.getTerminationTime());
        assertEquals(now, dto.getCreatedTime());
        assertEquals("SYSTEM", dto.getCreatedBy());
        assertEquals("SYSTEM", dto.getLastModifiedBy());
        assertEquals(now, dto.getLastModifiedTime());
    }
    
    @Test
    void testEqualsAndHashCode() {
        UndeliverRecDaily dto1 = new UndeliverRecDaily();
        dto1.setId(1L);
        dto1.setMobileNumber("12345678");
        
        UndeliverRecDaily dto2 = new UndeliverRecDaily();
        dto2.setId(1L);
        dto2.setMobileNumber("12345678");
        
        assertEquals(dto1, dto2);
        assertEquals(dto1.hashCode(), dto2.hashCode());
    }
} 