-- Alter the remarks table to add a new primary key 'remark_id' and allow multiple remarks per appointment_id

-- Step 1: Add the new remark_id column as auto-increment primary key
ALTER TABLE remarks ADD COLUMN remark_id INT AUTO_INCREMENT PRIMARY KEY;

-- Step 2: Drop the existing primary key constraint on appointment_id
ALTER TABLE remarks DROP PRIMARY KEY;

-- Note: The appointment_id column remains as a regular column, allowing multiple entries for the same appointment_id.
-- Each new remark will get a unique remark_id.
