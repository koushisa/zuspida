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
// `users` is zustand instance
const users = zuspida(
  aspida.api.v1.users, 
  { 
    options: {
      query: {
        page: 1,
        limit: 5,
      }
    },
    // you can define custom mutations with 
    mutations: {
      nextPage: store => () => {
         store.getState().getApi.reload(s=> ({page: s.page + 1}))
      },
      prevPage: store => () => {
         store.getState().getApi.reload(s=> ({page: s.page - 1}))
      },
      updatePage: store => (nextPage: number) => {
         store.getState().getApi.reload(s=> ({page: nextPage}))
      },
      peek: store => () => {
        const {
          data: {
            response,
            options
          },
          mutations: {
            nextPage,
            prevPage,
          }, 
          getApi, 
          postApi,
          ...etc
        } = store
      }
    }
  }
)

const {
  data,
  loading, 
  error, 
  mutations, // refetch, nextPage, prevPage, ...etc that is defined in mutations
  getApi, // wrapper for aspida.api.v1.user.$get
  postApi, // wrapper for aspida.api.v1.user.$postApi
  ...etc // also putApi, patchApi, deleteApi, ...etc that is defined in aspida
} = users.getState()

// call zustand store api
users.setState(/*~*/)
users.subscribe(/*~*/)

// mutations
mutations.nextPage()
mutations.prevPage()
mutations.updatePage(3)

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

