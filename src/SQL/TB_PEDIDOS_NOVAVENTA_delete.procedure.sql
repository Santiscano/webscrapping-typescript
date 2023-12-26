CREATE PROCEDURE `TB_PEDIDOS_NOVAVENTA_delete` (
    IN _id INT,
    OUT p_message VARCHAR(200)
)
BEGIN
    DECLARE v_counter INT;
    SELECT COUNT(*) INTO v_counter FROM TB_PEDIDOS_NOVAVENTA WHERE id = _id;

    IF v_counter = 0 THEN
        SET p_message = CONCAT('Los datos con id: ', _id, ' no existen en la base de datos');
    ELSE
        DELETE FROM TB_PEDIDOS_NOVAVENTA WHERE id = _id;
        SET p_message = CONCAT('Datos con id: ', _id, ' eliminado con éxito');
    END IF;
END
