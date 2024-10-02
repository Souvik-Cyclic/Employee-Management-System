import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Counter, Gauge, Histogram, register } from 'prom-client'; // Import the necessary classes from prom-client
import * as process from 'process';
import * as os from 'os';

@Injectable()
export class MetricsService implements OnModuleInit, OnModuleDestroy {
    public serverUptime: Gauge<string>;
    public requestCount: Counter<string>;
    public errorCount: Counter<string>;
    public cpuUsage: Gauge<string>;
    public memoryUsage: Gauge<string>;
    public responseTime: Histogram<string>; // Histogram for HTTP response times
    private intervalId: NodeJS.Timeout;

    constructor() {
        // Initialize metrics
        this.serverUptime = new Gauge({
            name: 'server_uptime_seconds',
            help: 'Server uptime in seconds',
            registers: [register],
        });

        this.requestCount = new Counter({
            name: 'request_count_total',
            help: 'Total number of requests received',
            registers: [register],
        });

        this.errorCount = new Counter({
            name: 'error_count_total',
            help: 'Total number of errors encountered',
            registers: [register],
        });

        // Initialize CPU usage gauge
        this.cpuUsage = new Gauge({
            name: 'cpu_usage_percentage',
            help: 'CPU usage percentage',
            registers: [register],
        });

        // Initialize Memory usage gauge (in MB)
        this.memoryUsage = new Gauge({
            name: 'memory_usage_mb',
            help: 'Memory usage in megabytes',
            registers: [register],
        });

        // Initialize Histogram for HTTP response times
        this.responseTime = new Histogram({
            name: 'http_response_time_seconds',
            help: 'Histogram of HTTP response times in seconds',
            registers: [register],
            buckets: [0.1, 0.5, 1, 2, 5, 10], // Define response time buckets
        });

        // Set initial server uptime
        this.serverUptime.set(process.uptime());
    }

    onModuleInit() {
        this.intervalId = setInterval(() => {
            this.updateServerUptime();
            this.updateCpuUsage(); // Update CPU usage periodically
            this.updateMemoryUsage(); // Update memory usage periodically
        }, 10000); // Update every 10 seconds
    }

    onModuleDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    incrementRequestCount() {
        this.requestCount.inc();
    }

    incrementErrorCount() {
        this.errorCount.inc();
    }

    recordResponseTime(duration: number) {
        this.responseTime.observe(duration); // Record response time in seconds
    }

    updateServerUptime() {
        this.serverUptime.set(process.uptime());
    }

    // Function to update CPU usage
    private updateCpuUsage() {
        const cpus = os.cpus();
        const totalIdle = cpus.reduce((acc, cpu) => acc + cpu.times.idle, 0);
        const totalTick = cpus.reduce((acc, cpu) => acc + Object.values(cpu.times).reduce((a, b) => a + b, 0), 0);

        const idlePercentage = (totalIdle / totalTick) * 100;
        const usagePercentage = 100 - idlePercentage;

        this.cpuUsage.set(usagePercentage); // Set CPU usage
    }

    // Function to update Memory usage
    private updateMemoryUsage() {
        const memoryUsageInMB = process.memoryUsage().rss / 1024 / 1024; // Convert bytes to MB
        this.memoryUsage.set(memoryUsageInMB); // Set Memory usage in MB
    }

    getFormattedUptime(): string {
        const uptimeSeconds = Math.floor(process.uptime());
        const days = Math.floor(uptimeSeconds / (24 * 3600));
        const hours = Math.floor((uptimeSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;

        return `${days}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}
