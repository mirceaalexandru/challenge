const { deterministicPartitionKey, encodeKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns the encoded data when event don\'t have partitionKey", () => {
    const event = {something: 1};
    const key = deterministicPartitionKey(event);
    expect(key).toBe(encodeKey(event));
  });

  it("Returns the encoded data when event don\'t have partitionKey", () => {
    const event = {something: 1};
    const key = deterministicPartitionKey(event);
    expect(key).toBe(encodeKey(event));
  });

  it("Returns the partition key when event contains partitionKey", () => {
    const event = {something: 1, partitionKey: "123"};
    const key = deterministicPartitionKey(event);
    expect(key).toBe(event.partitionKey);
  });

  it("Returns the stringified partition key when event contains partitionKey as object", () => {
    const event = {something: 1, partitionKey: {something_else: true}};
    const key = deterministicPartitionKey(event);
    expect(key).toBe(JSON.stringify(event.partitionKey));
  });

  it("Returns encoded partition key when event contains partitionKey with length bigger than PARTITION_KEY_LIMIT", () => {
    const event = {something: 1, partitionKey: Array(512).join('x')};
    const key = deterministicPartitionKey(event);
    expect(key).toBe(encodeKey(event.partitionKey));
  });
});