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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public Map<String, Object> getTable1Data(
            @RequestParam(value = "draw", defaultValue = "1") Integer draw,
            @RequestParam(value = "start", defaultValue = "0") Integer start,
            @RequestParam(value = "length", defaultValue = "10") Integer length) {
        int pageNum = (start / length) + 1;
        PageInfo<MarginReportDTO> pageInfo = printReportService.getMarginCustomersNotInUserSnap(pageNum, length);
        Map<String, Object> response = createDataTableResponse(pageInfo);
        response.put("draw", draw);
        return response;
    }

    @GetMapping("/un-customer-report")
    @ResponseBody
    public Map<String, Object> getTable2Data(
            @RequestParam(value = "draw", defaultValue = "1") Integer draw,
            @RequestParam(value = "start", defaultValue = "0") Integer start,
            @RequestParam(value = "length", defaultValue = "10") Integer length) {
        int pageNum = (start / length) + 1;
        PageInfo<MarginReportDTO> pageInfo = printReportService.getUndeliverableMarginCustomers(pageNum, length);
        Map<String, Object> response = createDataTableResponse(pageInfo);
        response.put("draw", draw);
        return response;
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

    private Map<String, Object> createDataTableResponse(PageInfo<?> pageInfo) {
        Map<String, Object> response = new HashMap<>();
        response.put("recordsTotal", pageInfo.getTotal());
        response.put("recordsFiltered", pageInfo.getTotal());
        response.put("data", pageInfo.getList());
        return response;
    }
} 