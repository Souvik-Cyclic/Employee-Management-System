import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { register } from 'prom-client'; // Use the default register
import { MetricsService } from './metrics.service'; // Import the MetricsService

@Controller('metrics')
export class MetricsController {
    constructor(private readonly metricsService: MetricsService) {} // Inject the MetricsService

    @Get()
    async getMetrics() {
        this.metricsService.incrementRequestCount(); // Increment request count for getMetrics call
        const start = Date.now(); // Start measuring time
        try {
            const metrics = await register.metrics(); // Return all metrics
            const duration = (Date.now() - start) / 1000; // Calculate duration in seconds
            this.metricsService.recordResponseTime(duration); // Record response time
            return metrics;
        } catch (error) {
            this.metricsService.incrementErrorCount(); // Increment error count on failure
            throw new HttpException('Failed to get metrics', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('formatted-uptime')
    getFormattedUptime() {
        this.metricsService.incrementRequestCount(); // Increment request count for getFormattedUptime call
        try {
            return this.metricsService.getFormattedUptime(); // Return formatted uptime
        } catch (error) {
            this.metricsService.incrementErrorCount(); // Increment error count on failure
            throw new HttpException('Failed to get formatted uptime', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post('query') // Handle queries from Grafana
    async query(@Body() body: { target: string }) {
        this.metricsService.incrementRequestCount(); // Increment request count for query call
        const { target } = body;

        try {
            // Check if the requested target is 'formatted-uptime'
            if (target === 'formatted-uptime') {
                const formattedUptime = this.metricsService.getFormattedUptime(); // Get formatted uptime
                return [{ target: 'formatted-uptime', text: formattedUptime }]; // Return as expected by SimpleJSON
            }

            // Return an error for unknown targets
            return { error: 'Unknown target' };
        } catch (error) {
            this.metricsService.incrementErrorCount(); // Increment error count on failure
            throw new HttpException('Failed to process query', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
