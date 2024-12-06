-- 清理已有数据
DELETE FROM tbl_undeliver_rec_daily;
DELETE FROM tbl_margin_tradelimit_daily;
DELETE FROM tbl_user_snap WHERE id >= 100;
DELETE FROM tbl_sms_message WHERE id >= 100;

-- 添加保证金账户数据（有对应用户快照的账户）
INSERT INTO tbl_margin_tradelimit_daily (id, sec_Acc_No, sec_Acc_No_9Digit, sec_Acc_Name, margin_Flag, created_by, last_modified_by) 
SELECT 
  100 + generate_series,
  'TEST' || lpad(generate_series::text, 10, '0'),
  lpad(generate_series::text, 9, '0'),
  '测试账户' || generate_series,
  'Y',
  'SYSTEM',
  'SYSTEM'
FROM generate_series(1, 200);

-- 添加保证金账户数据（没有对应用户快照的账户）
INSERT INTO tbl_margin_tradelimit_daily (id, sec_Acc_No, sec_Acc_No_9Digit, sec_Acc_Name, margin_Flag, created_by, last_modified_by) 
SELECT 
  1000 + generate_series,
  'TEST' || lpad((1000 + generate_series)::text, 10, '0'),
  lpad((1000 + generate_series)::text, 9, '0'),
  '无用户账户' || generate_series,
  'Y',
  'SYSTEM',
  'SYSTEM'
FROM generate_series(1, 200);

-- 添加用户快照数据
INSERT INTO tbl_user_snap (id, sec_acc_no, sec_acc_no_9digit, user_no, tel_no, created_by, last_modified_by)
SELECT 
  100 + generate_series,
  'TEST' || lpad(generate_series::text, 10, '0'),
  lpad(generate_series::text, 9, '0'),
  'USER' || (100 + generate_series),
  '138' || lpad(generate_series::text, 8, '0'),
  'SYSTEM',
  'SYSTEM'
FROM generate_series(1, 200);

-- 添加未投递记录数据
INSERT INTO tbl_undeliver_rec_daily (id, mobile_number, delivery_time, termination_time, created_by, last_modified_by)
SELECT 
  100 + generate_series,
  '138' || lpad(generate_series::text, 8, '0'),
  CURRENT_TIMESTAMP - (generate_series || ' hours')::interval,
  CURRENT_TIMESTAMP - (generate_series || ' hours')::interval + '30 minutes'::interval,
  'SYSTEM',
  'SYSTEM'
FROM generate_series(1, 200);

-- 添加短信消息数据
INSERT INTO tbl_sms_message (id, ac_no, mobile_number, content, status, reason, send_time, sender, submit_time)
SELECT 
  100 + generate_series,
  'TEST' || lpad(generate_series::text, 10, '0'),
  '138' || lpad(generate_series::text, 8, '0'),
  '测试消息' || generate_series,
  'Fail',
  CASE (generate_series % 3)
    WHEN 0 THEN '101,UNDELIV'
    WHEN 1 THEN '001,UNDELIV'
    ELSE 'EXPIRED'
  END,
  CURRENT_TIMESTAMP - (generate_series || ' hours')::interval,
  '10690000',
  CURRENT_TIMESTAMP - (generate_series || ' hours')::interval - '5 minutes'::interval
FROM generate_series(1, 200); 