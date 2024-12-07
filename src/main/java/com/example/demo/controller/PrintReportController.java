package com.example.demo.controller;

import com.example.demo.dto.MarginReportDTO;
import com.example.demo.service.PrintReportService;
import com.github.pagehelper.PageInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/print-report")
public class PrintReportController {

    @Autowired
    private PrintReportService printReportService;

    @GetMapping
    public String printReportPage(Model model) {
        model.addAttribute("currentPage", "printReport");
        return "Undeliverable-report/printReport";
    }

    @GetMapping("/no-sms-report")
    @ResponseBody
    public PageInfo<MarginReportDTO> getTable1Data(
            @RequestParam(value = "start", defaultValue = "0") Integer start,
            @RequestParam(value = "length", defaultValue = "10") Integer length) {
        int pageNum = (start / length) + 1;
        return printReportService.getMarginCustomersNotInUserSnap(pageNum, length);
    }

    @GetMapping("/un-customer-report")
    @ResponseBody
    public PageInfo<MarginReportDTO> getTable2Data(
            @RequestParam(value = "start", defaultValue = "0") Integer start,
            @RequestParam(value = "length", defaultValue = "10") Integer length) {
        int pageNum = (start / length) + 1;
        return printReportService.getUndeliverableMarginCustomers(pageNum, length);
    }

    @GetMapping("/no-sms-report/all")
    @ResponseBody
    public List<MarginReportDTO> getAllTable1Data() {
        return printReportService.getAllMarginCustomersNotInUserSnap();
    }

    @GetMapping("/un-customer-report/all")
    @ResponseBody
    public List<MarginReportDTO> getAllTable2Data() {
        return printReportService.getAllUndeliverableMarginCustomers();
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportExcel() throws IOException {
        String filename = String.format("margin_report_%s.xlsx", 
            java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.set(HttpHeaders.CONTENT_DISPOSITION, 
            "attachment; filename=" + java.net.URLEncoder.encode(filename, "UTF-8").replace("+", "%20"));

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(printReportService.exportExcelReport());
    }
} 