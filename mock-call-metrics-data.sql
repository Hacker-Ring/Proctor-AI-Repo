-- Mock data for call_metrics table
-- 20 rows of realistic call metrics data

INSERT INTO call_metrics (
  id,
  user_id,
  call_id,
  call_duration,
  transcript,
  summary,
  start_time,
  end_time,
  vendor_details,
  created_at,
  updated_at
) VALUES 
-- Row 1
(
  gen_random_uuid(),
  'user_12345',
  'call_abc123',
  'call_001_20241201_143022',
  1247,
  'Hello, this is John from TechCorp. I''m calling about the software development position. I have 5 years of experience in React and Node.js. I''ve worked on several large-scale applications and have experience with microservices architecture. I''m particularly interested in your company''s mission to revolutionize healthcare technology. I''d love to discuss how my skills can contribute to your team.',
  'Candidate John from TechCorp called about software development position. Has 5 years React/Node.js experience, worked on large-scale apps and microservices. Interested in healthcare tech mission.',
  '2024-12-01T14:30:22Z',
  '2024-12-01T14:50:09Z',
  '{"vendor_name": "Twilio", "api_version": "2023-10-01", "additional_info": {"region": "us-east-1", "quality_score": 0.95}}',
  NOW(),
  NOW()
),

-- Row 2
(
  gen_random_uuid(),
  'user_67890',
  'call_def456',
  'call_002_20241201_150315',
  892,
  'Hi, I''m Sarah and I''m calling regarding the data scientist role. I have a PhD in Machine Learning from Stanford and 3 years of industry experience. I''ve published papers on deep learning applications in medical imaging. I''m excited about the opportunity to work on AI-driven healthcare solutions.',
  'Sarah called about data scientist role. PhD in ML from Stanford, 3 years industry experience, published papers on medical imaging AI. Interested in healthcare AI solutions.',
  '2024-12-01T15:03:15Z',
  '2024-12-01T15:18:07Z',
  '{"vendor_name": "Vonage", "api_version": "2023-11-15", "additional_info": {"region": "us-west-2", "quality_score": 0.88}}',
  NOW(),
  NOW()
),

-- Row 3
(
  gen_random_uuid(),
  'user_11111',
  'call_ghi789',
  'call_003_20241201_160445',
  2103,
  'Good afternoon, this is Michael Rodriguez. I''m calling about the product manager position. I have 7 years of experience in product management, primarily in the fintech space. I''ve led cross-functional teams of 15+ people and have a track record of launching products that generated $50M+ in revenue. I''m particularly drawn to your company''s innovative approach to healthcare technology and would love to discuss how I can help drive product strategy.',
  'Michael Rodriguez called about product manager role. 7 years PM experience in fintech, led 15+ person teams, launched $50M+ revenue products. Interested in healthcare tech innovation.',
  '2024-12-01T16:04:45Z',
  '2024-12-01T16:39:48Z',
  '{"vendor_name": "Agora", "api_version": "2024-01-01", "additional_info": {"region": "eu-west-1", "quality_score": 0.92}}',
  NOW(),
  NOW()
),

-- Row 4
(
  gen_random_uuid(),
  'user_22222',
  'call_jkl012',
  'call_004_20241201_171230',
  756,
  'Hello, I''m Emily Chen and I''m interested in the UX designer position. I have 4 years of experience designing user interfaces for healthcare applications. I''ve worked with accessibility standards and have experience with user research methodologies. I''m passionate about creating intuitive healthcare experiences.',
  'Emily Chen called about UX designer role. 4 years healthcare UI experience, accessibility standards, user research. Passionate about intuitive healthcare experiences.',
  '2024-12-01T17:12:30Z',
  '2024-12-01T17:25:06Z',
  '{"vendor_name": "Twilio", "api_version": "2023-10-01", "additional_info": {"region": "us-east-1", "quality_score": 0.91}}',
  NOW(),
  NOW()
),

-- Row 5
(
  gen_random_uuid(),
  'user_33333',
  'call_mno345',
  'call_005_20241201_182145',
  1834,
  'Hi there, this is David Kim calling about the DevOps engineer position. I have 6 years of experience in cloud infrastructure and automation. I''m AWS certified and have experience with Kubernetes, Docker, and CI/CD pipelines. I''ve worked on scaling systems to handle millions of users. I''m excited about the opportunity to work on healthcare infrastructure that needs to be highly available and secure.',
  'David Kim called about DevOps engineer role. 6 years cloud infrastructure experience, AWS certified, Kubernetes/Docker/CI-CD expertise. Worked on million-user scaling. Interested in secure healthcare infrastructure.',
  '2024-12-01T18:21:45Z',
  '2024-12-01T18:52:19Z',
  '{"vendor_name": "Vonage", "api_version": "2023-11-15", "additional_info": {"region": "us-west-2", "quality_score": 0.89}}',
  NOW(),
  NOW()
),

-- Row 6
(
  gen_random_uuid(),
  'user_44444',
  'call_pqr678',
  'call_006_20241201_193000',
  1123,
  'Good evening, I''m Lisa Thompson and I''m calling about the marketing manager role. I have 5 years of experience in digital marketing, with a focus on B2B healthcare technology. I''ve managed campaigns that generated $10M+ in pipeline and have experience with content marketing, SEO, and social media. I''m excited about promoting innovative healthcare solutions.',
  'Lisa Thompson called about marketing manager role. 5 years digital marketing experience, B2B healthcare tech focus, $10M+ pipeline campaigns. SEO/social media expertise. Interested in promoting healthcare innovation.',
  '2024-12-01T19:30:00Z',
  '2024-12-01T19:48:43Z',
  '{"vendor_name": "Agora", "api_version": "2024-01-01", "additional_info": {"region": "eu-west-1", "quality_score": 0.87}}',
  NOW(),
  NOW()
),

-- Row 7
(
  gen_random_uuid(),
  'user_55555',
  'call_stu901',
  'call_007_20241201_201500',
  945,
  'Hello, this is James Wilson calling about the sales representative position. I have 3 years of experience in healthcare sales and have consistently exceeded my quota by 120%. I have strong relationships with hospital administrators and understand the healthcare procurement process. I''m passionate about helping healthcare organizations improve patient outcomes.',
  'James Wilson called about sales rep role. 3 years healthcare sales experience, 120% quota achievement, hospital admin relationships. Understands healthcare procurement. Passionate about improving patient outcomes.',
  '2024-12-01T20:15:00Z',
  '2024-12-01T20:30:45Z',
  '{"vendor_name": "Twilio", "api_version": "2023-10-01", "additional_info": {"region": "us-east-1", "quality_score": 0.93}}',
  NOW(),
  NOW()
),

-- Row 8
(
  gen_random_uuid(),
  'user_66666',
  'call_vwx234',
  'call_008_20241201_210200',
  1678,
  'Hi, I''m Maria Garcia and I''m interested in the clinical research coordinator position. I have a Master''s in Public Health and 4 years of experience coordinating clinical trials. I''ve worked on studies involving 500+ participants and have experience with regulatory compliance, data collection, and patient recruitment. I''m excited about contributing to evidence-based healthcare solutions.',
  'Maria Garcia called about clinical research coordinator role. MPH degree, 4 years clinical trial coordination, 500+ participant studies. Regulatory compliance, data collection, patient recruitment experience. Interested in evidence-based healthcare.',
  '2024-12-01T21:02:00Z',
  '2024-12-01T21:30:18Z',
  '{"vendor_name": "Vonage", "api_version": "2023-11-15", "additional_info": {"region": "us-west-2", "quality_score": 0.90}}',
  NOW(),
  NOW()
),

-- Row 9
(
  gen_random_uuid(),
  'user_77777',
  'call_yza567',
  'call_009_20241201_220000',
  1234,
  'Good evening, this is Robert Johnson calling about the cybersecurity analyst position. I have 5 years of experience in healthcare cybersecurity and am CISSP certified. I''ve worked on HIPAA compliance, incident response, and security architecture. I''m passionate about protecting patient data and ensuring healthcare systems are secure.',
  'Robert Johnson called about cybersecurity analyst role. 5 years healthcare cybersecurity experience, CISSP certified. HIPAA compliance, incident response, security architecture. Passionate about patient data protection.',
  '2024-12-01T22:00:00Z',
  '2024-12-01T22:20:34Z',
  '{"vendor_name": "Agora", "api_version": "2024-01-01", "additional_info": {"region": "eu-west-1", "quality_score": 0.94}}',
  NOW(),
  NOW()
),

-- Row 10
(
  gen_random_uuid(),
  'user_88888',
  'call_bcd890',
  'call_010_20241201_230000',
  789,
  'Hello, I''m Jennifer Lee and I''m calling about the customer success manager role. I have 4 years of experience in customer success for SaaS healthcare companies. I''ve managed accounts worth $2M+ ARR and have a 95% customer retention rate. I''m excited about helping healthcare organizations maximize the value of your platform.',
  'Jennifer Lee called about customer success manager role. 4 years SaaS healthcare customer success experience, $2M+ ARR accounts, 95% retention rate. Excited about maximizing platform value for healthcare orgs.',
  '2024-12-01T23:00:00Z',
  '2024-12-01T23:13:09Z',
  '{"vendor_name": "Twilio", "api_version": "2023-10-01", "additional_info": {"region": "us-east-1", "quality_score": 0.88}}',
  NOW(),
  NOW()
),

-- Row 11
(
  gen_random_uuid(),
  'user_99999',
  'call_efg123',
  'call_011_20241202_090000',
  1456,
  'Good morning, this is Alex Chen calling about the full-stack developer position. I have 6 years of experience building web applications using React, Node.js, and Python. I''ve worked on healthcare applications that handle sensitive patient data and understand the importance of security and compliance. I''m excited about building innovative healthcare solutions.',
  'Alex Chen called about full-stack developer role. 6 years React/Node.js/Python experience, healthcare app development with sensitive data. Security/compliance understanding. Excited about innovative healthcare solutions.',
  '2024-12-02T09:00:00Z',
  '2024-12-02T09:24:16Z',
  '{"vendor_name": "Vonage", "api_version": "2023-11-15", "additional_info": {"region": "us-west-2", "quality_score": 0.92}}',
  NOW(),
  NOW()
),

-- Row 12
(
  gen_random_uuid(),
  'user_10101',
  'call_hij456',
  'call_012_20241202_100000',
  1034,
  'Hi, I''m Amanda Rodriguez and I''m interested in the business analyst position. I have 3 years of experience analyzing healthcare data and processes. I''ve worked on improving operational efficiency and have experience with SQL, Tableau, and process mapping. I''m passionate about using data to improve healthcare outcomes.',
  'Amanda Rodriguez called about business analyst role. 3 years healthcare data analysis experience, operational efficiency improvements. SQL/Tableau/process mapping skills. Passionate about data-driven healthcare outcomes.',
  '2024-12-02T10:00:00Z',
  '2024-12-02T10:17:14Z',
  '{"vendor_name": "Agora", "api_version": "2024-01-01", "additional_info": {"region": "eu-west-1", "quality_score": 0.89}}',
  NOW(),
  NOW()
),

-- Row 13
(
  gen_random_uuid(),
  'user_20202',
  'call_klm789',
  'call_013_20241202_110000',
  1789,
  'Hello, this is Kevin Park calling about the mobile app developer position. I have 5 years of experience developing iOS and Android apps, with a focus on healthcare applications. I''ve built apps that are HIPAA compliant and have experience with React Native, Swift, and Kotlin. I''m excited about creating mobile solutions that improve patient care.',
  'Kevin Park called about mobile app developer role. 5 years iOS/Android development, healthcare app focus, HIPAA compliance experience. React Native/Swift/Kotlin skills. Excited about mobile patient care solutions.',
  '2024-12-02T11:00:00Z',
  '2024-12-02T11:29:49Z',
  '{"vendor_name": "Twilio", "api_version": "2023-10-01", "additional_info": {"region": "us-east-1", "quality_score": 0.91}}',
  NOW(),
  NOW()
),

-- Row 14
(
  gen_random_uuid(),
  'user_30303',
  'call_nop012',
  'call_014_20241202_120000',
  823,
  'Good afternoon, I''m Rachel Green and I''m calling about the quality assurance engineer position. I have 4 years of experience in QA for healthcare software. I''ve worked on testing medical devices and software applications, ensuring they meet regulatory requirements. I''m passionate about ensuring software quality in healthcare environments.',
  'Rachel Green called about QA engineer role. 4 years healthcare software QA experience, medical device testing, regulatory compliance. Passionate about healthcare software quality assurance.',
  '2024-12-02T12:00:00Z',
  '2024-12-02T12:13:43Z',
  '{"vendor_name": "Vonage", "api_version": "2023-11-15", "additional_info": {"region": "us-west-2", "quality_score": 0.87}}',
  NOW(),
  NOW()
),

-- Row 15
(
  gen_random_uuid(),
  'user_40404',
  'call_qrs345',
  'call_015_20241202_130000',
  1567,
  'Hi there, this is Thomas Anderson calling about the system administrator position. I have 7 years of experience managing Linux servers and network infrastructure. I''ve worked in healthcare environments and understand the importance of uptime and security. I''m experienced with monitoring, backup systems, and disaster recovery. I''m excited about maintaining critical healthcare systems.',
  'Thomas Anderson called about system administrator role. 7 years Linux server/network infrastructure experience, healthcare environment background. Monitoring/backup/disaster recovery expertise. Excited about critical healthcare system maintenance.',
  '2024-12-02T13:00:00Z',
  '2024-12-02T13:26:07Z',
  '{"vendor_name": "Agora", "api_version": "2024-01-01", "additional_info": {"region": "eu-west-1", "quality_score": 0.93}}',
  NOW(),
  NOW()
),

-- Row 16
(
  gen_random_uuid(),
  'user_50505',
  'call_tuv678',
  'call_016_20241202_140000',
  1123,
  'Hello, I''m Nicole Brown and I''m interested in the project manager position. I have 5 years of experience managing healthcare IT projects. I''ve led implementations of EHR systems and have experience with Agile methodologies. I''m PMP certified and have a track record of delivering projects on time and within budget.',
  'Nicole Brown called about project manager role. 5 years healthcare IT project management, EHR implementation leadership, Agile experience. PMP certified, on-time/budget delivery track record.',
  '2024-12-02T14:00:00Z',
  '2024-12-02T14:18:43Z',
  '{"vendor_name": "Twilio", "api_version": "2023-10-01", "additional_info": {"region": "us-east-1", "quality_score": 0.90}}',
  NOW(),
  NOW()
),

-- Row 17
(
  gen_random_uuid(),
  'user_60606',
  'call_wxy901',
  'call_017_20241202_150000',
  1345,
  'Good afternoon, this is Daniel Kim calling about the database administrator position. I have 6 years of experience with PostgreSQL, MySQL, and MongoDB. I''ve worked on healthcare databases with millions of patient records and have experience with data migration, performance tuning, and backup strategies. I''m passionate about ensuring data integrity in healthcare systems.',
  'Daniel Kim called about database administrator role. 6 years PostgreSQL/MySQL/MongoDB experience, healthcare databases with millions of records. Data migration/performance tuning/backup expertise. Passionate about healthcare data integrity.',
  '2024-12-02T15:00:00Z',
  '2024-12-02T15:22:25Z',
  '{"vendor_name": "Vonage", "api_version": "2023-11-15", "additional_info": {"region": "us-west-2", "quality_score": 0.92}}',
  NOW(),
  NOW()
),

-- Row 18
(
  gen_random_uuid(),
  'user_70707',
  'call_zab234',
  'call_018_20241202_160000',
  987,
  'Hi, I''m Stephanie Davis and I''m calling about the technical writer position. I have 4 years of experience writing technical documentation for healthcare software. I''ve created user manuals, API documentation, and training materials. I have a background in nursing which helps me understand healthcare workflows and terminology.',
  'Stephanie Davis called about technical writer role. 4 years healthcare software documentation experience, user manuals/API docs/training materials. Nursing background for healthcare workflow understanding.',
  '2024-12-02T16:00:00Z',
  '2024-12-02T16:16:27Z',
  '{"vendor_name": "Agora", "api_version": "2024-01-01", "additional_info": {"region": "eu-west-1", "quality_score": 0.88}}',
  NOW(),
  NOW()
),

-- Row 19
(
  gen_random_uuid(),
  'user_80808',
  'call_cde567',
  'call_019_20241202_170000',
  1456,
  'Hello, this is Mark Wilson calling about the solutions architect position. I have 8 years of experience designing healthcare IT solutions. I''ve architected systems that integrate with multiple EHR platforms and have experience with HL7, FHIR, and other healthcare standards. I''m excited about designing scalable solutions that improve healthcare delivery.',
  'Mark Wilson called about solutions architect role. 8 years healthcare IT solution design experience, multi-EHR integration, HL7/FHIR standards expertise. Excited about scalable healthcare delivery solutions.',
  '2024-12-02T17:00:00Z',
  '2024-12-02T17:24:16Z',
  '{"vendor_name": "Twilio", "api_version": "2023-10-01", "additional_info": {"region": "us-east-1", "quality_score": 0.94}}',
  NOW(),
  NOW()
),

-- Row 20
(
  gen_random_uuid(),
  'user_90909',
  'call_fgh890',
  'call_020_20241202_180000',
  1234,
  'Good evening, I''m Jessica Martinez and I''m interested in the compliance officer position. I have 5 years of experience in healthcare compliance and regulatory affairs. I''m well-versed in HIPAA, FDA regulations, and healthcare quality standards. I''ve helped organizations pass audits and maintain compliance. I''m passionate about ensuring ethical and compliant healthcare operations.',
  'Jessica Martinez called about compliance officer role. 5 years healthcare compliance/regulatory affairs experience, HIPAA/FDA/quality standards expertise. Audit assistance and compliance maintenance. Passionate about ethical healthcare operations.',
  '2024-12-02T18:00:00Z',
  '2024-12-02T18:20:34Z',
  '{"vendor_name": "Vonage", "api_version": "2023-11-15", "additional_info": {"region": "us-west-2", "quality_score": 0.91}}',
  NOW(),
  NOW()
);
