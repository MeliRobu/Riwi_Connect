    --ADMINISTRATORS/MANAGERS:
INSERT INTO institutional_sources (document_number, full_name, email, id_campus, id_journey, id_clan)
VALUES
    (900000001,'Riwi Connect Administrator Barranquilla','admin.baq@riwi.io',1,4,21),
    (900000002,'Riwi Connect Administrator Medellin','admin.med@riwi.io',2,4,21);


INSERT INTO users (username, password_hash, id_institutional_source,status,role)
VALUES
    ('admin_baq','$2b$12$ExampleHashAdministratorBarranquilla',
        (
            SELECT id_institutional_source
            FROM institutional_sources
            WHERE email = 'admin.baq@riwi.io'
        ),
        'AVAILABLE','ADMINISTRATOR'
    );
    ('admin_med','$2b$12$ExampleHashAdministratorMedellin',
     (
         SELECT id_institutional_source
         FROM institutional_sources
         WHERE email = 'admin.med@riwi.io'
     ),
     'AVAILABLE','ADMINISTRATOR'
    );
 