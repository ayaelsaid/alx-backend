import { createPushNotificationsJobs } from './8-job.js';
import kue from 'kue';

let queue;

beforeEach(() => {
  queue = kue.createQueue();
  queue.testMode = true;
});

afterEach(async () => {
  queue.testMode.clear();
});

describe('createPushNotificationsJobs', () => {
  it('should add jobs to the queue', () => {
    const jobsData = [
      { phoneNumber: '1234567890', message: 'Test message 1' },
      { phoneNumber: '0987654321', message: 'Test message 2' }
    ];

    createPushNotificationsJobs(jobsData, queue);

    const jobs = queue.testMode.jobs;

    expect(jobs.length).toBe(jobsData.length);

    jobs.forEach((job, index) => {
      expect(job.type).toBe('push_notification_code_3');
      expect(job.data).toEqual(jobsData[index]);
    });
  });

  it('should throw an error if jobs is not an array', () => {
    expect(() => {
      createPushNotificationsJobs({}, queue);
    }).toThrow('Jobs is not an array');
  });
});
