package com.example.demo.service;

import com.example.demo.dto.MarginReportDTO;
import com.example.demo.mapper.PrintReportMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrintReportService {

    @Autowired
    private PrintReportMapper printReportMapper;

    public PageInfo<MarginReportDTO> getMarginCustomersNotInUserSnap(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<MarginReportDTO> list = printReportMapper.findMarginCustomersNotInUserSnap();
        return new PageInfo<>(list);
    }

    public PageInfo<MarginReportDTO> getUndeliverableMarginCustomers(int pageNum, int pageSize) {
        PageHelper.startPage(pageNum, pageSize);
        List<MarginReportDTO> list = printReportMapper.findUndeliverableMarginCustomers();
        return new PageInfo<>(list);
    }

    public List<MarginReportDTO> getAllMarginCustomersNotInUserSnap() {
        return printReportMapper.findMarginCustomersNotInUserSnap();
    }

    public List<MarginReportDTO> getAllUndeliverableMarginCustomers() {
        return printReportMapper.findUndeliverableMarginCustomers();
    }

    public byte[] exportExcelReport() {
        // 导出Excel的实现...
        return new byte[0];
    }
} 