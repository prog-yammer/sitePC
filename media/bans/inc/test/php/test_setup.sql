CREATE TABLE IF NOT EXISTS test_bans(id SERIAL,uuid VARCHAR(36),ip VARCHAR(45),reason varchar(2048) NOT NULL,banned_by_uuid VARCHAR(36),banned_by_name VARCHAR(128),removed_by_uuid VARCHAR(36),removed_by_name VARCHAR(128),removed_by_reason VARCHAR(2048),removed_by_date TIMESTAMP,time BIGINT NOT NULL,until BIGINT NOT NULL,server_scope VARCHAR(32),server_origin VARCHAR(32),silent BIT NOT NULL,ipban BIT NOT NULL,ipban_wildcard BIT NOT NULL,active BIT NOT NULL  ,PRIMARY KEY (id))ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE TABLE IF NOT EXISTS test_mutes(id SERIAL,uuid VARCHAR(36),ip VARCHAR(45),reason varchar(2048) NOT NULL,banned_by_uuid VARCHAR(36),banned_by_name VARCHAR(128),removed_by_uuid VARCHAR(36),removed_by_name VARCHAR(128),removed_by_reason VARCHAR(2048),removed_by_date TIMESTAMP,time BIGINT NOT NULL,until BIGINT NOT NULL,server_scope VARCHAR(32),server_origin VARCHAR(32),silent BIT NOT NULL,ipban BIT NOT NULL,ipban_wildcard BIT NOT NULL,active BIT NOT NULL  ,PRIMARY KEY (id))ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE TABLE IF NOT EXISTS test_warnings(id SERIAL,uuid VARCHAR(36),ip VARCHAR(45),reason varchar(2048) NOT NULL,banned_by_uuid VARCHAR(36),banned_by_name VARCHAR(128),removed_by_uuid VARCHAR(36),removed_by_name VARCHAR(128),removed_by_reason VARCHAR(2048),removed_by_date TIMESTAMP,time BIGINT NOT NULL,until BIGINT NOT NULL,server_scope VARCHAR(32),server_origin VARCHAR(32),silent BIT NOT NULL,ipban BIT NOT NULL,ipban_wildcard BIT NOT NULL,active BIT NOT NULL ,warned BIT NOT NULL ,PRIMARY KEY (id))ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE TABLE IF NOT EXISTS test_kicks(id SERIAL,uuid VARCHAR(36),ip VARCHAR(45),reason varchar(2048) NOT NULL,banned_by_uuid VARCHAR(36),banned_by_name VARCHAR(128),time BIGINT NOT NULL,until BIGINT NOT NULL,server_scope VARCHAR(32),server_origin VARCHAR(32),silent BIT NOT NULL,ipban BIT NOT NULL,ipban_wildcard BIT NOT NULL,active BIT NOT NULL  ,PRIMARY KEY (id))ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE TABLE IF NOT EXISTS test_history(id SERIAL,date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,name varchar(16) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,uuid varchar(36) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,ip varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,PRIMARY KEY (id))ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci;
CREATE TABLE IF NOT EXISTS test_config(id SERIAL,version varchar(128)CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,build varchar(128)CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,timezone varchar(32) CHARACTER SET utf8 COLLATE utf8_unicode_ci DEFAULT '+00:00',PRIMARY KEY (id))ENGINE=InnoDB CHARACTER SET utf8 COLLATE utf8_unicode_ci;
INSERT INTO test_history(name,uuid,ip)VALUES('Ruan','2ccd0bb2-8121-4361-803a-945b8f0644ab','#');
INSERT INTO test_bans(uuid,ip,reason,banned_by_uuid,banned_by_name,time,until,server_scope,server_origin,silent,ipban,ipban_wildcard,active)VALUES('2ccd0bb2-8121-4361-803a-945b8f0644ab','#','.','CONSOLE','Console',1596821141202,-1,'*',NULL,0,0,0,1);