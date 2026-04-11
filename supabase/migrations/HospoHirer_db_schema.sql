-- Dropping tables
DROP TABLE applicant CASCADE;
DROP TABLE job_preference CASCADE;
DROP TABLE applicant_job_preference CASCADE;
DROP TABLE work_history CASCADE;

-- Creating applicant table
CREATE TABLE applicant (
  app_id              SERIAL PRIMARY KEY,
  app_name            VARCHAR(50) NOT NULL,
  app_dob             DATE NOT NULL,
  app_suburb          VARCHAR(30) NOT NULL,
  app_email           VARCHAR(100),
  app_phoneno         VARCHAR(15),
  app_radius_km       NUMERIC(4) NOT NULL,
  app_exp             VARCHAR(200) NOT NULL,
  app_cert            VARCHAR(100),
  app_availability    VARCHAR(50) NOT NULL
);

-- Creating job_preference table
CREATE TABLE job_preference (
  job_id     SERIAL PRIMARY KEY,
  job_name   VARCHAR(100) NOT NULL
);

-- Creating applicant_job_preference table
CREATE TABLE applicant_job_preference (
  app_id       INT NOT NULL,
  job_id       INT NOT NULL
);

-- Adding applicant_job_preference constraints
ALTER TABLE applicant_job_preference ADD CONSTRAINT app_job_pk PRIMARY KEY (app_id, job_id);

-- Creating work_history table
CREATE TABLE work_history (
  wh_id               SERIAL PRIMARY KEY,
  app_id              INT NOT NULL,
  wh_company_name     VARCHAR(100),
  wh_role             VARCHAR(100),
  wh_start_date       DATE,
  wh_end_date         DATE
);

-- Adding foreign keys
ALTER TABLE applicant_job_preference ADD CONSTRAINT app_app_job_fk FOREIGN KEY (app_id) REFERENCES applicant (app_id);
ALTER TABLE applicant_job_preference ADD CONSTRAINT job_app_job_fk FOREIGN KEY (job_id) REFERENCES job_preference (job_id);
ALTER TABLE work_history ADD CONSTRAINT app_wk_fk FOREIGN KEY (app_id) REFERENCES applicant (app_id);