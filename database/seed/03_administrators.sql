--ADMINISTRATORS/MANAGERS:
INSERT INTO institutional_sources (document_number, full_name, email, id_campus, id_journey, id_clan)
VALUES
    (900000001,'Riwi Connect Administrator Barranquilla','admin.baq@riwi.io',1,4, null),
    (900000002,'Riwi Connect Administrator Medellin','admin.med@riwi.io',2,4,  null);
-- ADMINISTRATOR - BARRANQUILLA
-- Initial password: admin1234, hashed with werkzeug generate_password_hash()
INSERT INTO users (password_hash, id_institutional_source, status, role)
SELECT
    'scrypt:32768:8:1$7JX74ufoYDWqGTj0$cb409fd13248a75b3d6e9f1fcd3447903957ccaf4648c6a5685e9d4531583247758aaafc8a1ac95ceedaad544403f3c0f7401c51386b3714e0264494e00fb8cc',
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
    'scrypt:32768:8:1$7JX74ufoYDWqGTj0$cb409fd13248a75b3d6e9f1fcd3447903957ccaf4648c6a5685e9d4531583247758aaafc8a1ac95ceedaad544403f3c0f7401c51386b3714e0264494e00fb8cc',
    (
        SELECT id_institutional_source
        FROM institutional_sources
        WHERE email = 'admin.med@riwi.io'
    ),
    'AVAILABLE',
    'ADMINISTRATOR'
);