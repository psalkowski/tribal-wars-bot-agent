// import EventSource from 'eventsource';
// import { Transmit } from '@adonisjs/transmit-client';
//
// let transmit = null;
//
// export const setupTransmit = () => {
//   transmit = new Transmit({
//     baseUrl: process.env.BACKEND_API,
//     eventSourceFactory: (
//       url: string | URL,
//       options: { withCredentials: boolean },
//     ) => {
//       return new EventSource(url.toString(), options) as any;
//     },
//   });
// };
//
// export { transmit };
