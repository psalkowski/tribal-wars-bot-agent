import tcpp from 'tcp-ping';

export abstract class Latency {
  static async getLatency(url: string): Promise<number> {
    const hostname = new URL(url).hostname;

    return new Promise((resolve) => {
      tcpp.ping({ address: hostname, port: 443 }, (err: any, data: any) => {
        console.log('ping', data.avg);
        resolve(data.avg);
      });
    });
  }
}
