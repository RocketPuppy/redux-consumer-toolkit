export function logConsumer(message, consumer) {
  return (s, a) => {
    const ret = consumer(s, a);
    // eslint-disable-next-line no-console
    console.log(message, ret);
    return ret;
  };
}
export function debugConsumer(consumer) {
  return (s, a) => {
    // eslint-disable-next-line no-debugger
    debugger;
    return consumer(s, a);
  };
}
