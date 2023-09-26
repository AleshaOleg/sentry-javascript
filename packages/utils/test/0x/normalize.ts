import { normalize } from '../../src/normalize';

const obj1 = { name: 'Alice', child: null } as any;
const obj2 = { name: 'John', child: null } as any;

function getObj1(target: any, prop: string | number | symbol): any {
  return prop === 'child'
    ? new Proxy(obj2, {
        get(t, p) {
          return getObj2(t, p);
        },
      })
    : target[prop];
}

function getObj2(target: any, prop: string | number | symbol): any {
  return prop === 'child'
    ? new Proxy(obj1, {
        get(t, p) {
          return getObj1(t, p);
        },
      })
    : target[prop];
}

const proxy1 = new Proxy(obj1, {
  get(target, prop) {
    return getObj1(target, prop);
  },
});

for (let i = 0; i < 1000; i++) {
  setTimeout(() => {
    normalize(proxy1, 10000);
  }, i);
}
