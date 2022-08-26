# zuspida
Created with CodeSandbox: https://codesandbox.io/s/github/koushisa/zuspida

WIP: framework-agnostic zustand + aspida (+ maybe tanstack query?) integration. 

```ts
const userStore = zuspida(aspida.api.v1.user)

const {
  data,
  loading, 
  error, 
  storeApi,  // zustand instance
  getApi, // aspida.api.v1.user.$get()
  putApi, // aspida.api.v1.user.$put()
  ...etc // ...
} = userStore
```

