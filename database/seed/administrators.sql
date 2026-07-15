    --ADMINISTRATORS/MANAGERS:
INSERT INTO institutional_sources (document_number, full_name, email, id_campus, id_journey, id_clan)
VALUES
    (900000001,'Riwi Connect Administrator Barranquilla','admin.baq@riwi.io',1,4, null),
    (900000002,'Riwi Connect Administrator Medellin','admin.med@riwi.io',2,4,  null);


 -- ADMINISTRATOR - BARRANQUILLA
 -- Initial password: admin123 (hashed by Flask in production)
INSERT INTO users (password_hash, id_institutional_source, status, role)
SELECT
    'admin123',
    id_institutional_source,
    'AVAILABLE',
    'ADMINISTRATOR'
FROM institutional_sources
WHERE email = 'admin.baq@riwi.io';

-- ADMINISTRATOR - MEDELLIN , ANOTHER WAY TO DO IT

INSERT INTO users
(password_hash, id_institutional_source, status, role)
VALUES
(
    'admin123',
    (
        SELECT id_institutional_source
        FROM institutional_sources
        WHERE email = 'admin.med@riwi.io'
    ),
    'AVAILABLE',
    'ADMINISTRATOR'
);