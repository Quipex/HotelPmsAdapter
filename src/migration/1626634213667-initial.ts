import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1626634213667 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			CREATE TABLE pms_bookings_raw
			(
				id                     INTEGER NOT NULL
					CONSTRAINT pms_bookings_raw_pk PRIMARY KEY,
				"cdsCustomerBalance"   REAL,
				"cdsCustomerFirstName" VARCHAR(50),
				"cdsCustomerId"        INTEGER,
				"cdsCustomerLastName"  VARCHAR(50),
				"cdsTotal"             REAL,
				"customerFirstName"    VARCHAR(50),
				"customerLastName"     VARCHAR(50),
				"customerId"           INTEGER,
				"startDate"            DATE,
				"endDate"              DATE,
				"groupId"              INTEGER,
				"groupTotal"           REAL,
				"groupTotalPaid"       REAL,
				moved                  BOOLEAN,
				"roomId"               INTEGER,
				"roomTypeId"           INTEGER,
				source                 VARCHAR(30),
				total                  REAL,
				status                 VARCHAR(30),
				"totalPaid"            REAL,
				type                   VARCHAR(30),
				"realRoomNumber"       INTEGER,
				"addedDate"            TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
				"realRoomType"         VARCHAR(50),
				"remindedPrepayment"   TIMESTAMP WITH TIME ZONE
			);

			CREATE INDEX pms_bookings_raw_dates_index ON pms_bookings_raw ("startDate", "endDate");
		`);
		await queryRunner.query(`
			CREATE TABLE pms_bookings_raw_history
			(
				id                     INTEGER NOT NULL,
				"cdsCustomerBalance"   REAL,
				"cdsCustomerFirstName" VARCHAR(50),
				"cdsCustomerId"        INTEGER,
				"cdsCustomerLastName"  VARCHAR(50),
				"cdsTotal"             REAL,
				"customerFirstName"    VARCHAR(50),
				"customerLastName"     VARCHAR(50),
				"customerId"           INTEGER,
				"startDate"            DATE,
				"endDate"              DATE,
				"groupId"              INTEGER,
				"groupTotal"           REAL,
				"groupTotalPaid"       REAL,
				moved                  BOOLEAN,
				"roomId"               INTEGER,
				"roomTypeId"           INTEGER,
				source                 VARCHAR(30),
				total                  INTEGER,
				status                 VARCHAR(30),
				"totalPaid"            REAL,
				type                   VARCHAR(30),
				"realRoomNumber"       INTEGER,
				"addedDate"            TIMESTAMP WITH TIME ZONE,
				"realRoomType"         VARCHAR(50),
				"remindedPrepayment"   TIMESTAMP WITH TIME ZONE
			);

			CREATE INDEX pms_bookings_raw_history_id_index ON pms_bookings_raw_history (id);
		`);

		await queryRunner.query(`
			CREATE TABLE pms_clients_raw
			(
				"createdDate"       DATE,
				"updatedDate"       DATE,
				id                  INTEGER NOT NULL
					CONSTRAINT pms_clients_raw_pk PRIMARY KEY,
				"firstName"         VARCHAR(50),
				"lastName"          VARCHAR(50),
				patronymic          VARCHAR(50),
				dob                 VARCHAR(50),
				identity            VARCHAR(50),
				country             VARCHAR(50),
				city                VARCHAR(50),
				province            VARCHAR(50),
				address             VARCHAR(50),
				"fromPoH"           BOOLEAN,
				phone               VARCHAR(20),
				email               VARCHAR(100),
				language            VARCHAR(15),
				"driverLicense"     VARCHAR(30),
				"passportNumber"    VARCHAR(30),
				"passportValidTill" VARCHAR,
				"passportIssued"    VARCHAR(30),
				"passportIssuedBy"  VARCHAR(50),
				"postIndex"         VARCHAR(10),
				cio                 VARCHAR(50),
				"entryType"         VARCHAR(20),
				"entryValidFrom"    VARCHAR,
				"entryValidTill"    VARCHAR,
				"entryNumber"       VARCHAR(20),
				"visaType"          VARCHAR(20),
				"carBrand"          VARCHAR(20),
				"carNumber"         VARCHAR(20),
				"listMembership"    VARCHAR(30),
				"membershipReason"  VARCHAR(50),
				discount            INTEGER,
				notes               TEXT,
				"hasPersonalData"   BOOLEAN,
				active              BOOLEAN,
				type                VARCHAR(15),
				"dateAdded"         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
				"fullNameRu"        VARCHAR(100),
				"fullNameUa"        VARCHAR(100),
				"fullNameEn"        VARCHAR(100),
				"fullNameOrig"      VARCHAR(100)
			);

			CREATE INDEX pms_clients_raw_names_index ON pms_clients_raw ("fullNameEn", "fullNameRu", "fullNameUa", "fullNameOrig");
		`);

		// language=PostgreSQL
		await queryRunner.query(`
			CREATE FUNCTION pms_bookings_update_trigger_fn() RETURNS TRIGGER
				LANGUAGE plpgsql AS
			$$
			DECLARE
				f PMS_BOOKINGS_RAW;
			BEGIN
				IF old IS DISTINCT FROM new THEN
					INSERT INTO pms_bookings_raw_history(id, "cdsCustomerBalance", "cdsCustomerFirstName", "cdsCustomerId",
																							 "cdsCustomerLastName", "cdsTotal", "customerFirstName",
																							 "customerLastName",
																							 "customerId", "startDate", "endDate", "groupId", "groupTotal",
																							 "groupTotalPaid", moved, "roomId", "roomTypeId", source, total, status,
																							 "totalPaid", type, "realRoomNumber", "addedDate", "realRoomType",
																							 "remindedPrepayment")
						VALUES (OLD.id, OLD."cdsCustomerBalance", OLD."cdsCustomerFirstName", OLD."cdsCustomerId",
										OLD."cdsCustomerLastName", OLD."cdsTotal", OLD."customerFirstName", OLD."customerLastName",
										OLD."customerId", OLD."startDate", OLD."endDate", OLD."groupId", OLD."groupTotal",
										OLD."groupTotalPaid", OLD.moved, OLD."roomId", OLD."roomTypeId", OLD.source, OLD.total,
										OLD.status, OLD."totalPaid", OLD.type, OLD."realRoomNumber", OLD."addedDate", OLD."realRoomType",
										OLD."remindedPrepayment");

					f :=
						ROW (NEW.id, NEW."cdsCustomerBalance", NEW."cdsCustomerFirstName", NEW."cdsCustomerId", NEW."cdsCustomerLastName", NEW."cdsTotal", NEW."customerFirstName", NEW."customerLastName", NEW."customerId", NEW."startDate", NEW."endDate", NEW."groupId", NEW."groupTotal", NEW."groupTotalPaid", NEW.moved, NEW."roomId", NEW."roomTypeId", NEW.source, NEW.total, NEW.status, NEW."totalPaid", NEW.type, NEW."realRoomNumber", CURRENT_TIMESTAMP, NEW."realRoomType", NEW."remindedPrepayment");
					RETURN f;

				ELSE
					RETURN OLD;
				END IF;
			END;

			$$;

			ALTER FUNCTION pms_bookings_update_trigger_fn() OWNER TO postgres;
		`);

		// language=PostgreSQL
		await queryRunner.query(`
			CREATE TRIGGER on_pms_bookings_update
				BEFORE UPDATE
				ON pms_bookings_raw
				FOR EACH ROW
			EXECUTE PROCEDURE pms_bookings_update_trigger_fn();
		`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
	}
}
