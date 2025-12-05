-- SQL script to create agent_bank_details table with foreign key referencing users_kp_db.user_id

CREATE TABLE agent_bank_details (
    agent_id VARCHAR(30) NOT NULL PRIMARY KEY,
    account_holder_name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(255),
    account_number VARCHAR(30),
    ifsc_code VARCHAR(20),
    upi_id VARCHAR(50),
    qr_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_agent_user FOREIGN KEY (agent_id) REFERENCES users_kp_db(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
