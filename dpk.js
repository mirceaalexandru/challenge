const crypto = require("crypto");
const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

const encodeKey = (data) => {
  let key = data;
  if (typeof key !== "string") {
    key = JSON.stringify(key);
  }
  return crypto.createHash("sha3-512").update(key).digest("hex");
};

exports.deterministicPartitionKey = (event) => {
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }
  let candidate = event?.partitionKey ? event.partitionKey : encodeKey(event);

  if (typeof candidate !== "string") {
    candidate = JSON.stringify(candidate);
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    return encodeKey(candidate);
  }
  return candidate;
};

exports.encodeKey = encodeKey;