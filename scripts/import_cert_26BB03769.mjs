import fs from 'fs';
import path from 'path';

const repoPath = 'C:/Users/ADMIN/Desktop/bb_exp-2.0';

// 1. Update admin_store.json
const adminStorePath = path.join(repoPath, 'src/data/admin_store.json');
const adminStore = JSON.parse(fs.readFileSync(adminStorePath, 'utf8'));

const newCertItem = {
  id: 5467,
  certificate_number: '26BB03769',
  student_name: 'jagdeep singh',
  candidate_email: 'jsmuman@gmail.com',
  course_name: 'IATF 16949:2016 INTERNAL AUDITOR',
  training_type: 'Corporate Training',
  issuing_organization: 'Broadbeach Academy',
  authorized_signatory: 'Dr. K. R. Sharma, Academic Director',
  issue_date: '2026-09-17',
  completion_date: '2026-09-17',
  status: 'valid',
  verification_status: 'Valid',
  validity: 'Lifetime',
  notes: 'Country: INDIA. Sl No: 2498, Month: NOVEMBER 2026. Date of Issue: 17-09-2026',
  history: [
    {
      action: 'imported',
      timestamp: '2026-11-17T00:00:00Z',
      performed_by: 'System Administrator',
      details: 'Batch imported into Master Certificate Registry.'
    }
  ]
};

const auditLogEntry = {
  id: 'LOG-' + Date.now().toString(36).toUpperCase() + '-CERT',
  timestamp: new Date().toISOString(),
  created_at: new Date().toISOString(),
  actor_name: 'System Administrator',
  performed_by: 'System Administrator',
  actor_email: 'admin@broadbeachlearning.com',
  performed_by_email: 'admin@broadbeachlearning.com',
  actor_role: 'super_admin',
  action_category: 'CERTIFICATE',
  module: 'Manual Cert Master',
  action: 'IMPORT_MANUAL_CERTIFICATE',
  target_type: 'manual_certificate',
  target_id: '26BB03769',
  details: "Imported manual certificate 26BB03769 for student 'jagdeep singh' (IATF 16949:2016 INTERNAL AUDITOR, jsmuman@gmail.com).",
  status: 'success',
  outcome: 'Success'
};

if (!adminStore.manual_certificates.some(c => c.certificate_number === newCertItem.certificate_number)) {
  adminStore.manual_certificates.push(newCertItem);
  console.log('Appended 26BB03769 to admin_store.manual_certificates.');
} else {
  console.log('admin_store already has 26BB03769. Updating details.');
  const idx = adminStore.manual_certificates.findIndex(c => c.certificate_number === newCertItem.certificate_number);
  adminStore.manual_certificates[idx] = newCertItem;
}

if (!Array.isArray(adminStore.audit_logs)) {
  adminStore.audit_logs = [];
}
adminStore.audit_logs.unshift(auditLogEntry);

fs.writeFileSync(adminStorePath, JSON.stringify(adminStore, null, 2), 'utf8');
console.log('admin_store.json updated. Total count:', adminStore.manual_certificates.length);

// 2. Update manualCertificatesData.js
const mCertDataPath = path.join(repoPath, 'src/data/manualCertificatesData.js');
let mCertCode = fs.readFileSync(mCertDataPath, 'utf8');

mCertCode = mCertCode.replace(/Total Records: \d+/, 'Total Records: ' + adminStore.manual_certificates.length);

const rawAppend = '{"id":5467,"certificate_number":"26BB03769","student_name":"jagdeep singh","candidate_email":"jsmuman@gmail.com","course_name":"IATF 16949:2016 INTERNAL AUDITOR","issue_date":"2026-09-17","status":"valid","validity":"Lifetime","notes":"Country: INDIA. Sl No: 2498, Month: NOVEMBER 2026. Date of Issue: 17-09-2026"}';

const targetOldEnd = '{"id":5466,"certificate_number":"26BB03768","student_name":"Eric Siaw nartey","course_name":"LEAN SIX SIGMA BLACK BELT","issue_date":"2026-10-27","status":"valid","validity":"Lifetime","notes":"Country: GHANA. Sl No: 2497, Month: OCTOBER 2026."}';

if (!mCertCode.includes('26BB03769')) {
  if (mCertCode.includes(targetOldEnd)) {
    mCertCode = mCertCode.replace(targetOldEnd, targetOldEnd + ',' + rawAppend);
    fs.writeFileSync(mCertDataPath, mCertCode, 'utf8');
    console.log('manualCertificatesData.js updated successfully!');
  } else {
    console.error('Error: targetOldEnd not found in manualCertificatesData.js');
  }
} else {
  console.log('manualCertificatesData.js already contains 26BB03769.');
}

// 3. Create incremental SQL migration file
const incrementalSqlPath = path.join(repoPath, 'database/2026_11_17_import_certificate_26BB03769.sql');
const incrementalSql = [
  '-- Broadbeach Academy — Incremental Certificate Import Migration',
  '-- Generated: 2026-11-17',
  '-- Record: 26BB03769 (jagdeep singh)',
  '',
  'INSERT INTO `manual_certificates` (`certificate_number`, `student_name`, `candidate_email`, `course_name`, `issue_date`, `completion_date`, `issuing_organization`, `signatory`, `training_type`, `status`, `verification_status`) VALUES',
  "('26BB03769', 'jagdeep singh', 'jsmuman@gmail.com', 'IATF 16949:2016 INTERNAL AUDITOR', '2026-09-17', '2026-09-17', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid')",
  'ON DUPLICATE KEY UPDATE',
  '  `student_name` = VALUES(`student_name`),',
  '  `candidate_email` = VALUES(`candidate_email`),',
  '  `course_name` = VALUES(`course_name`),',
  '  `issue_date` = VALUES(`issue_date`),',
  '  `completion_date` = VALUES(`completion_date`),',
  '  `status` = VALUES(`status`),',
  '  `verification_status` = VALUES(`verification_status`);',
  ''
].join('\n');

fs.writeFileSync(incrementalSqlPath, incrementalSql, 'utf8');
console.log('Incremental SQL migration written:', incrementalSqlPath);

// 4. Update master SQL migration file
const masterSqlPath = path.join(repoPath, 'database/2026_11_09_import_manual_certificates.sql');
let masterSql = fs.readFileSync(masterSqlPath, 'utf8');
masterSql = masterSql.replace(/Total Records: \d+/, 'Total Records: ' + adminStore.manual_certificates.length);

const oldSqlTarget = "('26BB03768', 'Eric Siaw nartey', '', 'LEAN SIX SIGMA BLACK BELT', '2026-10-27', '2026-10-27', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid')";
const newSqlLine = "('26BB03769', 'jagdeep singh', 'jsmuman@gmail.com', 'IATF 16949:2016 INTERNAL AUDITOR', '2026-09-17', '2026-09-17', 'Broadbeach Academy', 'Dr. K. R. Sharma, Academic Director', 'Corporate Training', 'valid', 'Valid')";

if (!masterSql.includes('26BB03769')) {
  if (masterSql.includes(oldSqlTarget)) {
    masterSql = masterSql.replace(oldSqlTarget, oldSqlTarget + ',\n' + newSqlLine);
    fs.writeFileSync(masterSqlPath, masterSql, 'utf8');
    console.log('Master SQL file updated successfully!');
  } else {
    console.error('Error: oldSqlTarget not found in master SQL file');
  }
} else {
  console.log('Master SQL file already contains 26BB03769.');
}
