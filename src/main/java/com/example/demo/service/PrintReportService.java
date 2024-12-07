package com.example.demo.service;

import com.example.demo.dto.MarginReportDTO;
import com.example.demo.mapper.PrintReportMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
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

    public byte[] exportExcelReport() throws IOException {
        // 获取所有数据
        List<MarginReportDTO> noSmsData = getAllMarginCustomersNotInUserSnap();
        List<MarginReportDTO> unCustomerData = getAllUndeliverableMarginCustomers();

        // 创建工作簿
        try (Workbook workbook = new XSSFWorkbook()) {
            // 创建样式
            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setBorderBottom(BorderStyle.THIN);
            dataStyle.setBorderTop(BorderStyle.THIN);
            dataStyle.setBorderLeft(BorderStyle.THIN);
            dataStyle.setBorderRight(BorderStyle.THIN);

            // 创建第一个表格：Margin Customers Not in User Snap
            Sheet sheet1 = workbook.createSheet("No SMS Report");
            Row headerRow1 = sheet1.createRow(0);
            
            // 设置表头
            String[] headers1 = {"Securities Account", "Account Name"};
            for (int i = 0; i < headers1.length; i++) {
                Cell cell = headerRow1.createCell(i);
                cell.setCellValue(headers1[i]);
                cell.setCellStyle(headerStyle);
                sheet1.setColumnWidth(i, 256 * 20); // 设置列宽
            }

            // 填充数据
            int rowNum = 1;
            for (MarginReportDTO data : noSmsData) {
                Row row = sheet1.createRow(rowNum++);
                
                Cell cell0 = row.createCell(0);
                cell0.setCellValue(data.getSecAccNo());
                cell0.setCellStyle(dataStyle);
                
                Cell cell1 = row.createCell(1);
                cell1.setCellValue(data.getSecAccName());
                cell1.setCellStyle(dataStyle);
            }

            // 创建第二个表格：Undeliverable Margin Customers
            Sheet sheet2 = workbook.createSheet("Undeliverable Report");
            Row headerRow2 = sheet2.createRow(0);
            
            // 设置表头
            String[] headers2 = {"Securities Account", "User No", "Account Name", "Phone Number"};
            for (int i = 0; i < headers2.length; i++) {
                Cell cell = headerRow2.createCell(i);
                cell.setCellValue(headers2[i]);
                cell.setCellStyle(headerStyle);
                sheet2.setColumnWidth(i, 256 * 20); // 设置列宽
            }

            // 填充数据
            rowNum = 1;
            for (MarginReportDTO data : unCustomerData) {
                Row row = sheet2.createRow(rowNum++);
                
                Cell cell0 = row.createCell(0);
                cell0.setCellValue(data.getSecAccNo());
                cell0.setCellStyle(dataStyle);
                
                Cell cell1 = row.createCell(1);
                cell1.setCellValue(data.getUserNo());
                cell1.setCellStyle(dataStyle);
                
                Cell cell2 = row.createCell(2);
                cell2.setCellValue(data.getSecAccName());
                cell2.setCellStyle(dataStyle);
                
                Cell cell3 = row.createCell(3);
                cell3.setCellValue(data.getTelNo());
                cell3.setCellStyle(dataStyle);
            }

            // 将工作簿写入字节数组
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            workbook.write(bos);
            return bos.toByteArray();
        }
    }
} 