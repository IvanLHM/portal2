package com.example.demo.mapper;

import com.example.demo.dto.UnreachedReason;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface UnreachedReasonMapper {
    List<UnreachedReason> selectAll();
    void insert(UnreachedReason reason);
    void update(UnreachedReason reason);
    void delete(Long id);
    UnreachedReason selectById(Long id);
    long count();
    List<UnreachedReason> findPage(@Param("limit") int limit, @Param("offset") int offset);
} 