module.exports = [
  {
    script: "./dist/index.js", // punto de entrada de la aplicación
    name: "app",
    exec_mode: "cluster",
    instances: 2,
    // watch: true, // Reinicia la aplicación si hay cambios en los archivos
    // ignore_watch: ["node_modules", "logs"], // Ignora cambios en estos directorios
    // log_date_format: "YYYY-MM-DD HH:mm Z", // Formato de fecha para los logs
    // error_file: "./logs/err.log", // Archivo donde se guardan los errores
    // out_file: "./logs/out.log", // Archivo donde se guarda la salida estándar
    // merge_logs: true, // Combina los logs de todas las instancias
    // max_restarts: 10, // Número máximo de reinicios en caso de fallo
  },
];
