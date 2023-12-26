CREATE PROCEDURE `TB_PEDIDOS_NOVAVENTA_update` (
    IN _id INT,
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
    OUT p_message VARCHAR(255)
)
BEGIN
    DECLARE v_counter INT;
    SELECT COUNT(*) INTO v_counter FROM TB_PEDIDOS_NOVAVENTA WHERE id = _id;

    IF v_counter = 0 THEN
        SET p_message = CONCAT('Los datos con id: ', _id , ' no existen en la base de datos');
    ELSE
        UPDATE TB_PEDIDOS_NOVAVENTA
        SET
            Plataforma = _Plataforma,
            Campaña = _Campaña,
            Fecha_Recepcion = _Fecha_Recepcion,
            Hora_Recepcion = _Hora_Recepcion,
            Manifiesto = _Manifiesto,
            Region = _Region,
            Zona = _Zona,
            Seccion = _Seccion,
            Nombre_destinatatio = _Nombre_destinatatio,
            Cedula = _Cedula,
            Numero_Boleta = _Numero_Boleta,
            Direccion = _Direccion,
            Departamento = _Departamento,
            Ciudad = _Ciudad,
            Municipio_Enviexpres = _Municipio_Enviexpres,
            Barrio = _Barrio,
            Telefono = _Telefono,
            Tipo = _Tipo,
            Promesa_de_Entrega = _Promesa_de_Entrega,
            Estado_Pedido = _Estado_Pedido,
            Asignaciones = _Asignaciones,
            Usuario_Movil = _Usuario_Movil,
            Placas_del_Usuario_Movil = _Placas_del_Usuario_Movil,
            Estado_Entrega = _Estado_Entrega,
            Fecha_Entrega = _Fecha_Entrega,
            Hora_Entrega = _Hora_Entrega,
            Nov_Entrega = _Nov_Entrega,
            Obs_Entrega = _Obs_Entrega,
            Direccion_Tercero = _Direccion_Tercero,
            Nombre_Tercero = _Nombre_Tercero,
            Foto1 = _Foto1,
            Foto2 = _Foto2,
            Foto3 = _Foto3,
            Foto4 = _Foto4,
            Foto5 = _Foto5,
            Numero_Asignacion = _Numero_Asignacion,
            Numero_Despacho = _Numero_Despacho,
            Fecha_Despacho = _Fecha_Despacho,
            Hora_Despacho = _Hora_Despacho,
            Latitud = _Latitud,
            Longitud = _Longitud,
            Pedido_Inventariado = _Pedido_Inventariado,
            Novedad_Inventario = _Novedad_Inventario,
            Observacion_Inventario = _Observacion_Inventario,
            Clasificacion_por_Valor = _Clasificacion_por_Valor,
            Subestado = _Subestado,
            Transportador = _Transportador,
            Valor_Costo = _Valor_Costo,
            Valor_Venta = _Valor_Venta,
            Factura_De_Venta = _Factura_De_Venta,
            Fecha_De_Venta = _Fecha_De_Venta,
            Pre_Liquidacion = _Pre_Liquidacion,
            Fecha_Pre_Liquidacion = _Fecha_Pre_Liquidacion,
            Orden_de_Compra = _Orden_de_Compra,
            Fecha_Orden_de_Compra = _Fecha_Orden_de_Compra,
            Leido = _Leido
        WHERE id = _id;
        SET p_message = 'Datos actualizados con éxito';
    END IF;
END
