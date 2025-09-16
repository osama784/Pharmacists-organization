module.exports = {
    apps: [
        {
            name: "Pharmacists_Organization",
            script: "./dist/index.js", // Path to your main script
            instances: 1, // Number of instances. Use 1 for now.
            exec_mode: "fork", // Mode: 'fork' (single instance) or 'cluster'
            watch: false, // Set to 'true' to restart on file change (development only!)
            autorestart: true, // PM2 will auto-restart the app if it crashes
            max_memory_restart: "1G",
            max_restarts: 10, // Max number of consecutive unstable restarts
            restart_delay: 4000, // Delay between restarts if app crashes (ms)
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: "production",
            },
            // CRITICAL: Set your log paths
            error_file: ".pm2/logs/error.log", // Error logs
            out_file: ".pm2/logs/out.log", // Output logs (console.log)
            log_date_format: "YYYY-MM-DD HH:mm Z", // Log timestamp format
        },
    ],
};
