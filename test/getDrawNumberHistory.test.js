const { getDrawNumberHistoryAPI } = require("../services");

let totalPage = 0;
let totalDrawNumber = 0;

test('page: null, size: null', async () => {
  const result = await getDrawNumberHistoryAPI(null, null);
  expect(typeof result.totalPage === 'number').toBe(true);
  expect(typeof result.totalDrawNumber === 'number').toBe(true);
  expect(typeof result.page === 'number').toBe(true);
  expect(Array.isArray(result.results)).toBe(true);

  totalPage = result.totalPage;
  totalDrawNumber = result.totalDrawNumber;
});

test('page: last page + 2', async () => {
  const result = await getDrawNumberHistoryAPI(totalPage + 2, null);
  expect(result.results.length).toBe(0);
});

test('run time <= 2sec', async () => {
  const startTime = new Date();
  const result = await getDrawNumberHistoryAPI(1, totalDrawNumber + 10);
  const endTime = new Date();
  const runtime = endTime - startTime;
  expect(runtime).toBeLessThan(2 * 1000);
});