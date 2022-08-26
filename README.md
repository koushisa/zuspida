# zuspida (WIP)
Created with CodeSandbox: https://codesandbox.io/s/github/koushisa/zuspida

framework-agnostic [zustand](https://github.com/pmndrs/zustand) + [aspida](https://github.com/aspida/aspida) (+ maybe [tanstack query](https://github.com/TanStack/query)?) integration. 

`api/v1/users/index.ts`
```ts
import { DefineMethods } from 'aspida'

type User = {
  id: number
  name: string
}

export type Methods = DefineMethods<{
  get: {
    query?: {
      page: number,
      limit: number
    }

    resBody: User[]
  }

  post: {
    reqBody: {
      name: string
    }

    resBody: User
    /**
     * reqHeaders(?): ...
     * reqFormat: ...
     * status: ...
     * resHeaders(?): ...
     * polymorph: [...]
     */
  }
}>
```

zuspida 

```ts
const users = zuspida(
  aspida.api.v1.users, 
  // register mutations
  { 
    state: {
      page: 1,
      limit: 5,
    },
    mutations: {
      nextPage:(store) => () => {
        return store.setState((s)=> { page: s.page + 1})
      }
      prevPage(store) => () => {
        return store.setState((s)=> { page: s.page - 1})
      }
    }
  }
)

const {
  storeApi,  // zustand instance
  getApi, // aspida.api.v1.user.$get
  postApi, // aspida.api.v1.user.$postApi
  ...etc // also putApi, patchApi, deleteApi, ...etc that defined by aspida
} = users

const {  
  data,
  loading, 
  error, 
  mutations, // refetch, nextPage, prevPage, ...etc
} = storeApi.getState()

// raw zustand store api
storeApi.setState(/*~*/)
storeApi.subscribe(/*~*/)

// mutations
mutations.nextPage()
mutations.prevPage()

// call post 
(data) => {
  postApi.call({ body: data })
}

// call post and refetch on success (cache invalidate)
(data) => {
  postApi.call({ body: data }, {refetchOnSuccess: true })
}

// optimistic update
(data) => {
  postApi.call({ body: data }, {optimisticData: (current) => [...current, data]})
}

```

