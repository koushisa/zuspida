# zuspida
Created with CodeSandbox: https://codesandbox.io/s/github/koushisa/zuspida

WIP: framework-agnostic zustand + aspida (+ maybe tanstack query?) integration. 

```ts
const userStore = zuspida(
  aspida.api.v1.user, 
  // register mutations
  {
    nextPage:(store) => () => {
      return store.page + 1
    }
    prevPage(store) => () => {
      return store.page - 1
    }
  }
)

const {
  data,
  loading, 
  error, 
  mutations, // nextPage, prevPage
  storeApi,  // zustand instance
  getApi, // aspida.api.v1.user.$get()
  postApi, // aspida.api.v1.user.$postApi()
  ...etc // also putApi, patchApi, deleteApi, ...etc
} = userStore

// call post 
(data) => {
  postApi.call({ body: data })
}

// call post and refetch on success (automatic cache invalidate)
(data) => {
  postApi.call({ body: data }, {refetchOnSuccess: true })
}

// optimistic update
(data) => {
  postApi.call({ body: data }, {optimisticData: (current) => [...current, data]})
}

// pagination
mutations.nextPage()
mutations.prevPage()

// zustand store api
storeApi.getState()
storeApi.setState(/*~*/)
storeApi.subscribe(/*~*/)
```

