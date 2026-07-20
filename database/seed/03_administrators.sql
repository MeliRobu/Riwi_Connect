--ADMINISTRATORS/MANAGERS:
INSERT INTO institutional_sources (document_number, full_name, email, id_campus, id_journey, id_clan)
VALUES
    (900000001,'Riwi Connect Administrator Barranquilla','admin.baq@riwi.io',1,4, null),
    (900000002,'Riwi Connect Administrator Medellin','admin.med@riwi.io',2,4,  null);
-- ADMINISTRATOR - BARRANQUILLA
-- Initial password: Prueba1234, hashed with werkzeug generate_password_hash()
INSERT INTO users (password_hash, id_institutional_source, status, role)
SELECT
    'scrypt:32768:8:1$cAGxOIoxBFSJL4sB$195d3945ce7102b45f050e166a698c22da87eb41c6f998d6bec5a4d20efbf8cc50e5571abe8d3e64731e83416dcef18a221b323da03108a3117e240ab96198ab',
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
    'scrypt:32768:8:1$cAGxOIoxBFSJL4sB$195d3945ce7102b45f050e166a698c22da87eb41c6f998d6bec5a4d20efbf8cc50e5571abe8d3e64731e83416dcef18a221b323da03108a3117e240ab96198ab',
    (
        SELECT id_institutional_source
        FROM institutional_sources
        WHERE email = 'admin.med@riwi.io'
    ),
    'AVAILABLE',
    'ADMINISTRATOR'
);