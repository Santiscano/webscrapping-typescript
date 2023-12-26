CREATE PROCEDURE `TB_PEDIDOS_NOVAVENTA_create` (
    IN _Plataforma VARCHAR(245),
    IN _Campaña VARCHAR(245),
    IN _Fecha_Recepcion VARCHAR(245),
    IN _Hora_Recepcion VARCHAR(245),
    IN _Manifiesto VARCHAR(245),
    IN _Region VARCHAR(245),
    IN _Zona VARCHAR(245),
    IN _Seccion VARCHAR(245),
    IN _Nombre_destinatatio VARCHAR(245),
    IN _Cedula VARCHAR(245),
    IN _Numero_Boleta VARCHAR(45),
    IN _Direccion VARCHAR(245),
    IN _Departamento VARCHAR(245),
    IN _Ciudad VARCHAR(245),
    IN _Municipio_Enviexpres VARCHAR(245),
    IN _Barrio VARCHAR(245),
    IN _Telefono VARCHAR(245),
    IN _Tipo VARCHAR(245),
    IN _Promesa_de_Entrega VARCHAR(245),
    IN _Estado_Pedido VARCHAR(245),
    IN _Asignaciones VARCHAR(245),
    IN _Usuario_Movil VARCHAR(245),
    IN _Placas_del_Usuario_Movil VARCHAR(245),
    IN _Estado_Entrega VARCHAR(245),
    IN _Fecha_Entrega VARCHAR(245),
    IN _Hora_Entrega VARCHAR(245),
    IN _Nov_Entrega VARCHAR(245),
    IN _Obs_Entrega VARCHAR(245),
    IN _Direccion_Tercero VARCHAR(245),
    IN _Nombre_Tercero VARCHAR(245),
    IN _Foto1 VARCHAR(445),
    IN _Foto2 VARCHAR(445),
    IN _Foto3 VARCHAR(445),
    IN _Foto4 VARCHAR(445),
    IN _Foto5 VARCHAR(445),
    IN _Numero_Asignacion VARCHAR(245),
    IN _Numero_Despacho VARCHAR(245),
    IN _Fecha_Despacho VARCHAR(245),
    IN _Hora_Despacho VARCHAR(245),
    IN _Latitud VARCHAR(245),
    IN _Longitud VARCHAR(512),
    IN _Pedido_Inventariado VARCHAR(245),
    IN _Novedad_Inventario VARCHAR(245),
    IN _Observacion_Inventario VARCHAR(245),
    IN _Clasificacion_por_Valor VARCHAR(245),
    IN _Subestado VARCHAR(245),
    IN _Transportador VARCHAR(245),
    IN _Valor_Costo VARCHAR(45),
    IN _Valor_Venta VARCHAR(45),
    IN _Factura_De_Venta VARCHAR(45),
    IN _Fecha_De_Venta VARCHAR(45),
    IN _Pre_Liquidacion VARCHAR(45),
    IN _Fecha_Pre_Liquidacion VARCHAR(45),
    IN _Orden_de_Compra VARCHAR(45),
    IN _Fecha_Orden_de_Compra VARCHAR(45),
    IN _Leido INT,
    OUT p_message VARCHAR(255),
    OUT p_insert_id INT
)
BEGIN
    -- DECLARE v_counter INT;
    -- SELECT COUNT(*) INTO v_counter FROM TB_PEDIDOS_NOVAVENTA WHERE parametro????? = _parametro???? ;

    -- IF v_counter > 0 THEN
        -- SET p_message = CONCAT('los datos ', _parametro?????,' ya existe en la base de datos');
        -- SET p_insert_id = NULL;
    -- ELSE
        INSERT INTO TB_PEDIDOS_NOVAVENTA
            ( Plataforma, Campaña, Fecha_Recepcion, Hora_Recepcion, Manifiesto, Region, Zona, Seccion, Nombre_destinatatio, Cedula, Numero_Boleta, Direccion, Departamento, Ciudad, Municipio_Enviexpres, Barrio, Telefono, Tipo, Promesa_de_Entrega, Estado_Pedido, Asignaciones, Usuario_Movil, Placas_del_Usuario_Movil, Estado_Entrega, Fecha_Entrega, Hora_Entrega, Nov_Entrega, Obs_Entrega, Direccion_Tercero, Nombre_Tercero, Foto1, Foto2, Foto3, Foto4, Foto5, Numero_Asignacion, Numero_Despacho, Fecha_Despacho, Hora_Despacho, Latitud, Longitud, Pedido_Inventariado, Novedad_Inventario, Observacion_Inventario, Clasificacion_por_Valor, Subestado, Transportador, Valor_Costo, Valor_Venta, Factura_De_Venta, Fecha_De_Venta, Pre_Liquidacion, Fecha_Pre_Liquidacion, Orden_de_Compra, Fecha_Orden_de_Compra, Leido )
        VALUES
            ( _Plataforma, _Campaña, _Fecha_Recepcion, _Hora_Recepcion, _Manifiesto, _Region, _Zona, _Seccion, _Nombre_destinatatio, _Cedula, _Numero_Boleta, _Direccion, _Departamento, _Ciudad, _Municipio_Enviexpres, _Barrio, _Telefono, _Tipo, _Promesa_de_Entrega, _Estado_Pedido, _Asignaciones, _Usuario_Movil, _Placas_del_Usuario_Movil, _Estado_Entrega, _Fecha_Entrega, _Hora_Entrega, _Nov_Entrega, _Obs_Entrega, _Direccion_Tercero, _Nombre_Tercero, _Foto1, _Foto2, _Foto3, _Foto4, _Foto5, _Numero_Asignacion, _Numero_Despacho, _Fecha_Despacho, _Hora_Despacho, _Latitud, _Longitud, _Pedido_Inventariado, _Novedad_Inventario, _Observacion_Inventario, _Clasificacion_por_Valor, _Subestado, _Transportador, _Valor_Costo, _Valor_Venta, _Factura_De_Venta, _Fecha_De_Venta, _Pre_Liquidacion, _Fecha_Pre_Liquidacion, _Orden_de_Compra, _Fecha_Orden_de_Compra, _Leido );
        SET p_message = CONCAT('Datos creados con éxito');
        SET p_insert_id = LAST_INSERT_ID();
    -- END IF;
END